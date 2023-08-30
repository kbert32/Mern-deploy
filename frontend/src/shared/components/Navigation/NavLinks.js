import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import './NavLinks.css';

export default function NavLinks(props) {

    const authCtx = useContext(AuthContext);
    
    return (
        <ul className='nav-links'>
            <li>
                <NavLink to='/' end>All Users</NavLink>
            </li>
            {authCtx.isLoggedIn && (
                <li>
                    <NavLink to={`/${authCtx.userId}/places`}>My Places</NavLink>
                </li>
            )}
            {authCtx.isLoggedIn && (
                <li>
                    <NavLink to='/places/new' >Add Place</NavLink>
                </li>
            )}
            {!authCtx.isLoggedIn && (
                <li>
                    <NavLink to='/auth' >Authenticate</NavLink>
                </li>
            )}
            {authCtx.isLoggedIn && (
                <li>
                    {/* <NavLink onClick={authCtx.logout} to='/auth' >Logout</NavLink> */}  {/*Could also be done this way*/}
                    <button onClick={authCtx.logout}>Logout</button>
                </li>
            )}
        </ul>
    );
};