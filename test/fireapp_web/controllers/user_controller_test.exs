defmodule FireappWeb.UserControllerTest do
  use FireappWeb.ConnCase

  alias Fireapp.{User, Repo}
  alias Plug.Conn.Status

  @valid_create_params %{name: "test_name", email: "test_email@test.com", password: "test_password"}
  @login_params %{email: "test_email@test.com", password: "test_password"}

  @valid_reset_password_params %{old_password: "test_password", password: "new_password", password_confirmation: "new_password"}
  @invalid_reset_password_params %{old_password: "invalid_old_pass", password: "new_password", password_confirmation: "new_password"}

  describe "update/2" do
    setup [:insert_user]

    test "Creates then update name", %{conn: conn, user: user} do
      {:ok, token} = login_user_by_params()

      conn_with_token = conn
      |> put_req_header("authorization", "bearer: " <> token)

      response = put(conn_with_token, user_path(conn_with_token, :update, user.id, user: %{name: "updated_name"}))
      assert response.status == Status.code(:ok)
    end
  end

  describe "reset_password/2" do
    setup [:insert_user]

    test "Creates then reset password", %{conn: conn, user: user} do
      {:ok, token} = login_user_by_params()

      conn_with_token = conn
      |> put_req_header("authorization", "bearer: " <> token)

      response = put(conn_with_token, user_path(conn_with_token, :reset_password, user.id, password_params: @valid_reset_password_params))
      assert response.status == Status.code(:ok)
    end

    test "Creates then reset with invalid old password", %{conn: conn, user: user} do
      {:ok, token} = login_user_by_params()

      conn_with_token = conn
      |> put_req_header("authorization", "bearer: " <> token)

      response = put(conn_with_token, user_path(conn_with_token, :reset_password, user.id, password_params: @invalid_reset_password_params))
      assert response.status == Status.code(:conflict)
    end
  end

  defp login_user_by_params() do
    conn = build_conn()
    response = post(conn, session_path(conn, :create, session: @login_params))

    case Poison.decode!(response.resp_body) do
      %{"token" => token} ->
        {:ok, token}
      _ ->
        {:error}
    end
  end

  defp insert_user(_) do
    user = User.registration_changeset(%User{}, @valid_create_params)
    |> Repo.insert!()

    {:ok, user: user}
  end
end
