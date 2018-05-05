defmodule FireappWeb.ProjectController do
  use FireappWeb, :controller
  alias Fireapp.{UserProject, ProjectContext, Repo}

  plug :scrub_params, "project" when action in [:create]
  plug :scrub_params, "project_params" when action in [:update]
  plug :scrub_params, "user_id" when action in [:bind, :unbind]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def index(conn, %{"substring" => substring, "users" => users}, current_user) do
    current_user = Repo.preload(current_user, :projects)

    projects = current_user.projects
    |> Enum.filter(fn (project) -> project.name =~ substring end)

    if (users == "true") do
      projects = projects
      |> Enum.map(fn (project) -> Repo.preload(project, :users) end)
    end

    conn
    |> render("list.json", %{projects: projects})
  end

  def show(conn, %{"id" => id}, current_user) do
    id = String.to_integer(id)
    current_user = Repo.preload(current_user, :projects)

    project = current_user.projects
    |> Enum.filter(fn (project) -> project.id == id end)
    |> List.first()

    case project do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("error.json")
      project ->
        project = Repo.preload(project, :users)
        conn
        |> render("show.json", project: project)
    end
  end

  def create(conn, %{"project" => project_params}, current_user) do
    case ProjectContext.create_project(project_params, current_user.id) do
      {:ok, project} ->
        conn
        |> put_status(:created)
        |> render("successfull_create_update.json", %{project: project})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error_changeset.json", data: changeset)
    end
  end

  def update(conn, %{"id" => id, "project_params" => params}, current_user) do
    case ProjectContext.update_project(id, params, current_user.id) do
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
        |> render("successfull_create_update.json", %{project: project})

      {:unprocessable_entity, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error_changeset.json", data: changeset)
    end
  end

  def archive(conn, %{"id" => id}, current_user) do
    case ProjectContext.archive_project(id, current_user.id) do
      :conflict ->
        conn
        |> put_status(:conflict)
        |> render("error.json")

      :unauthorized ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")

      {:ok, _} ->
        conn
        |> put_status(:ok)
        |> render("success_bind.json")
    end
  end

  def bind(conn, %{"id" => project_id, "user_id" => user_id}, current_user) do
    case ProjectContext.bind_user_to_project(user_id, project_id, current_user.id) do
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
        |> render("success_bind.json")
    end
  end

  def unbind(conn, %{"id" => project_id, "user_id" => user_id}, _) do
    case ProjectContext.unbind_user_from_project(user_id, project_id) do
      :ok ->
        conn
        |> put_status(:ok)
        |> render("success_bind.json")

      :unprocessable_entity ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end
end
