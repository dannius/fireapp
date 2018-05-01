defmodule FireappWeb.SessionController do
  use FireappWeb, :controller

  plug :scrub_params, "session" when action in [:create]

  def setup(conn, _) do
    conn
    |> put_status(:ok)
    |> render("setup-user.json", %{user: Fireapp.Auth.Guardian.Plug.current_resource(conn)})
  end

  def create(conn, %{"session" => %{"email" => email, "password" => password}}) do
    with {:ok, user} <- Fireapp.Auth.authenticate_user(email, password),
      {:ok, jwt, _claims} <- Fireapp.Auth.Guardian.encode_and_sign(user) do
        conn
        |> put_status(:created)
        |> render("create-session.json", %{user: user, token: jwt})
    else
      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> render("unauthorized.json")
    end
  end
end
