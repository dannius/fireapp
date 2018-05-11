defmodule FireappWeb.BindController do
  use FireappWeb, :controller
  alias Fireapp.{BindContext}

  plug :scrub_params, "project_ids" when action in [:bind, :unbind]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def bind(conn, %{"id" => user_id, "project_ids" => project_ids}, current_user) do
    project_ids = String.split(project_ids, ",")

    case BindContext.bind_user_to_project(user_id, project_ids, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      ids ->
        conn
        |> put_status(:created)
        |> render("success.json", %{ids: ids})
    end
  end

  def unbind(conn, %{"id" => user_id, "project_ids" => project_ids}, current_user) do
    project_ids = String.split(project_ids, ",")

    case BindContext.unbind_user_from_project(user_id, project_ids, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      ids ->
        conn
        |> put_status(:ok)
        |> render("success.json", %{ids: ids})
    end
  end
end
