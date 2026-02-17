import { ServerRoute } from '@hapi/hapi';
import HealthRoutes from './components/Health/Route';
import UserRoutes from './components/Users/Route';
import QuoteRoutes from './components/Quotes/Route';
const routes: ServerRoute[] = [...HealthRoutes, ...UserRoutes, ...QuoteRoutes];
export default routes;
