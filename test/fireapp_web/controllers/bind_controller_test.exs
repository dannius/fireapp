defmodule Fireapp.BindControllerTest do
  use FireappWeb.ConnCase
  import FireappWeb.ControllerTestHelper

  alias Fireapp.{UserProject}
  alias Plug.Conn.Status

  describe "bind" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful binding user to project as owner", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> get(bind_path(conn_with_token, :bind, guest.id, project_ids: "#{project.id}"))

      assert response.status == Status.code(:created)
    end

    test "Guest already exist in project", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(current_user)

      UserProject.add_user_to_project(guest.id, project.id)

      response = conn_with_token
      |> get(bind_path(conn_with_token, :bind, guest.id, project_ids: "#{project.id}"))

      assert response.status == Status.code(:conflict)
    end

    test "Unsuccessful binding user to project as guest", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(guest)

      response = conn_with_token
      |> get(bind_path(conn_with_token, :bind, current_user.id, project_ids: "#{project.id}"))

      assert response.status == Status.code(:conflict)
    end
  end

  describe "unbind" do
    setup [:create_user, :login_user, :create_guest_user]

    test "Successful bind then unbind user-project relationship", %{conn_with_token: conn_with_token, current_user: current_user, guest: guest} do
      %{project: project} = create_project_with_owner(current_user)
      UserProject.add_user_to_project(guest.id, project.id)

      response = conn_with_token
      |> get(bind_path(conn_with_token, :unbind, guest.id, project_ids: "#{project.id}"))

      assert response.status == Status.code(:ok)
    end

    test "Unsuccessful unbind, from not exist project", %{conn_with_token: conn_with_token, guest: guest} do

      response = conn_with_token
      |> get(bind_path(conn_with_token, :unbind, guest.id, project_ids: "#{undefined_id()}"))

      assert response.status == Status.code(:conflict)
    end

    test "Can not unbind owner", %{conn_with_token: conn_with_token, current_user: current_user} do
      %{project: project} = create_project_with_owner(current_user)

      response = conn_with_token
      |> get(bind_path(conn_with_token, :unbind, current_user.id, project_ids: "#{project.id}"))

      assert response.status == Status.code(:conflict)
    end

    test "Guest can not unbind another guest", 
      %{conn_with_token: conn_with_token, current_user: current_user, guest: guest, another_guest: another_guest} do

      %{project: project} = create_project_with_owner(guest)
      UserProject.add_user_to_project(current_user.id, project.id)
      UserProject.add_user_to_project(another_guest.id, project.id)

      response = conn_with_token
      |> get(bind_path(conn_with_token, :unbind, another_guest.id, project_ids: "#{project.id}"))

      assert response.status == Status.code(:conflict)
    end
  end

  def login_user(_) do
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

