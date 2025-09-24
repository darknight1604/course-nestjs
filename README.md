# Task Management Monorepo

This repository is a **NestJS monorepo** that contains multiple backend applications and shared libraries for building a scalable task management platform.

---

## 📂 Project Structure

apps/

├── notification/ # WebSocket service for real-time notifications

└── task-management/ # Main application with authentication and CRUD modules

libs/

├── queue/ # RabbitMQ wrapper for handling message queues

└── caching-database/ # Redis-based caching abstraction layer

---

## 🚀 Applications

### 1. Notification Service (`apps/notification`)

- WebSocket-based application.
- Listens to **Redis streams** and pushes messages to connected clients in real-time.
- Supports **authentication on WebSocket connection**.
- Acts as a notification hub for the system.

### 2. Task Management Service (`apps/task-management`)

- The **main application** of the system.
- Provides APIs for:
  - Authentication & authorization
  - CRUD operations for:
    - **Teams**
    - **Sprints**
    - **Tickets**
    - **Users**
- Integrates with the notification service and shared libraries.

---

## 📦 Shared Libraries

### 1. Queue (`libs/queue`)

- A wrapper around **RabbitMQ** for working with message queues.
- Provides a clean abstraction for:
  - Publishing messages
  - Consuming messages
- Ensures consistent queue handling across applications.

### 2. Caching Database (`libs/caching-database`)

- Abstraction layer for **caching mechanisms**.
- Defines a `CacheProvider` interface:
  ```ts
  interface CacheProvider {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
  }
  ```
- Current implementation: RedisCacheProvider (backed by Redis).
- Future-proof design: Replace RedisCacheProvider with another implementation without changing the app code.

---

## 🔧 Tech Stack

- NestJS (monorepo mode)
- TypeORM (database ORM)

- RabbitMQ(message queue)

- Redis (cache + streams)

- Socket.IO (real-time communication)
