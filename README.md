<div align="center">
  <h1>MPesa Analytics Dashboard</h1>
  <p><strong>A production-ready React dashboard for transforming complex MPesa transaction data into clear, actionable business insights.</strong></p>

  <!-- Add your status badges here if you have any -->
  <p>
    <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Material--UI-5.0-007FFF?style=for-the-badge&logo=mui" alt="Material-UI">
    <img src="https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux" alt="Redux Toolkit">
    <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker" alt="Docker">
  </p>
</div>

---

##  **Overview**

The **MPesa Analytics Dashboard** is the perfect companion to the [MPesa Analytics API](https://github.com/Black-opps/mpesa-analytics-api). It's a modern, feature-rich single-page application (SPA) built to consume the API and present financial data through an intuitive and powerful user interface.

Designed with both end-users and administrators in mind, this dashboard provides a secure, role-based experience. Regular users can monitor their own transaction history and analytics, while administrators gain a holistic view of the entire platform, complete with user management and system-wide insights.

## ✨ **Key Features**

*   **👥 Role-Based User Interface**
    *   **Regular Users**: Experience a personalized dashboard showing only their transactions, analytics, and customer insights.
    *   **Administrators**: Unlock a powerful admin panel with additional views for **User Management**, **System Overview**, and platform settings.
*   **📊 Comprehensive Analytics Views**
    *   **Dashboard**: Get a snapshot of key metrics including total volume, transaction count, and unique customers with interactive KPI cards.
    *   **Visualizations**: Explore data through dynamic, interactive charts (line charts for trends, pie charts for distribution) built with **Recharts**.
    *   **Customer Insights**: Dedicated pages for analyzing customer behavior and segmentation.
*   **📝 Transaction Management**
    *   View, search, and filter transactions in a responsive, paginated table.
    *   Gain insights into transaction statuses and types at a glance with color-coded chips.
*   **🔒 Secure & Scalable Architecture**
    *   **JWT Token Management**: Automatic token storage, injection, and refresh handling via a robust API service layer.
    *   **Protected Routes**: Route guards (`ProtectedRoute`, `AdminRoute`) ensure users only access content they're authorized to see.
    *   **TypeScript**: Full type safety across the entire application, from API responses to component props.
*   **🎨 Modern & Responsive UI**
    *   Built with **Material-UI (MUI)** v5 for a polished, professional look and feel.
    *   Fully responsive design, providing an optimal experience on desktop, tablet, and mobile.
    *   Clean, intuitive layouts that make complex data easy to digest.
*   **🚀 Developer & Deployment Friendly**
    *   **State Management**: Efficient and predictable state management with **Redux Toolkit**.
    *   **API Integration**: Centralized API service layer with request/response interceptors for logging, error handling, and authentication.
    *   **Dockerized**: Ready for containerized deployment.
    *   **Multi-Cloud Ready**: Designed for easy deployment on platforms like AWS and OCI.

## 🛠️ **Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Core Framework** | React 18 | Component-based UI library. |
| **Language** | TypeScript | Static typing for enhanced developer experience and code reliability. |
| **UI Library** | Material-UI (MUI) v5 | Professional, customizable, and responsive component library. |
| **State Management** | Redux Toolkit | Centralized and predictable state management with simplified Redux logic. |
| **API Client** | Axios | Promise-based HTTP client with interceptors for token handling and error management. |
| **Charts** | Recharts | Composable and interactive charting library built with React components. |
| **Routing** | React Router v6 | Declarative routing with support for protected and role-based routes. |
| **Icons** | Material-UI Icons | Comprehensive set of high-quality icons. |
| **Containerization** | Docker | Consistent development and deployment environments. |

## 📂 **Project Structure**

mpesa-analytics-dashboard/
├── public/ # Static assets
├── src/
│ ├── tests/ # Unit and integration tests
│ ├── components/ # Reusable UI components
│ │ ├── Admin/ # Admin-only components
│ │ │ ├── AdminSettings.tsx
│ │ │ ├── SystemOverview.tsx # System-wide stats and charts
│ │ │ ├── SystemStats.tsx # Basic system statistics
│ │ │ └── UserManagement.tsx # User CRUD operations
│ │ ├── Auth/ # Authentication related components
│ │ │ ├── AdminRoute.tsx # Route guard for admin users
│ │ │ └── ProtectedRoute.tsx # Route guard for authenticated users
│ │ ├── cards/ # Reusable card components
│ │ │ └── StatCard.tsx # KPI statistic card
│ │ ├── charts/ # Chart components
│ │ │ ├── index.tsx # Chart exports
│ │ │ ├── RevenuePieChart.tsx
│ │ │ └── TransactionChart.tsx # Line/bar chart for trends
│ │ ├── Debug/ # Debugging tools
│ │ │ └── DashboardDebug.tsx
│ │ └── Layout/ # Main layout component
│ │ └── Layout.tsx
│ ├── pages/ # Main application views
│ │ ├── Dashboard.tsx # Main analytics dashboard
│ │ ├── Transactions.tsx # Transaction list view
│ │ ├── Analytics.tsx # Customer analytics view
│ │ ├── Customers.tsx # Customer list view
│ │ ├── Login.tsx # User login page
│ │ └── Register.tsx # User registration page
│ ├── services/ # External service integrations
│ │ └── api.ts # Centralized API service with interceptors
│ ├── store/ # Redux state management
│ │ ├── hooks.ts # Typed Redux hooks
│ │ └── slices/ # Redux slices
│ │ └── analyticsSlice.ts # Analytics state and thunks
│ ├── App.tsx # Main app component with routing
│ ├── index.tsx # Application entry point
│ └── theme.ts # MUI custom theme configuration
├── .env # Environment variables
├── .env.example # Example environment variables
├── Dockerfile # Docker build instructions
├── nginx.conf # Nginx configuration for production
├── package.json # Project dependencies and scripts
└── test_connection.ps1 # Utility script to test API connection

text

## 🚀 **Quick Start (5 Minutes)**

Get the dashboard up and running locally, connected to your API.

### **Prerequisites**
*   Node.js (v18 or higher)
*   npm or yarn
*   The [MPesa Analytics API](https://github.com/Black-opps/mpesa-analytics-api) should be running locally or accessible remotely.

### **Installation & Setup**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Black-opps/mpesa-analytics-dashboard.git
    cd mpesa-analytics-dashboard
Install Dependencies

bash
npm install
# or
yarn install
Configure Environment

bash
cp .env.example .env
# Edit .env and set REACT_APP_API_URL to your API's address (e.g., http://localhost:8000)
Start the Development Server

bash
npm start
# or
yarn start
Open the Application
Navigate to http://localhost:3000 in your browser.

Docker Setup (Optional)
bash
# Build the Docker image
docker build -t mpesa-dashboard .

# Run the container
docker run -p 3000:3000 mpesa-dashboard
🔗 Integration with MPesa Analytics API
This dashboard is designed to work seamlessly with the companion backend API. Ensure the API is running and the REACT_APP_API_URL in your .env file points to the correct address.



📊 Dashboard Walkthrough
For Regular Users
Login with a regular user account.

Dashboard: View personal KPIs (Total Transactions, Volume, etc.) and interactive charts showing your transaction trends and distribution.

Transactions: Browse, search, and filter your own transaction history.

Analytics: See insights into your customer segments and top customers.

Customers: View a list of all unique counterparties you've transacted with.

For Admin Users
Admins see everything a regular user sees, plus an additional Admin section in the sidebar.

User Management: View, create, activate/deactivate, and delete users.

System Overview: Access a powerful dashboard with system-wide metrics, including total users, transactions, volume, daily activity charts, and a detailed user breakdown table.

Settings: (Placeholder) Configure system parameters.

🧪 Testing & Utilities
Debug Panel: Navigate to /debug to inspect raw API responses, Redux state, and authentication status. This is an invaluable tool for development and troubleshooting.

Connection Tester: Use the provided PowerShell script test_connection.ps1 to verify connectivity between the dashboard and your API.

💼 Why Choose This Dashboard for Your Project?
For Businesses: Get an immediate, intuitive window into your financial data. Empower your team with a tool that turns complex transaction logs into clear, actionable intelligence.

For Developers: Integrate a fully-featured, secure, and well-structured frontend with your fintech application in record time. It's the perfect partner to the MPesa Analytics API.

For Recruiters: This project showcases a deep understanding of modern frontend development, including React with TypeScript, state management (Redux Toolkit), professional UI development (Material-UI), API integration, role-based routing, and a clean, maintainable architecture.

🤝 Connect & Contribute
This project is actively developed. Feel free to:

⭐ Star the repository to show your support.

🐛 Open an issue to report bugs or suggest features.

🔀 Submit a pull request to contribute improvements.

<div align="center"> <sub>Built with ❤️ using React, TypeScript, and Material-UI.</sub> <br /> <a href="https://github.com/Black-opps">GitHub</a> • <a href="https://www.linkedin.com/in/jonathan-wambugu/">LinkedIn</a> • <a href="https://x.com/Mucheru_Jay">X (Twitter)</a> </div> ```
