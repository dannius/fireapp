defmodule FireappWeb.ProjectView do
  use FireappWeb, :view
  @project_attributes [:id, :name, :users]
  @user_attributes [:id, :name, :email]

  def render("update-successful.json", %{user: user}),
    do: %{user: Map.take(user, @user_attributes)}

  def render("list.json", %{projects: projects}) do
    projects = Enum.map(projects, fn (project) ->
      users = Enum.map(project.users, fn (user) ->
        Map.take(user, @user_attributes)
      end)
      project = Map.replace!(project, :users, users)
      Map.take(project, @project_attributes)
    end)

    %{projects: projects}
  end

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
