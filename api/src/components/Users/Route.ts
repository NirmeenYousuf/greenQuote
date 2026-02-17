import { ServerRoute } from '@hapi/hapi';
import LoginController from './LoginController';
import RegisterController from './RegisterController';
import LogoutController from './LogoutController';

const routes: ServerRoute[] = [
  {
    method: 'post',
    path: '/login',
    options: LoginController,
  },
  {
    method: 'get',
    path: '/logout',
    options: LogoutController,
  },
  {
    method: 'post',
    path: '/register',
    options: RegisterController,
  },
];
export default routes;
