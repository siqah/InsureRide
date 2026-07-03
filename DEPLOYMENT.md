# InsureRide Production Deployment Playbook

This document describes how to deploy the InsureRide application on **Render** (for the Spring Boot backend using Docker) and **Netlify** (for the React Vite frontend).

---

## 1. Backend Deployment (Render)

Render hosts the Spring Boot web service and Postgres database.

### **Step A: Spin Up a Render PostgreSQL Database**

1. Log in to Render and click **New > PostgreSQL**.
2. Name the database `insureride-db`.
3. Copy the **Internal Database URL** or **External Database URL**.

### **Step B: Create a Render Web Service**

1. Click **New > Web Service** and connect your Github repository.
2. Configure settings:
   - **Environment**: Select `Docker`.
   - Render will automatically detect the [Dockerfile](file:///Users/app/Desktop/InsureRide/Dockerfile) in the repository root and build the container. There is no need to manually enter build or start commands.
3. Click **Advanced** and set the following environment variables:
   - `SPRING_DATASOURCE_URL`: The PostgreSQL connection string (e.g. `jdbc:postgresql://dpg-xxxxxx:5432/insureride`).
   - `SPRING_DATASOURCE_USERNAME`: The database username.
   - `DB_PASSWORD`: The database user password.
   - `FRONTEND_URL`: The production Netlify deployment URL (e.g. `https://insureride-app.netlify.app`). This is cryptographically critical to dynamically configure CORS validation patterns.
   - `SPRING_DOCKER_COMPOSE_ENABLED`: `false` (Bypasses Docker compose lifecycle checks in production).
4. Deploy the service. Copy the active production URL (e.g. `https://insureride-backend.onrender.com`).

---

## 2. Frontend Deployment (Netlify)

Netlify hosts the React frontend build folder.

### **Step A: Build Configurations**

1. Log in to Netlify and click **Add new site > Import an existing project**.
2. Select your repository.
3. Configure the directory settings:
   - **Base directory**: `frontend` (since the frontend files reside in a subfolder).
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (or `dist` if context base is set to `frontend`).
4. Click **Environment Variables** and add:
   - `VITE_API_URL`: The backend Render URL mapped to `/api` (e.g. `https://insureride-backend.onrender.com/api`).
5. Click **Deploy site**.

### **Client Routing Redirects**

To prevent reload `404 Not Found` messages on single-page routing paths (like `/hospital` or `/worker`), Netlify reads the pre-configured [netlify.toml](file:///Users/app/Desktop/InsureRide/frontend/netlify.toml) file which registers a wildcard rewrite pattern:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This forces all client-side navigation paths to fall back to `index.html` to be resolved dynamically by the React Router DOM.
