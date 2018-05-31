defmodule FireappWeb.ErrorController do
  use FireappWeb, :controller

  alias Fireapp.{Event, Repo}

  plug :scrub_params, "error" when action in [:create, :update]

  def create(conn, %{"error" => error_params}) do
    case Event.create_or_update_error_counter(error_params) do
      {:ok, _} ->
        conn
        |> put_status(:ok)
        |> render(FireappWeb.EventView, "success.json")
      _ ->
        conn
        |> put_status(:conflict)
        |> render("error.json")
    end
  end

  def update(conn, %{"id" => id, "error" => params}) do
    current_user = Fireapp.Auth.Guardian.Plug.current_resource(conn)

    case Event.update_error(id, params, current_user) do
      {:ok, error} ->
        error = Repo.preload(error, :user)
        conn
        |> put_status(:ok)
        |> render(FireappWeb.EventView, "show.json", %{error: error})

      _ ->
        conn
        |> put_status(:conflict)
        |> render("error.json")
    end
  end

  def solve(conn, %{"id" => id}) do
    current_user = Fireapp.Auth.Guardian.Plug.current_resource(conn)

    case Event.solve_error(id, current_user) do
      {:ok, error} ->
        error = Repo.preload(error, :user)
        conn
        |> put_status(:ok)
        |> render(FireappWeb.EventView, "show.json", %{error: error})

      _ ->
        conn
        |> put_status(:conflict)
        |> render("error.json")
    end
  end

  def delete(conn, %{"id" => id}) do
    current_user = Fireapp.Auth.Guardian.Plug.current_resource(conn)
    error = Repo.get(Event.Error, id) |> Repo.preload(:project)

    case error && Event.check_user_exist_in_project(error, current_user) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("error.json")

      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      _ ->
        error = Repo.preload(error, :user)
        Repo.delete!(error)
        conn
        |> put_status(:ok)
        |> render(FireappWeb.EventView, "show.json", %{error: error})
    end
  end
end