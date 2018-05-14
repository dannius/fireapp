defmodule Fireapp.EnvironmentContext do

  alias Fireapp.{Repo, Environment, ProjectContext}

  def create(env_params, current_user) do
    %{"project_id" => project_id} = env_params
    project = ProjectContext.get_one_if_owner(project_id, current_user)

    case project && project.archived do
      nil ->
        :unauthorized

      true ->
        :conflict

      false ->
        Environment.create_changeset(%Environment{}, env_params)
        |> Repo.insert()
    end
  end

  def update(id, env_params, current_user) do
    project = get_own_project_by_env(id, current_user.id)

    case project && project.archived do
      nil ->
        :unauthorized

      true ->
        :conflict

      false ->
        changeset = Repo.get!(Environment, id)
        |> Environment.update_changeset(env_params)

        case Repo.update(changeset) do
          {:ok, environment} ->
            {:ok, environment}
          {:error, changeset} ->
            {:unprocessable_entity, changeset}
        end
    end
  end

  def get_own_project_by_env(id, current_user_id) do
    env = Repo.get(Environment, id)

    project = if (!is_nil(env)),
      do: Repo.preload(env, :project) |> Map.get(:project),
      else: nil

    if (project && project.owner_id == current_user_id),
      do: project, else: nil
  end
end

