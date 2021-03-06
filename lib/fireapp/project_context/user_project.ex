defmodule Fireapp.UserProject do
  use Ecto.Schema
  import Ecto.Query, only: [from: 2]
  import Ecto.Changeset

  alias Fireapp.Repo

  schema "users_projects" do
    field :user_id, :integer
    field :project_id, :integer
  end

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(user_id project_id))
    |> validate_required(:user_id)
    |> validate_required(:project_id)
  end

  def delete_user_from_project(user_id, project_id) do
    case check_user_in_project(user_id, project_id) do
      {:ok, relationship} ->
        Repo.delete(relationship)
      nil ->
        :not_exist
    end
  end

  def add_user_to_project(user_id, project_id) do
    case check_user_in_project(user_id, project_id) do
      {:ok, _} ->
        :already_exist
      nil ->
        __MODULE__.changeset(%__MODULE__{user_id: user_id, project_id: project_id})
        |> Repo.insert()
    end
  end

  defp check_user_in_project(user_id, project_id) do
    query = from relationship in __MODULE__,
    where: (relationship.user_id == ^user_id) and
            (relationship.project_id == ^project_id)

    case Repo.one(query) do
      nil ->
        nil
      relationship ->
        {:ok, relationship}
    end
  end

end
