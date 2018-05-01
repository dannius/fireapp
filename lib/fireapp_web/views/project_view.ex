defmodule FireappWeb.ProjectView do
  use FireappWeb, :view
  @project_attributes [:id, :name]

  def render("success.json", %{project: project}) do
    %{project: Map.take(project, @project_attributes)}
  end

  def render("error.json", _) do

  end

  def render("success_bind.json", _) do

  end

  def render("error_bind.json", _) do

  end
end
