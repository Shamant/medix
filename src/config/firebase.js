import { getFirestore, collection, query, where, getDocs, setDoc, doc, limit, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";



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
const db = getFirestore(app);

const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, db, collection, query, where, getDocs, setDoc, doc, limit, addDoc, onSnapshot, storage, firestore, orderBy};