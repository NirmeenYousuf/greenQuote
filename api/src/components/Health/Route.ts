import { ServerRoute } from '@hapi/hapi';
import CheckController from './CheckController';

const routes: ServerRoute[] = [
  {
    method: 'get',
    path: '/health',
    options: CheckController,
  },
];
export default routes;
