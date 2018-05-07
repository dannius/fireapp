defmodule FireappWeb.RegistrationView do
  use FireappWeb, :view
  @user_attributes [:id, :name, :email]

  def render("create-successful.json", %{user: user, token: jwt}), do:
    %{user: Map.take(user, @user_attributes), token: jwt}

  def render("create-fail.json", _), do: ""
end
