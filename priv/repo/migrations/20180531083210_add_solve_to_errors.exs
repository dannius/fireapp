defmodule Fireapp.Repo.Migrations.AddSolvedToErrors do
  use Ecto.Migration

  def change do
    alter table(:errors) do
      add :solved, :boolean, default: false
    end
  end
end
