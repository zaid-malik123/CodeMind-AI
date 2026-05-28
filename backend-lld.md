# Backend LLD — AI Codebase Assistant
**Stack:** Node.js + Express · MongoDB + Mongoose · Redis · RabbitMQ · Pinecone · Google Gemini · AWS/GCP

---

## 1. Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection (mongoose)
│   │   ├── redis.js               # Redis client (ioredis)
│   │   ├── rabbitmq.js            # RabbitMQ connection (amqplib)
│   │   ├── pinecone.js            # Pinecone client init
│   │   ├── gemini.js              # Google Gemini client init
│   │   └── env.js                 # All env vars validated here (zod)
│   │
│   ├── models/                    # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Repository.model.js
│   │   ├── RepoSummary.model.js
│   │   ├── Chat.model.js
│   │   └── Message.model.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validator.js
│   │   │
│   │   ├── repo/
│   │   │   ├── repo.routes.js
│   │   │   ├── repo.controller.js
│   │   │   ├── repo.service.js
│   │   │   └── repo.validator.js
│   │   │
│   │   ├── chat/
│   │   │   ├── chat.routes.js
│   │   │   ├── chat.controller.js
│   │   │   ├── chat.service.js
│   │   │   └── chat.validator.js
│   │   │
│   │   └── user/
│   │       ├── user.routes.js
│   │       ├── user.controller.js
│   │       └── user.service.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verify
│   │   ├── rateLimit.middleware.js # Redis-based rate limiter
│   │   ├── error.middleware.js     # Global error handler
│   │   └── validate.middleware.js  # Zod schema validator
│   │
│   ├── websocket/
│   │   ├── ws.server.js           # WebSocket server setup
│   │   └── ws.events.js           # Event constants
│   │
│   ├── jobs/
│   │   └── producer.js            # Publish jobs to RabbitMQ
│   │
│   ├── utils/
│   │   ├── jwt.util.js
│   │   ├── hash.util.js
│   │   ├── logger.js              # Winston logger
│   │   └── apiResponse.util.js    # Standard response format
│   │
│   └── app.js                     # Express app init
│
├── worker/                        # Separate process
│   ├── index.js                   # Worker entry, consumes RabbitMQ
│   ├── handlers/
│   │   ├── cloneRepo.handler.js
│   │   ├── chunkFiles.handler.js
│   │   ├── generateEmbeddings.handler.js
│   │   ├── storePinecone.handler.js
│   │   └── generateSummary.handler.js
│   └── utils/
│       ├── gitClone.util.js       # simple-git wrapper
│       ├── fileScanner.util.js    # walk dirs, filter files
│       ├── chunker.util.js        # split code into chunks
│       └── cleanup.util.js        # delete cloned repo after indexing
│
├── .env.example
├── server.js                      # Entry point (starts app + ws)
├── package.json
└── Dockerfile
```

---

## 2. Dependencies

### Production
```json
{
  "express": "^4.18",
  "mongoose": "^8.3",
  "ioredis": "^5.3",
  "amqplib": "^0.10",
  "@pinecone-database/pinecone": "^2.2",
  "@google/generative-ai": "^0.15",
  "bcryptjs": "^2.4",
  "jsonwebtoken": "^9.0",
  "zod": "^3.22",
  "simple-git": "^3.19",
  "ws": "^8.16",
  "winston": "^3.11",
  "dotenv": "^16.4",
  "cors": "^2.8",
  "helmet": "^7.1",
  "express-rate-limit": "^7.2"
}
```

### Dev
```json
{
  "nodemon": "^3.0",
  "jest": "^29.7",
  "supertest": "^6.3",
  "eslint": "^8.57"
}
```

> `uuid` package ki zaroorat nahi — MongoDB ka `_id` (ObjectId) apne aap unique ID deta hai.

---

## 3. Database Design (MongoDB + Mongoose)

### Collection: users
```js
// models/User.model.js
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },   // bcrypt hash
  },
  { timestamps: true }   // createdAt, updatedAt auto
);

// Index
userSchema.index({ email: 1 });
```

---

### Collection: repositories
```js
// models/Repository.model.js
const repositorySchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    githubUrl:    { type: String, required: true },
    repoName:     { type: String },               // "acme/backend-api"
    status:       {
                    type: String,
                    enum: ['pending', 'cloning', 'chunking', 'embedding', 'ready', 'failed'],
                    default: 'pending'
                  },
    totalFiles:   { type: Number, default: 0 },
    totalChunks:  { type: Number, default: 0 },
    errorMessage: { type: String },
    indexedAt:    { type: Date },
  },
  { timestamps: true }
);

