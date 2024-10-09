import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { Navigate } from 'react-router-dom';
import './data.css';

const UserForm = () => {
  const [username, setUsername] = useState('');
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(''); 

  useEffect(() => {
    if (localStorage.getItem("username")) {
      setRedirectToDashboard(true);
    }
    if (!localStorage.getItem("valid")) {
        setRedirectToLogin(true);
      }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new document in the 'users' collection with auto-generated ID
      await addDoc(collection(db, 'users'), {
        email: localStorage.getItem('valid'),
        username: username,
        firstName: firstName,
        lastName: lastName,
        age: parseInt(age, 10),  // Store age as a number
      });
      localStorage.setItem('username', username);
      setRedirectToDashboard(true);
    } catch (error) {
      console.error('Error adding user: ', error);
      alert('Error adding user');
    }
  };

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }
  if (redirectToLogin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="input-page-container">
      <h2 className="input-page-title">Create a New User</h2>
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="firstName">First Name: </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="lastName">Last Name: </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="age">Age: </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
