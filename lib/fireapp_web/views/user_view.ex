defmodule FireappWeb.UserView do
  use FireappWeb, :view
  @user_with_projects_attributes [:id, :name, :email, :projects]
  @user_attributes [:id, :name, :email]
  @project_attributes [:id, :name, :owner_id]

  def render("list.json", %{users: users}) do
    users = Enum.map(users, fn (user) ->

      if (Ecto.assoc_loaded?(user.projects)) do
        projects = Enum.map(user.projects, fn (project) ->
          Map.take(project, @project_attributes)
        end)
        user = Map.replace!(user, :projects, projects)
        Map.take(user, @user_with_projects_attributes)
      else
        Map.take(user, @user_attributes)
      end
    end)
    
    %{users: users}
  end

  def render("update-successful.json", %{user: user}),
    do: %{user: Map.take(user, @user_attributes)}

  def render("update-fail.json", _), do: ""
end
