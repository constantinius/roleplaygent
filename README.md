# Roleplaygent

An AI Agent to run pen-and-paper RPG games.

## Deployment

### Agent

Go to the `roleplaygent-agent/` directory first.

To deploy the Agent on Fly.io, first a `volume` needs to be created.

```bash
fly volumes create games_data --size 1 --region fra -n 2 --app roleplaygent-agent
```

To run, the `OPENAI_API_KEY` secret needs to be set:
```bash
fly secrets set OPENAI_API_KEY=...
```

Now the agent can be deployed:

```bash
fly deploy
```

### UI

Go to the `roleplaygent-ui/` directory first.

Modify the Agent API URL in the `fly.toml` if necessary:

```toml
[env]
  NEXT_PUBLIC_AGENT_URL = 'https://roleplaygent-agent.fly.dev'
```

Then just run:

```bash
fly deploy
```
