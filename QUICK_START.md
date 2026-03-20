# WorkSure - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Start Mobile Backend
```bash
cd mobile/backend
npm install
npm run dev
```
✅ Server running on `http://localhost:3001`
✅ 5 sample users created
✅ Wallets initialized with transactions
✅ 4 sample claims loaded

### 2. Start Web Backend
```bash
cd web/backend
npm install
npm run dev
```
✅ Server running on `http://localhost:3002`
✅ 8 policies loaded
✅ 5 claims ready for review
✅ Risk heatmap data available

---

## 🧪 Quick API Tests

### Test 1: Check Wallet Balance
```bash
curl http://localhost:3001/api/v1/wallet/balance?userId=usr_000001
```

### Test 2: Trigger a Claim
```bash
curl -X POST http://localhost:3001/api/v1/claims/trigger \
  -H "Content-Type: application/json" \
  -d '{"userId": "usr_000001"}'
```

### Test 3: Review Claim (Admin)
```bash
curl -X PATCH http://localhost:3002/api/v1/admin/claims/clm_00000001 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "reviewedBy": "Admin",
    "reviewNotes": "Approved"
  }'
```

### Test 4: Get Admin Dashboard Stats
```bash
curl http://localhost:3002/api/v1/admin/policy-stats
```

---

## 📊 Sample Data Overview

### Users (Mobile Backend)
| User ID | Name | Persona | Location | Balance |
|---------|------|---------|----------|---------|
| usr_000001 | Rajesh Kumar | Daily Wage | Delhi | ₹1,550 |
| usr_000002 | Priya Sharma | Gig Worker | Mumbai | ₹2,050 |
| usr_000003 | Amit Patel | Self-Employed | Bangalore | ₹2,550 |
| usr_000004 | Sunita Devi | Domestic Worker | Chennai | ₹3,050 |
| usr_000005 | Vikram Singh | Daily Wage | Kolkata | ₹3,550 |

### Claims Status
- **1 Pending** - Awaiting admin review
- **1 Approved** - Ready for payment
- **1 Paid** - Completed and credited
- **1 Pending** - Recent submission

---

## 🔗 Key Endpoints

### Mobile Backend (Port 3001)
```
GET  /api/v1/wallet/balance?userId={id}
GET  /api/v1/wallet/transactions?userId={id}
POST /api/v1/wallet/topup
POST /api/v1/wallet/withdraw
GET  /api/v1/claims/history?userId={id}
POST /api/v1/claims/trigger
```

### Web Backend (Port 3002)
```
GET   /api/v1/admin/policy-stats
GET   /api/v1/admin/claims
PATCH /api/v1/admin/claims/:id
GET   /api/v1/admin/policies
```

---

## 🎯 Common Workflows

### Workflow 1: User Gets Paid for Weather Disruption
1. Weather conditions trigger claim → `POST /claims/trigger`
2. Claim created with status "Pending"
3. Admin reviews claim → `PATCH /admin/claims/:id`
4. Claim approved and paid → `POST /claims/pay`
5. Wallet credited automatically
6. User checks balance → `GET /wallet/balance`

### Workflow 2: Admin Reviews Flagged Claim
1. Get pending claims → `GET /admin/claims?status=pending`
2. Review claim details → `GET /admin/claims/:id`
3. Check fraud score
4. Approve or reject → `PATCH /admin/claims/:id`

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
npx kill-port 3001

# Kill process on port 3002
npx kill-port 3002
```

### Dependencies Missing
```bash
# Mobile backend
cd mobile/backend
npm install

# Web backend
cd web/backend
npm install
```

### Seed Data Not Loading
- Check `NODE_ENV` is not set to "production"
- Restart the server
- Check logs for errors

---

## 📱 Frontend Integration

### Connect Mobile App
```typescript
const API_BASE = 'http://localhost:3001/api/v1';

// Get wallet balance
const balance = await fetch(`${API_BASE}/wallet/balance?userId=${userId}`);

// Trigger claim
const claim = await fetch(`${API_BASE}/claims/trigger`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId })
});
```

### Connect Admin Dashboard
```typescript
const API_BASE = 'http://localhost:3002/api/v1';

// Get policy stats
const stats = await fetch(`${API_BASE}/admin/policy-stats`);

// Review claim
const review = await fetch(`${API_BASE}/admin/claims/${claimId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    action: 'approve', 
    reviewedBy: 'Admin',
    reviewNotes: 'Verified'
  })
});
```

---

## 📚 Next Steps

1. ✅ Both backends running
2. ✅ Sample data loaded
3. ✅ API endpoints tested
4. 🔲 Connect frontend applications
5. 🔲 Test end-to-end workflows
6. 🔲 Add authentication
7. 🔲 Deploy to production

---

## 💡 Tips

- Use Postman or Insomnia for easier API testing
- Check server logs for detailed error messages
- Sample user IDs start from `usr_000001`
- Sample claim IDs start from `clm_00000001`
- All amounts are in Indian Rupees (₹)

---

## 🆘 Need Help?

Check these files for detailed information:
- `INTEGRATION_SUMMARY.md` - Complete system overview
- `mobile/backend/src/` - Mobile backend source code
- `web/backend/src/` - Web backend source code
- Server logs - Check console output for errors

---

**Ready to build something amazing! 🚀**
