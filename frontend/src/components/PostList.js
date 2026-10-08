import React, { useState } from 'react';
import PostCard from './PostCard';

function PostList({ posts, onDeletePost, onAddComment, currentUser }) {
  return (
    <div className="posts-container">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDeletePost}
          onAddComment={onAddComment}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}

export default PostList;
