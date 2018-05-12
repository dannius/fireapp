defmodule FireappWeb.EnvironmentView do
  use FireappWeb, :view
  @environment_attributes [:id, :name]

  def render("environment.json", %{environment: environment}) do
    %{environment: Map.take(environment, @environment_attributes)}
  end

  def render("error.json", _), do: ""
end
