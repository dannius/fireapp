defmodule Fireapp.BindContext do

  alias Fireapp.{Repo, Project, UserProject}
  import Ecto.Query, only: [from: 2]

  def bind_user_to_project(user_id, project_ids, current_user) do
    query = from(p in Project,
              where: (p.id in ^project_ids) and
                      (p.owner_id == ^current_user.id),
              select: p.id
            )

    project_ids = Repo.all(query)

    if (length(project_ids) == 0) do
      :conflict
    else
      ids = add_user_to_projects(user_id, project_ids)

      case (length(ids) == 0) do
        true ->
          :conflict
        false ->
          ids
      end
    end
  end

  def unbind_user_from_project(user_id, project_ids, current_user) do
    query = from(p in Project,
              where: (p.id in ^project_ids)
            )

    projects = Repo.all(query)

    if (length(projects) == 0) do
      :conflict
    else
      ids = delete_user_from_projects(user_id, projects, current_user.id)
      case (length(ids) == 0) do
        true ->
          :conflict
        false ->
          ids
      end
    end
  end

  defp delete_user_from_projects(user_id, projects, current_user_id) do
    user_id = String.to_integer(user_id)
    projects
    |> Enum.filter(fn (project) ->
      if (
        #can not delete owner, can not modify archived
        user_id == project.owner_id || 
        #owner can unbind every user, guest can unbind yourself
        current_user_id != project.owner_id && current_user_id != user_id 
      ) do
        false
      else
        case UserProject.delete_user_from_project(user_id, project.id) do
          {:ok, _} -> true
          _ -> false
        end
      end
    end)
    |> Enum.map(fn (project) ->
      project.id
    end)

  end

  defp add_user_to_projects(user_id, project_ids) do
    user_id = String.to_integer(user_id)

    Enum.filter(project_ids, fn (id) ->
      case UserProject.add_user_to_project(user_id, id) do
        {:ok, _} -> true
        _ -> false
      end
    end)
  end
end