// Indexes
repositorySchema.index({ userId: 1 });
repositorySchema.index({ status: 1 });
```

---

### Collection: reposummaries
```js
// models/RepoSummary.model.js
const repoSummarySchema = new mongoose.Schema(
  {
    repoId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true, unique: true },
    architecture: { type: String },               // AI-generated architecture overview
    techStack:    [{ type: String }],             // ["Node.js", "Redis", "MongoDB"]
    folderTree:   { type: String },               // top-level folder structure text
    apiOverview:  { type: String },               // public API summary
  },
  { timestamps: true }
);
```

---

### Collection: chats
```js
// models/Chat.model.js
const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    repoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },
    title:  { type: String, default: 'New Chat' },  // auto-set from first message
  },
  { timestamps: true }
);

// Indexes
chatSchema.index({ userId: 1, repoId: 1 });
```

---

### Collection: messages
```js
// models/Message.model.js
const messageSchema = new mongoose.Schema(
  {
    chatId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    role:       { type: String, enum: ['user', 'assistant'], required: true },
    content:    { type: String, required: true },
    fileRefs:   [
                  {
                    filePath:  { type: String },   // "src/middleware/auth.js"
                    startLine: { type: Number },
                    endLine:   { type: Number },
                  }
                ],
    tokenCount: { type: Number },
  },
  { timestamps: true }
);

// Index
messageSchema.index({ chatId: 1, createdAt: 1 });
```

---

## 4. MongoDB vs PostgreSQL — Is Project Me Kyon Sahi Hai

| Reason | Detail |
|--------|--------|
| Flexible schema | `fileRefs`, `techStack` jaise nested arrays naturally fit hote hain |
| No migrations | Status enum change karna ho ya field add karna — schema update karo, done |
| Mongoose ODM | Built-in validation, hooks (pre-save password hash), populate (joins) |
| MongoDB Atlas | AWS pe free tier available, managed, backups automatic |
| ObjectId | UUID package ki zaroorat nahi |

---

## 5. Redis Usage

| Key Pattern                        | Type   | TTL     | Purpose                            |
|------------------------------------|--------|---------|------------------------------------|
| `session:{userId}`                 | String | 7 days  | JWT refresh token store            |
| `ratelimit:{userId}:{endpoint}`    | String | 1 min   | Rate limiting counter              |
| `repo:progress:{repoId}`           | Hash   | 1 hour  | Ingestion progress for WebSocket   |
| `chat:context:{chatId}`            | List   | 2 hours | Last N messages for Gemini context |

### repo:progress hash fields
```
status        → "embedding"
total_chunks  → "8420"
done_chunks   → "5040"
current_step  → "Generating embeddings..."
```

---

## 6. RabbitMQ Queues

| Queue Name       | Published by       | Consumed by        | Purpose                      |
|------------------|--------------------|--------------------|------------------------------|
| `repo.clone`     | repo.service.js    | cloneRepo.handler  | Clone GitHub repo            |
| `repo.chunk`     | cloneRepo.handler  | chunkFiles.handler | Scan + chunk files           |
| `repo.embed`     | chunkFiles.handler | generateEmbeddings | Create embeddings via Gemini |
| `repo.store`     | embed.handler      | storePinecone      | Store vectors in Pinecone    |
| `repo.summarize` | store.handler      | generateSummary    | Generate AI repo summary     |

Each job message shape:
```json
{
  "repoId":    "mongoObjectId",
  "userId":    "mongoObjectId",
  "githubUrl": "https://github.com/acme/backend-api",
  "clonePath": "/tmp/repos/mongoObjectId"
}
```

---

## 7. Pinecone Schema

**Index name:** `codebase-chunks`
**Dimensions:** 768 (Gemini text-embedding-004)
**Metric:** cosine

### Vector metadata (stored per chunk)
```json
{
  "repoId":    "mongoObjectId",
  "filePath":  "src/middleware/auth.js",
  "startLine": 42,
  "endLine":   78,
  "language":  "javascript",
  "chunkText": "function verifyToken(req, res, next) { ... }"
}
```

**Namespace per repo:** `repo-{repoId}` → isolates search per repository

---

## 8. API Endpoints

### Auth — `/api/v1/auth`
| Method | Endpoint    | Auth | Description              |
|--------|-------------|------|--------------------------|
| POST   | `/register` | ❌   | Register new user        |
| POST   | `/login`    | ❌   | Login, returns JWT       |
| POST   | `/logout`   | ✅   | Invalidate refresh token |
| POST   | `/refresh`  | ❌   | Get new access token     |

### Repo — `/api/v1/repos`
| Method | Endpoint           | Auth | Description                    |
|--------|--------------------|------|--------------------------------|
| POST   | `/`                | ✅   | Add new repo, publish to queue |
| GET    | `/`                | ✅   | List all repos of current user |
| GET    | `/:repoId`         | ✅   | Get repo details + status      |
| GET    | `/:repoId/summary` | ✅   | Get AI-generated repo summary  |
| DELETE | `/:repoId`         | ✅   | Delete repo + Pinecone vectors |
| POST   | `/:repoId/reindex` | ✅   | Trigger fresh re-indexing      |

### Chat — `/api/v1/chats`
| Method | Endpoint              | Auth | Description                         |
|--------|-----------------------|------|-------------------------------------|
| POST   | `/`                   | ✅   | Create new chat for a repo          |
| GET    | `/`                   | ✅   | List all chats (filter by repoId)   |
| GET    | `/:chatId`            | ✅   | Get chat + message history          |
| DELETE | `/:chatId`            | ✅   | Delete chat                         |
| POST   | `/:chatId/messages`   | ✅   | Send message, get AI response       |
| GET    | `/:chatId/messages`   | ✅   | Get paginated messages              |

### User — `/api/v1/users`
| Method | Endpoint | Auth | Description              |
|--------|----------|------|--------------------------|
| GET    | `/me`    | ✅   | Get current user profile |
| PATCH  | `/me`    | ✅   | Update name or password  |
| DELETE | `/me`    | ✅   | Delete account           |

---

## 9. WebSocket Events

**Connection:** `ws://host/ws?token=<JWT>`

