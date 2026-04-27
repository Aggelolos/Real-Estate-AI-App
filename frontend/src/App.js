import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Importing the new ESTI logo file you just saved
import logo from './esti-logo.png'; 

function App() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Axios fetches data from the Django API
    axios.get('http://127.0.0.1:8000/api/properties/')
      .then(response => {
        setProperties(response.data);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
      });
  }, []);

  // Define the core brand color codes
  const BRAND_NAVY = '#112a47'; // Sophisticated Navy Blue from logo text
  const PAGE_BG = '#fcfcf9';    // Warm Paper White from business card background
  const VALUE_GREEN = '#1e8449'; // Rich Financial Green for prices
  const CARD_BG = '#FFFFFF';    // Clean white for cards

  const pageStyle = {
    backgroundColor: PAGE_BG,
    minHeight: '100vh',
    fontFamily: "'Playfair Display', serif, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Optional refined font feel
    color: BRAND_NAVY,
    margin: 0,
    padding: 0
  };

  const headerStyle = {
    backgroundColor: '#FFFFFF', // Clear white header area
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center', // Center the logo image
    alignItems: 'center',
    borderBottom: `2px solid ${BRAND_NAVY}`, // Thick blue line for structure
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  };

 const logoStyle = {
    width: '400px',  // Controls how wide it is across the screen
    height: 'auto',  // Keeps the proportions perfect
    margin: '0 auto',
    display: 'block'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // Standard grid columns
    gap: '30px' // Increased spacing for premium feel
  };

  const cardStyle = {
    backgroundColor: CARD_BG,
    borderRadius: '4px', // More square corners match the logo lines
    padding: '25px',
    boxShadow: '0 5px 15px rgba(17,42,71, 0.08)', // Blue-tinted shadow
    border: '1px solid #e1e8ed',
    transition: 'transform 0.2s ease',
    // Minimalist hover effect
    ":hover": {
      transform: 'translateY(-3px)'
    }
  };

  const badgeStyle = {
    backgroundColor: '#FFFFFF',
    color: BRAND_NAVY,
    padding: '6px 12px',
    borderRadius: '2px', // Minimalist square edges
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginBottom: '15px',
    border: `1px solid ${BRAND_NAVY}`, // Outline matches logo color
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const priceStyle = {
    color: VALUE_GREEN,
    fontWeight: 'bold',
    fontSize: '28px',
    marginTop: '20px',
    borderTop: `1px solid ${BRAND_NAVY}`,
    paddingTop: '15px'
  };

  return (
    <div style={pageStyle}>
      {/* Premium Header with centered logo */}
      <header style={headerStyle}>
        <img src={logo} alt="ESTI Real Estate Services Logo" style={logoStyle} />
      </header>

      {/* Main Content Area Title (now outside header for sleek look) */}
      <div style={{padding: '0 20px'}}>
        <h2 style={{
          maxWidth: '1200px', 
          margin: '40px auto 10px auto', 
          fontWeight: 'normal', 
          color: BRAND_NAVY,
          borderBottom: `1px solid ${BRAND_NAVY}`,
          display: 'inline-block',
          paddingBottom: '5px'
          }}>
          AI Property Valuations
        </h2>
      </div>

      {/* Main Grid Container for Property Cards */}
      <main style={containerStyle}>
        {properties.map(property => (
          <div key={property.id} style={cardStyle} className="property-card">
            <div style={badgeStyle}>
              Listing ID: {property.id} (Agent: {property.agent_name})
            </div>
            
            <h3 style={{margin: '10px 0 15px 0', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
              Modern Residential Property
            </h3>
            
            <div style={{display: 'flex', justifyContent: 'space-between', color: BRAND_NAVY, fontSize: '15px', opacity: '0.9'}}>
              <span>Rooms: <strong>{property.rooms}</strong></span>
              <span>House Age: <strong>{property.house_age} years</strong></span>
            </div>
            
            {/* The core AI prediction result, matching the brand green accent */}
            <div style={priceStyle}>
              <span style={{fontSize: '14px', color: BRAND_NAVY, fontWeight: 'normal', opacity: '0.8'}}>AI Predicted Market Value:</span><br/>
              ${property.price.toLocaleString()}
            </div>
          </div>
        ))}
      </main>

      {/* Corporate Footer */}
      <footer style={{textAlign: 'center', padding: '50px', color: BRAND_NAVY, fontSize: '12px', opacity: '0.7'}}>
        ESTI | Real Estate Services<br/>
        Linear Regression AI Model | Integrated by Django & React
      </footer>
    </div>
  );
}

export default App;