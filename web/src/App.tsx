import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import AppToast from './components/common/AppToast';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <AppToast />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
