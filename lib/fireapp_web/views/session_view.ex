defmodule FireappWeb.SessionView do
  use FireappWeb, :view
  @user_attributes [:id, :name, :email]

  def render("setup-user.json", %{user: user}) do
    user = if user, do: Map.take(user, @user_attributes), else: false

    %{user: user}
  end

  def render("create-session.json", %{user: user, token: jwt}),
    do: %{user: Map.take(user, @user_attributes), token: jwt}

  def render("unauthorized.json", _), do: ""
end
