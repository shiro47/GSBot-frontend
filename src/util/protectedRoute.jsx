import React, { useEffect, useState } from "react";
import { Route, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const ProtectedRoute = (props) => {
    const [cookies,] = useCookies(['discordToken', 'discordRefreshToken']);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const fetchAuth = async () => {
        const headers = {
          Authorization: `Bearer ${cookies.discordToken}`,
        };
        const auth = await fetch(`http://localhost:8000/authenticated`, { headers });
        if (auth.status !== 200) {
            setIsLoggedIn(false);
            return navigate('/login');
        }
        setIsLoggedIn(true); 
    }
    useEffect(() => {
            fetchAuth();
        }, [isLoggedIn]);
    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}
export default ProtectedRoute;