import React, { useEffect, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import AuthContext from '../components/AuthContext';
import ServerList from '../components/serverList';

const Login = () => {
  const [loginUrl, setLoginUrl] = useState('');
  const [parameter, setParameter] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['discordToken', 'discordRefreshToken']);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  
  console.log(cookies)
  useEffect(() => {
    const fetchLoginUrl = async () => {
      try {
        const response = await fetch('http://localhost:8000/login');
        const { url } = await response.json();
        setLoginUrl(url);

        // Retrieve parameter from the URL
        const searchParams = new URLSearchParams(window.location.search);
        const param = searchParams.get('code');
        setParameter(param);

        if (loginUrl && parameter) {
          try {
            const response = await fetch(`http://localhost:8000/callback?code=${parameter}`);
            const data = await response.json();
            console.log(data);
            if (data["error"] ==="Invalid code"){
              removeCookie('discordToken', { path: '/' });
              removeCookie('discordRefreshToken', { path: '/' });
              window.location.href = loginUrl;
            }
            setCookie('discordToken', data["access_token"], { path: '/' });
            setCookie('discordRefreshToken', data["refresh_token"], { path: '/' });
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Error making API call:', error);
          }
        }
        
      } catch (error) {
        console.error('Error retrieving login URL:', error);
      }
    };

    fetchLoginUrl();
  }, [loginUrl]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loginUrl) {
      window.location.href = loginUrl;
    }
  };
  

  return (
    <>
      {isLoggedIn ? (
        <ServerList />
      ) : (
        <section className="vh-100 gradient-custom">
          <div className="container py-5 h-100">
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div
                  className="card bg-dark text-white"
                  style={{
                    borderRadius: "1rem",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  <div className="card-body p-5 text-center">
                    <div className="mb-md-5 mt-md-4 pb-5">
                      <h2
                        className="fw-bold mb-4 text-uppercase"
                        style={{ fontSize: "2rem" }}
                      >
                        Login with Discord
                      </h2>
                      <button
                        className="btn btn-outline-light btn-lg px-5"
                        type="submit"
                        onClick={handleLogin}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
  
};

export default Login;