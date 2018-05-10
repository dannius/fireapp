defmodule Fireapp.UserContext do

  alias Fireapp.{User, Repo, UserProject, Project}
  import Ecto.Query

  def user_list_by_params(params, current_user) do
    %{
      "substring" => substring,
      "limit" => limit,
      "page" => page
    } = params

    limit = String.to_integer(limit)
    offset = String.to_integer(page) * limit

    basic_query =
      from(u in User,
        where: u.id != ^current_user.id,
        where: ilike(u.email, ^"%#{substring}%"),
        # limit: ^limit,
        # offset: ^offset
      )

    projects_subquery =
      Project
      |> join(:inner, [p], up in UserProject, p.id == up.project_id)
      |> where([p, up], up.user_id == ^current_user.id)
      |> select([p, up], p)

    projects_by_user_ids =
      basic_query
      |> join(:inner, [u], up in UserProject, u.id == up.user_id)
      |> join(:inner, [u, up], p in Project, up.project_id == p.id)
      |> join(:inner, [u, up, p], ps in subquery(projects_subquery), ps.id == p.id)
      |> select([u, up, p, ps], {u, p})
      |> Repo.all()
      |> Enum.group_by(
        fn {%User{id: id}, _project} -> id end,
        fn {_user, project} -> project end
      )

    basic_query
    |> Repo.all()
    |> Enum.map(fn (u) ->
      Map.replace!(u, :projects, Map.get(projects_by_user_ids, u.id, []))
    end)
  end
end

