import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleAuth from './auth';
import UserForm from './data';
import Chat from './bot';
import Dashboard from './dashboard';
import CommentPage from './comment';
import UploadPDF from './add';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GoogleAuth />} />
          <Route path="/userform" element={<UserForm />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<UploadPDF />} />
          <Route path="/comment/:id" element={<CommentPage />} /> {/* Route to CommentPage */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
