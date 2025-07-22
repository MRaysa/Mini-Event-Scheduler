# Event Scheduler – React + TypeScript + Vite

A modern event scheduling web application built with **React**, **TypeScript**, and **Vite**. This project provides a clean UI for creating, viewing, filtering, and managing events, with features like category filtering, AI-powered event suggestions, and responsive design.

---

## Features

- Create, view, and manage events with details like title, date, time, location, notes, and category.
- Filter events by date, category, and time (upcoming, past, today).
- Responsive layout with sidebar navigation and mobile drawer support.
- Modern UI using Tailwind CSS and Lucide icons.
- Optimistic UI updates and caching with React Query.
- Toast notifications for user feedback.

---

## File Structure

```
.
├── public/                 # Static assets
├── src/                    # Source code
│   ├── api.ts              # API calls for events
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Tailwind CSS import
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── hooks/              # Custom React hooks
│   ├── components/         # UI components
│   │   ├── common/         # Shared UI (Button, Modal, etc.)
│   │   ├── events/         # Event-related components
│   │   └── layout/         # Layout components
│   └── assets/             # Images and SVGs
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── .env                    # Environment variables
└── README.md               # Project documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Running Locally

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd client
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and adjust as needed.

4. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Scripts

- `npm run dev` – Start the Vite development server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build
- `npm run lint` – Run ESLint

---
