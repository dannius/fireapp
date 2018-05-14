defmodule FireappWeb.EnvironmentController do
  use FireappWeb, :controller
  alias Fireapp.{EnvironmentContext, Repo, Environment, Event}

  plug :scrub_params, "environment" when action in [:create, :update]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def index(conn, params, current_user) do
    case Event.error_list_by_params(params, current_user) do
      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")
      
      errors ->
        errors = Enum.map(errors, fn (error) ->
          Repo.preload(error, :user)
        end)

        conn
        |> render(FireappWeb.EventView, "list.json", %{errors: errors})
    end
  end

  def create(conn, %{"environment" => env_params}, current_user) do
    case EnvironmentContext.create(env_params, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      {:ok, environment} ->
        conn
        |> put_status(:created)
        |> render("environment.json", %{environment: environment})
      {:error, _} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def update(conn, %{"id" => id, "environment" => env_params}, current_user) do
    case EnvironmentContext.update(id, env_params, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      {:ok, environment} ->
        conn
        |> put_status(:ok)
        |> render("environment.json", %{environment: environment})

      {:unprocessable_entity, _} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def delete(conn, %{"id" => id}, current_user) do
    case EnvironmentContext.get_own_project_by_env(id, current_user.id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("error.json")
      _ ->
        environment = Repo.get(Environment, id)
        |> Repo.delete!()

        conn
        |> put_status(:ok)
        |> render("environment.json", %{environment: environment})
    end
  end
end
