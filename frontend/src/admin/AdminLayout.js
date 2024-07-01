import { Route, Routes } from "react-router-dom"
import routes from "./routes";

const AdminLayout = props => {
    return <>
        <Routes>
            {routes.map((frontendRoute, index) => {
                return (
                    <Route
                        key={index}
                        path={frontendRoute.path}
                        exact={frontendRoute.exact}
                        name={frontendRoute.name}
                        element={<frontendRoute.element />}
                    />
                );
            })}
        </Routes>
    </>
}

export default AdminLayout;