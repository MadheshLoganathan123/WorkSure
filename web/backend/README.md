# WorkSure Web Admin Backend

Express-based REST API for the WorkSure Web Admin Dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The server will run on `http://localhost:3002`

## API Endpoints

### Admin Analytics

- `GET /api/v1/admin/policy-stats` - System-wide policy statistics
  - Returns: totalActive, totalProtectionPot, pendingApprovals, avgLossRatio

- `GET /api/v1/admin/risk-heatmap` - City-level risk heatmap data
  - Returns: Array of city risk data with risk levels, active policies, claims, and payouts

### Policy Management

- `GET /api/v1/admin/policies` - Get all policies
  - Query params: `status` (optional) - 'Active', 'Pending', or 'Expired'

- `GET /api/v1/admin/policies/:id` - Get specific policy by ID

- `PATCH /api/v1/admin/policies/:id` - Update policy status
  - Body: `{ status: 'Active' | 'Pending' | 'Expired' }`

### Health Check

- `GET /health` - Service health check

## Project Structure

```
web/backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # Route definitions
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utilities (logger, ApiResponse)
│   └── server.ts        # Main server file
├── logs/                # Application logs
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Environment Variables

- `PORT` - Server port (default: 3002)
- `NODE_ENV` - Environment (development/production)
