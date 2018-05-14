defmodule Fireapp.EnvironmentControllerTest do
  use FireappWeb.ConnCase
  import FireappWeb.ControllerTestHelper

  alias Plug.Conn.Status

  @env_name "test_env_name"
  @error_name "test_error_name"

  describe "index" do
    setup [:create_user, :create_guest_user, :login_user]

    test "Successful get error list as project user", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})
      create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> get(environment_path(conn_with_token, :index, %{environment_id: env.id, project_id: project.id}))

      assert response.status == Status.code(:ok)
    end

    test "Unuccessful get error list as unexist user", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      env = create_environment(%{name: @env_name, project_id: project.id})
      create_error(%{name: @error_name, project_id: project.id, environment_id: env.id})

      response = conn_with_token
      |> get(environment_path(conn_with_token, :index, %{environment_id: env.id, project_id: project.id}))

      assert response.status == Status.code(:unauthorized)
    end
  end

  describe "create" do
    setup [:create_user, :create_guest_user, :login_user]

    test "Successful environment creation", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> post(environment_path(conn_with_token, :create, environment: %{name: @env_name, project_id: project.id}))

      assert response.status == Status.code(:created)
    end

    test "Unsuccessful environment creation with empty name", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> post(environment_path(conn_with_token, :create, environment: %{name: "", project_id: project.id}))

      assert response.status == Status.code(:unprocessable_entity)
    end

    test "Unsuccessful environment creation with undefined project", %{conn_with_token: conn_with_token} do
      response = conn_with_token
      |> post(environment_path(conn_with_token, :create, environment: %{name: @env_name, project_id: undefined_id()}))

      assert response.status == Status.code(:unauthorized)
    end

    test "Unsuccessful environment creation if not project owner", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      params = %{name: @env_name, project_id: project.id}

      response = conn_with_token
      |> post(environment_path(conn_with_token, :create, environment: params))

      assert response.status == Status.code(:unauthorized)
    end

    test "Unsuccessful environment creation with exist name", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      params = %{name: @env_name, project_id: project.id}
      create_environment(params)

      response = conn_with_token
      |> post(environment_path(conn_with_token, :create, environment: params))

      assert response.status == Status.code(:unprocessable_entity)
    end
  end

  describe "update" do
    setup [:create_user, :create_guest_user, :login_user]

    test "Successful update environment as owner", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      params = %{name: @env_name, project_id: project.id}

      env = create_environment(params)

      response = conn_with_token
      |> patch(environment_path(conn_with_token, :update, env.id, environment: %{name: "updated_name"}))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful update environment with exist name", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      create_environment(%{name: @env_name, project_id: project.id})
      env = create_environment(%{name: "new_name", project_id: project.id})

      response = conn_with_token
      |> patch(environment_path(conn_with_token, :update, env.id, environment: %{name: @env_name}))

      assert response.status == Status.code(:unprocessable_entity)
    end

    test "Create project and env as guest, and unsuccessfull update env as user", %{conn_with_token: conn_with_token, guest: guest} do
      %{project: project} = create_project_with_owner(guest)
      env = create_environment(%{name: @env_name, project_id: project.id})

      params = %{name: "updated_name"}

      response = conn_with_token
      |> patch(environment_path(conn_with_token, :update, env.id, environment: params))

      assert response.status == Status.code(:unauthorized)
    end

    test "Unsuccessful update with invalid environment id", %{conn_with_token: conn_with_token} do
      params = %{name: "updated_name"}

      response = conn_with_token
      |> patch(environment_path(conn_with_token, :update, undefined_id(), environment: params))

      assert response.status == Status.code(:unauthorized)
    end

    test "Unsuccessful update environment if archived project", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      params = %{name: "updated_name"}
      env = create_environment(%{name: @env_name, project_id: project.id})

      archive_project(project)

      response = conn_with_token
      |> patch(environment_path(conn_with_token, :update, env.id, environment: params))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "delete" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful delete environment if owner", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)
      env = create_environment(%{name: @env_name, project_id: project.id})

      response = conn_with_token
      |> delete(environment_path(conn_with_token, :delete, env.id))

      assert response.status == Status.code(:ok)
    end

    test "Unuccessful try to delete project with wrong id", %{conn_with_token: conn_with_token} do
      response = conn_with_token
      |> delete(environment_path(conn_with_token, :delete, undefined_id()))

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

