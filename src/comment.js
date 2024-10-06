import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { db, collection, doc, query, where, onSnapshot, addDoc } from "./config/firebase"; // Ensure Firebase is properly configured
import { getDoc, orderBy } from 'firebase/firestore';
import './comment.css';

const CommentPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null); // For storing the post details
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const username = localStorage.getItem("username"); // Assuming user is stored in localStorage
  const navigate = useNavigate(); // For navigation

  // Fetch the post by ID
  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = doc(db, "posts", id); // Reference the specific post by ID
      const postSnapshot = await getDoc(postDoc);
      if (postSnapshot.exists()) {
        setPost(postSnapshot.data()); // Set post data if it exists
      } else {
        console.log("No such post found!");
      }
    };

    fetchPost();
  }, [id]);

  // Fetch comments for this post in real-time
  useEffect(() => {
    const commentsCollection = collection(db, "comments");
    const commentsQuery = query(
      commentsCollection,
      where("id", "==", id),
      orderBy("date", "desc") // Order by latest comments
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => doc.data());
      setComments(commentList);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [id]);

  // Add new comment to Firestore
  const handleAddComment = async () => {
    if (commentText.trim() !== "") {
      await addDoc(collection(db, "comments"), {
        id: id, // Link the comment to the post
        user: username, // Store username
        content: commentText,
        date: new Date() // Add a timestamp
      });
      setCommentText(""); // Clear the input field after posting
    }
  };

  // Handle navigation back to the previous page
  const handleGoBack = () => {
    navigate(-1); // This navigates back to the previous page
  };

  return (
    <div>
  {/* Back Arrow */}
  <div className="back-arrow" onClick={handleGoBack}>
    <i className="fas fa-arrow-left"></i>back
  </div>

  {/* Display the post content */}
  {post ? (
    <div className="post-content">
      <h2>{post.content}</h2>
      <p><strong>Posted by:</strong> {post.user}</p>
    </div>
  ) : (
    <p>Loading post...</p>
  )}

  {/* Display Comments */}
  <div className="comments-section">
    <h3>Comments</h3>
    {comments.length > 0 ? (
      comments.map((comment, index) => (
        <div key={index} className="comment">
          <p><strong>{comment.user}</strong>: {comment.content}</p>
          <p className="comment-time">{new Date(comment.date.seconds * 1000).toLocaleString()}</p>
        </div>
      ))
    ) : (
      <p>No comments yet. Be the first to comment!</p>
    )}
  </div>

  {/* Add New Comment */}
  <div className="add-comment">
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Add a comment..."
    ></textarea>
    <button onClick={handleAddComment}>
      Add Comment
    </button>
  </div>
</div>

  );
};

export default CommentPage;
