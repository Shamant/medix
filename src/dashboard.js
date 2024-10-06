import React, { useState, useEffect } from "react";
import { db, collection, addDoc, query, onSnapshot, orderBy } from "./config/firebase";
import { useNavigate } from 'react-router-dom'; // For navigation
import './dashboard.css';

const Dashboard = () => {
  const [postText, setPostText] = useState("");
  const [view, setView] = useState("community");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [educationPosts, setEducationPosts] = useState([]);
  const [user, setUser] = useState(null);
  const name = localStorage.getItem("username");
  const navigate = useNavigate(); // Use this for redirecting to /comment/{id}

  // Real-time fetch from Firebase when community or education view is active
  useEffect(() => {
    if (view === "community") {
      const postsCollection = collection(db, "posts");
      const postsQuery = query(postsCollection, orderBy("date", "desc"));

      // Set up a real-time listener using onSnapshot for community posts
      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postList = snapshot.docs.map((doc) => ({
          id: doc.id, // Add post ID
          ...doc.data()
        }));
        setCommunityPosts(postList);
      });

      // Clean up the listener when component unmounts or view changes
      return () => unsubscribe();
    }

    if (view === "education") {
      const resourcesCollection = collection(db, "resources");
      const resourcesQuery = query(resourcesCollection, orderBy("date", "desc"));

      // Set up a real-time listener using onSnapshot for educational content
      const unsubscribe = onSnapshot(resourcesQuery, (snapshot) => {
        const resourceList = snapshot.docs.map((doc) => ({
          id: doc.id, // Add resource ID
          ...doc.data()
        }));
        setEducationPosts(resourceList);
      });

      // Clean up the listener when component unmounts or view changes
      return () => unsubscribe();
    }

    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);
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
      <div className="logo">My Home Page</div>
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
      ></textarea>
      <button onClick={handlePost}>
        Post
      </button>
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
        <div>
          <h2>Community Posts</h2>
          {communityPosts.length > 0 ? (
            communityPosts.map((post, index) => (
              <div key={index} className="post">
                <p>{post.content}</p>
                <button className="bsdkbutton" onClick={() => handleReplyClick(post.id)}>Reply</button>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      ) : (
        <div>
          <h2>Educational Content</h2>
          {/* + Button shown only if user is 'shamant' */}
          {name === "shamant" && (
            <button onClick={add} style={{ marginTop: "10px", display: "block", fontSize: "20px" }}>
              + Add Educational Content
            </button>
          )}
          {educationPosts.length > 0 ? (
            educationPosts.map((resource, index) => (
              <div key={index} className="resource">
                <p>{resource.caption}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
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
