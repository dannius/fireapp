defmodule FireappWeb.Router do
  use FireappWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :with_session do
    plug Guardian.Plug.Pipeline,
      error_handler: Fireapp.Auth.ErrorHandler,
      module: Fireapp.Auth.Guardian
    # If there is a session token, validate it
    plug Guardian.Plug.VerifySession, claims: %{"typ" => "access"}
    # If there is an authorization header, validate it
    plug Guardian.Plug.VerifyHeader, realm: "Bearer", claims: %{"typ" => "access"}
    # Load the user if either of the verifications worked
    plug Guardian.Plug.LoadResource
  end

  scope "/", FireappWeb do
    pipe_through :browser # Use the default browser stack

    get "/", LandingController, :index
  end

  scope "/api", FireappWeb do
    pipe_through :api

    resources "/users", RegistrationController, only: [:create]
    resources "/session", SessionController, only: [:create]
  end

  scope "/api", FireappWeb do
    pipe_through [:api, :with_session]

    resources "/users", UserController, only: [:update]
    put "/users/:id/reset-password", UserController, :reset_password
    get "/session", SessionController, :setup

    resources "/projects", ProjectController, only: [:create, :update, :index, :show]
    post "/projects/:id/archive", ProjectController, :archive
    post "/projects/:id/bind", ProjectController, :bind
    post "/projects/:id/unbind", ProjectController, :unbind
  end
end
