defmodule Fireapp.Repo.Migrations.AddErrorsToProjectsAndEnvironments do
  use Ecto.Migration

  def change do
    create table(:errors) do
      add :name, :string, null: false, size: 70
      add :description, :string
      add :counter, :integer

      add :user_id, references(:users)
      add :project_id, references(:projects, on_delete: :delete_all)
      add :environment_id, references(:projects, on_delete: :delete_all)
      timestamps()
    end

    create unique_index(:errors, [:name, :project_id, :environment_id, :user_id])
  end
end
