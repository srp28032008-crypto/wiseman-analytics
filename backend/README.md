# Wiseman Analytics - Protected Cloud Server

This is the backend server template for Wiseman Analytics, equipped with **Terminator Security Core V2**. It runs an Express HTTP server along with an integrated JWT-authenticated WebSocket Server to feed simulated price ticks.

---

## 🚀 Getting Started

### 1. Installation
Navigate to this directory in your terminal and install dependencies:
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file by copying the example template:
```bash
copy .env.example .env
```
*(Make sure to change the `JWT_SECRET` key to a secure custom string in production).*

### 3. Start Server
Run the startup script:
```bash
npm start
```
The server will boot on port `5000` by default.

---

## 🛡️ Terminator V2 Security Architecture

This backend implements a 5-star protection layer:

1. **Helmet Secure Headers**: Blocks Clickjacking, XSS, and MIME-sniffing at the browser level.
2. **REST Rate Limiting**: Limits IP addresses to max 100 requests per 15 minutes to block brute-force and DDoS attempts.
3. **Strict CORS Boundaries**: Restricts request origins strictly to whitelisted addresses (`http://localhost:8000`, `http://127.0.0.1:8000`).
4. **WAF Request Scanner**: Scans all incoming query params and POST requests for threat signatures. If an injection attempt is found, it blocks the packet and returns a `BLOCKED` status code.
5. **Secure WebSocket Stream**: WebSocket connections require a cryptographically signed JWT token. Inbound messages are scanned. If a script payload is found, the server triggers countermeasures, decreases shield strength, and clears the threat stream.

---

## 🔍 API Testing Guide

### 1. Health & Security Check
* **Method**: `GET`
* **Route**: `http://localhost:5000/api/health`
* **Returns**: Current CPU health status and Terminator Shield capacity (e.g. `100%`).

### 2. User Registration
* **Method**: `POST`
* **Route**: `http://localhost:5000/api/register`
* **Body (JSON)**:
  ```json
  {
    "username": "trader1",
    "password": "Password123!"
  }
  ```

### 3. Authentication & Token Issuance
* **Method**: `POST`
* **Route**: `http://localhost:5000/api/login`
* **Body (JSON)**:
  ```json
  {
    "username": "trader1",
    "password": "Password123!"
  }
  ```
* **Returns**: A signed JWT `token` required for WebSocket connections.

### 4. Fetch Security Logs (Admin only)
* **Method**: `GET`
* **Route**: `http://localhost:5000/api/security-logs`
* **Headers**: `x-api-key: BlackDragon_AdminSecretKey_98765`

### 5. Secure WebSocket connection
* **URL**: `ws://localhost:5000/?token=YOUR_JWT_TOKEN_HERE`
* **Payload**: Receives `TICK_UPDATE` price tick packets every second.
