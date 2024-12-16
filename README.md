## Instructions

Create a fork of this repository, and set up the project locally.
You can either run it directly on your machine or use Docker (recommended).

### Running with Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
4. The API will be available at http://localhost:3000
5. To seed the database:
   ```bash
   docker-compose exec app npm run seed
   ```

### Running Locally

Ensure that you have MongoDB running locally, and node v22.

```bash
npm i
npm run seed
npm start
```

### API

By the end of the project, we should have the following endpoints implemented:

- `GET /api/meetings`

Retrieves all the meetings for the user.

- `POST /api/meetings`

Create a new meeting with title, date, and participants.

- `GET /api/meetings/:id`

Retrieve a specific meeting by ID. Include its tasks.

- `PUT /api/meetings/:id/transcript`

Update a meeting with its transcript.

- `POST /api/meetings/:id/summarize`

Generate a summary and action items for a meeting (you can use a mock AI service for this).
Once the AI service returns the action items, you should automatically create the tasks for this meeting.

- `GET /api/tasks`

Returns all the tasks assigned to the user

- `GET /api/meetings/stats`

Return statistics about meetings, such as the total number of meetings, average number of participants, and most frequent participants.
Please follow the data structure defined in the router file.

- (Bonus) `GET /api/dashboard`

Return a summary of the user's meetings, including count and upcoming meetings, task counts by status, and past due tasks. The data structure is also defined in the endpoint file.

## Docker Environment

The application is containerized using Docker and includes:

- Node.js v22 application container
- MongoDB container
- Persistent volume for MongoDB data
- Bridge network for container communication
- Environment variable management
- Health checks for MongoDB

### Environment Variables

The following environment variables can be configured in the `.env` file:

- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration time

### Docker Commands

```bash
# Start the application
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Run database seed
docker-compose exec app npm run seed

# Access MongoDB shell
docker-compose exec mongodb mongosh
```

## Bugs Fixed

- Paginations for the APIs were not implemented properly which can cause problems when call the API on large scale.
- APIs did not filter the data based on the `userId` provided in the token, which can result in unauthorized data access causing security breach.
- APIs used `userId` as authorization header which is replaced with more secure JWT token.

## Further Enhancements that can be made

- Implement cache for frequently accessed data like users, meeting which will be used for the authorization validation purposes.
- Implement rate limiting on the APIs based on certain contraints to limit abusive use of the APIs.
- Shard the data based on the users to handle large scale load by distrubuting the data.

## Project Strucutre

```
fireflies/
│
├── src/
│   ├── controllers/
│   │   ├── DashboardController.ts
│   │   ├── MeetingController.ts
│   │   └── TaskController.ts
│   │
│   ├── interfaces/
│   │   ├── models/
│   │   │   ├── IMeeting.ts
│   │   │   └── ITask.ts
│   │   │
│   │   ├── repositories/
│   │   │   ├── IMeetingRepository.ts
│   │   │   ├── ITaskRepository.ts
|   |   |   └── IRepository.ts
│   │   │
│   │   └── services/
│   │       ├── IDashboardService.ts
│   │       ├── IMeetingService.ts
│   │       └── ITaskService.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── models/
│   │   ├── meeting.model.ts
│   │   └── task.model.ts
│   │
│   ├── repositories/
|   │   ├── mongodb/
│   │   |   └── MongoRepository.ts
│   │   ├── MeetingRepository.ts
│   │   └── TaskRepository.ts
│   │
│   ├── routes/
│   │   ├── dashboard.routes.ts
│   │   ├── meeting.routes.ts
│   │   └── task.routes.ts
│   │
│   ├── scripts/
│   │   └── generateToken.ts
│   │
│   ├── seed.ts
│   ├── server.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── DashboardService.ts
│   │   ├── MeetingService.ts
│   │   └── TaskService.ts
│   │
│   └── utils/
│       ├── AIService.ts
│       ├── errors.ts
│       └── validators.ts
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

- **src/**: The main source directory containing all the application code.

  - **controllers/**: Contains the controller classes that handle incoming requests and return responses. Each controller corresponds to a specific resource (e.g., meetings, tasks, dashboard).

  - **interfaces/**: Defines TypeScript interfaces for models, repositories, and services to ensure type safety and clarity in the codebase.

    - **models/**: Contains interfaces that define the structure of data models (e.g., IMeeting, ITask).

    - **repositories/**: Contains interfaces for repository classes that handle data access logic.

    - **services/**: Contains interfaces for service classes that encapsulate business logic.

  - **middlewares/**: Contains middleware functions for authentication and error handling.

  - **models/**: Contains Mongoose models that define the schema for MongoDB collections (e.g., meeting and task models).

  - **repositories/**: Contains repository classes that implement data access logic for meetings and tasks.

  - **routes/**: Contains route definitions for the API endpoints, mapping HTTP requests to controller methods.

  - **scripts/**: Contains utility scripts, such as generating JWT tokens.

  - **seed.ts**: A script for seeding the database with initial data.

  - **services/**: Contains service classes that implement business logic for meetings, tasks, and dashboards.

  - **utils/**: Contains utility classes and functions, such as an AI service for summarizing meetings, error handling utilities, and input validators.
