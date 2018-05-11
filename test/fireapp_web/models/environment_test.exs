defmodule Fireapp.ProjectTest do
  use FireappWeb.ConnCase
  use FireappWeb.ModelTestHelper

  alias Fireapp.{Repo, Project, User, Environment}

  @env_name "test_name"

  describe "changeset" do
    setup [:create_owner_project]

    test "Changeset with valid attributes", %{project: project} do
      changeset = Environment.create_changeset(%Environment{}, %{name: @env_name, project_id: project.id})
      assert changeset.valid? == true
    end

    test "Changeset with invalid attributes", %{project: project} do
      changeset = Environment.create_changeset(%Environment{}, %{name: "", project_id: project.id})
      assert changeset.valid? == false
    end
  end

  describe "insert" do
    setup [:create_owner_project]

    test "Insert environment with valid params", %{project: project} do
      assert Environment.create_changeset(%Environment{}, %{name: @env_name, project_id: project.id})
      |> Repo.insert()
      |> repo_condition()
    end

    test "Insert environment with the same name", %{project: project} do
      Environment.create_changeset(%Environment{}, %{name: @env_name, project_id: project.id})
      |> Repo.insert!()

      refute Environment.create_changeset(%Environment{}, %{name: @env_name, project_id: project.id})
      |> Repo.insert()
      |> repo_condition()
    end

    test "Insert environment with invalid params", %{project: project} do
      refute Environment.create_changeset(%Environment{}, %{name: "", project_id: project.id})
      |> Repo.insert()
      |> repo_condition()
    end
  end

  describe "update" do
    setup [:create_owner_project]

    test "Insert then update environment", %{project: project} do
      updated_name = "updated_name";

      assert Environment.create_changeset(%Environment{}, %{name: @env_name, project_id: project.id})
      |> Repo.insert!()
      |> Environment.update_changeset(%{name: updated_name})
      |> Repo.update()
      |> repo_condition()
    end
  end

  describe "delete" do
    setup [:create_owner_project]

    test "Insert then delete environment", %{project: project} do
      assert Environment.create_changeset(%Environment{}, %{name: @env_name, project_id: project.id})
      |> Repo.insert!()
      |> Repo.delete()
      |> repo_condition()
    end
  end

  defp create_owner_project(_) do
    owner =
      User.registration_changeset(%User{}, %{email: "test_email@test.com", password: "test_password"})
      |> Repo.insert!()

      project = Project.create_changeset(%Project{}, %{name: "test_project", owner_id: owner.id})
      |> Repo.insert!()

    {:ok, project: project}
  end
end
