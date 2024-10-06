import React, { useState, useEffect } from "react";
import { db, collection, addDoc, query, onSnapshot, orderBy } from "./config/firebase";
import { useNavigate } from 'react-router-dom'; // For navigation
import './dashboard.css';

const Dashboard = () => {
  const [postText, setPostText] = useState("");
  const [view, setView] = useState("community");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [educationPosts, setEducationPosts] = useState([]);
  const name = localStorage.getItem("username");
  const navigate = useNavigate(); // Use this for redirecting to /comment/{id}

  // Real-time fetch from Firebase when community or education view is active
  useEffect(() => {
    const unsubscribe = view === "community" 
      ? onSnapshot(query(collection(db, "posts"), orderBy("date", "desc")), (snapshot) => {
          const postList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setCommunityPosts(postList);
        })
      : onSnapshot(query(collection(db, "resources"), orderBy("date", "desc")), (snapshot) => {
          const resourceList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setEducationPosts(resourceList);
        });

    return () => unsubscribe();
  }, [view]);

  // Add post to Firebase for community posts
  const handlePost = async () => {
    if (postText.trim() !== "") {
      setPostText(""); // Clear input after posting
      await addDoc(collection(db, "posts"), {
        content: postText,
        user: name,
        date: new Date() // Ensure timestamp is stored for ordering
      });
    }
  };

  // Function to handle navigation to the comment page
  const handleReplyClick = (postId) => {
    navigate(`/comment/${postId}`); // Navigate to /comment/{id}
  };

  const chat = () => {
    navigate('/chat');
  };

  const add = () => {
    navigate('/add');
  }

  return (
    <div className="container">
      {/* Menu with Chat Icon */}
      <nav className="navbar">
        <div className="logo">Medix</div>
        <div className="chat" onClick={chat}>
          <i className="fas fa-comments"></i> Chat
        </div>
      </nav>

      {/* Post Something Section */}
      <div className="post-area">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Post something..."
          className="post-input"
        ></textarea>
        <button onClick={handlePost} className="post-btn">Post</button>
      </div>

      {/* Buttons to Switch Between Views */}
      <div className="switch-buttons">
        <button onClick={() => setView("community")} className={view === "community" ? "active" : ""}>
          Community
        </button>
        <button onClick={() => setView("education")} className={view === "education" ? "active" : ""}>
          Educational Content
        </button>
      </div>

      {/* Display content based on the view */}
      <div className="content">
        {view === "community" ? (
          <div className="post-list">
            <h2 style={{color: "#1d9bf0"}}>Community Posts</h2>
            {communityPosts.length > 0 ? (
              communityPosts.map((post, index) => (
                <div key={index} className="post" style={{borderRadius: "10px",}}>
                  <p>{post.content}</p><br />
                  <button className="reply-btn" onClick={() => handleReplyClick(post.id)}>Reply</button>
                </div>
              ))
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        ) : (
          <div className="resource-list">
            <h2 style={{color: "#1d9bf0"}}>Educational Content</h2>
            {name !== "shamant" && (
              <>
              <button onClick={add} className="add-btn">
                + Add Educational Content
              </button>
              <br /><br /><br />
              </>
            )}
            {educationPosts.length > 0 ? (
              educationPosts.map((resource, index) => (
                <div key={index} className="resource" style={{borderRadius: "10px",}}>
                  <p>{resource.caption}</p>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">View PDF</a>
                </div>
              ))
            ) : (
              <p>No educational content available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
