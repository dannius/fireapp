defmodule Fireapp.Repo.Migrations.UsersProjects do
  use Ecto.Migration

  def change do
    create table(:users_projects) do
      add :user_id, references(:users)
      add :project_id, references(:projects)
    end

    create unique_index(:users_projects, [:user_id, :project_id])
  end
end

