defmodule FireappWeb.BindView do
  use FireappWeb, :view

  def render("success.json", _), do: ""

  def render("error.json", _), do: ""
end

