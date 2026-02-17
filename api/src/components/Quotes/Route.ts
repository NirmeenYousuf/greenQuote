import { ServerRoute } from '@hapi/hapi';
import CreateController from './CreateController';
import ReadController from './ReadController';
import FetchController from './FetchController';

const routes: ServerRoute[] = [
  {
    method: 'post',
    path: '/quotes',
    options: CreateController,
  },
  {
    method: 'get',
    path: '/quotes/{id}',
    options: ReadController,
  },
  {
    method: 'get',
    path: '/quotes',
    options: FetchController,
  },
];
export default routes;
