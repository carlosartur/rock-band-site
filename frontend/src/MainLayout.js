import { Route, Routes } from "react-router-dom";
import routes from "./routes";

const MainLayout = props => {
    return <>
        <div className="front-main">
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
        </div>
    </>
}

export default MainLayout