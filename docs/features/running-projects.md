# Running Projects

Manage your active development servers.

## Start a Project

Click the **Play** button on any project card.

Tafil will:
1. Detect the appropriate start script (`dev`, `start`, `serve`)
2. Find an available port
3. Start the dev server
4. Show a "Running" badge

## Running Badge

Active projects show a green **Running** badge with:
- Pulse animation
- Port number
- Framework icon

## Stop a Project

Click the **Stop** button on a running project card.

Or use the Running Projects panel in the sidebar.

## Running Projects Panel

Click **Running** in the sidebar to see all active dev servers.

Each entry shows:
- Project name
- Framework
- Port number
- Quick actions (Stop, Open in Browser)

## Port Management

### Automatic Port Detection

Tafil automatically:
- Detects the default port for each framework
- Finds available ports if default is taken
- Handles Create React App's port prompts

### Port Conflicts

If a port is in use, Tafil will:
1. Detect the conflict
2. Find the next available port
3. Start on the new port
4. Update the UI with the correct port

### External Processes

Tafil can detect projects running outside of Tafil (started from terminal).

These show with a blue **External** badge.

## Open in Browser

Click the **Browser** icon or "Open in Browser" to open:
```
http://localhost:[port]
```

## Common Ports

| Framework | Default Port |
|-----------|-------------|
| Vite | 5173 |
| Create React App | 3000 |
| Next.js | 3000 |
| Vue CLI | 8080 |
| Angular | 4200 |
| Express | 3000 |

