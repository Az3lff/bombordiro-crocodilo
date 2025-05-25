import { BrowserRouter, Link } from "react-router-dom";
import { AppRoutes } from "../route-config/config";
import { useUnit } from 'effector-react';
import { $isAuthenticated, $isAdmin, $userRole, userLoggedOut } from "../../Entities/session";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import styled from "styled-components";

function App() {
  const isAuth = useUnit($isAuthenticated);
  const isAdmin = useUnit($isAdmin);

  return (
    <Containter>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Containter>


  );
}

export default App;


const Containter = styled(Layout)`
  padding-left: 10px;
  width: 100%;
  height: 100vh;
`