defmodule Fireapp.Event do

  alias Fireapp.{Repo, User, Environment, ProjectContext, Project, Event, UserProject, ProjectContext}
  import Ecto.Query

  def error_list_by_params(params, current_user) do
    %{
      "environment_id" => env_id,
      "project_id" => project_id
    } = params

    case ProjectContext.get_one(project_id, current_user) do
      nil ->
        :unauthorized
      _ ->
        (
          from error in Event.Error,
          where: (error.environment_id == ^env_id)
        )
        |> order_by(desc: :counter)
        |> Repo.all()
    end
  end

  def create_or_update_error_counter(params) do
    %{
      "name" => error_name,
      "environment_name" => env_name,
      "sdk_key" => sdk_key
    } = params

    case get_env_with_errors(String.downcase(env_name), sdk_key) do
      nil ->
        :conflict

      %{env: env, project: project} ->
        if (project.archived), do: :conflict, else: make_error(env, error_name)
    end
  end

  defp make_error(env, error_name) do
    env = Repo.preload(env, :errors)

    case check_error_exist_by_name(env.errors, error_name) do
      nil ->
        inserted_params = %{name: error_name, project_id: env.project_id, environment_id: env.id}
        %Event.Error{}
        |> Event.Error.create_changeset(inserted_params)
        |> Repo.insert()

      :conflict ->
        :conflict

      exist_error ->
        Event.Error.counter_changeset(exist_error)
        |> Repo.update()
    end
  end

  def solve_error(id, current_user) do
    error = Repo.get(Event.Error, id) |> Repo.preload(:project)

    case check_user_exist_in_project(error, current_user) do
      :conflict ->
        :conflict

      nil ->
        :conflict

      _ ->
        Event.Error.solve_changeset(error) |> Repo.update()
    end
  end

  def update_error(id, params, current_user) do
    error = Repo.get(Event.Error, id) |> Repo.preload(:project)
    inserted_user = get_inserted_user_by_params(params)

    case inserted_user && check_users_in_project(error, current_user, inserted_user) do
      nil ->
        if (params["description"]),
          do: Event.Error.update_changeset(error, %{description: params["description"]}) |> Repo.update(),
          else: :conflict

      :conflict ->
        :conflict
      
      false ->
        :conflict

      _ ->
        changeset = Event.Error.update_changeset(error, params)

        case changeset.valid? do
          true -> Repo.update(changeset)
          _ -> :conflict
        end
    end

  end

  defp get_inserted_user_by_params(params) do
    %{"user_id" => user_id} = params

    if (user_id) do
      (
        from u in User,
        where: u.id == ^user_id
      )
      |> Repo.one()
    else
      nil
    end
  end

  defp check_users_in_project(error, current_user, inserted_user) do
    check_user_exist_in_project(error, current_user) &&
    check_user_exist_in_project(error, inserted_user)
  end

  def check_user_exist_in_project(error, user) do
    if (error) do
      (
        from up in UserProject,
        where: (up.user_id == ^user.id),
        where: (up.project_id == ^error.project.id)
      )
      |> Repo.one()
    else
      :conflict
    end
  end

  defp get_env_with_errors(env_name, sdk_key) do
    if (sdk_key && env_name) do
      (
        from project in Project,
        where: (project.sdk_key == ^sdk_key),
        join: env in Environment, where: env.name == ^env_name,
        select: %{env: env, project: project}
      )
      |> Repo.one()
    else
      nil
    end
  end

  defp check_error_exist_by_name(errors, name) do
    if (is_list(errors)) do
      Enum.find(errors, fn (err) ->
        err.name == name
      end)
    else
      :conflict
    end
  end
end

