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

  scope "/", FireappWeb do
    pipe_through :browser # Use the default browser stack

    get "/", LandingController, :index
  end

  scope "/api", Api do
    pipe_through :api

    resources "/users", RegistrationController, only: [:create]
  end
end
