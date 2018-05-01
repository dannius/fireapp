defmodule FireappWeb.ProjectController do
  use FireappWeb, :controller

  alias Fireapp.ProjectContext

  plug :scrub_params, "project" when action in [:create]
  plug :scrub_params, "project_params" when action in [:update]
  plug :scrub_params, "bind" when action in [:bind, :unbind]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def create(conn, %{"project" => project_params}, current_user) do
    case ProjectContext.create_project(project_params, current_user.id) do
      {:ok, project} ->
        conn
        |> put_status(:created)
        |> render("success.json", %{project: project})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", data: changeset)
    end
  end

  def update(conn, %{"id" => id, "project_params" => params}, current_user) do
    case ProjectContext.update_project(id, params, current_user.id) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error_bind.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error_bind.json")

      {:ok, _} ->
        conn
        |> put_status(:ok)
        |> render("error_bind.json")

      {:unprocessable_entity, _} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error_bind.json")
    end
  end

  def archive(conn, %{"id" => id}, current_user) do
    case ProjectContext.archive_project(id, current_user.id) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error_bind.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error_bind.json")

      {:ok, _} ->
        conn
        |> put_status(:ok)
        |> render("success_bind.json")
    end
  end

  def bind(conn, %{"bind" => %{"user_id" => user_id, "project_id" => project_id}}, current_user) do
    case ProjectContext.bind_user_to_project(user_id, project_id, current_user.id) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error_bind.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error_bind.json")

      :ok ->
        conn
        |> put_status(:created)
        |> render("success_bind.json")
    end
  end

  def unbind(conn, %{"bind" => %{"user_id" => user_id, "project_id" => project_id}}, _) do
    case ProjectContext.unbind_user_from_project(user_id, project_id) do
      :ok ->
        conn
        |> put_status(:ok)
        |> render("success_bind.json")

      :unprocessable_entity ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error_bind.json")
    end
  end
end
