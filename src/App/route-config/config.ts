import { useRoutes } from "react-router-dom";
import routes from "./route";

export function AppRoutes() {
    const element = useRoutes(routes);
    return element;
}