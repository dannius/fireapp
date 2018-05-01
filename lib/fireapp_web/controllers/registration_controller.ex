defmodule FireappWeb.RegistrationController do
  use FireappWeb, :controller

  alias Fireapp.{User, Repo}

  plug :scrub_params, "user" when action in [:create]

  def create(conn, %{"user" => user_params}) do
    changeset = User.registration_changeset(%User{}, user_params)

    with {:ok, user} <- Repo.insert(changeset),
      {:ok, jwt, _claims} <- Fireapp.Auth.Guardian.encode_and_sign(user) do
        conn
        |> put_status(:created)
        |> render("create-successful.json", %{user: user, token: jwt})
    else
      {:error, _} ->
        conn
        |> put_status(:conflict)
        |> render("create-fail.json")
    end
  end
end


