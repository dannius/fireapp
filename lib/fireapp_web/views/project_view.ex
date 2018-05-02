defmodule FireappWeb.ProjectView do
  use FireappWeb, :view
  @project_attributes [:id, :name]

  def render("successfull_create_update.json", %{project: project}) do
    %{project: Map.take(project, @project_attributes)}
  end

  def render("success_bind.json", _) do

  end

  def render("error_changeset.json", %{data: data}) do

  end

  def render("error.json", _) do

  end
end
