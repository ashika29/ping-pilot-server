# Ping Pilot Server

Ping Pilot Server is a backend application designed to support a health check and monitoring system. It allows users to monitor the performance, uptime, and load time of specific endpoints. Built with NestJS, it provides a scalable and maintainable architecture for managing monitoring tasks.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
  - [Running Tests](#running-tests)
  - [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Endpoint Monitoring**: Collects and monitors user-defined endpoints for performance, uptime, and load time.
- **User Management**: Supports roles and users for managing access and monitoring configurations.
- **Database Integration**: Uses PostgreSQL for storing monitoring data.
- **Queue Management**: Integrates BullMQ for scheduling and processing monitoring tasks.
- **Docker Support**: Includes Docker Compose for easy setup of dependencies like PostgreSQL and Redis.
- **Extensive Testing**: Includes unit and end-to-end tests for ensuring code quality.
- **Interactive API Documentation**: Swagger UI is available for exploring and testing API endpoints.

---

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: An ORM for managing database interactions.
- **PostgreSQL**: A powerful, open-source relational database.
- **Redis**: A fast, in-memory data structure store used for queue management.
- **BullMQ**: A Node.js library for handling job queues.
- **Docker**: For containerizing services and dependencies.
- **Husky & lint-staged**: For enforcing code quality with Git hooks.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)
- **Docker Desktop** (for running `docker-compose`)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ping-pilot-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the necessary environment variables (e.g., database connection details, Redis configuration). Refer to `configuration/` for hints.

4. Install Husky for Git hooks:
   ```bash
   npx husky install
   ```

### Running the Server

1. Start Docker services:

   ```bash
   docker-compose up -d
   ```

2. Run database seeders:

   ```bash
   npm run seed
   ```

3. Start the server in development mode:

   ```bash
   npm run start:dev
   ```

4. Access the server at `http://localhost:3000`.

### Running Tests

To ensure everything is working as expected, run the tests:

- Unit tests:

  ```bash
  npm run test
  ```

- End-to-end tests:
  ```bash
  npm run test:e2e
  ```

### API Documentation

Swagger UI is available for exploring and testing API endpoints. After starting the server, access the documentation at:

```
http://localhost:3000/api-docs
```

---

## Project Structure

```
ping-pilot-server/
├── src/
│   ├── app.controller.ts         # Main application controller
│   ├── app.service.ts            # Main application service
│   ├── app.module.ts             # Root module
│   ├── main.ts                   # Application entry point
│   ├── configuration/            # Configuration files
│   ├── database/                 # Seeders and factories
│   ├── model/                    # Database models
│   └── test/                     # Test files
├── docker-compose.yml            # Docker Compose configuration
├── package.json                  # Project metadata and dependencies
├── README.md                     # Project documentation
└── tsconfig.json                 # TypeScript configuration
```

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
