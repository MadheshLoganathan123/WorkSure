# Software Requirements Specification (SRS) - WorkSure Mobile

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for the WorkSure Mobile application. WorkSure is a parametric insurance platform designed specifically for gig workers (delivery partners, ride-hailing drivers) to protect their income against environmental and urban disruptions.

### 1.2 Scope
The WorkSure Mobile app provides real-time risk forecasting, automated claim triggers, premium management, and a digital wallet for instant payouts.

---

## 2. Functional Requirements

### 2.1 User Onboarding & Profiling
- **Persona Selection**: Users can select their work type (Food, Grocery, E-Commerce).
- **Work Profile Builder**: Integration with platform APIs (simulated) to fetch work history.
- **Risk Assessment**: Calculation of a risk score based on location.
    - **API**: [IP-API](https://ip-api.com/) (Free) for zero-config city/zone detection without GPS prompts.

### 2.2 Dynamic Coverage & Monitoring
- **Plan Selection**: choose between Basic, Standard, and Pro coverage plans.
- **Real-time Monitoring**: 5-day predictive dashboard and Live Alerts.
    - **API**: [OpenWeatherMap One Call 3.0](https://openweathermap.org/api/one-call-3) (Free tier: 1,000 calls/day). 
    - **Usage**: One single API covers **Rainfall**, **Temperature (Heat Waves)**, and **Historical Data** for claims.

### 2.3 Automated Claims
- **Auto-Trigger**: Claims initiated when threshold conditions are met.
- **Environmental Validation**:
    - **API**: [OpenWeatherMap Air Quality API](https://openweathermap.org/api/air-pollution) (Free).
    - **Usage**: Provides **AQI data** for health-related disruption claims.

### 2.4 Financial Management
- **WorkSure Wallet**: Digital wallet for payouts.
- **Transaction History**: Logs of payouts.
    - **Requirement**: Simulated/Local state (Minimalist approach: No external payment gateway needed for MVP).

---

## 3. Technical Requirements

### 3.1 Frontend (Mobile)
- **Framework**: [React.js](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Routing**: [React Router](https://reactrouter.com/)

### 3.2 Backend & Data (Open Source Stack)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Server Framework**: [Hono](https://hono.dev/) (Recommended for JSX on the backend) or [Express](https://expressjs.com/)
- **Database Options**:
    - **[Supabase](https://supabase.com/) (Recommended)**: Open-source Firebase alternative. Provides PostgreSQL, Auth, and Real-time out of the box. *Much easier to integrate for mobile/web apps.*
    - **[MongoDB](https://www.mongodb.com/)**: Document-based database. Flexible, but requires more manual setup for Auth and API layers compared to Supabase.
- **Real-time Engine**: [Supabase Realtime](https://supabase.com/realtime) or [Socket.io](https://socket.io/)
- **Validation**: [Zod](https://zod.dev/)
- **External APIs (Minimalist Set)**:
    - **OpenWeatherMap One Call API**: Single source for Weather, Heat, AQI, and Historical verification.
    - **IP-API**: Zero-config city/region detection.

---

## 4. Database Comparison: MongoDB vs Supabase

| Feature | Supabase (PostgreSQL) | MongoDB |
|---------|-----------------------|---------|
| **Type** | Relational (SQL) | Document (NoSQL) |
| **Auth** | Built-in | Manual / Third-party |
| **API** | Auto-generated REST/GraphQL | Manual (Express/Hono) |
| **Ease of Integration** | High (Single Client SDK) | Moderate (Requires API layer) |
| **Real-time** | Built-in | Change Streams (Complex) |

**Conclusion**: For WorkSure Mobile, **Supabase** is more efficient as it handles User Auth and Instant Payout triggers with much less code.

---

## 4. Non-Functional Requirements
- **Low Latency**: Real-time alerts must be delivered within seconds of a trigger event.
- **Security**: Strict encryption for worker identity and financial transactions.
- **Reliability**: 99.9% uptime for the automated claim engine.
