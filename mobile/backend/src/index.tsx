/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { z } from 'zod'

const app = new Hono()

// --- Mock Database ---
const profiles: Record<string, any> = {}

// --- JSX Components (Backend UI/Status Page) ---
const Layout = ({ children }: { children: any }) => (
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>WorkSure Backend API</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body className="bg-slate-950 text-slate-200 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto p-8">
                {children}
            </div>
        </body>
    </html>
)

const StatusPage = () => (
    <Layout>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold">WorkSure Mobile API</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <h2 className="text-emerald-400 font-semibold mb-2">API Status</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-sm">Running on Edge/Node runtime</p>
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <h2 className="text-blue-400 font-semibold mb-2">Endpoint Group</h2>
                    <p className="text-sm">/api/v1/profile (Onboarding)</p>
                </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-8">
                <h3 className="text-lg font-semibold mb-4">Functional Endpoints</h3>
                <ul className="space-y-3">
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>POST /api/v1/profile</code>
                        <span className="text-emerald-400">Save Persona & Profile</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>POST /api/v1/risk-assessment</code>
                        <span className="text-blue-400">Calculate Risk Score</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>POST /api/v1/policy/select</code>
                        <span className="text-purple-400">Select Coverage Plan</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>GET /api/v1/weather/monitoring</code>
                        <span className="text-yellow-400">Fetch Risk Monitor Data</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>POST /api/v1/claims/trigger</code>
                        <span className="text-red-400">Auto-Trigger Claim</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>GET /api/v1/claims/history</code>
                        <span className="text-orange-400">View Claims History</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>GET /api/v1/wallet/balance</code>
                        <span className="text-pink-400">Fetch Wallet Balance</span>
                    </li>
                    <li className="flex items-center justify-between text-sm bg-slate-800/20 p-3 rounded-lg">
                        <code>GET /api/v1/wallet/transactions</code>
                        <span className="text-indigo-400">Fetch Transaction Logs</span>
                    </li>
                </ul>
            </div>
        </div>
    </Layout>
)

// --- Routes ---

// API Landing Page (JSX)
app.get('/', (c) => {
    return c.html(<StatusPage />)
})

// Profile Schema
const profileSchema = z.object({
    userId: z.string(),
    persona: z.enum(['food', 'grocery', 'ecommerce']),
    location: z.string(),
    avgEarnings: z.number().optional(),
    workingHours: z.array(z.string()).optional()
})

// Endpoint: Save User Profile/Persona
app.post('/api/v1/profile', async (c) => {
    try {
        const body = await c.req.json()
        const validated = profileSchema.parse(body)

        profiles[validated.userId] = {
            ...validated,
            updatedAt: new Date().toISOString()
        }

        return c.json({
            success: true,
            message: 'Profile saved successfully',
            profile: profiles[validated.userId]
        })
    } catch (err) {
        return c.json({ success: false, error: 'Invalid profile data' }, 400)
    }
})

// Endpoint: Risk Assessment Logic
app.post('/api/v1/risk-assessment', async (c) => {
    const { persona, location } = await c.req.json()

    // Simulated Risk Calculation Logic
    let baseRisk = 25
    if (persona === 'food') baseRisk += 30
    if (location.toLowerCase().includes('delhi')) baseRisk += 20
    if (location.toLowerCase().includes('mumbai')) baseRisk += 15

    const riskScore = Math.min(baseRisk + Math.floor(Math.random() * 20), 100)

    return c.json({
        persona,
        location,
        riskScore,
        level: riskScore > 70 ? 'High' : riskScore > 40 ? 'Moderate' : 'Low',
        timestamp: new Date().toISOString()
    })
})

// --- Feature 2.2: Dynamic Coverage & Monitoring ---

const policySchema = z.object({
    userId: z.string(),
    planId: z.enum(['basic', 'standard', 'pro']),
    coverageAmount: z.number(),
    premium: z.number()
})

// Endpoint: Select Coverage Plan
app.post('/api/v1/policy/select', async (c) => {
    try {
        const body = await c.req.json()
        const validated = policySchema.parse(body)

        // Mock save to database
        profiles[validated.userId] = {
            ...profiles[validated.userId],
            activePolicy: validated,
            policyStatus: 'Active'
        }

        return c.json({
            success: true,
            message: `Successfully enrolled in ${validated.planId} plan`,
            policy: validated
        })
    } catch (err) {
        return c.json({ success: false, error: 'Invalid policy selection' }, 400)
    }
})

