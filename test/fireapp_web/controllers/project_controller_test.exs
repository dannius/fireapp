defmodule Fireapp.ProjectControllerTest do
  use FireappWeb.ConnCase

  alias Fireapp.{User, Repo, Project, UserProject}
  alias Plug.Conn.Status

  @login_params %{email: "owner_email@test.com", password: "test_password"}

  describe "create" do
    setup [:create_user, :login_user]

    test "Successful project creation", %{conn_with_token: conn_with_token} do
      response = conn_with_token
      |> post(project_path(conn_with_token, :create, project: %{name: "123"}))

      assert response.status == Status.code(:created)
    end

    test "Unsuccessful project creation with empty name", %{conn_with_token: conn_with_token} do
      response = conn_with_token
      |> post(project_path(conn_with_token, :create, project: %{name: ""}))

      assert response.status == Status.code(:unprocessable_entity)
    end

    test "Unsuccessful project creation with exist name", %{conn_with_token: conn_with_token, current_user: current_user} do
      params = %{name: "awesome_name"}
      create_project_with_owner(current_user, params.name)

      response = conn_with_token
      |> post(project_path(conn_with_token, :create, project: params))

      assert response.status == Status.code(:unprocessable_entity)
    end

  end

  describe "update" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful update project as owner", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      params = %{name: "updated_name"}

      response = conn_with_token
      |> patch(project_path(conn_with_token, :update, project.id, project_params: params))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful update project with exist name", %{conn_with_token: conn_with_token, current_user: current_user} do
      params = %{name: "update_name"}

      %{project: project} = create_project_with_owner(current_user)
      create_project_with_owner(current_user, params.name)

      response = conn_with_token
      |> patch(project_path(conn_with_token, :update, project.id, project_params: params))

      assert response.status == Status.code(:unprocessable_entity)
    end

    test "Create project as guest and unsuccessful update as user", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      params = %{name: "updated_name"}

      response = conn_with_token
      |> patch(project_path(conn_with_token, :update, project.id, project_params: params))

      assert response.status == Status.code(:unauthorized)
    end

    test "Unsuccessful update archived project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      params = %{name: "updated_name"}
      project = archive_project(project)

      response = conn_with_token
      |> patch(project_path(conn_with_token, :update, project.id, project_params: params))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "archive" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful create and archive project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> post(project_path(conn_with_token, :archive, project.id))

      assert response.status == Status.code(:ok)
    end

    test "Create and unsuccessful archive project as not owner", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)

      response = conn_with_token
      |> post(project_path(conn_with_token, :archive, project.id))

      assert response.status == Status.code(:unauthorized)
    end

    test "Create and unsuccessful archive already archived project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      project = archive_project(project)

      response = conn_with_token
      |> post(project_path(conn_with_token, :archive, project.id))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "bind" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful binding user to project as owner", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> post(project_path(conn_with_token, :bind, project.id, user_id: guest.id))

      assert response.status == Status.code(:created)
    end

    test "Guest already exist in project", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(current_user)

      UserProject.add_user_to_project(guest, project)

      response = conn_with_token
      |> post(project_path(conn_with_token, :bind, project.id, user_id: guest.id))

      assert response.status == Status.code(:conflict)
    end

    test "Unsuccessful binding user to project as guest", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(guest)

      response = conn_with_token
      |> post(project_path(conn_with_token, :bind, project.id, user_id: current_user.id))

      assert response.status == Status.code(:unauthorized)
    end

  end


  describe "unbind" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful bind then unbind user-project relationship", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      UserProject.add_user_to_project(current_user, project)

      response = conn_with_token
      |> post(project_path(conn_with_token, :unbind, project.id, user_id: current_user.id))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful unbind, archived", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(current_user)
      project = archive_project(project)

      response = conn_with_token
      |> post(project_path(conn_with_token, :unbind, project.id, user_id: guest.id))

      assert response.status == Status.code(:unprocessable_entity)
    end

  end

  defp archive_project(project) do
    project
    |> Project.archive_changeset()
    |> Repo.update!()
  end

  defp create_project_with_owner(owner, project_name \\ "") do
    project_name = if project_name == "", do: "test_project", else: project_name

    project = Project.create_changeset(%Project{}, %{name: project_name, owner_id: owner.id, users: [owner]})
    |> Repo.insert!()

    %{project: project}
  end

  defp create_guest_user(_) do
    guest_params = %{email: "guest_email@test.com", password: "test_password"}

    guest = User.registration_changeset(%User{}, guest_params)
    |> Repo.insert!()

    {:ok, guest: guest}
  end

  defp create_user(_) do
    current_user = User.registration_changeset(%User{}, @login_params)
    |> Repo.insert!()

    {:ok, current_user: current_user}
  end

  defp login_user(_) do
    conn = build_conn()
    response = conn
    |> post(session_path(conn, :create, session: @login_params))

    case Poison.decode!(response.resp_body) do
      %{"token" => token} ->
        conn_with_token = build_conn()
        |> put_req_header("authorization", "bearer: " <> token)
        {:ok, conn_with_token: conn_with_token}
      _ ->
        {:error}
    end
  end

end

