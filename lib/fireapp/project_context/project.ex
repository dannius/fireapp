defmodule Fireapp.Project do
  use Ecto.Schema
  import Ecto.Changeset

  alias Fireapp.{User, Repo}

  schema "projects" do
    field :name, :string
    field :archived, :boolean, default: false

    many_to_many :users, User, join_through: "users_projects", on_replace: :delete
    belongs_to :owner, User, foreign_key: :owner_id

    timestamps()
  end

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(name owner_id archived))
    |> validate_required([:owner_id, :name])
  end

  def create_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(name owner_id))
    |> validate_required([:owner_id, :name])
    |> put_owner_to_users
    |> uniq_project_name_for_user(:name)
  end

  def archive_changeset(model, params \\ %{}) do
    model
    |> cast(params, [])
    |> archive
  end

  defp archive(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true} ->
        put_change(changeset, :archived, true)
      _ ->
        changeset
    end
  end

  def put_owner_to_users(changeset) do
    case Map.has_key?(changeset.changes, :owner_id) do
      true ->
        owner_id = get_field(changeset, :owner_id)
        owner = Repo.get(User, owner_id)
        put_assoc(changeset, :users, [owner])
      false ->
        changeset
    end
  end

  def uniq_project_name_for_user(changeset, field, options \\ []) do
    case Map.has_key?(changeset.changes, :owner_id) do
      true ->
        validate_change(changeset, field, fn _, name ->
          user = Repo.get(User, changeset.changes.owner_id)
          |> Repo.preload(:projects)

          ununiq_project = Enum.filter(user.projects, fn(project) ->
            project.name == name
          end)

          case Enum.empty?(ununiq_project) do
            true -> []
            false -> [name: "mast have unique name"]
          end
        end)

      false ->
        changeset
    end
  end

end