// Endpoint: Real-time Weather Monitoring (OpenWeatherMap Placeholder)
app.get('/api/v1/weather/monitoring', async (c) => {
    const lat = c.req.query('lat') || '28.6139' // Default Delhi
    const lon = c.req.query('lon') || '77.2090'
    const apiKey = process.env.OPENWEATHER_API_KEY

    // Structure for OpenWeatherMap One Call 3.0
    // The user will provide the API key later, so we structure the fetch call but use mock data if key is missing.

    if (apiKey) {
        try {
            // This is the actual API call logic ready for when the key is provided
            // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            // const data = await response.json()
            // return c.json(data)
        } catch (error) {
            console.error('Weather API Error:', error)
        }
    }

    // High-Fidelity Mock Data mapped to SRS requirements (Rainfall, Heat, 5-day Forecast)
    return c.json({
        current: {
            temp: 32,
            condition: 'Clear',
            rainfall: 0,
            risk_level: 'Low',
            alerts: []
        },
        forecast: [
            { day: 'Tomorrow', temp: 35, condition: 'Heat Wave', risk: 'High', rainfall: 0 },
            { day: 'Wed', temp: 28, condition: 'Light Rain', risk: 'Moderate', rainfall: 5 },
            { day: 'Thu', temp: 24, condition: 'Heavy Rain', risk: 'High', rainfall: 15 },
            { day: 'Fri', temp: 29, condition: 'Cloudy', risk: 'Low', rainfall: 2 },
            { day: 'Sat', temp: 31, condition: 'Clear', risk: 'Low', rainfall: 0 }
        ],
        aqi: {
            index: 145,
            status: 'Poor',
            recommendation: 'Wear a mask while riding'
        },
        attribution: 'Data powered by OpenWeatherMap (Simulated)'
    })
})

// --- Feature 2.3: Automated Claims ---

const claimTriggerSchema = z.object({
    userId: z.string(),
    location: z.object({
        lat: z.number(),
        lon: z.number()
    }),
    triggerType: z.enum(['rainfall', 'heatwave', 'pollution']),
    timestamp: z.string()
})

// Mock Claims Database
const claimsHistory: any[] = []

// Endpoint: Auto-Trigger Claim
app.post('/api/v1/claims/trigger', async (c) => {
    try {
        const body = await c.req.json()
        const validated = claimTriggerSchema.parse(body)
        const apiKey = process.env.OPENWEATHER_API_KEY

        let validationStatus = 'Pending'
        let validationSource = 'Internal Engine'
        let aqiData = null

        // Environmental Validation (Air Quality API Placeholder)
        if (validated.triggerType === 'pollution' && apiKey) {
            try {
                // const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${validated.location.lat}&lon=${validated.location.lon}&appid=${apiKey}`)
                // aqiData = await response.json()
                // if (aqiData.list[0].main.aqi >= 4) validationStatus = 'Approved'
            } catch (error) {
                console.error('AQI API Error:', error)
            }
        }

        // Automated approval logic (Simulated)
        const newClaim = {
            id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
            ...validated,
            status: validationStatus === 'Approved' ? 'Approved' : 'Verifying',
            amount: 500.00,
            currency: 'INR',
            payoutMethod: 'WorkSure Wallet',
            verificationSource: validationSource,
            verifiedAt: new Date().toISOString()
        }

        claimsHistory.unshift(newClaim)

        return c.json({
            success: true,
            message: 'Claim request received and verification started',
            claim: newClaim
        })
    } catch (err) {
        return c.json({ success: false, error: 'Invalid claim trigger data' }, 400)
    }
})

// Endpoint: View Claims History
app.get('/api/v1/claims/history', (c) => {
    const userId = c.req.query('userId')
    const filteredHistory = userId ? claimsHistory.filter(h => h.userId === userId) : claimsHistory

    return c.json({
        userId,
        history: filteredHistory,
        totalClaims: filteredHistory.length,
        totalPayout: filteredHistory.reduce((acc, curr) => acc + (curr.status === 'Approved' ? curr.amount : 0), 0)
    })
})

// --- Feature 2.4: Financial Management ---

// Mock Wallet Database
const wallets: Record<string, { balance: number; currency: string }> = {}
const transactions: any[] = []

// Endpoint: Fetch Wallet Balance
app.get('/api/v1/wallet/balance', (c) => {
    const userId = c.req.query('userId') || 'anon-user'

    if (!wallets[userId]) {
        wallets[userId] = { balance: 0, currency: 'INR' }
    }

    // Proactively sync balance from approved claims
    const approvedTotal = claimsHistory
        .filter(h => h.userId === userId && h.status === 'Approved')
        .reduce((acc, curr) => acc + curr.amount, 0)

    wallets[userId].balance = approvedTotal

    return c.json({
        userId,
        ...wallets[userId]
    })
})

// Endpoint: Fetch Transaction Logs
app.get('/api/v1/wallet/transactions', (c) => {
    const userId = c.req.query('userId')

    // Generate transactions from claims history for simulation
    const logs = claimsHistory
        .filter(h => !userId || h.userId === userId)
        .map(claim => ({
            id: `TXN-${claim.id.split('-')[1]}`,
            type: 'Credit',
            amount: claim.amount,
            description: `Parametric Payout: ${claim.triggerType}`,
            status: claim.status === 'Approved' ? 'Success' : 'Pending',
            timestamp: claim.verifiedAt
        }))

    return c.json({
        userId,
        transactions: logs
    })
})

const port = 3001
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port
})
