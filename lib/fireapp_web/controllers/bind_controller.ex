defmodule FireappWeb.BindController do
  use FireappWeb, :controller
  alias Fireapp.{ProjectContext}

  plug :scrub_params, "project_id" when action in [:bind, :unbind]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def bind(conn, %{"id" => user_id, "project_id" => project_id}, current_user) do
    case ProjectContext.bind_user_to_project(user_id, project_id, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      :ok ->
        conn
        |> put_status(:created)
        |> render("success.json")
    end
  end

  def unbind(conn, %{"id" => user_id, "project_id" => project_id}, current_user) do
    case ProjectContext.unbind_user_from_project(user_id, project_id, current_user) do
      :ok ->
        conn
        |> put_status(:ok)
        |> render("success.json")

      :unprocessable_entity ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end
end
