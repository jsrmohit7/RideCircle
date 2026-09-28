# RideCircle API Contract

## Authentication
All endpoints (except `/auth/login` and `/auth/register`) require a Bearer token in the `Authorization` header.

### `POST /auth/register`
- **Request**: `{ "name", "email", "password", "college_id" }`
- **Response**: User object

### `POST /auth/login`
- **Request**: OAuth2 form data `username`, `password`
- **Response**: `{ "access_token", "token_type": "bearer" }`

### `GET /auth/me`
- **Response**: Current User object

## Users

### `GET /users/me`
- **Response**: Current User object

### `GET /users/{id}`
- **Response**: User object

### `POST /users/{id}/block`
- **Response**: `{ "status": "User blocked" }`

### `DELETE /users/{id}/block`
- **Response**: `{ "status": "User unblocked" }`

## Rides

### `POST /rides`
- **Request**: `{ "from_location", "to_location", "departure_time", "vehicle_type", "original_seats", "contribution", ... }`
- **Response**: Created Ride object

### `GET /rides`
- **Query Params**: `from_location`, `to_location`, `date`
- **Response**: List of upcoming Ride objects with available seats.

### `GET /rides/{id}`
- **Response**: Ride object

### `DELETE /rides/{id}`
- **Response**: Status object

### `POST /rides/{id}/complete`
- **Response**: Status object

## Ride Requests

### `POST /rides/{id}/requests`
- **Response**: Request object

### `PATCH /rides/requests/{request_id}?action=ACCEPT|DECLINE|CANCEL`
- **Response**: Status object

## Messages

### `GET /rides/{id}/messages`
- **Response**: List of Message objects

### `POST /rides/{id}/messages`
- **Request**: `{ "message": "string" }`
- **Response**: Message object

## Ratings

### `POST /ratings`
- **Request**: `{ "ride_id", "to_user_id", "rating", "feedback" }`
- **Response**: Rating object

### `GET /ratings/user/{user_id}`
- **Response**: List of Rating objects

## Reports

### `POST /reports`
- **Request**: `{ "reported_user_id", "ride_id", "reason", "description" }`
- **Response**: Report object
