// src/pages/Customers.tsx - Fix to show real customers

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  Search,
  Refresh,
  Person,
  AttachMoney,
  Receipt,
} from "@mui/icons-material";
import api from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

interface Customer {
  id: string;
  phone: string;
  transaction_count: number;
  total_volume: number;
  average_transaction: number;
  last_transaction: string;
  first_name?: string;
  last_name?: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  // src/pages/Customers.tsx - Updated fetch function

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Try to use the dedicated customers endpoint first
      const data = await api.fetchCustomers(0, 100);
      setCustomers(data);
      setError(null);
      console.log("✅ Customers loaded from API:", data.length);
    } catch (err: any) {
      console.log(
        "⚠️ Customers endpoint failed, falling back to transactions:",
        err.message
      );

      // Fallback: process transactions locally
      try {
        const transactions = await api.fetchTransactions(0, 1000);

        // Group by counterparty to create customer list
        const customerMap = new Map();

        transactions.forEach((tx: any) => {
          if (!customerMap.has(tx.counterparty)) {
            customerMap.set(tx.counterparty, {
              id: tx.counterparty,
              phone: tx.counterparty,
              transactions: [],
              total_volume: 0,
              last_transaction: tx.timestamp,
              first_name: `Customer ${tx.counterparty.slice(-4)}`,
            });
          }

          const customer = customerMap.get(tx.counterparty);
          customer.transactions.push(tx);
          customer.total_volume += tx.amount;

          // Update last transaction if newer
          if (new Date(tx.timestamp) > new Date(customer.last_transaction)) {
            customer.last_transaction = tx.timestamp;
          }
        });

        // Transform to customer list
        const customerList = Array.from(customerMap.values()).map((c: any) => ({
          id: c.phone,
          phone: c.phone,
          transaction_count: c.transactions.length,
          total_volume: c.total_volume,
          average_transaction: c.total_volume / c.transactions.length,
          last_transaction: c.last_transaction,
          first_name: c.first_name,
        }));

        setCustomers(customerList);
        setError(null);
      } catch (txErr: any) {
        setError(txErr.message || "Failed to fetch customers");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.phone.includes(searchTerm) ||
      (customer.first_name &&
        customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner message="Loading customers..." />;
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton color="inherit" size="small" onClick={fetchCustomers}>
            <Refresh />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
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
          Your Customers
        </Typography>
        <TextField
          size="small"
          placeholder="Search by phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Customers
              </Typography>
              <Typography variant="h4">{customers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">
                {customers.reduce((sum, c) => sum + c.transaction_count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Transaction
              </Typography>
              <Typography variant="h4">
                KES{" "}
                {Math.round(
                  customers.reduce((sum, c) => sum + c.average_transaction, 0) /
                    (customers.length || 1)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Customers Grid */}
      <Grid container spacing={3}>
        {filteredCustomers.map((customer) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={customer.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: "#6366f1", width: 56, height: 56 }}>
                    <Person />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6">
                      {customer.first_name ||
                        `Customer ${customer.phone.slice(-4)}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.phone}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Receipt fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Transactions
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {customer.transaction_count}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AttachMoney fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Volume
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          KES {customer.total_volume.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    Average Transaction
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    KES{" "}
                    {Math.round(customer.average_transaction).toLocaleString()}
                  </Typography>
                </Box>

                <Box mt={2} pt={2} borderTop={`1px solid #eee`}>
                  <Typography variant="caption" color="text.secondary">
                    Last Transaction
                  </Typography>
                  <Typography variant="body2">
                    {new Date(customer.last_transaction).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Customers;
