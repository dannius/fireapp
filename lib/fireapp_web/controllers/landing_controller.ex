defmodule FireappWeb.LandingController do
  use FireappWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
