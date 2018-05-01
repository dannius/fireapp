defmodule Fireapp.SessionControllerTest do
  use FireappWeb.ConnCase
  alias Plug.Conn.Status

  @valid_create_params %{email: "test_email@test.com", password: "test_password"}
  @invalid_create_params %{email: "invalid_test_email@test.com", password: "invalid_test_password"}

  describe "create/2" do
    setup [:create_user_by_params]

    test "Create and login with valid params" do
      assert {:ok, _} = login_user_by_params(@valid_create_params)
    end

    test "Create and login with invalid params" do
      assert {:error} == login_user_by_params(@invalid_create_params)
    end
  end

  describe "setup" do
    setup [:create_user_by_params]

    test "Setup user by token" do
      {:ok, token} = login_user_by_params(@valid_create_params)

      conn_with_token = build_conn()
      |> put_req_header("authorization", "bearer: " <> token)

      response = get(conn_with_token, session_path(conn_with_token, :setup))
      assert response.status == Status.code(:ok)
    end
  end

  defp create_user_by_params(_) do
    conn = build_conn()
    post(conn, registration_path(conn, :create, user: @valid_create_params))
    :ok
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

