defmodule Api.RegistrationController do
  use FireappWeb, :controller

  alias Fireapp.User

  plug :scrub_params, "user" when action in [:create, :update]
  plug :scrub_params, "password_params" when action in [:reset_password]

  def create(conn, %{"user" => user_params}) do
    changeset = User.registration_changeset(%User{}, user_params)

    case Repo.insert(changeset) do
      {:ok, user} ->
        {:ok, jwt, _claims} = Api.Auth.Guardian.encode_and_sign(user)

        conn
        |> put_status(:created)
        |> render("create-successful.json", %{user: user, token: jwt})
      {:error, _} ->
        conn
        |> put_status(:conflict)
        |> render("fail.json")
    end
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Repo.get(User, id)
    |> User.changeset(user_params)
    |> Repo.update!()

    conn
    |> put_status(:ok)
    |> render("update-successful.json", %{user: user})
  end

  def reset_password(conn, %{"id" => id, "password_params" =>
                                            %{"old_password" => old_password, "password" => password,
                                            "password_confirmation" => password_confirmation}}) do

    user = Repo.get(User, id)

    with {:ok, user} <- Api.Auth.authenticate_user(user.email, old_password),
          true <- password == password_confirmation,
          changeset <- User.registration_changeset(user, %{password: password}),
          {:ok, user} <- Repo.update(changeset) do
            conn
            |> put_status(:ok)
            |> render("update-successful.json", %{user: user})
        else
          _ ->
            conn
            |> put_status(:conflict)
            |> render("fail.json")
    end
  end
end
