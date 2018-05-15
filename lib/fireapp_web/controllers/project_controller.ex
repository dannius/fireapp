defmodule FireappWeb.ProjectController do
  use FireappWeb, :controller
  alias Fireapp.{ProjectContext, Repo}

  plug :scrub_params, "project" when action in [:create, :update]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def index(conn, params, current_user) do
    projects =
      ProjectContext.project_list_by_params(params, current_user)
      |> Enum.map(fn (project) ->
        project
        |> Repo.preload(:users)
        |> Repo.preload(:owner)
        |> Repo.preload(:environments)
      end)

    conn
    |> render("list.json", %{projects: projects})
  end

  def show(conn, %{"id" => id}, current_user) do
    case ProjectContext.get_one(id, current_user) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("error.json")

      project ->
        project = project 
        |> Repo.preload(:users)
        |> Repo.preload(:owner)
        |> Repo.preload(:environments)

        conn
        |> render("show.json", project: project)
    end
  end

  def create(conn, %{"project" => project_params}, current_user) do
    case ProjectContext.create_project(project_params, current_user.id) do
      {:ok, project} ->
        project = project
        |> Repo.preload(:users)
        |> Repo.preload(:owner)
        |> Repo.preload(:environments)

        conn
        |> put_status(:created)
        |> render("show.json", %{project: project})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error_changeset.json", data: changeset)
    end
  end

  def update(conn, %{"id" => id, "project" => params}, current_user) do
    case ProjectContext.update_project(id, params, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      {:ok, project} ->
        project = project
        |> Repo.preload(:users)
        |> Repo.preload(:owner)
        |> Repo.preload(:environments)

        conn
        |> put_status(:ok)
        |> render("show.json", %{project: project})

      {:unprocessable_entity, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error_changeset.json", data: changeset)
    end
  end

  def delete(conn, %{"id" => id}, current_user) do
    case ProjectContext.get_one_if_owner(id, current_user) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("error.json")
      project ->
        Repo.delete!(project)
        conn
        |> put_status(:ok)
        |> render("successfull.json")
    end
  end

  def archive(conn, %{"id" => id}, current_user) do
    case ProjectContext.archive_project(id, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      {:ok, project} ->
        project = project
        |> Repo.preload(:users)
        |> Repo.preload(:owner)
        |> Repo.preload(:environments)

        conn
        |> put_status(:ok)
        |> render("show.json", %{project: project})
    end
  end

  def unarchive(conn, %{"id" => id}, current_user) do
    case ProjectContext.unarchive_project(id, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      {:ok, project} ->
        project = project
        |> Repo.preload(:users)
        |> Repo.preload(:owner)
        |> Repo.preload(:environments)

        conn
        |> put_status(:ok)
        |> render("show.json", %{project: project})
    end
  end

  def reset_sdk_key(conn, %{"id" => id}, current_user) do
    case ProjectContext.reset_sdk(id, current_user) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      {:ok, project} ->
        conn
        |> put_status(:ok)
        |> render("sdk_key.json", %{key: project.sdk_key})
    end
  end
end
