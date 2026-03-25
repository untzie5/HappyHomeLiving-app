# API Documentation – Happy Home Living

## Overview
This project contains a RESTful'ish API for managing shared household to-do items in the Happy Home Living application.
The API allows the client to create, read, update and delete tasks that are shared between users. It is specifically designed for the app and is not a generic API.
User creation and authentication exist in the project, but are not part of this API scaffold as specified in the assignment.


## Resource: To-do
A to-do item represents a shared household task.
Example:

{
  "id": "todo_1",
  "text": "Clean kitchen",
  "done": false,
  "repeatWeekly": true,
  "removeWhenDone": false
}


## Endpoints

### GET /api/todos
Returns all to-do items.
Response:

{
  "todos": [...]
}

Used by the client to display the shared task list.


### POST /api/todos
Creates a new to-do item.
Request:

{
  "text": "Clean kitchen",
  "repeatWeekly": true,
  "removeWhenDone": false
}

Response:

{
  "created": true,
  "quietHour": false,
  "notification": "would send",
  "todo": {...}
}

Validation:
- text is required and must be a non-empty string


### PATCH /api/todos/:id
Updates a to-do item.
Request:

{
  "done": true
}

Response:

{
  "updated": true,
  "todo": {...}
}

Special case:
- If done = true AND removeWhenDone = true, the item is deleted.


### DELETE /api/todos/:id
Deletes a to-do item.
Response:

{
  "deleted": true,
  "id": "todo_1"
}


### POST /api/todos/reset-week
Resets completed tasks that repeat weekly.
Response:

{
  "ok": true,
  "resetCount": 2
}


## Middleware
The API uses a middleware called quietHours.
This middleware checks the current time and sets:
req.isQuietHours = true | false;
This value is used to simulate whether notifications would be sent or suppressed.


## Error handling
Example errors:

{ "error": "text is required" }

{ "error": "todo not found" }


## Data storage
To-do items are currently stored in memory:
let todos = [];
This means data is temporary and will be lost when the server restarts.


## Testing
The API was tested using Insomnia.  
The exported Insomnia collection is included in the repository.


## Why this API
The to-do API was chosen because shared task management is a core feature of the Happy Home Living application. Happy Home Living is supposed to make shared living easier and more organized


## Notes
This API is a scaffold implementation intended to demonstrate structure and communication between client and server. It is not a complete production-ready system.
