defmodule FireappWeb.ControllerTestHelper do
  alias Fireapp.{User, Project, Repo, Environment}

  def login_params, do: %{email: "owner_email@test.com", password: "test_password"}
  def undefined_id, do: -1

  def archive_project(project) do
    project
    |> Project.archive_changeset()
    |> Repo.update!()
  end

  def create_project_with_owner(owner, project_name \\ "") do
    project_name = if project_name == "", do: "test_project", else: project_name

    project = Project.create_changeset(%Project{}, %{name: project_name, owner_id: owner.id, users: [owner]})
    |> Repo.insert!()

    %{project: project}
  end

  def create_guest_user(_) do
    guest_params = %{email: "guest_email@test.com", password: "test_password"}
    another_guest_params = %{email: "another_guest_email@test.com", password: "test_password"}

    guest = User.registration_changeset(%User{}, guest_params)
    |> Repo.insert!()

    another_guest = User.registration_changeset(%User{}, another_guest_params)
    |> Repo.insert!()

    {:ok, guest: guest, another_guest: another_guest}
  end

  def create_user(_) do
    current_user = User.registration_changeset(%User{}, login_params())
    |> Repo.insert!()

    {:ok, current_user: current_user}
  end

  def create_environment(params) do
    Environment.create_changeset(%Environment{}, params)
    |> Repo.insert!()
  end
end
