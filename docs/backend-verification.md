# Backend Verification

## Running the Server

1.  Navigate to the `backend` directory.
2.  Run `npm install` to install dependencies.
3.  Run `node src/server.js`. The server will start on `http://localhost:3000`.

## API Endpoints

### Get All Posts

```bash
curl http://localhost:3000/api/queue
```

### Generate New Posts

```bash
curl -X POST http://localhost:3000/api/generate \
-H "Content-Type: application/json" \
-d '{
  "topic": "Benefits of AI in marketing",
  "tone": "professional",
  "count": 1
}'
```

### Update a Post (e.g., Approve a Post)

```bash
# First, get the ID of a post from the /api/queue endpoint
# Then, use that ID to update the post. For example, to approve post with ID 1:
curl -X PUT http://localhost:3000/api/queue/1 \
-H "Content-Type: application/json" \
-d '{
  "approved": true
}'
```
