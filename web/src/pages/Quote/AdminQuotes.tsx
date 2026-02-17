import {
  Container,
  TextField,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Typography,
  Paper
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { QuoteListResponse, QuoteListResult } from './types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminQuotesList = () => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<QuoteListResult[]>([]);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    name: '',
    email: ''
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchQuotes = async () => {
    try {
      const res = await api.get<QuoteListResponse>('/quotes', {
        params: {
          name: filters.name,
          email: filters.email,
          pageNumber: page + 1,
          pageSize: rowsPerPage
        }
      });

      setQuotes(res.data.results);
      setTotal(res.data.totalCount);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch quotes');
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [page, rowsPerPage]);

  const handleFilter = () => {
    setPage(0);
    fetchQuotes();
  };

  const resetFilter = () => {
    setFilters({ name: '', email: '' });
    setPage(0);
    fetchQuotes();
  };

  return (
    <Container>
      <Typography variant="h5" mt={4} mb={2}>
        Quotes List (Admin)
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="User Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <TextField
          label="Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <Button variant="contained" onClick={handleFilter}>
          Filter
        </Button>
        <Button variant="outlined" onClick={resetFilter}>
          Reset
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>System Size (KW)</TableCell>
              <TableCell>Monthly Payment (5 yrs)</TableCell>
              <TableCell>Monthly Payment (10 yrs)</TableCell>
              <TableCell>Monthly Payment (15 yrs)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {quotes.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.name}</TableCell>
                <TableCell>{q.email}</TableCell>
                <TableCell>{q.systemSizeKw}</TableCell>
                <TableCell>{q.monthlyPaymentAmount5Years}</TableCell>
                <TableCell>{q.monthlyPaymentAmount10Years}</TableCell>
                <TableCell>{q.monthlyPaymentAmount15Years}</TableCell>
                <TableCell>
                  {new Date(q.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/quote/${q.id}`)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Container>
  );
};

export default AdminQuotesList;
