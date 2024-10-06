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
    <div>
      <h2>Create a New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>First Name: </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name: </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age:     </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
