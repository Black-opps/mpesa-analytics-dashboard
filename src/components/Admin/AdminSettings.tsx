// src/components/Admin/AdminSettings.tsx

import React from "react";
import {
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import { Save } from "@mui/icons-material";

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    enableNotifications: true,
    maintenanceMode: false,
    debugMode: false,
  });

  const handleSave = () => {
    // Implement save logic
    console.log("Settings saved:", settings);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        System Settings
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure system-wide settings. Changes will affect all users.
      </Alert>

      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  enableNotifications: e.target.checked,
                })
              }
            />
          }
          label="Enable Email Notifications"
        />
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ ml: 2 }}
        >
          Send email notifications to users for important events
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings({ ...settings, maintenanceMode: e.target.checked })
              }
              color="warning"
            />
          }
          label="Maintenance Mode"
        />
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ ml: 2 }}
        >
          Disable user access during maintenance
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={settings.debugMode}
              onChange={(e) =>
                setSettings({ ...settings, debugMode: e.target.checked })
              }
              color="secondary"
            />
          }
          label="Debug Mode"
        />
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ ml: 2 }}
        >
          Enable detailed logging for troubleshooting
        </Typography>
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Paper>
  );
};

export default AdminSettings;
