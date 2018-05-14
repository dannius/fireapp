defmodule FireappWeb.EventView do
  use FireappWeb, :view
  @error_attributes [:id, :name, :description, :inserted_at, :updated_at]

  def render("show.json", %{error: error}) do
    error = Map.take(error, @error_attributes)

    %{error: error}
  end

  def render("success.json", _), do: ""

  def render("error.json", _), do: ""
end
