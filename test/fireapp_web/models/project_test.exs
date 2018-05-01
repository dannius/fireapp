defmodule Fireapp.ProjectTest do
  use FireappWeb.ConnCase
  use Fireapp.ModelTestHelper

  alias Fireapp.{Repo, Project, User}

  describe "changeset" do
    setup [:valid_project_params, :invalid_project_params]

    test "Changeset with valid attributes", %{valid_project_params: valid_project_params} do
      changeset = Project.create_changeset(%Project{}, valid_project_params)
      assert changeset.valid? == true
    end

    test "Changeset with invalid attributes", %{invalid_project_params: invalid_project_params} do
      changeset = Project.create_changeset(%Project{}, invalid_project_params)
      assert changeset.valid? == false
    end
  end

  describe "insert" do
    setup [:valid_project_params, :invalid_project_params, :create_guest_user]

    test "Insert project with valid params", %{valid_project_params: valid_project_params} do
      assert Project.create_changeset(%Project{}, valid_project_params)
      |> Repo.insert()
      |> repo_condition()
    end

    test "Insert project with the same name and owner", %{valid_project_params: valid_project_params} do
      Project.create_changeset(%Project{}, valid_project_params)
      |> Repo.insert!()

      refute Project.create_changeset(%Project{}, valid_project_params)
      |> Repo.insert()
      |> repo_condition()
    end

    test "Insert project with the same name to another owner", %{valid_project_params: valid_project_params, guest: guest} do
      Project.create_changeset(%Project{}, valid_project_params)
      |> Repo.insert!()

      valid_project_params = Map.replace!(valid_project_params, :owner_id, guest.id)

      assert Project.create_changeset(%Project{}, valid_project_params)
      |> Repo.insert()
      |> repo_condition()
    end

    test "Insert project with invalid params", %{invalid_project_params: invalid_project_params} do
      refute Project.create_changeset(%Project{}, invalid_project_params)
      |> Repo.insert()
      |> repo_condition()
    end
  end

  describe "update" do
    setup [:valid_project_params]

    test "Insert then update project", %{valid_project_params: valid_project_params} do
      project = Project.create_changeset(%Project{}, valid_project_params)
      |> Repo.insert!()

      project = Repo.get!(Project, project.id)
      updated_name = "updated_name";

      assert project
      |> Repo.preload(:users)
      |> Project.changeset(%{name: updated_name})
      |> Repo.update()
      |> repo_condition()
    end
  end

  describe "archive" do
    setup [:valid_project_params]

    test "Insert then archive project", %{valid_project_params: valid_project_params} do
      project = Project.create_changeset(%Project{}, valid_project_params)
      |> Repo.insert!()

      project = Repo.get!(Project, project.id)

      assert project
      |> Repo.preload(:users)
      |> Project.archive_changeset()
      |> Repo.update()
      |> repo_condition()
    end
  end

  defp valid_project_params(_) do
    owner = User.registration_changeset(%User{}, %{email: "test_email@test.com", password: "test_password"})
    |> Repo.insert!()

    {:ok, valid_project_params: %{name: "test_project", owner_id: owner.id}}
  end

  defp invalid_project_params(_) do
    owner = User.registration_changeset(%User{}, %{email: "user_email@test.com", password: "test_password"})
    |> Repo.insert!()

    {:ok, invalid_project_params: %{name: "", owner_id: owner.id}}
  end

  defp create_guest_user(_) do
    guest = User.registration_changeset(%User{}, %{email: "guest_email@test.com", password: "test_password"})
    |> Repo.insert!()

    {:ok, guest: guest}
  end

end
