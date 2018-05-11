defmodule FireappWeb.BindView do
  use FireappWeb, :view

  def render("success.json", %{ids: ids}), do: %{ids: ids}

  def render("error.json", _), do: ""
end
