# MPesa Analytics Dashboard

<div align="center">

**A lightweight, secure analytics dashboard for MPesa transaction monitoring with role-based access control.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

</div>

---

## 📋 Overview

The **MPesa Analytics Dashboard** is a modern, secure single-page application for visualizing MPesa transaction data. Built with simplicity and scalability in mind, it provides role-based access control, real-time analytics, and an intuitive user interface.

### 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **🔐 JWT Authentication** | Secure token-based auth with Context API (no Redux complexity) |
| **👥 Role-Based Access** | Owner, Admin, Analyst, and Viewer roles with different permissions |
| **🛡️ Protected Routes** | Route guards prevent unauthorized access |
| **💎 Premium Features** | Analytics & Insights locked behind role checks with visual badges |
| **📊 Dashboard** | Interactive sidebar navigation with active route highlighting |
| **🎨 Modern UI** | Custom design system with dark theme, no heavy UI libraries |

### 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | React 18 | Component-based UI library |
| **Language** | TypeScript | Static typing for reliability |
| **State Management** | Context API | Lightweight auth state (no Redux) |
| **API Client** | Axios | HTTP client with interceptors |
| **Routing** | React Router v6 | Declarative routing with guards |
| **Styling** | CSS Modules + Design Tokens | Custom scalable styling system |

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [API Repository](https://github.com/Black-opps/mpesa-analytics-api))

### Installation

```bash
# Clone the repository
git clone https://github.com/Black-opps/mpesa-analytics-dashboard.git
cd mpesa-analytics-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
