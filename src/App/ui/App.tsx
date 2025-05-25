import { BrowserRouter, Link } from "react-router-dom";
import { AppRoutes } from "../route-config/config";
import { useUnit } from 'effector-react';
import { $isAuthenticated, $isAdmin, $userRole, userLoggedOut } from "../../Entities/session";

function App() {
  const isAuth = useUnit($isAuthenticated);
  const isAdmin = useUnit($isAdmin);
  const handleLogout = () => {
    userLoggedOut();
  }
  return (
    <div>
      Это временное решение потом удалим
      <BrowserRouter>
        <div style={{ display: 'flex', gap: 15 }}>
          <Link to='/'>
            <button>Игровое поле</button>
          </Link>
          {isAdmin && 
            <Link to='/admin-panel'>
              <button>Админка</button>
            </Link>
          }
          <Link to='/lesson-selection'>
            <button>Настройка игры</button>
          </Link>
          {!isAuth && 
            <Link to='/login'>
              <button>Вход/регистрация</button>
            </Link>
          }
          {isAuth && <button onClick={handleLogout}>Выход</button>}
        </div>
        <AppRoutes />
      </BrowserRouter>
    </div>

  );
}

export default App;
