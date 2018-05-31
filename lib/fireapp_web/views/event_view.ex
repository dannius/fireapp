defmodule FireappWeb.EventView do
  use FireappWeb, :view

  @error_attributes [:id, :name, :user, :description, :counter, :solved, :inserted_at, :updated_at]
  @user_attributes [:id, :name, :email]

  def render("list.json", %{errors: errors}) do
    errors = Enum.map(errors, fn (error) ->
      configurate_error_params(error)
    end)

    %{errors: errors}
  end

  def render("show.json", %{error: error}) do
    error = configurate_error_params(error)
    %{error: error}
  end

  def render("success.json", _), do: ""

  def render("error.json", _), do: ""

  defp configurate_error_params(error) do
    user = if (error.user),
      do: Map.take(error.user, @user_attributes),
      else: nil

    Map.replace!(error, :user, user)
    |> Map.take(@error_attributes)
  end
end
