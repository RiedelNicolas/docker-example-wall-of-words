# dodkcer-example-wall-of-words
This is an example for a docker-compose class.

## Environment Configuration

This application supports environment variable configuration for flexible deployment scenarios.

### Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your configuration:
   ```bash
   # For classroom use, replace with teacher's IP address
   API_HOST=192.168.1.100
   API_PORT=3000
   API_URL=http://192.168.1.100:3000
   
   FRONTEND_PORT=8080
   REDIS_HOST=redis
   ```

3. Start the application:
   ```bash
   docker-compose up -d
   ```

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `API_HOST` | API server hostname/IP | `localhost` | `192.168.1.100` |
| `API_PORT` | API server port | `3000` | `3000` |
| `API_URL` | Complete API URL | `http://localhost:3000` | `http://192.168.1.100:3000` |
| `FRONTEND_PORT` | Frontend port mapping | `8080` | `8080` |
| `REDIS_HOST` | Redis hostname | `redis` | `redis` |

### Classroom Setup

For classroom use, the teacher should:
1. Find their local IP address: `ip addr show` (Linux) or `ipconfig` (Windows)
2. Update the `.env` file with their IP address
3. Students can then access the application at `http://TEACHER_IP:8080`

### Development vs Production

- **Development**: Use `localhost` in `API_URL` for local testing
- **Production/Classroom**: Use the actual server IP address in `API_URL`

The frontend automatically uses the configured API URL from environment variables, eliminating the need to manually edit JavaScript files.
