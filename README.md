# Departments Fullstack App

Full-stack setup with:

- **Backend**: NestJS, GraphQL, TypeORM, Postgres, JWT Auth
- **Frontend**: Next.js (App Router) + Zustand
- **Features**:
  - `POST /auth/login` returns a JWT token.
  - Protected GraphQL operations for:
    - `createDepartment`
    - `getDepartments` (with pagination)
    - `updateDepartment`
    - `deleteDepartment` (cascade deletes sub-departments)
  - Frontend:
    - State management with zustand
    - Login form (Redirects to departments if logged in)
    - Simple dashboard to manage departments
    - Create departments with optional sub-departments
    - View hierarchy and delete
    - Logout

## 1. Running locally

### Backend only

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

Backend runs on `http://localhost:4000`.

Default seeded user:

- **username**: `admin`
- **password**: `password`

#### Test login (REST)

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Use the returned `accessToken` as `Authorization: Bearer <token>` for GraphQL.

#### Example GraphQL queries

**Create department alone**

```graphql
mutation {
  createDepartment(
    input: { name: "Finance", subDepartments: null }
  ) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Create department with sub-departments**

```graphql
mutation {
  createDepartment(
    input: {
      name: "Finance"
      subDepartments: [{ name: "Accounts" }, { name: "Audit" }]
    }
  ) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Get departments with pagination**

```graphql
query {
  getDepartments(pagination: { page: 1, limit: 10 }) {
    items {
      id
      name
      subDepartments {
        id
        name
      }
    }
    meta {
      total
      page
      limit
      totalPages
    }
  }
}
```

**Update department**

```graphql
mutation {
  updateDepartment(input: { id: 1, name: "Finance & Audit" }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

**Delete department**

```graphql
mutation {
  deleteDepartment(id: 1)
}
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

- Log in with `admin` / `password`
- You will be redirected to `/departments` to manage data.


### Running on docker
- Set up env variables
```bash
cd backend
cp .env.example .env
```
- Build and start app within docker
```bash
docker compose up --build
```
- Frontend runs on `http://localhost:3000`,
- Backend ruuns on `http://localhost:4000`.

### Backend (NestJS)

- **Web Service** on Render.
- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`
- Environment variables:
  - `DATABASE_URL` (Render Postgres)
  - `JWT_SECRET`
  - `FRONTEND_URL` (your frontend deployment URL)

### Frontend (Next.js)

- Deploy to Vercel or Render.
- Environment variable:
  - `NEXT_PUBLIC_API_URL` = backend public URL.

## Notes

- Validation ensures:
  - Department `name` \>= 2 characters.
  - Sub-department `name` \>= 2 characters.
- Deleting a department cascades deletes its sub-departments (via TypeORM relation).
