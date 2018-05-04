defmodule FireappWeb.ProjectView do
  use FireappWeb, :view
  @project_with_users_attributes [:id, :name, :users]
  @project_attributes [:id, :name]
  @user_attributes [:id, :name, :email]

  def render("list.json", %{projects: projects}) do
    projects = Enum.map(projects, fn (project) ->
      users = Enum.map(project.users, fn (user) ->
        Map.take(user, @user_attributes)
      end)
      project = Map.replace!(project, :users, users)
      Map.take(project, @project_with_users_attributes)
    end)

    %{projects: projects}
  end

  def render("successfull_create_update.json", %{project: project}) do
    %{project: Map.take(project, @project_attributes)}
  end

  def render("show.json", %{project: project}) do
    users = Enum.map(project.users, fn (user) ->
      Map.take(user, @user_attributes)
    end)

    project = project
    |> Map.replace!(:users, users)
    |> Map.take(@project_with_users_attributes)

    %{project: project}
  end

  def render("success_bind.json", _), do: ""

  def render("error_changeset.json", %{data: data}), do: ""

  def render("error.json", _), do: ""
end
