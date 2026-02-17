import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  Paper
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { QuoteListResponse, QuoteListResult } from './types';
import { useNavigate } from 'react-router-dom';

const UserQuotes = () => {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState<QuoteListResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchQuotes = async () => {
    const res = await api.get<QuoteListResponse>('/quotes', {
      params: { pageNumber: page + 1, pageSize: rowsPerPage }
    });

    setQuotes(res.data.results);
    setTotal(res.data.totalCount);
  };

  useEffect(() => {
    fetchQuotes();
  }, [page, rowsPerPage]);

  return (
    <Container>
      <Typography variant="h6" mb={2}>
        My Quotes
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>System Size (KW)</TableCell>
              <TableCell>Risk Band</TableCell>
              <TableCell>Monthly Payment - 5 yrs (€)</TableCell>
              <TableCell>Monthly Payment - 10 yrs (€)</TableCell>
              <TableCell>Monthly Payment - 15 yrs (€)</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((q) => (
              <TableRow key={q.id}>
                <TableCell>
                  {new Date(q.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{q.systemSizeKw}</TableCell>
                <TableCell>{q.riskBand}</TableCell>
                <TableCell>{q.monthlyPaymentAmount5Years}</TableCell>
                <TableCell>{q.monthlyPaymentAmount10Years}</TableCell>
                <TableCell>{q.monthlyPaymentAmount15Years}</TableCell>
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

export default UserQuotes;
