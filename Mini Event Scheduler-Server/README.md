# Mini Event Scheduler

A simple Node.js/Express server for scheduling events with automatic AI-based categorization (Work, Personal, Other). Events are stored in MongoDB.

## Features

- Create, list, archive/unarchive, and delete events
- Events are categorized automatically based on title/notes
- RESTful API (JSON)
- Health check endpoint

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) instance (local or cloud, e.g., MongoDB Atlas)

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd Mini Event Scheduler-Server
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following content:

```
MONGODB_URI=<your-mongodb-connection-string>
PORT=3001
```

Replace `<your-mongodb-connection-string>` with your MongoDB URI.

### 4. Build the project

```sh
npm run build
```

### 5. Start the server

```sh
npm start
```

Or for development with auto-reload:

```sh
npm run dev
```

The server will run on `http://localhost:3001` by default.

### 6. Run tests

```sh
npm test
```

---

## API Documentation

All endpoints are prefixed with `/api/v1`.

### Health Check

- **GET** `/api/health`
  - **Response:** `{ "status": "OK" }`

---

### Events

#### Get All Events

- **GET** `/api/v1/events`
- **Response:** `200 OK`
  - Returns an array of event objects.

#### Create Event

- **POST** `/api/v1/events`
- **Body:**
  ```json
  {
    "title": "Project Meeting",
    "date": "2024-06-01",
    "time": "14:00",
    "notes": "Discuss project milestones"
  }
  ```
- **Response:** `201 Created`
  - Returns the created event object.

#### Archive/Unarchive Event

- **PUT** `/api/v1/events/:id/archive`
- **Response:** `200 OK`
  - Returns the updated event object with toggled `archived` status.

#### Delete Event

- **DELETE** `/api/v1/events/:id`
- **Response:** `200 OK`
  - `{ "message": "Event deleted successfully" }`

---

## Event Object Structure

```json
{
  "_id": "string",
  "title": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "notes": "string",
  "category": "Work | Personal | Other",
  "archived": false,
  "createdAt": "ISODate"
}
```

---

## Error Handling

- All errors return a JSON object with a `message` field.
- Example:
  ```json
  { "message": "Event not found" }
  ```

---

## Project Structure

- `src/app.ts` - Express app setup and middleware
- `src/server.ts` - Server entry point
- `src/controllers/` - Route handlers
- `src/models/` - Mongoose models
- `src/routes/` - API route definitions
- `src/services/` - Business logic
- `src/utils/` - Utility functions (e.g., database connection)
- `src/types/` - TypeScript interfaces/types

---

## Deployment

This project is ready for deployment on [Vercel](https://event-scheduler-server-2x3q.vercel.app/api/health) using the provided `vercel.json` configuration.

---
