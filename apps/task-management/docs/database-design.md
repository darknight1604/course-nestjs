# Database Schema Documentation

## Overview

This document outlines the database schema for a ticket management system with users, teams, sprints, and tickets.

## Tables

### Users

Stores user information
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | primary key | Unique identifier |
| username | varchar | | User's username |
| password | varchar | | Hashed password |
| isActive | bool | | Account status |
| role | varchar | | User's role |
| createdDate | timestamp | | Record creation date |
| updatedDate | timestamp | | Record update date |

### Teams

Stores team information
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | primary key | Unique identifier |
| name | integer | | Team name |
| createdById | integer | not null | Creator reference |
| createdBy | varchar | | Creator name |
| createdDate | timestamp | | Record creation date |
| updatedDate | timestamp | | Record update date |

### User Teams

Junction table for users and teams (many-to-many)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| userId | integer | primary key | User reference |
| teamId | integer | primary key | Team reference |
| createdDate | timestamp | | Record creation date |
| updatedDate | timestamp | | Record update date |

### Sessions

Tracks user sessions
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | primary key | Unique identifier |
| userId | integer | not null | User reference |
| accessToken | varchar | | Session token |
| refreshToken | varchar | | Refresh token |
| ipAddress | varchar | | Client IP address |
| userAgent | varchar | | Browser/client info |
| revoked | bool | | Session status |
| createdDate | timestamp | | Record creation date |
| updatedDate | timestamp | | Record update date |
| expiredAt | timestamp | | Record expire date |

### Tickets

Stores ticket information
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | primary key | Unique identifier |
| title | varchar | not null | Ticket title |
| description | varchar | | Ticket details |
| createdById | integer | not null | Creator reference |
| createdBy | varchar | | Creator name |
| assigneeId | integer | not null | Assignee reference |
| status | varchar | | Ticket status |
| parentId | integer | not null | Parent ticket reference |
| teamId | integer | not null | Team reference |
| sprintId | integer | not null | Sprint reference |
| createdDate | timestamp | | Record creation date |
| updatedDate | timestamp | | Record update date |

### Ticket Watchers

Junction table for tickets and watchers (many-to-many)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ticketId | integer | primary key | Ticket reference |
| watcherId | integer | primary key | Watcher reference |

### Comments

Stores ticket comments
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | primary key | Unique identifier |
| content | varchar | not null | Comment content |
| createdById | integer | not null | Creator reference |
| createdBy | varchar | | Creator name |
| ticketId | integer | not null | Ticket reference |
| createdDate | timestamp | | Record creation date |
| updatedDate | timestamp | | Record update date |

### Sprints

Stores sprint information
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | integer | primary key | Unique identifier |
| title | varchar | not null | Sprint title |
| createdById | integer | not null | Creator reference |
| createdBy | varchar | | Creator name |
| teamId | integer | not null | Team reference |
| startDate | timestamp | | Sprint start date |
| endDate | timestamp | | Sprint end date |
| createdDate | timestamp | | Record creation date |
| updatedDate | timestamp | | Record update date |

## Relationships

- teams ← sprints (team_sprints)
- sprints ← tickets (sprint_tickets)
- users ← sessions (user_sessions)
- users ← tickets (user_tickets)
- tickets ← tickets (ticket_tickets)
- tickets ← comments (ticket_comments)
- teams ← tickets (team_tickets)
- users ↔ teams (user_teams)
- users ← tickets (user_tickets)
- users ← comments (user_comments)
- users ← sprints (user_sprints)
- users ↔ tickets (ticket_watchers)
