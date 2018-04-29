defmodule FireappWeb.RegistrationControllerTest do
  use FireappWeb.ConnCase

  alias Fireapp.{User, Repo}

  @valid_create_params %{name: "test_name", email: "test_email@test.com", password: "test_password"}
  @invalid_create_params %{name: "invalid_name", email: "invalid_email@test.com", password: "short"}

  @login_params %{email: "test_email@test.com", password: "test_password"}

  @valid_reset_password_params %{old_password: "test_password", password: "new_password", password_confirmation: "new_password"}
  @invalid_reset_password_params %{old_password: "invalid_old_pass", password: "new_password", password_confirmation: "new_password"}

  describe "create/2" do
    test "Creates, and responds with a newly created user if attributes are valid", %{conn: conn} do
      response = post(conn, registration_path(conn, :create, user: @valid_create_params))

      case Poison.decode!(response.resp_body) do
        %{"token" => token} ->
          assert true
        _ ->
          assert false
      end
    end

    test "Unsuccess create action", %{conn: conn} do
      response = post(conn, registration_path(conn, :create, user: @invalid_create_params))
      assert response.status == 409
    end
  end

  describe "update/2" do
    test "Creates then update name", %{conn: conn} do
      user = Repo.insert!(User.registration_changeset(%User{}, @valid_create_params))

      {:ok, token} = login_user_by_params(@login_params)

      conn_with_token = build_conn()
      |> put_req_header("authorization", "bearer: " <> token)

      response = put(conn_with_token, registration_path(conn_with_token, :update, user.id, user: %{name: "updated_name"}))
      assert response.status == 200
    end
  end

  describe "reset_password/2" do
    test "Creates then reset password", %{conn: conn} do
      user = Repo.insert!(User.registration_changeset(%User{}, @valid_create_params))

      {:ok, token} = login_user_by_params(@login_params)

      conn_with_token = build_conn()
      |> put_req_header("authorization", "bearer: " <> token)

      response = put(conn_with_token, registration_path(conn_with_token, :reset_password, user.id, password_params: @valid_reset_password_params))
      assert response.status == 200
    end

    test "Creates then reset with invalid old password", %{conn: conn} do
      user = Repo.insert!(User.registration_changeset(%User{}, @valid_create_params))

      {:ok, token} = login_user_by_params(@login_params)

      conn_with_token = build_conn()
      |> put_req_header("authorization", "bearer: " <> token)

      response = put(conn_with_token, registration_path(conn_with_token, :reset_password, user.id, password_params: @invalid_reset_password_params))
      assert response.status == 409
    end
  end

  defp login_user_by_params(login_params) do
    conn = build_conn()
    response = post(conn, session_path(conn, :create, session: login_params))

    case Poison.decode!(response.resp_body) do
      %{"token" => token} ->
        {:ok, token}
      _ ->
        {:error}
    end
  end
end
