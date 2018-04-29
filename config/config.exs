# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :fireapp,
  ecto_repos: [Fireapp.Repo]

# Configures the endpoint
config :fireapp, FireappWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "EN6kQIOzl8cT6N2GshaH620+26W3zS91MPS3qmF9MsJ+esSurlV7xUskEFOETMsY",
  render_errors: [view: FireappWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Fireapp.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:user_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configures slim
config :phoenix, :template_engines,
  slim: PhoenixSlime.Engine,
  slime: PhoenixSlime.Engine

# Configures Guardian
config :fireapp, Fireapp.Auth.Guardian,
  issuer: "fireapp",
  secret_key: "HNinpKh9Ne3tr8BpjCpAEh0xzCqTIG3PWsfkR2AtzvUaRIpbs6oIQ9RcmjmGPekJ"
