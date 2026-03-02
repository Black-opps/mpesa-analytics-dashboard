import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Alert,
} from "@mui/material";
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState("transactions");
  const [format, setFormat] = useState("pdf");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      alert(`Report generated successfully in ${format} format!`);
    }, 2000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }} component="div">
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="transactions">Transaction Report</MenuItem>
                  <MenuItem value="customers">Customer Report</MenuItem>
                  <MenuItem value="revenue">Revenue Report</MenuItem>
                  <MenuItem value="analytics">Analytics Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} component="div">
              <FormControl fullWidth>
                <InputLabel>Export Format</InputLabel>
                <Select
                  value={format}
                  label="Export Format"
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <MenuItem value="pdf">PDF Document</MenuItem>
                  <MenuItem value="csv">CSV File</MenuItem>
                  <MenuItem value="excel">Excel File</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} component="div">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} component="div">
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid size={12} component="div">
              <Alert severity="info" sx={{ mb: 2 }}>
                Select the report type, format, and date range to generate your
                report.
              </Alert>
            </Grid>

            <Grid size={12} component="div">
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleGenerateReport}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate Report"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={format === "pdf" ? <PdfIcon /> : <CsvIcon />}
                >
                  Preview
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
