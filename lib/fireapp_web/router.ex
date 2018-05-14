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
    resources "/errors", ErrorController, only: [:create]
  end

  scope "/api", FireappWeb do
    pipe_through [:api, :with_session]

    get "/session", SessionController, :setup

    resources "/users", UserController, only: [:update, :index]
    put "/users/:id/reset-password", UserController, :reset_password

    get "/users/:id/bind", BindController, :bind
    get "/users/:id/unbind", BindController, :unbind

    resources "/projects", ProjectController
    get "/projects/:id/archive", ProjectController, :archive
    get "/projects/:id/unarchive", ProjectController, :unarchive
    get "/projects/:id/reset-sdk-key", ProjectController, :reset_sdk_key

    resources "/environments", EnvironmentController, only: [:create, :update, :delete]
    resources "/errors", ErrorController, only: [:index, :update, :delete]
  end
end
