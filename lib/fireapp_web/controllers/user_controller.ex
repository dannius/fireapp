defmodule FireappWeb.UserController do
  use FireappWeb, :controller

  import Ecto.Query, only: [from: 2]
  alias Fireapp.{User, Repo, UserContext}

  plug :scrub_params, "user" when action in [:update]
  plug :scrub_params, "password_params" when action in [:reset_password]

  def action(conn, _) do
    args = [conn, conn.params, Fireapp.Auth.Guardian.Plug.current_resource(conn)]
    apply(__MODULE__, action_name(conn), args)
  end

  def index(conn, params, current_user) do
  # please kill that action
  users = UserContext.user_list_by_params(params, current_user)

  %{
    "substring" => substring,
  } = params

  count = (
    from u in User,
    where: u.id != ^current_user.id,
    where: ilike(u.email, ^"%#{substring}%"),
    select: count("*")
  ) |> Repo.all()

  conn
    |> render("list.json", %{users: users, count: count})
  end

  def update(conn, %{"id" => id, "user" => user_params}, _) do
    user = Repo.get(User, id)
    |> User.changeset(user_params)
    |> Repo.update!()

    conn
    |> put_status(:ok)
    |> render("update-successful.json", %{user: user})
  end

  def reset_password(conn, %{"id" => id, "password_params" =>
                                            %{"old_password" => old_password, "password" => password,
                                            "password_confirmation" => password_confirmation}}, _) do
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
