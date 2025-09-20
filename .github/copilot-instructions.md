# Docker Example Wall of Words

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Current Repository State

This repository is currently in a minimal state with only a README.md file. It's intended as an example for a docker-compose class but lacks implementation. The repository name contains a typo ("dodkcer" instead of "docker").

## Working Effectively

### Repository Validation
- **Current state**: Repository contains only README.md file
- **Expected future state**: Docker/docker-compose example application
- **No build required**: There is currently no code to build, test, or run
- **No dependencies**: No package.json, requirements.txt, or other dependency files exist

### Basic Repository Operations
- Clone repository: `git clone https://github.com/RiedelNicolas/dodkcer-example-wall-of-words.git`
- Check current status: `git status`
- List files: `ls -la` (will show only README.md and .git directory)

### Docker Prerequisites (for future development)
When Docker-related code is added to this repository, ensure the following prerequisites:

- Install Docker: 
  ```bash
  # Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install docker.io docker-compose-plugin
  ```
- Verify Docker installation: `docker --version && docker compose version`
- Ensure Docker daemon is running: `sudo systemctl start docker`
- Add user to docker group (optional): `sudo usermod -aG docker $USER`

### Expected Future Files
Based on the repository description, anticipate these files to be added:
- `docker-compose.yml` or `docker-compose.yaml` - Main compose configuration
- `Dockerfile` - Container definition
- Application source code (language TBD)
- `requirements.txt`, `package.json`, or similar dependency files
- `.dockerignore` - Docker ignore patterns

### Expected Application Behavior (when implemented)
Based on the "wall of words" name, this application likely will:
- Display words in a visual "wall" format (web interface)
- May involve user input for adding words
- Possibly include database storage for word persistence
- Could include multiple services (web frontend, backend API, database)
- When testing manually, verify word display, addition, and persistence functionality

## Validation

### Current Validation Steps
- Verify repository structure: `ls -la` should show README.md and .git directory
- Check README content: `cat README.md` should show Docker-compose class example description
- Confirm no build artifacts or dependencies exist
- Verify Docker Compose reports no config: `docker compose config --quiet` should output "no configuration file provided: not found" (expected)

### Future Validation Steps (when code is added)
- **NEVER CANCEL**: Docker builds can take 5-15 minutes depending on base images and dependencies. Set timeout to 30+ minutes.
- **NEVER CANCEL**: Docker Compose startup can take 2-5 minutes for multi-service applications. Set timeout to 10+ minutes.
- Always validate Docker Compose configuration: `docker compose config --quiet`
- Build all services: `docker compose build` -- NEVER CANCEL, set timeout to 30+ minutes
- Start services: `docker compose up -d` -- NEVER CANCEL, set timeout to 10+ minutes
- Check service health: `docker compose ps` and `docker compose logs`
- Test application endpoints manually if web services are involved
- **MANUAL VALIDATION REQUIREMENT**: When web services are added, test complete user scenarios:
  - Access the application via browser if it's a web app
  - Test all major user workflows end-to-end
  - Verify data persistence if databases are involved
  - Check inter-service communication if multiple services exist
- Stop services cleanly: `docker compose down`

## Common Tasks

### Repository Management
- Check git status: `git status`
- View commit history: `git log --oneline`
- Create new branch: `git checkout -b feature/new-feature`

### Documentation
- Edit README: Use appropriate text editor to modify README.md
- Always check if documentation matches implementation when code is added

### Future Docker Operations (when applicable)
- Build images: `docker compose build` -- takes 5-15 minutes, NEVER CANCEL
- Start services: `docker compose up -d` -- takes 2-5 minutes, NEVER CANCEL  
- View logs: `docker compose logs -f [service-name]`
- Scale services: `docker compose up -d --scale [service-name]=3`
- Clean up: `docker compose down -v --remove-orphans`
- Remove images: `docker compose down --rmi all`

### Current Repository Structure
```
.
├── .git/
├── .github/
│   └── copilot-instructions.md (this file)
└── README.md
```

### README.md Content
```
# dodkcer-example-wall-of-words
This is an example for a docker-compose class.
```

## Important Notes

- **Repository Name Typo**: The repository name contains "dodkcer" instead of "docker" - this is intentional and should not be changed without coordinating with the repository owner
- **Minimal State**: Currently no functional code exists - this is expected for a template/example repository
- **Future Development**: When adding Docker functionality, always test with sample data and document service interactions
- **Validation Required**: Any Docker-related additions must be thoroughly tested with complete end-to-end scenarios including container builds, service startup, inter-service communication, and graceful shutdown

## Troubleshooting

### Common Issues (for future development)
- Docker daemon not running: `sudo systemctl start docker`
- Permission denied: Add user to docker group or use sudo
- Port conflicts: Check `docker compose ps` and modify port mappings
- Build cache issues: Use `docker compose build --no-cache`
- Volume permission issues: Check file ownership and Docker volume mounts

### Current State Issues
- Missing implementation: Expected - repository is in template state
- Only README exists: Expected - no functional code has been added yet
- No build scripts: Expected - no code to build currently exists