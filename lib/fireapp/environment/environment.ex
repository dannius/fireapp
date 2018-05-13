defmodule Fireapp.Environment do
  use Ecto.Schema
  import Ecto.Changeset

  alias Fireapp.{Repo, Project, Event}

  schema "environments" do
    field :name, :string

    belongs_to :project, Project
    has_many :errors, Event.Error
  end

  def create_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(name project_id))
    |> validate_required([:project_id, :name])
    |> uniq_environment_name_for_project(:name)
    |> name_to_lower_case()
  end

  def update_changeset(model, params \\ %{}) do
    model
    |> cast(params, ~w(name))
    |> uniq_environment_name_for_project(:name)
    |> name_to_lower_case()
  end

  defp name_to_lower_case(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true} ->
        env_name =
          if changeset.changes.name,
            do: changeset.changes.name, else: changeset.data.name

        put_change(changeset, :name, String.downcase(env_name))
      _ ->
        changeset
    end
  end

  defp uniq_environment_name_for_project(changeset, field) do
    project_id = if changeset.data.project_id,
                    do: changeset.data.project_id, else: changeset.changes.project_id

    validate_change(changeset, field, fn _, name ->
      project = Repo.get(Project, project_id)
      |> Repo.preload(:environments)

      ununiq_env = Enum.filter(project.environments, fn(env) ->
        env.name == name
      end)

      case Enum.empty?(ununiq_env) do
        true -> []
        false -> [name: "mast have unique name"]
      end
    end)
  end

end
