// src/components/Layout/Layout.tsx - COMPLETE FIXED VERSION

import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Receipt,
  People,
  Analytics,
  Logout,
  AdminPanelSettings,
  Settings,
  Group,
  Person,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../services/api";

const drawerWidth = 260;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin on component mount
    const role = api.getUserRole();
    const email = api.getUserEmail();
    setIsAdmin(role === "admin");
    setUserRole(role || "user");
    setUserEmail(email || "User");
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    api.logout();
  };

  // Regular user menu items
  const userMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Transactions", icon: <Receipt />, path: "/transactions" },
    { text: "Analytics", icon: <Analytics />, path: "/analytics" },
    { text: "Customers", icon: <People />, path: "/customers" },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    { text: "User Management", icon: <Group />, path: "/admin/users" },
    { text: "System Overview", icon: <Dashboard />, path: "/admin/overview" },

    { text: "Settings", icon: <Settings />, path: "/admin/settings" },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={700} color="primary">
          MPesa Analytics
        </Typography>
      </Toolbar>

      {/* Improved User Role Indicator */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            bgcolor: isAdmin ? "secondary.main" : "primary.main",
            borderRadius: 2,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {isAdmin ? (
            <AdminPanelSettings sx={{ fontSize: 24 }} />
          ) : (
            <Person sx={{ fontSize: 24 }} />
          )}
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="caption"
              sx={{ opacity: 0.9, display: "block" }}
            >
              Logged in as
            </Typography>
            <Typography variant="subtitle2" fontWeight={600} noWrap>
              {isAdmin ? "Administrator" : "Regular User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.8, display: "block", fontSize: "0.7rem" }}
              noWrap
            >
              {userEmail}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Divider />

      {/* Regular User Menu */}
      <List>
        {userMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                  "& .MuiListItemIcon-root": { color: "white" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Admin Menu - Only visible to admins */}
      {isAdmin && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ px: 3, color: "text.secondary" }}>
            ADMINISTRATION
          </Typography>
          <List>
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "secondary.light",
                      color: "white",
                      "& .MuiListItemIcon-root": { color: "white" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Divider sx={{ my: 1 }} />

      {/* Logout Button */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "error.light",
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Welcome back, {userEmail.split("@")[0] || "User"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "#f9fafc",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
