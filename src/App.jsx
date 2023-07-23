import './App.css';
import { 
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Layout from './components/layout'
import Login from './pages/login';
import HomePage from './pages/home';
import Streamers from './pages/streamers';
import React, { useState, useEffect } from 'react';
import AuthContext from './components/AuthContext';
import { useCookies } from 'react-cookie';
import Dashboard from './pages/dashboard';
import ProtectedRoute from './util/protectedRoute';
import ApexDB from './pages/apexDB';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies,] = useCookies(['discordToken', 'discordRefreshToken']);

  useEffect(() => {
    const fetchAuth = async () => {
      const headers = {
        Authorization: `Bearer ${cookies.discordToken}`,
      };
      const auth = await fetch(`http://localhost:8000/authenticated`, { headers });
      if (auth.status === 200){
        setIsLoggedIn(true);
      }

    }
    fetchAuth();
  }, [cookies]);
  

  
  return (
    <Router>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className="gradient-custom" >
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage/>} exact/>
          <Route path="/login" element={<Login/>} exact/>
          <Route path="/streamers" element={
            <ProtectedRoute>
          <Streamers/>
          </ProtectedRoute>
          } exact/>
          <Route path="/dashboard" element={
            <ProtectedRoute>
          <Dashboard/>
          </ProtectedRoute>
          } exact/>
          <Route path="/apexDB" element={
            <ProtectedRoute>
          <ApexDB/>
          </ProtectedRoute>
          } exact/>
        </Routes>
      </Layout>
      </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;