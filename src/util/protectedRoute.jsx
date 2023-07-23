import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const ProtectedRoute = (props) => {
    const [cookies,] = useCookies(['discordToken', 'discordRefreshToken']);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const fetchAuth = useCallback(() => {
        const headers = {
          Authorization: `Bearer ${cookies.discordToken}`,
        };
        const auth = fetch(`http://localhost:8000/authenticated`, { headers });
        if (auth.status !== 200) {
            setIsLoggedIn(false);
            return navigate('/login');
        }
        setIsLoggedIn(true); 
    }, [cookies.discordToken, navigate]);
    useEffect(() => {
            fetchAuth();
        }, [fetchAuth ]);
    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}
export default ProtectedRoute;npm 