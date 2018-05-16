# Fireapp

## To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

## Start angular server

  * Install Node.js dependencies with `cd frontend && npm install`
  * Start angular server `ng server`
  * Note that you need start frontend from frontend folder, not root

## Tests

 * Use `mix test test` for run all tests
 * Or `mix test test/path/to/test` to run a specific test

## Usage

  * There is a test sdkService in project. You can use it for test everywhere you want.
  * Create account, create project, create environment, then see app.component.ts.
  * You need to set sdk project key and environment name to app.component.ts
  * Test errors will come when signin and signup actions.
  * Visit demo-sdk.service.ts and signin.component.ts/signup.component.ts for more info.
