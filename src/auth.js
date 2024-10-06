import {useState, useEffect } from 'react';
import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import './LoginPage.css'; 

const firebaseConfig = {
  apiKey: "AIzaSyDxaEzLUojI4oUCLezFOiRyYPlCSS0ooFY",
  authDomain: "medix-2cf8a.firebaseapp.com",
  projectId: "medix-2cf8a",
  storageBucket: "medix-2cf8a.appspot.com",
  messagingSenderId: "930806518933",
  appId: "1:930806518933:web:3c6fc48def9ee5c7f1779c",
  measurementId: "G-9QJRT4P0ZP"
};  


const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);
const db = getFirestore(app);

const GoogleAuth = () => {
  const [error, setError] = useState(null);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [redirectToData_Entry, setRedirectToData_Entry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("username")) {
      setRedirectToDashboard(true);
    }
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const name = user.displayName;

      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        localStorage.setItem('valid', name);
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
        }, 3000);
        setRedirectToData_Entry(true);
      } else {
        localStorage.setItem('username', name);
        setRedirectToDashboard(true);
      }

    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setError('Error signing in with Google. Please try again.');
    }
  };

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }
  if (redirectToData_Entry) {
    return <Navigate to="/userform" />;
  }

  return (
    <div className="login-container">
      <div className="animated-bg">
        <div className="circle small"></div>
        <div className="circle medium"></div>
        <div className="circle large"></div>
      </div>

      {!success ? (
        <div className="login-content">
          <h1>Medix</h1>
          {loading && (
            <div className="loading-animation">
              <div className="heart"></div>
            </div>
          )}
          <button 
            onClick={handleSignInWithGoogle} 
            className={`login-button ${loading ? 'disabled' : ''}`}
          >
            <FaGoogle style={{ marginRight: '10px' }} />
            {loading ? 'Authenticating...' : 'Sign In With Google'}
          </button>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </div>
      ) : (
        <div className="success-animation">
          <div className="heart"></div>
          <div className="blood-channel channel1"></div>
          <div className="blood-channel channel2"></div>
          <div className="blood-channel channel3"></div>
          <div className="blood-channel channel4"></div>
          <div className="blood-channel channel5"></div>
          <div className="blood-channel channel6"></div>
          <div className="blood-channel channel7"></div>
          <div className="blood-channel channel8"></div>
          <h1 className="success-message">Success!</h1>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
