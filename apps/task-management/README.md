# Ticket Management Application

### Overview

- Ticket Management is a simple BE application for management Tickets, authentication and authorization User... You can find the database schema at `./apps/task-management/docs/database-design.md`

### Modules
- Authentication
- Session
- Ticket
- Comment
- Sprint
- User
- Team

### Commands

- Start redis service(macOS)

```bash
redis-server $(brew --prefix)/etc/redis.conf
```

- Run app:
```bash
npm run start:debug:task-management
```