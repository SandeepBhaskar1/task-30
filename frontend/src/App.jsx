import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './Form';
import ResponsePage from './ResponsePage';

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/response" element={<ResponsePage />} />
      </Routes>
    </Router>
  );
}

export default Root;
