import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Quote } from './types';

const QuoteDetails = () => {
  const { id } = useParams();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      const res = await api.get<Quote>(`/quotes/${id}`);
      setQuote(res.data);
    };

    fetchQuote();
  }, [id]);

  if (!quote) return null;

  return (
    <Container>
      <Typography variant="h5" mt={4} mb={3}>
        Quote Details
      </Typography>

      <Box>
        <Typography>
          Monthly Consumption: {quote.monthlyConsumptionKwh} Kwh
        </Typography>
        <Typography>System Size: {quote.systemSizeKw} Kw</Typography>
        <Typography>Down Payment: {quote.downPayment} €</Typography>
        <Typography>System Price: {quote.systemPrice} €</Typography>
        <Typography>Principal Amount: {quote.principalAmount} €</Typography>
        <Typography>Risk Band: {quote.riskBand}</Typography>
        <Typography>
          Monthly Payment (5 Years): {quote.monthlyPaymentAmount5Years} €
        </Typography>
        <Typography>
          Monthly Payment (10 Years): {quote.monthlyPaymentAmount10Years} €
        </Typography>
        <Typography>
          Monthly Payment (15 Years): {quote.monthlyPaymentAmount15Years} €
        </Typography>
        <Typography>
          Created At: {new Date(quote.createdAt).toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default QuoteDetails;
