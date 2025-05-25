import { RouteObject } from 'react-router-dom';
import PlayingFieldPage from '../../Pages/Playing-field-page/ui/index'
import AuthPage from '../../Pages/Auth-page/ui';
import AdminPanelPage from '../../Pages/Admin-page/ui';
import LessonSelectionPage from '../../Pages/Lesson-selection-page/ui';
import { ProtectedRoute, AdminRoute, SceneRoute } from './protectedRoutes';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <AuthPage />
  },
  {
    element: <ProtectedRoute />,
    children:
      [
        {
          element: <SceneRoute />,
          children: [
            {
              path: '/',
              element: <PlayingFieldPage />
            }
          ]
        },
        {
          element: <AdminRoute />,
          children:
            [
              {
                path: '/admin-panel',
                element: <AdminPanelPage />
              }
            ]
        },
        {
          path: '/lesson-selection',
          element: <LessonSelectionPage />
        }
      ]
  },
];

export default routes;