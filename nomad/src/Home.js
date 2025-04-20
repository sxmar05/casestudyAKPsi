// src/Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={{ width: '100%', height: '100vh', position: 'relative', background: 'radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, #A3CEDD 0%, #2A62C9 100%)', overflow: 'hidden' }}>
    <div style={{ width: 748, height: 112, left: 346, top: 138, position: 'absolute', background: '#D9D9D9', boxShadow: '0px 11px 9.5px rgba(0, 0, 0, 0.25)', borderRadius: 45 }} />
    
    <div style={{ width: 400, height: 59, left: '50%', top: 156, position: 'absolute', transform: 'translateX(-50%)', color: 'black', fontSize: 36, fontFamily: 'Satoshi, sans-serif', fontWeight: '500', textAlign: 'center',}}>
      Welcome To Nomad
    </div>
    
    <div style={{ width: 202, height: 66, left: 449, top: 426, position: 'absolute', background: '#4274D0', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 55 }} />
    <div style={{ width: 202, height: 64, left: 747, top: 427, position: 'absolute', background: '#F5ECEC', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 55 }} />
    
    <Link to="/places" style={{ width: 154, height: 33, left: 478, top: 444, position: 'absolute', color: 'white', fontSize: 20, fontFamily: 'Satoshi, sans-serif', fontWeight: '500', textDecoration: 'none' }}>
      find workspaces
    </Link>
    
    <Link to="/profile" style={{ width: 65, height: 28, left: 820, top: 444, position: 'absolute', color: '#4274D0', fontSize: 20, fontFamily: 'Satoshi, sans-serif', fontWeight: '500', textDecoration: 'none' }}>
      profile
    </Link>
    
    <div style={{ width: 300, height: 17, left: '50%', top: 207, position: 'absolute', transform: 'translateX(-50%)', color: '#5D5D5D', fontSize: 20, fontFamily: 'Satoshi, sans-serif', fontWeight: '500', textAlign: 'center'}}>
      find your perfect workspace
    </div>
  </div>
);

export default Home;
