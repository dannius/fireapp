defmodule FireappWeb.UserController do
  use FireappWeb, :controller

  alias Fireapp.{User, Repo}
  import Ecto.Query, only: [from: 2]

  plug :scrub_params, "user" when action in [:update]
  plug :scrub_params, "password_params" when action in [:reset_password]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def index(conn, _, current_user) do
    query = from user in User,
            where: user.id != ^current_user.id,
            preload: [:projects]

    users = Repo.all(query)

    conn
    |> render("list.json", %{users: users})
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

    with {:ok, user} <- Fireapp.Auth.authenticate_user(user.email, old_password),
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
            |> render("update-fail.json")
    end
  end
end
