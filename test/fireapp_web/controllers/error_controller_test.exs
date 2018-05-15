defmodule Fireapp.ErrorControllerTest do
  use FireappWeb.ConnCase
  import FireappWeb.ControllerTestHelper

  alias Plug.Conn.Status
  alias Fireapp.UserProject

  @env_name "test_env_name"
  @error_name "test_error_name"

  describe "create" do
    setup [:create_user, :login_user]

    test "Successful error creation", %{conn: conn, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})

      response = conn
      |> post(error_path(conn, :create, error: %{name: @error_name, environment_name: env.name, sdk_key: project.sdk_key}))

      assert response.status == Status.code(:ok)
    end

    test "Unuccessful error creation if project archived", %{conn: conn, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})
      archive_project(project)

      response = conn
      |> post(error_path(conn, :create, error: %{name: @error_name, environment_name: env.name, sdk_key: project.sdk_key}))

      assert response.status == Status.code(:conflict)
    end

    test "Successful error update counter", %{conn: conn, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})
      create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn
      |> post(error_path(conn, :create, error: %{name: @error_name, environment_name: env.name, sdk_key: project.sdk_key}))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful create error with invalid params", %{conn: conn, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})
      create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn
      |> post(error_path(conn, :create, error: %{name: @error_name, environment_name: env.name, sdk_key: "invalid"}))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "update" do
    setup [:create_user, :create_guest_user, :login_user]

    test "Successful update error as user in project", %{conn_with_token: conn_with_token, guest: guest, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      UserProject.add_user_to_project(guest.id, project.id)
      env = create_environment(%{name: @env_name, project_id: project.id})
      error = create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> patch(error_path(conn_with_token, :update, error.id, error: %{description: "awesome", user_id: guest.id}))
      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful set unexist user to error", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})
      error = create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> patch(error_path(conn_with_token, :update, error.id, error: %{description: "", user_id: undefined_id()}))
      assert response.status == Status.code(:conflict)
    end

    test "Unsuccessful update error with as unexist login-user in project", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      env = create_environment(%{name: @env_name, project_id: project.id})
      error = create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> patch(error_path(conn_with_token, :update, error.id, error: %{description: "", user_id: guest.id}))
      assert response.status == Status.code(:conflict)
    end

    test "Unuccessful update unexist error", %{conn_with_token: conn_with_token, guest: guest, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      UserProject.add_user_to_project(guest.id, project.id)
      env = create_environment(%{name: @env_name, project_id: project.id})
      create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> patch(error_path(conn_with_token, :update, undefined_id(), error: %{description: "awesome", user_id: guest.id}))
      assert response.status == Status.code(:conflict)
    end
  end

  describe "delete" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful delete error as project owner", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})
      error = create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> delete(error_path(conn_with_token, :delete, error.id))

      assert response.status == Status.code(:ok)
    end

    test "Successful delete error as project guest", %{conn_with_token: conn_with_token, guest: guest, current_user: current_user} do
      %{project: project} = create_project_with_owner(guest)
      UserProject.add_user_to_project(current_user.id, project.id)
      env = create_environment(%{name: @env_name, project_id: project.id})
      error = create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> delete(error_path(conn_with_token, :delete, error.id))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful delete error as project unexist guest", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      env = create_environment(%{name: @env_name, project_id: project.id})
      error = create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> delete(error_path(conn_with_token, :delete, error.id))

      assert response.status == Status.code(:not_found)
    end

    test "Unuccessful try to delete error with wrong id", %{conn_with_token: conn_with_token} do
      response = conn_with_token
      |> delete(error_path(conn_with_token, :delete, undefined_id()))

      assert response.status == Status.code(:not_found)
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
