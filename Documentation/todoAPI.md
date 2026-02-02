# API - Happy Home Living (To-Do)
This API is a scafforld for a weekly to-do list for people that live together. All the tasks is for the whole household and not for one single member. 

The API uses intern memory only. 
Base URL: /api

# Endpoints
GET /api/health only checks if the server is running.
Response: { "ok" : true }

# GET /api/todos
fetch all the to-do tasks.
Response: { "todos": [] }

# POST /api/todo
creates a new to-do task.
Uses quietHours middleware to decide if it should notify users or not.

# DELETE /api/todos/:id
deletes a task. 

# POST /api/todos/reset-week
Simulated a weekly reset, allowing all tasks with "repeatWeekly: true" to reset back to "done: false" every week. 

# Testing
This API has been tested using Insomnia. Export workspace exists in: "test/insomnia/InsomniaTest.yaml