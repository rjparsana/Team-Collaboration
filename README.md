# Team Collaboration 

## Overview
This backend supports user authentication, task management, and real-time chat using Socket.IO.

## Features
- JWT authentication with role-based access control (Admin/User)
- Task management (Create, Read, Update, Delete)
- Real-time chat with project-specific rooms using Socket.IO
- MongoDB for data storage

## Install dependencies:
npm install

## Create a .env file with the following variables:

MONGO_URI= mongodb+srv://rjparsana8:lQp1C2mAwJRPzDv6@cluster0.vzcc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=RJ_SECRET

## Run the backend server:

node server.js

## Postman Collection

Import the postman_collection.json from this repository to test the API endpoints.

## Deployment
The backend is deployed on Heroku:
Live API
