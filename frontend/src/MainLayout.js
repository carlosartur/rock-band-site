import { Route, Routes } from "react-router-dom";
import routes from "./routes";
import { StickyNavbar } from "./Components/Navbar/Navbar";

const MainLayout = props => {
    return <>
        <div className="front-main">
            <StickyNavbar />
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

                {/* { path: '/', name: 'Home', element: Home } */}
                <Route
                    key="1234598"
                    path={'/oi'}
                    exact={true}
                    name="teste"
                    element={<div>oi</div>}
                />

            </Routes>
        </div>
    </>
}

export default MainLayout