defmodule Fireapp.ProjectContext do

  alias Fireapp.{Repo, User, Project, UserProject}

  def create_project(project_params, owner_id) do
    project_params = project_params
    |> Map.put("owner_id", owner_id)

    Project.create_changeset(%Project{}, project_params)
    |> Repo.insert()
  end

  def update_project(id, project_params, current_user_id) do
    project = Repo.get(Project, id)

    cond do
      project.archived ->
        :conflict

      project.owner_id != current_user_id ->
        :unauthorized

      project.owner_id == current_user_id && !project.archived ->
        changeset = project
        |> Repo.preload(:users)
        |> Project.changeset(project_params)

        case Repo.update(changeset) do
          {:ok, project} ->
            {:ok, project}
          {:error, changeset} ->
            {:unprocessable_entity, changeset}
        end
    end
  end

  def archive_project(id, current_user_id) do
    project = Repo.get(Project, id)

    cond do
      project.archived ->
        :conflict

      project.owner_id != current_user_id ->
        :unauthorized

      project.owner_id == current_user_id && !project.archived ->
        project
        |> Project.archive_changeset
        |> Repo.update!

        {:ok, project}
    end
  end

  def bind_user_to_project(user_id, project_id, current_user_id) do
    project = Repo.get(Project, project_id)
    user = Repo.get(User, user_id)

    cond do
      project.archived ->
        :conflict

      project.owner_id != current_user_id ->
        :unauthorized

      project.owner_id == current_user_id && !project.archived ->
        case UserProject.add_user_to_project(user, project) do
          :ok ->
            :ok
          :error ->
            :conflict
        end
    end
  end

  def unbind_user_from_project(user_id, project_id) do
    project = Repo.get(Project, project_id)
    user = Repo.get(User, user_id)

    case UserProject.delete_user_from_project(user, project) do
      :ok ->
        :ok
      :error ->
        :unprocessable_entity
    end
  end
end

