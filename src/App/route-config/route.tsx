import { RouteObject } from 'react-router-dom';
import PlayingFieldPage from '../../Pages/Playing-field-page/ui/index'
import AuthPage from '../../Pages/Auth-page/ui';
import AdminPanelPage from '../../Pages/Admin-page/ui';
import LessonSelectionPage from '../../Pages/Lesson-selection-page/ui';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <PlayingFieldPage />,
  },
  {
    path: '/login',
    element: <AuthPage />
  },
  {
    path: '/admin-panel',
    element: <AdminPanelPage />
  },
  {
    path: '/lesson-selection',
    element: <LessonSelectionPage />
  }
];

export default routes;