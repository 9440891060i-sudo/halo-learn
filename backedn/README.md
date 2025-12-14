# Halo Learn backend

This folder contains a simple Express + MongoDB backend for the Halo Learn app.

Quick start

1. From the `backedn` folder, install dependencies:

```bash
cd backedn
npm install
```

2. Create a `.env` file (or rely on the provided connection string) using `.env.example`.

3. Run the server in development:

```bash
npm run dev
```

API endpoints

- `POST /api/users` - create user { name, email, mobile, address, city, pincode }
- `GET /api/users` - list users
- `GET /api/users/:id` - get user
- `PUT /api/users/:id` - update user

- `GET /api/plans` - list plans (seeded: `basic`, `pro`)

- `POST /api/orders` - create order { userId, planId, paymentMethod, address }
- `GET /api/orders` - list orders
- `GET /api/orders/:id` - get order

Notes

- CORS is enabled so you can call these APIs from the frontend.
- The server will seed two plans on startup if they don't exist.
