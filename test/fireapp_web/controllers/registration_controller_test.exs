defmodule FireappWeb.RegistrationControllerTest do
  use FireappWeb.ConnCase

  alias Plug.Conn.Status

  @valid_create_params %{name: "test_name", email: "test_email@test.com", password: "test_password"}
  @invalid_create_params %{name: "invalid_name", email: "invalid_email@test.com", password: "short"}

  describe "create/2" do
    test "Creates, and responds with a newly created user if attributes are valid", %{conn: conn} do
      response = post(conn, registration_path(conn, :create, user: @valid_create_params))

      success =
        with %{"token" => _} <- Poison.decode!(response.resp_body) do
          true
        else
          _ ->
            false
        end

      assert success
    end

    test "Unsuccess create action", %{conn: conn} do
      response = post(conn, registration_path(conn, :create, user: @invalid_create_params))
      assert response.status == Status.code(:conflict)
    end
  end
end