| Event (Server → Client) | Payload                                           | Description        |
|-------------------------|---------------------------------------------------|--------------------|
| `repo:progress`         | `{ repoId, step, doneChunks, totalChunks, pct }` | Ingestion progress |
| `repo:ready`            | `{ repoId }`                                      | Indexing complete  |
| `repo:failed`           | `{ repoId, error }`                               | Indexing failed    |

---

## 10. Core Flow — Chat Message (RAG)

```
POST /api/v1/chats/:chatId/messages
         │
         ▼
  Validate request (zod)
         │
         ▼
  Chat.findById(chatId) → get repoId
         │
         ▼
  Generate embedding of user question
  (Gemini text-embedding-004)
         │
         ▼
  Query Pinecone namespace: repo-{repoId}
  top_k = 8, similarity threshold 0.75
         │
         ▼
  Fetch last 6 messages from Redis cache
  (chat context window)
         │
         ▼
  Build Gemini prompt:
    [system] + [repo summary] + [retrieved chunks] + [chat history] + [user question]
         │
         ▼
  Call Gemini 1.5 Flash API
         │
         ▼
  Parse response + extract file references
         │
         ▼
  Message.insertMany([userMsg, aiMsg])
  Update Redis cache
         │
         ▼
  Return { answer, fileRefs, tokensUsed }
```

---

## 11. Standard API Response Format

```json
// Success
{
  "success": true,
  "data": {},
  "message": "Repository added successfully"
}

// Error
{
  "success": false,
  "error": {
    "code": "REPO_NOT_FOUND",
    "message": "Repository does not exist or access denied"
  }
}
```

---

## 12. Environment Variables (.env)

```bash
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codebase_ai

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=codebase-chunks

# Google Gemini
GEMINI_API_KEY=your_gemini_key

# File Storage
REPO_CLONE_PATH=/tmp/repos
MAX_REPO_SIZE_MB=500
```

---

## 13. Error Codes Reference

| Code                  | HTTP | Meaning                            |
|-----------------------|------|------------------------------------|
| `VALIDATION_ERROR`    | 400  | Request body failed zod validation |
| `UNAUTHORIZED`        | 401  | JWT missing or invalid             |
| `FORBIDDEN`           | 403  | Resource belongs to another user   |
| `REPO_NOT_FOUND`      | 404  | Repo does not exist                |
| `CHAT_NOT_FOUND`      | 404  | Chat does not exist                |
| `REPO_NOT_READY`      | 409  | Repo still indexing, cannot chat   |
| `REPO_LIMIT_EXCEEDED` | 429  | User hit repo quota                |
| `RATE_LIMITED`        | 429  | Too many requests                  |
| `EMBEDDING_FAILED`    | 500  | Gemini embedding API error         |
| `PINECONE_ERROR`      | 500  | Vector search failed               |
| `INTERNAL_ERROR`      | 500  | Unexpected server error            |
