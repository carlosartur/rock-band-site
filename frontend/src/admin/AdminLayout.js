import { Route, Routes } from "react-router-dom"
import routes from "./routes";

const AdminLayout = props => {
    return <>
        <Routes>
            {routes.map((adminRoute, index) => {
                return (
                    <Route
                        key={index}
                        // path={adminRoute.path}
                        path={adminRoute.path}
                        exact={adminRoute.exact}
                        name={adminRoute.name}
                        element={<adminRoute.element />}
                    />
                );
            })}
        </Routes>
    </>
}

export default AdminLayout;