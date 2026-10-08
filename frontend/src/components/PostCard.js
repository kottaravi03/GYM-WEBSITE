import React, { useState } from 'react';

function PostCard({ post, onDelete, onAddComment, currentUser }) {
  const [commentText, setCommentText] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
      setShowCommentForm(false);
    }
  };

  return (
    <div className="post-card">
      {post.image_url && <img src={post.image_url} alt={post.title} className="post-image" />}
      
      <div className="post-content">
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
          {currentUser?.id === post.user_id && (
            <button className="delete" onClick={() => onDelete(post.id)}>×</button>
          )}
        </div>

        <div className="post-meta">
          By <strong>{post.username}</strong> • {new Date(post.created_at).toLocaleDateString()}
        </div>

        <span className="pet-type">{post.pet_type}</span>

        <p className="post-description">{post.description}</p>

        <div className="comments-section">
          <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>
            Comments ({post.comments?.length || 0})
          </h3>

          {post.comments?.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-author">{comment.username}</div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}

          {!showCommentForm ? (
            <button onClick={() => setShowCommentForm(true)} style={{ marginTop: '10px', width: '100%' }}>
              Add Comment
            </button>
          ) : (
            <div style={{ marginTop: '10px' }}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #bdc3c7', minHeight: '80px' }}
              />
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={handleAddComment} style={{ flex: 1 }}>Post Comment</button>
                <button onClick={() => setShowCommentForm(false)} style={{ flex: 1, backgroundColor: '#95a5a6' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
