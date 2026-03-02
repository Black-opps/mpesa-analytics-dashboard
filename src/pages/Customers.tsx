import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import customersService, { Customer } from "../services/customers";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, [page, limit, search]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await customersService.getCustomers(
        { page: page + 1, limit },
        { search }
      );
      setCustomers(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to load customers:", error);
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
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "blocked":
        return "error";
      default:
        return "default";
    }
  };

  if (loading && customers.length === 0) {
    return <LoadingSpinner message="Loading customers..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Total Transactions</TableCell>
                <TableCell>Total Volume</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Transaction</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                      >
                        {customer.name?.[0] || customer.phone_number[0]}
                      </Avatar>
                      {customer.name || "N/A"}
                    </Box>
                  </TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.total_transactions}</TableCell>
                  <TableCell>
                    KES {customer.total_volume.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    KES {customer.average_transaction.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(customer.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {customer.last_transaction_date
                      ? new Date(
                          customer.last_transaction_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Customers;
