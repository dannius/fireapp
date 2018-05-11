defmodule Fireapp.Project do
  use Ecto.Schema
  import Ecto.Changeset

  alias Fireapp.{User, Repo}

  schema "projects" do
    field :name, :string
    field :sdk_key, :string
    field :archived, :boolean, default: false

    many_to_many :users, User, join_through: "users_projects", on_replace: :delete, on_delete: :delete_all
    belongs_to :owner, User, foreign_key: :owner_id

    timestamps()
  end

  def create_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(name owner_id))
    |> validate_required([:owner_id, :name])
    |> put_owner_to_users()
    |> foreign_key_constraint(:users, name: :users_projects_project_id_fkey)
    |> uniq_project_name_for_user(:name)
    |> make_sdk_key()
  end

  def update_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(name))
    |> uniq_project_name_for_user(:name)
  end

  def archive_changeset(model, params \\ %{}) do
    model
    |> cast(params, [])
    |> archive()
  end

  def unarchive_changeset(model, params \\ %{}) do
    model
    |> cast(params, [])
    |> unarchive()
  end

  defp archive(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true} ->
        put_change(changeset, :archived, true)
      _ ->
        changeset
    end
  end

  defp unarchive(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true} ->
        put_change(changeset, :archived, false)
      _ ->
        changeset
    end
  end

  defp put_owner_to_users(changeset) do
    case Map.has_key?(changeset.changes, :owner_id) do
      true ->
        owner_id = get_field(changeset, :owner_id)
        owner = Repo.get(User, owner_id)
        put_assoc(changeset, :users, [owner])
      false ->
        changeset
    end
  end

  defp uniq_project_name_for_user(changeset, field, options \\ []) do
    owner_id = if changeset.data.owner_id,
                    do: changeset.data.owner_id, else: changeset.changes.owner_id

    validate_change(changeset, field, fn _, name ->
      user = Repo.get(User, owner_id)
      |> Repo.preload(:projects)

      ununiq_project = Enum.filter(user.projects, fn(project) ->
        project.name == name
      end)

      case Enum.empty?(ununiq_project) do
        true -> []
        false -> [name: "mast have unique name"]
      end
    end)
  end

  defp make_sdk_key(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true} ->
        hash = :crypto.strong_rand_bytes(32) |> Base.encode64 |> binary_part(0, 32)
        put_change(changeset, :sdk_key, hash)
      _ ->
        changeset
    end
  end

end
