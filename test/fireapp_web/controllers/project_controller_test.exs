defmodule Fireapp.ProjectControllerTest do
  use FireappWeb.ConnCase
  import FireappWeb.ControllerTestHelper

  alias Plug.Conn.Status

  describe "show" do
    setup [:create_user, :login_user]

    test "Successful show project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> get(project_path(conn_with_token, :show, project.id))

      assert response.status == Status.code(:ok)
    end

    test "Unuccessful show project with wrong id", %{conn_with_token: conn_with_token} do

      response = conn_with_token
      |> get(project_path(conn_with_token, :show, undefined_id()))

      assert response.status == Status.code(:not_found)
    end
  end

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
      |> patch(project_path(conn_with_token, :update, project.id, project: params))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful update project with exist name", %{conn_with_token: conn_with_token, current_user: current_user} do
      params = %{name: "update_name"}

      %{project: project} = create_project_with_owner(current_user)
      create_project_with_owner(current_user, params.name)

      response = conn_with_token
      |> patch(project_path(conn_with_token, :update, project.id, project: params))

      assert response.status == Status.code(:unprocessable_entity)
    end

    test "Create project as guest and unsuccessful update as user", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      params = %{name: "updated_name"}

      response = conn_with_token
      |> patch(project_path(conn_with_token, :update, project.id, project: params))

      assert response.status == Status.code(:unauthorized)
    end

    test "Unsuccessful update archived project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      params = %{name: "updated_name"}
      project = archive_project(project)

      response = conn_with_token
      |> patch(project_path(conn_with_token, :update, project.id, project: params))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "delete" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful delete project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> delete(project_path(conn_with_token, :delete, project.id))

      assert response.status == Status.code(:ok)
    end

    test "Unuccessful try to delete project with wrong id", %{conn_with_token: conn_with_token} do

      response = conn_with_token
      |> delete(project_path(conn_with_token, :delete, undefined_id()))

      assert response.status == Status.code(:not_found)
    end
  end

  describe "archive" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful create and archive project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> get(project_path(conn_with_token, :archive, project.id))

      assert response.status == Status.code(:ok)
    end

    test "Create and unsuccessful archive project as not owner", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)

      response = conn_with_token
      |> get(project_path(conn_with_token, :archive, project.id))

      assert response.status == Status.code(:unauthorized)
    end

    test "Create and unsuccessful archive already archived project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      project = archive_project(project)

      response = conn_with_token
      |> get(project_path(conn_with_token, :archive, project.id))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "unarchive" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful unarchive project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      project = archive_project(project)

      response = conn_with_token
      |> get(project_path(conn_with_token, :unarchive, project.id))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful unarchive project as not owner", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      project = archive_project(project)

      response = conn_with_token
      |> get(project_path(conn_with_token, :unarchive, project.id))

      assert response.status == Status.code(:unauthorized)
    end

    test "Create and unsuccessful unarchive already unarchived project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> get(project_path(conn_with_token, :unarchive, project.id))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "reset_sdk_key" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful reset sdk_key as owner", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> get(project_path(conn_with_token, :reset_sdk_key, project.id))

      assert response.status == Status.code(:ok)
    end

    test "Create project as guest and unsuccessful reset sdk_key as user", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)

      response = conn_with_token
      |> get(project_path(conn_with_token, :reset_sdk_key, project.id))

      assert response.status == Status.code(:unauthorized)
    end

    test "Unsuccessful reset sdk_key, archived project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      project = archive_project(project)

      response = conn_with_token
      |> get(project_path(conn_with_token, :reset_sdk_key, project.id))

      assert response.status == Status.code(:conflict)
    end
  end

  defp login_user(_) do
    conn = build_conn()
    response = conn
    |> post(session_path(conn, :create, session: login_params()))

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

