import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Stack,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    apiUrl: "http://localhost:8000",
    refreshInterval: 30,
    enableNotifications: true,
    darkMode: false,
    autoRefresh: true,
    itemsPerPage: 20,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem("settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={12} component="div">
            <Typography variant="h6" gutterBottom>
              API Configuration
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
            <TextField
              fullWidth
              label="API URL"
              value={settings.apiUrl}
              onChange={(e) =>
                setSettings({ ...settings, apiUrl: e.target.value })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
            <TextField
              fullWidth
              type="number"
              label="Refresh Interval (seconds)"
              value={settings.refreshInterval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  refreshInterval: parseInt(e.target.value),
                })
              }
            />
          </Grid>

          <Grid size={12} component="div">
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
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
              label="Enable Notifications"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(e) =>
                    setSettings({ ...settings, darkMode: e.target.checked })
                  }
                />
              }
              label="Dark Mode"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoRefresh}
                  onChange={(e) =>
                    setSettings({ ...settings, autoRefresh: e.target.checked })
                  }
                />
              }
              label="Auto Refresh Data"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
            <TextField
              fullWidth
              type="number"
              label="Items Per Page"
              value={settings.itemsPerPage}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  itemsPerPage: parseInt(e.target.value),
                })
              }
            />
          </Grid>

          <Grid size={12} component="div">
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Settings
              </Button>
              <Button variant="outlined">Reset to Default</Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Settings;
