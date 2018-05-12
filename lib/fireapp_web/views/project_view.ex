defmodule FireappWeb.ProjectView do
  use FireappWeb, :view
  @project_with_users_attributes [:id, :name, :owner_id, :archived, :sdk_key, :environments, :owner_login, :users]
  @project_attributes [:id, :name, :owner_id, :archived, :environments, :owner_login]
  @user_attributes [:id, :name, :email]
  @env_attributes [:id, :name]

  def render("list.json", %{projects: projects}) do
    projects = Enum.map(projects, fn (project) ->
      configurate_project_params(project)
    end)

    %{projects: projects}
  end

  def render("show.json", %{project: project}) do
    project = configurate_project_params(project)
    %{project: project}
  end

  def render("sdk_key.json", %{key: key}), do: %{key: key}

  def render("successfull.json", _), do: %{success: true}

  def render("error_changeset.json", _), do: ""

  def render("error.json", _), do: ""

  defp configurate_project_params(project) do
    envs = Enum.map(project.environments, fn (env) ->
      Map.take(env, @env_attributes)
    end)
    
    project = project
    |> Map.replace!(:environments, envs)
    |> Map.put(:owner_login, project.owner.name || project.owner.email)

    if (Ecto.assoc_loaded?(project.users)) do
      users = Enum.map(project.users, fn (user) ->
        Map.take(user, @user_attributes)
      end)

      Map.replace!(project, :users, users)
      |> Map.take(@project_with_users_attributes)
    else
      Map.take(project, @project_attributes)
    end
  end
end
