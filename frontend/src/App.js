import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './esti-logo.png';

function App() {
  // Authentication State
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ rooms: '', house_age: '', agent: 1 });

  // 1. Fetch properties (only if logged in)
  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/api/properties/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setProperties(response.data))
        .catch(error => {
          console.error("Token expired or invalid", error);
          handleLogout(); // Kick them out if token is bad
        });
    }
  }, [token]);

  // 2. Handle Login / Register Submission
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? 'api/login/' : 'api/register/';
    
    axios.post(`http://127.0.0.1:8000/${endpoint}`, authData)
      .then(response => {
        if (isLoginMode) {
          // Save the token on login
          const newToken = response.data.access;
          localStorage.setItem('token', newToken);
          setToken(newToken);
          setAuthError('');
        } else {
          // If they just registered, switch them to the login screen
          setIsLoginMode(true);
          setAuthError('Registration successful! Please log in.');
        }
      })
      .catch(error => {
        setAuthError(isLoginMode ? 'Invalid credentials.' : 'Username might be taken.');
      });
  };

  // 3. Handle Property Submission
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/properties/', newProperty, {
      headers: { Authorization: `Bearer ${token}` } // Send VIP pass
    })
      .then(response => {
        setProperties([...properties, response.data]);
        setNewProperty({ rooms: '', house_age: '', agent: 1 });
      })
      .catch(error => console.error("Error adding property:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // --- STYLING ---
  const BRAND_NAVY = '#112a47';
  const VALUE_GREEN = '#1e8449';

  const pageStyle = { backgroundColor: '#fcfcf9', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, sans-serif", color: BRAND_NAVY, margin: 0, padding: 0 };
  const inputStyle = { width: '100%', padding: '12px', margin: '8px 0 20px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', backgroundColor: BRAND_NAVY, color: 'white', padding: '14px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

  // --- RENDER LOGIN SCREEN ---
  if (!token) {
    return (
      <div style={{ ...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <img src={logo} alt="ESTI Logo" style={{ width: '250px', marginBottom: '20px' }} />
          <h2 style={{ marginTop: 0 }}>{isLoginMode ? 'Agent Portal Login' : 'Register New Agent'}</h2>
          
          {authError && <p style={{ color: isLoginMode ? 'red' : 'green', fontWeight: 'bold' }}>{authError}</p>}
          
          <form onSubmit={handleAuthSubmit} style={{ textAlign: 'left' }}>
            <label>Username</label>
            <input type="text" style={inputStyle} value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} required />
            
            <label>Password</label>
            <input type="password" style={inputStyle} value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} required />
            
            <button type="submit" style={buttonStyle}>{isLoginMode ? 'Log In' : 'Register'}</button>
          </form>
          
          <p style={{ marginTop: '20px', cursor: 'pointer', color: '#666', textDecoration: 'underline' }} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Need an account? Register here.' : 'Already have an account? Log in.'}
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD SCREEN (If Logged In) ---
  return (
    <div style={pageStyle}>
      <header style={{ backgroundColor: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${BRAND_NAVY}` }}>
        <img src={logo} alt="ESTI Logo" style={{ width: '250px' }} />
        <button onClick={handleLogout} style={{ ...buttonStyle, width: 'auto', padding: '10px 20px', backgroundColor: '#e74c3c' }}>Logout</button>
      </header>

      {/* Property Input Form */}
      <div style={{ backgroundColor: 'white', maxWidth: '600px', margin: '40px auto', padding: '30px', borderRadius: '4px', boxShadow: '0 5px 15px rgba(17,42,71, 0.08)' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>New Property Appraisal</h3>
        <form onSubmit={handlePropertySubmit}>
          <label>Number of Rooms</label>
          <input type="number" required style={inputStyle} value={newProperty.rooms} onChange={(e) => setNewProperty({...newProperty, rooms: e.target.value})} />
          <label>House Age (Years)</label>
          <input type="number" required style={inputStyle} value={newProperty.house_age} onChange={(e) => setNewProperty({...newProperty, house_age: e.target.value})} />
          <button type="submit" style={{...buttonStyle, backgroundColor: VALUE_GREEN}}>Generate AI Valuation</button>
        </form>
      </div>

      {/* Property Display Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h2>Recent Appraisals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', paddingBottom: '50px' }}>
          {properties.map(property => (
            <div key={property.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '4px', boxShadow: '0 5px 15px rgba(17,42,71, 0.08)', border: '1px solid #e1e8ed' }}>
              <div style={{ backgroundColor: '#fff', color: BRAND_NAVY, padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', border: `1px solid ${BRAND_NAVY}`, display: 'inline-block', marginBottom: '15px' }}>
                Listing ID: {property.id} (Agent: {property.agent_name})
              </div>
              <h3 style={{margin: '10px 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Residential Property</h3>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '15px'}}>
                <span>Rooms: <strong>{property.rooms}</strong></span>
                <span>Age: <strong>{property.house_age} years</strong></span>
              </div>
              <div style={{ color: VALUE_GREEN, fontWeight: 'bold', fontSize: '28px', marginTop: '20px', borderTop: `1px solid ${BRAND_NAVY}`, paddingTop: '15px' }}>
                <span style={{fontSize: '14px', color: BRAND_NAVY, fontWeight: 'normal'}}>AI Value:</span><br/>
                ${property.price ? property.price.toLocaleString() : 'Calculating...'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;