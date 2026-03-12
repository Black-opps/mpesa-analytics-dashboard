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

## 👋 **Overview**

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
