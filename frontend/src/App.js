import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './components/PostList';
import CreatePostModal from './components/CreatePostModal';

const API_URL = 'http://localhost:8000';

function App() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      const newUser = { id: 1, username: 'User' + Math.floor(Math.random() * 1000), email: 'user@example.com', user_type: 'owner' };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setCurrentUser(newUser);
    } else {
      setCurrentUser(JSON.parse(user));
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const newPost = {
        user_id: currentUser.id,
        username: currentUser.username,
        ...postData
      };
      await axios.post(`${API_URL}/posts`, newPost);
      fetchPosts();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API_URL}/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const comment = {
        post_id: postId,
        user_id: currentUser.id,
        username: currentUser.username,
        text: commentText
      };
      await axios.post(`${API_URL}/posts/${postId}/comments`, comment);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🐾 Pet Community</h1>
        <p>Share your pet's moments and get advice from the community</p>
        <p style={{ fontSize: '0.9em', marginTop: '10px' }}>Logged in as: {currentUser?.username}</p>
      </header>

      <button onClick={() => setShowModal(true)} style={{ marginBottom: '20px', padding: '12px 24px', fontSize: '1.1em' }}>
        + Create Post
      </button>

      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreatePost}
        />
      )}

      <PostList
        posts={posts}
        onDeletePost={handleDeletePost}
        onAddComment={handleAddComment}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;
