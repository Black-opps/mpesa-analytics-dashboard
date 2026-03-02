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
  Chip,
  TextField,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTransactions } from "../store/slices/transactionSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from "../types/transaction";

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, pagination, loading } = useAppSelector(
    (state) => state.transactions
  );
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState({
    type: "",
    status: "",
    phoneNumber: "",
  });

  useEffect(() => {
    dispatch(fetchTransactions({ page: page + 1, limit }));
  }, [dispatch, page, limit]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return "success";
      case TransactionStatus.FAILED:
        return "error";
      case TransactionStatus.PENDING:
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 3 }} component="div">
            <TextField
              select
              fullWidth
              size="small"
              label="Transaction Type"
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {Object.values(TransactionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} component="div">
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {Object.values(TransactionStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} component="div">
            <TextField
              fullWidth
              size="small"
              label="Phone Number"
              value={filter.phoneNumber}
              onChange={(e) =>
                setFilter({ ...filter, phoneNumber: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }} component="div">
            <Button variant="contained" fullWidth>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.transaction_id}</TableCell>
                  <TableCell>{transaction.phone_number}</TableCell>
                  <TableCell>
                    KES {transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Transactions;
