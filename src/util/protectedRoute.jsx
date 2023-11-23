import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProtectedRoute = (props) => {
  const [cookies] = useCookies(['discordToken', 'discordRefreshToken']);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchAuth = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${cookies.discordToken}`,
      };
      const auth = await fetch(`http://localhost:8000/authenticated`, { headers });

      if (auth.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate('/login');
      }
    } catch (error) {
      console.error("Error fetching authentication:", error);
      setIsLoggedIn(false);
      navigate('/login');
    }
  }, [cookies.discordToken, navigate]);

  useEffect(() => {
    fetchAuth();
  }, [fetchAuth]);

  return (
    <React.Fragment>
      {isLoggedIn ? props.children : null}
    </React.Fragment>
  );
};

export default ProtectedRoute;
