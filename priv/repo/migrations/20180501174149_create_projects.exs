defmodule Fireapp.Repo.Migrations.CreateProjects do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string, null: false
      add :archived, :boolean, default: false
      add :owner_id, :integer, null: false

      timestamps()
    end

    create index("projects", [:name])
  end
end

