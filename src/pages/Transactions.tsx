// src/pages/Transactions.tsx - FIXED VERSION

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { Search, Refresh, Add, Edit, Delete } from "@mui/icons-material";
import api from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface Transaction {
  id: string;
  transaction_id: string;
  amount: number;
  transaction_type: string;
  counterparty: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Fetch real transactions from API
      const data = await api.fetchTransactions(0, 100);
      console.log("📊 Transactions from API:", data);

      if (data && data.length > 0) {
        // API returned real data
        setTransactions(data);
        setError(null);
      } else {
        // No transactions found for this user
        setTransactions([]);
        setError(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message || "Failed to fetch transactions");

      // NO MOCK DATA FALLBACK - show empty state instead
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.transaction_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || transaction.transaction_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const paginatedTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={600}>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedTransaction(null);
            setOpenDialog(true);
          }}
        >
          New Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Search by ID or counterparty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Filter by Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="send_money">Send Money</MenuItem>
              <MenuItem value="pay_bill">Pay Bill</MenuItem>
              <MenuItem value="buy_goods">Buy Goods</MenuItem>
              <MenuItem value="withdraw">Withdraw</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={fetchTransactions}>
            <Refresh />
          </IconButton>
        </Stack>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Counterparty</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.transaction_id}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.transaction_type.replace("_", " ")}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    KES {transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{transaction.counterparty}</TableCell>
                  <TableCell>
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setOpenDialog(true);
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No transactions found for this user
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Add Your First Transaction
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Transaction Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTransaction ? "Edit Transaction" : "New Transaction"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Transaction ID"
              fullWidth
              size="small"
              defaultValue={selectedTransaction?.transaction_id}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Transaction Type</InputLabel>
              <Select
                label="Transaction Type"
                defaultValue={
                  selectedTransaction?.transaction_type || "send_money"
                }
              >
                <MenuItem value="send_money">Send Money</MenuItem>
                <MenuItem value="pay_bill">Pay Bill</MenuItem>
                <MenuItem value="buy_goods">Buy Goods</MenuItem>
                <MenuItem value="withdraw">Withdraw</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              size="small"
              defaultValue={selectedTransaction?.amount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">KES</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Counterparty"
              fullWidth
              size="small"
              defaultValue={selectedTransaction?.counterparty}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            {selectedTransaction ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transactions;
