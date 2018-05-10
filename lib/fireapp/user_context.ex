defmodule Fireapp.UserContext do

  alias Fireapp.{User, Repo}
  import Ecto.Query

  def user_list_by_params(params, current_user) do
    %{
      "substring" => substring,
      "limit" => limit,
      "page" => page
    } = params

    current_projects_ids = get_current_user_project_ids(current_user)

    limit = String.to_integer(limit)
    offset = String.to_integer(page) * limit


    from(u in User,
      where: u.id != ^current_user.id,
      where: ilike(u.email, ^"%#{substring}%"),
      limit: ^limit,
      offset: ^offset,
      preload: [:projects]
    )
    |>  Repo.all()
    |>  Enum.map(fn (u) ->
          projects = Enum.filter(u.projects, fn (project) ->
            Enum.member?(current_projects_ids, project.id)
          end)
          Map.replace!(u, :projects, projects)
        end)
  end

  def get_count_of_users(%{"substring" => substring}, current_user) do
    (
      from u in User,
      where: u.id != ^current_user.id,
      where: ilike(u.email, ^"%#{substring}%"),
      select: count("*")
    ) |> Repo.all()
  end

  defp get_current_user_project_ids(current_user) do
    current_user
    |> Repo.preload(:projects)
    |> Map.get(:projects, [])
    |> Enum.map(fn (project) -> project.id end)
  end
end

