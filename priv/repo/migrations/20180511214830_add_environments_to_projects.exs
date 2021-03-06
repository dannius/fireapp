defmodule Fireapp.Repo.Migrations.AddEnvironmentsToProjects do
  use Ecto.Migration

  def change do
    create table(:environments) do
      add :name, :string, null: false
      add :project_id, references(:projects, on_delete: :delete_all)
    end

    create unique_index(:environments, [:name, :project_id])
  end
end
