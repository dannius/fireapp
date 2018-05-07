defmodule Fireapp.ModelTestHelper do

  defmacro __using__(_) do
    quote do
      alias Project.{Repo}
      alias Project.{Accounts.User}

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
