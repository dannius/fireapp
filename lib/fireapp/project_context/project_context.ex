defmodule Fireapp.ProjectContext do

  alias Fireapp.{Repo, User, Project, UserProject}

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

  def bind_user_to_project(user_id, project_id, current_user) do
    project = getOneIfOwner(project_id, current_user)

    case project && project.archived do
      nil ->
        :unauthorized

      true ->
        :conflict

      false ->
        user = Repo.get(User, user_id)
        case UserProject.add_user_to_project(user, project) do
          {:ok, _} ->
            :ok
          {:error, _} ->
            :conflict
          :already_exist ->
            :conflict
        end
    end
  end

  def unbind_user_from_project(user_id, project_id, current_user) do
    user = Repo.get(User, user_id)
    project = getOne(project_id, user)

    if (
      #project does not exist
      project == nil || 
      #can not delete owner, can not modify archived
      user.id == project.owner_id || project.archived || 
      #owner can unbind every user, guest can unbind yourself
      current_user.id != project.owner_id && current_user.id != user.id 
    ) do
      :unprocessable_entity
    else
      case UserProject.delete_user_from_project(user, project) do
        {:ok, _} ->
          :ok
        {:error, _} ->
          :unprocessable_entity
        :not_exist ->
          :unprocessable_entity
      end
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

