import {useState, useEffect } from 'react';
import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

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
    <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#333', color: 'white' }}>
      <h1>Welcome to Highway</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSignInWithGoogle} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', color: 'black', padding: '10px', borderRadius: '7px', border: 'none', cursor: 'pointer' }}>
        <FaGoogle style={{ marginRight: '10px' }} /> Sign In With Google
      </button>
    </div>
  );
};

export default GoogleAuth;