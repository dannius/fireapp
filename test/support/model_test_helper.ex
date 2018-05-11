defmodule FireappWeb.ModelTestHelper do

  defmacro __using__(_) do
    quote do
      defp repo_condition(map) do
        with {:ok, _} <- map do
          true
        else
          _ ->
            false
        end
      end
    end
  end
end
