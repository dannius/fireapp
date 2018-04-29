defmodule FireappWeb.UserView do
  use FireappWeb, :view
  @user_attributes [:id, :name, :email]

  def render("update-successful.json", %{user: user}),
    do: %{user: Map.take(user, @user_attributes)}

  def render("update-fail.json", _), do: ''
end
