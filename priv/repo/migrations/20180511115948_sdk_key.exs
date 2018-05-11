defmodule Fireapp.Repo.Migrations.SdkKey do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :sdk_key, :string, null: false
    end

    create index("projects", [:sdk_key])
  end
end
