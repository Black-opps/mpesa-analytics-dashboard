import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes";
import { useAppSelector } from "./store/hooks";

function App() {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            ml: sidebarOpen ? "240px" : 0,
            transition: "margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            backgroundColor: (theme) => theme.palette.background.default,
            minHeight: "100vh",
          }}
        >
          <AppRoutes />
        </Box>
      </Box>
    </Router>
  );
}

export default App;
