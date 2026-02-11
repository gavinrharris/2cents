# 2Cents – AI Financial Advice Web App

## Overview

A modern, minimal fintech web app providing AI-powered financial advice, budget tracking, and personalized financial reports. Desktop-first, fully responsive, using mock data throughout.

## Design System

- **Colors**: Deep charcoal primary, soft green accent, light gray background, white cards
- **Style**: Clean SaaS aesthetic (Stripe/Notion-inspired), card-based UI, soft shadows, rounded corners
- **Typography**: Modern sans-serif, professional spacing

---

## Pages & Features

### 1. Landing Page (Public)

- Hero section with "2Cents" branding, headline, and Sign Up / Log In CTAs. Change logo to add color to it.
- Feature highlights section (budgeting, tips, AI chat, reports) with icons
- Minimal footer with About, Privacy, Terms links

### 2. Login Page

- Centered card with logo, email/password fields, Sign In button
- Link to Create Account page

### 3. Create Account Page

- Centered card with logo, email/password fields, Register button
- Link back to Login page

### 4. Personal Financial Survey (Onboarding)

- Multi-field form: name, state dropdown, income, rent, car payment, grocery spend, eating out frequency, recurring expenses open ended question
- Personality preference radio buttons (planner vs. spontaneous)
- Submit redirects to dashboard

### 5. Home Dashboard

- Top navigation bar with logo + links (Home, Chat, Reports, Update Info, Logout)
- Welcome header with user greeting
- "Daily Budgeting Tip" card with placeholder AI text
- Monthly spending trend line chart (using Recharts with mock data)
- Floating chat button in bottom-right corner

### 6. Chat Page

- Full-width chat interface with message history
- User messages right-aligned, AI messages left-aligned with distinct styling
- Input box + send button at bottom
- Placeholder AI responses on send

### 7. Finance Report Page

- Monthly summary cards (income, expenses, savings rate)
- Spending breakdown bar/pie chart
- Savings trend chart
- All using mock data with Recharts

### 8. Update Financial Info Page

- Same form as onboarding, pre-filled with mock user data
- Save button with success toast notification
  9. **Orientation Page**
    1. create a new page for orientation. its in the photo.

---

## Navigation & Flow

- Public routes: Landing, Login, Create Account
- Authenticated routes (simulated): Dashboard, Chat, Reports, Update Info, Survey
- Simulated auth state using React context (no real backend)
- Logout returns to landing page

## Technical Approach

- All mock data, no backend needed
- React Router for navigation
- Recharts for charts/graphs
- Existing shadcn/ui components for forms, cards, buttons
- Responsive design with Tailwind breakpoints