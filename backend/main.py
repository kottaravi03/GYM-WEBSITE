from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    user_type: str = "owner"

class Comment(BaseModel):
    id: Optional[int] = None
    post_id: int
    user_id: int
    username: str
    text: str
    created_at: str = None

class Post(BaseModel):
    id: Optional[int] = None
    user_id: int
    username: str
    title: str
    description: str
    image_url: str
    pet_type: str
    created_at: str = None
    comments: List[Comment] = []

posts_db = []
comments_db = []
users_db = []
post_id_counter = 1
comment_id_counter = 1
user_id_counter = 1

@app.get("/")
def read_root():
    return {"message": "Pet Community API"}

@app.post("/users")
def create_user(user: User):
    global user_id_counter
    user.id = user_id_counter
    user_id_counter += 1
    users_db.append(user)
    return user

@app.get("/users")
def get_all_users():
    return users_db

@app.post("/posts")
def create_post(post: Post):
    global post_id_counter
    post.id = post_id_counter
    post.created_at = datetime.now().isoformat()
    post_id_counter += 1
    posts_db.append(post)
    return post

@app.get("/posts")
def get_all_posts():
    posts_with_comments = []
    for post in posts_db:
        post_comments = [c for c in comments_db if c.post_id == post.id]
        post.comments = post_comments
        posts_with_comments.append(post)
    return posts_with_comments

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    for post in posts_db:
        if post.id == post_id:
            post.comments = [c for c in comments_db if c.post_id == post_id]
            return post
    raise HTTPException(status_code=404, detail="Post not found")

@app.put("/posts/{post_id}")
def update_post(post_id: int, post: Post):
    for i, p in enumerate(posts_db):
        if p.id == post_id:
            post.id = post_id
            posts_db[i] = post
            return post
    raise HTTPException(status_code=404, detail="Post not found")

@app.delete("/posts/{post_id}")
def delete_post(post_id: int):
    for i, post in enumerate(posts_db):
        if post.id == post_id:
            posts_db.pop(i)
            comments_db[:] = [c for c in comments_db if c.post_id != post_id]
            return {"message": "Post deleted"}
    raise HTTPException(status_code=404, detail="Post not found")

@app.post("/posts/{post_id}/comments")
def add_comment(post_id: int, comment: Comment):
    global comment_id_counter
    post_exists = any(p.id == post_id for p in posts_db)
    if not post_exists:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comment.id = comment_id_counter
    comment.post_id = post_id
    comment.created_at = datetime.now().isoformat()
    comment_id_counter += 1
    comments_db.append(comment)
    return comment

@app.get("/posts/{post_id}/comments")
def get_post_comments(post_id: int):
    return [c for c in comments_db if c.post_id == post_id]

@app.delete("/comments/{comment_id}")
def delete_comment(comment_id: int):
    for i, comment in enumerate(comments_db):
        if comment.id == comment_id:
            comments_db.pop(i)
            return {"message": "Comment deleted"}
    raise HTTPException(status_code=404, detail="Comment not found")
