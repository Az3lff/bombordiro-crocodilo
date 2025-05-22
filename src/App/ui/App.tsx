import { BrowserRouter, Link } from "react-router-dom";
import { AppRoutes } from "../route-config/config";

function App() {

  return (
    <div>
      Это временное решение потом удалим
      <BrowserRouter>
        <div style={{ display: 'flex', gap: 15 }}>
          <Link to='/'>
            <button>Игровое поле</button>
          </Link>
          <Link to='/admin-panel'>
            <button>Админка</button>
          </Link>
          <Link to='/lesson-selection'>
            <button>Настройка игры</button>
          </Link>
          <Link to='/login'>
            <button>Вход/регистрация</button>
          </Link>
        </div>
        <AppRoutes />
      </BrowserRouter>
    </div>

  );
}

export default App;
