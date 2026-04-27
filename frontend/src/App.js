import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './esti-logo.png'; 

function App() {
  const [properties, setProperties] = useState([]);
  // State to hold the new data the agent types in
  const [newProperty, setNewProperty] = useState({ rooms: '', house_age: '', agent: 1 });

  // 1. Fetch existing data when the page loads
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    axios.get('http://127.0.0.1:8000/api/properties/')
      .then(response => setProperties(response.data))
      .catch(error => console.error("Error fetching properties:", error));
  };

  // 2. Handle the "Submit" button click
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the new data to the Django API
    axios.post('http://127.0.0.1:8000/api/properties/', newProperty)
      .then(response => {
        // Instantly add the new AI-valued property to the screen
        setProperties([...properties, response.data]);
        // Clear the form boxes
        setNewProperty({ rooms: '', house_age: '', agent: 1 });
      })
      .catch(error => console.error("Error adding property:", error));
  };

  // Core brand colors
  const BRAND_NAVY = '#112a47';
  const PAGE_BG = '#fcfcf9';
  const VALUE_GREEN = '#1e8449';
  const CARD_BG = '#FFFFFF';

  const pageStyle = {
    backgroundColor: PAGE_BG,
    minHeight: '100vh',
    fontFamily: "'Playfair Display', serif, 'Segoe UI', Tahoma, sans-serif",
    color: BRAND_NAVY,
    margin: 0,
    padding: 0
  };

  const headerStyle = {
    backgroundColor: '#FFFFFF',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `2px solid ${BRAND_NAVY}`,
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  };

  const formCardStyle = {
    backgroundColor: CARD_BG,
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '4px',
    boxShadow: '0 5px 15px rgba(17,42,71, 0.08)',
    border: '1px solid #e1e8ed',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '8px 0 20px 0',
    display: 'inline-block',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: VALUE_GREEN,
    color: 'white',
    padding: '14px 20px',
    margin: '8px 0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px'
  };

  const cardStyle = {
    backgroundColor: CARD_BG,
    borderRadius: '4px',
    padding: '25px',
    boxShadow: '0 5px 15px rgba(17,42,71, 0.08)',
    border: '1px solid #e1e8ed',
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <img src={logo} alt="ESTI Logo" style={{ width: '400px', margin: '0 auto', display: 'block' }} />
      </header>

      {/* NEW: Agent Input Form */}
      <div style={formCardStyle}>
        <h3 style={{ marginTop: 0, color: BRAND_NAVY, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          New Property Appraisal
        </h3>
        <form onSubmit={handleSubmit}>
          <label style={{ fontWeight: 'bold' }}>Number of Rooms</label>
          <input 
            type="number" 
            required 
            style={inputStyle} 
            value={newProperty.rooms}
            onChange={(e) => setNewProperty({...newProperty, rooms: e.target.value})}
            placeholder="e.g. 4"
          />

          <label style={{ fontWeight: 'bold' }}>House Age (Years)</label>
          <input 
            type="number" 
            required 
            style={inputStyle} 
            value={newProperty.house_age}
            onChange={(e) => setNewProperty({...newProperty, house_age: e.target.value})}
            placeholder="e.g. 15"
          />

          <button type="submit" style={buttonStyle}>
            Generate AI Valuation
          </button>
        </form>
      </div>

      <div style={{padding: '0 20px'}}>
        <h2 style={{ maxWidth: '1200px', margin: '20px auto 10px auto', fontWeight: 'normal', color: BRAND_NAVY, borderBottom: `1px solid ${BRAND_NAVY}`, display: 'inline-block', paddingBottom: '5px' }}>
          Recent Appraisals
        </h2>
      </div>

      <main style={containerStyle}>
        {properties.map(property => (
          <div key={property.id} style={cardStyle}>
            <div style={{ backgroundColor: '#FFFFFF', color: BRAND_NAVY, padding: '6px 12px', borderRadius: '2px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px', border: `1px solid ${BRAND_NAVY}` }}>
              Listing ID: {property.id} (Agent: {property.agent_name})
            </div>
            <h3 style={{margin: '10px 0 15px 0', fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
              Modern Residential Property
            </h3>
            <div style={{display: 'flex', justifyContent: 'space-between', color: BRAND_NAVY, fontSize: '15px'}}>
              <span>Rooms: <strong>{property.rooms}</strong></span>
              <span>House Age: <strong>{property.house_age} years</strong></span>
            </div>
            <div style={{ color: VALUE_GREEN, fontWeight: 'bold', fontSize: '28px', marginTop: '20px', borderTop: `1px solid ${BRAND_NAVY}`, paddingTop: '15px' }}>
              <span style={{fontSize: '14px', color: BRAND_NAVY, fontWeight: 'normal'}}>AI Predicted Market Value:</span><br/>
              ${property.price ? property.price.toLocaleString() : 'Calculating...'}
            </div>
          </div>
        ))}
      </main>

      <footer style={{textAlign: 'center', padding: '50px', color: BRAND_NAVY, fontSize: '12px', opacity: '0.7'}}>
        ESTI | Real Estate Services<br/>
        Linear Regression AI Model | Integrated by Django & React
      </footer>
    </div>
  );
}

export default App;