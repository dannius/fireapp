defmodule Fireapp.Event.Error do
  use Ecto.Schema
  import Ecto.Changeset

  alias Fireapp.{Repo, Project, Environment, User}

  schema "errors" do
    field :name, :string
    field :description, :string
    field :counter, :integer, default: 0
    field :solved, :boolean, default: false

    belongs_to :project, Project
    belongs_to :environment, Environment
    belongs_to :user, User

    timestamps()
  end

  def create_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(name project_id environment_id))
    |> validate_required([:name, :project_id, :environment_id])
    |> set_counter()
  end

  def update_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(description user_id))
  end

  def counter_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w())
    |> set_counter()
  end

  defp set_counter(changeset) do
    if (changeset.valid?) do
      case Map.has_key?(changeset.data, :counter) do
        true ->
          counter = get_field(changeset, :counter)
          force_change(changeset, :counter, counter + 1)
        false ->
          changeset
      end
    else
      changeset
    end
  end

end
