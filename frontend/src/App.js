import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './esti-logo.png';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ rooms: '', house_age: '', agent: 1 });
  
  // NEW: State for tracking which property is being edited
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ rooms: '', house_age: '' });

  useEffect(() => {
    if (token) {
      axios.get('http://167.172.188.187:8000/api/properties/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setProperties(response.data))
        .catch(error => {
          console.error("Token expired", error);
          handleLogout();
        });
    }
  }, [token]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? 'api/login/' : 'api/register/';
    axios.post(`http://167.172.188.187:8000/${endpoint}`, authData)
      .then(response => {
        if (isLoginMode) {
          localStorage.setItem('token', response.data.access);
          setToken(response.data.access);
          setAuthError('');
        } else {
          setIsLoginMode(true);
          setAuthError('Registration successful! Please log in.');
        }
      })
      .catch(() => setAuthError(isLoginMode ? 'Invalid credentials.' : 'Username taken.'));
  };

  const handlePropertySubmit = (e) => {
    e.preventDefault();
    axios.post('http://167.172.188.187:8000/api/properties/', newProperty, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProperties([...properties, response.data]);
        setNewProperty({ rooms: '', house_age: '' });      })
      .catch(error => console.error("Error adding property:", error));
  };

  // NEW: Delete Function
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      axios.delete(`http://167.172.188.187:8000/api/properties/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setProperties(properties.filter(property => property.id !== id));
      })
      .catch(error => console.error("Error deleting property:", error));
    }
  };

  // NEW: Start Edit Mode
  const startEdit = (property) => {
    setEditingId(property.id);
    setEditFormData({ rooms: property.rooms, house_age: property.house_age });
  };

  // NEW: Save Updated Property
  const handleUpdate = (id) => {
    axios.patch(`http://167.172.188.187:8000/api/properties/${id}/`, editFormData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      // Replace the old property data with the newly calculated one
      setProperties(properties.map(p => (p.id === id ? response.data : p)));
      setEditingId(null); // Close edit mode
    })
    .catch(error => console.error("Error updating property:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const BRAND_NAVY = '#112a47';
  const VALUE_GREEN = '#1e8449';

  const pageStyle = { backgroundColor: '#fcfcf9', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, sans-serif", color: BRAND_NAVY, margin: 0, padding: 0 };
  const inputStyle = { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const buttonStyle = { backgroundColor: BRAND_NAVY, color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

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
            <button type="submit" style={{...buttonStyle, width: '100%', marginTop: '15px'}}>{isLoginMode ? 'Log In' : 'Register'}</button>
          </form>
          <p style={{ marginTop: '20px', cursor: 'pointer', color: '#666', textDecoration: 'underline' }} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Need an account? Register here.' : 'Already have an account? Log in.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <header style={{ backgroundColor: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${BRAND_NAVY}` }}>
        <img src={logo} alt="ESTI Logo" style={{ width: '250px' }} />
        <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>Logout</button>
      </header>

      <div style={{ backgroundColor: 'white', maxWidth: '600px', margin: '40px auto', padding: '30px', borderRadius: '4px', boxShadow: '0 5px 15px rgba(17,42,71, 0.08)' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>New Property Appraisal</h3>
        <form onSubmit={handlePropertySubmit}>
          <label>Number of Rooms</label>
          <input type="number" required style={inputStyle} value={newProperty.rooms} onChange={(e) => setNewProperty({...newProperty, rooms: e.target.value})} />
          <label>House Age (Years)</label>
          <input type="number" required style={inputStyle} value={newProperty.house_age} onChange={(e) => setNewProperty({...newProperty, house_age: e.target.value})} />
          <button type="submit" style={{...buttonStyle, width: '100%', backgroundColor: VALUE_GREEN, marginTop: '10px', fontSize: '16px'}}>Generate AI Valuation</button>
        </form>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h2>Manage Appraisals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', paddingBottom: '50px' }}>
          {properties.map(property => (
            <div key={property.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '4px', boxShadow: '0 5px 15px rgba(17,42,71, 0.08)', border: '1px solid #e1e8ed', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                <div style={{ backgroundColor: '#fff', color: BRAND_NAVY, padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', border: `1px solid ${BRAND_NAVY}`, display: 'inline-block', marginBottom: '15px' }}>
                  Listing ID: {property.id} | Agent: {property.agent_name} 
                </div>
                <h3 style={{margin: '10px 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>Residential Property</h3>
                
                {/* Toggle between Edit Mode and View Mode */}
                {editingId === property.id ? (
                  <div style={{ paddingBottom: '15px' }}>
                    <label style={{ fontSize: '14px' }}>Rooms:</label>
                    <input type="number" style={inputStyle} value={editFormData.rooms} onChange={e => setEditFormData({...editFormData, rooms: e.target.value})} />
                    <label style={{ fontSize: '14px' }}>Age (Years):</label>
                    <input type="number" style={inputStyle} value={editFormData.house_age} onChange={e => setEditFormData({...editFormData, house_age: e.target.value})} />
                  </div>
                ) : (
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '15px'}}>
                    <span>Rooms: <strong>{property.rooms}</strong></span>
                    <span>Age: <strong>{property.house_age} years</strong></span>
                  </div>
                )}
                
                <div style={{ color: VALUE_GREEN, fontWeight: 'bold', fontSize: '28px', marginTop: '20px', borderTop: `1px solid ${BRAND_NAVY}`, paddingTop: '15px' }}>
                  <span style={{fontSize: '14px', color: BRAND_NAVY, fontWeight: 'normal'}}>AI Value:</span><br/>
                  ${property.price ? property.price.toLocaleString() : 'Calculating...'}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                {editingId === property.id ? (
                  <>
                    <button onClick={() => handleUpdate(property.id)} style={{ ...buttonStyle, flex: 1, backgroundColor: VALUE_GREEN }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ ...buttonStyle, flex: 1, backgroundColor: '#7f8c8d' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(property)} style={{ ...buttonStyle, flex: 1, backgroundColor: '#3498db' }}>Edit</button>
                    <button onClick={() => handleDelete(property.id)} style={{ ...buttonStyle, flex: 1, backgroundColor: '#e74c3c' }}>Delete</button>
                  </>
                )}
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;