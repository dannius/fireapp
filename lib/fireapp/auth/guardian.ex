defmodule Fireapp.Auth.Guardian do
  use Guardian, otp_app: :fireapp

  def subject_for_token(user, _claims) do
    sub = to_string(user.id)
    {:ok, sub}
  end

  def resource_from_claims(claims) do
    id = claims["sub"]
    user = Fireapp.Repo.get(Fireapp.User, id)
    {:ok, user}
  end
end
