# CAMBODIA BUS

A responsive, bilingual (Khmer / English) bus ticket booking frontend built with React, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Recharts, and Context API.

The app runs entirely in **demo/mock mode**: no backend requests are made and no real payments are processed. Booking and CRUD changes live in React memory for the current session. Only language and theme preferences are persisted in `localStorage`; the demo auth session is kept in `sessionStorage`.

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run lint
```

## Demo accounts

Open `/login` and use any of these accounts with password `demo1234`, or click the one-click demo account buttons:

| Role | Email |
| --- | --- |
| Customer | `customer@cambodiabus.demo` |
| Bus company | `company@cambodiabus.demo` |
| Admin | `admin@cambodiabus.demo` |

## Laravel API preparation

Copy `.env.example` to `.env` and update it when the backend is available:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_API_MODE=mock
```

Set `VITE_API_MODE=live` to route service calls through the configured Axios instance. Components never hardcode an API URL. The prepared endpoints are defined in `src/services/`.

## Main flows

- Customer: home → search results → seat selection → passenger info → KHQR demo payment → ticket
- Account: profile, my bookings, booking details, dedicated cancel-booking page
- Admin: dashboard, companies, buses, stations, routes, schedules, bookings, payments, customers, reports, settings
- Company: overview, own buses, own schedules, own bookings, revenue

The QR code and payment proof flow are explicitly demo-only and cannot initiate or settle a real KHQR payment.
