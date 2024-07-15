import { NavLink } from "react-router-dom"

export const CNavLink = (props) => {

    const {to} = props

    return <NavLink
        to="/admin/users"
        className="nav-link"
    >
        Messages
    </NavLink>
}