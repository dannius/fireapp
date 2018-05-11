defmodule Fireapp.ProjectContext do

  import Ecto.Query, only: [from: 2]
  alias Fireapp.{Repo, Project, UserProject}

  def project_list_by_params(params, current_user) do
    %{
      "substring" => substring,
      "users" => users,
      "ownership" => ownership
    } = params

    ids =
      from(relationship in UserProject,
        where: relationship.user_id == ^current_user.id,
        join: p in Project, where: relationship.project_id == p.id,
        select: p.id
      ) |> Repo.all

    query =
      from(p in Project,
        where: (p.id in ^ids),
        where: ilike(p.name, ^"%#{substring}%")
      )

    query = if users == "true",
              do: from(p in query, preload: [:users]),
              else: query

    query = if ownership == "true",
              do: from(p in query, where: p.owner_id == ^current_user.id),
              else: query

    Repo.all(query)
  end

  def create_project(project_params, owner_id) do
    project_params = project_params
    |> Map.put("owner_id", owner_id)

    Project.create_changeset(%Project{}, project_params)
    |> Repo.insert()
  end

  def update_project(id, project_params, current_user) do
    project = getOneIfOwner(id, current_user)

    case project && project.archived do
      nil ->
        :unauthorized

      true ->
        :conflict

      false ->
        changeset = project
        |> Repo.preload(:users)
        |> Project.update_changeset(project_params)

        case Repo.update(changeset) do
          {:ok, project} ->
            {:ok, project}
          {:error, changeset} ->
            {:unprocessable_entity, changeset}
        end
    end
  end

  def archive_project(id, current_user) do
    project = getOneIfOwner(id, current_user)

    case project && project.archived do
      nil ->
        :unauthorized

      true ->
        :conflict

      false ->
        project = project
        |> Project.archive_changeset()
        |> Repo.update!()
        {:ok, project}
    end
  end

  def unarchive_project(id, current_user) do
    project = getOneIfOwner(id, current_user)

    case project && project.archived do
      nil ->
        :unauthorized

      false ->
        :conflict

      true ->
        project = project
        |> Project.unarchive_changeset()
        |> Repo.update!()
        {:ok, project}
    end
  end

  def reset_sdk(id, current_user) do
    project = getOneIfOwner(id, current_user)

    case project && !project.archived do
      nil ->
        :unauthorized

      false ->
        :conflict

      true ->
        project = project
        |> Project.reset_sdk_changeset()
        |> Repo.update!()
        {:ok, project}
    end
  end

  def getOne(id, current_user) do
    id = String.to_integer(id)
    current_user = Repo.preload(current_user, :projects)

    current_user.projects
    |> Enum.filter(fn (project) -> project.id == id end)
    |> List.first()
  end

  def getOneIfOwner(id, current_user) do
    id = String.to_integer(id)
    current_user = Repo.preload(current_user, :projects)

    current_user.projects
    |> Enum.filter(fn (project) -> project.id == id && project.owner_id == current_user.id end)
    |> List.first()
  end
end

