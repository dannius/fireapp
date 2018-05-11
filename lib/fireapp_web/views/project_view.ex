defmodule FireappWeb.ProjectView do
  use FireappWeb, :view
  @project_with_users_attributes [:id, :name, :owner_id, :archived, :sdk_key, :owner_login, :users]
  @project_attributes [:id, :name, :owner_id, :archived, :owner_login]
  @user_attributes [:id, :name, :email]

  def render("list.json", %{projects: projects}) do
    projects = Enum.map(projects, fn (project) ->
      
      if (Ecto.assoc_loaded?(project.users)) do
        configurate_project_params(project)
      else
        project
        |> Map.put(:owner_login, project.owner.name || project.owner.email)
        |> Map.take(@project_attributes)
      end
    end)

    %{projects: projects}
  end

  def render("successfull_with_project.json", %{project: project}) do
    project = project
    |> Map.put(:owner_login, project.owner.name || project.owner.email)
    |> Map.take(@project_attributes)

    %{project: project}
  end

  def render("show.json", %{project: project}) do
    project = configurate_project_params(project)
    %{project: project}
  end

  def render("successfull.json", _), do: %{success: true}

  def render("error_changeset.json", %{data: data}), do: ""

  def render("error.json", _), do: ""

  defp configurate_project_params(project) do
    users = Enum.map(project.users, fn (user) ->
      Map.take(user, @user_attributes)
    end)

    project
    |> Map.replace!(:users, users)
    |> Map.put(:owner_login, project.owner.name || project.owner.email)
    |> Map.take(@project_with_users_attributes)
  end
end
