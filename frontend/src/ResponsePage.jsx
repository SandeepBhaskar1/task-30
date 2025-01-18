import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css'; 

function ResponsePage() {
  const location = useLocation();
  const responseMessage = location.state;

  return (
    <div className="response-container">
      <h1><span>Application</span> Response</h1>
      <h2>{responseMessage.message}</h2>
      <pre>{JSON.stringify(responseMessage.data, null, 2)}</pre>
      <button onClick={() => window.location.href = '/'}>Back to Form</button>
    </div>
  );
}

export default ResponsePage;
