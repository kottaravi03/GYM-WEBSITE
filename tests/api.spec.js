import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:8000';

test.describe('Pet Community API', () => {
  test('should get root endpoint', async ({ request }) => {
    const response = await request.get(`${API_URL}/`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });

  test('should create a user', async ({ request }) => {
    const response = await request.post(`${API_URL}/users`, {
      data: {
        username: 'testuser',
        email: 'test@example.com',
        user_type: 'owner'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.username).toBe('testuser');
  });

  test('should get all users', async ({ request }) => {
    await request.post(`${API_URL}/users`, {
      data: {
        username: 'user1',
        email: 'user1@example.com',
        user_type: 'owner'
      }
    });

    const response = await request.get(`${API_URL}/users`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should create a post', async ({ request }) => {
    const response = await request.post(`${API_URL}/posts`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'My Pet Question',
        description: 'This is a test post',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Dog'
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('My Pet Question');
  });

  test('should get all posts', async ({ request }) => {
    const response = await request.get(`${API_URL}/posts`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should get specific post', async ({ request }) => {
    const createResponse = await request.post(`${API_URL}/posts`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'Test Post',
        description: 'Test description',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Cat'
      }
    });

    const post = await createResponse.json();
    const getResponse = await request.get(`${API_URL}/posts/${post.id}`);
    
    expect(getResponse.status()).toBe(200);
    const data = await getResponse.json();
    expect(data.id).toBe(post.id);
  });

  test('should add comment to post', async ({ request }) => {
    const postResponse = await request.post(`${API_URL}/posts`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'Post for Comments',
        description: 'Test post',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Dog'
      }
    });

    const post = await postResponse.json();

    const commentResponse = await request.post(`${API_URL}/posts/${post.id}/comments`, {
      data: {
        post_id: post.id,
        user_id: 2,
        username: 'commenter',
        text: 'Great post!'
      }
    });

    expect(commentResponse.status()).toBe(200);
    const comment = await commentResponse.json();
    expect(comment.text).toBe('Great post!');
  });

  test('should get post comments', async ({ request }) => {
    const postResponse = await request.post(`${API_URL}/posts`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'Post with Comments',
        description: 'Test post',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Bird'
      }
    });

    const post = await postResponse.json();

    await request.post(`${API_URL}/posts/${post.id}/comments`, {
      data: {
        post_id: post.id,
        user_id: 2,
        username: 'commenter',
        text: 'Nice post!'
      }
    });

    const commentsResponse = await request.get(`${API_URL}/posts/${post.id}/comments`);
    expect(commentsResponse.status()).toBe(200);
    
    const comments = await commentsResponse.json();
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBeGreaterThan(0);
  });

  test('should update post', async ({ request }) => {
    const createResponse = await request.post(`${API_URL}/posts`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'Original Title',
        description: 'Original description',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Rabbit'
      }
    });

    const post = await createResponse.json();

    const updateResponse = await request.put(`${API_URL}/posts/${post.id}`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'Updated Title',
        description: 'Updated description',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Rabbit'
      }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedPost = await updateResponse.json();
    expect(updatedPost.title).toBe('Updated Title');
  });

  test('should delete post', async ({ request }) => {
    const createResponse = await request.post(`${API_URL}/posts`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'Post to Delete',
        description: 'This will be deleted',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Hamster'
      }
    });

    const post = await createResponse.json();

    const deleteResponse = await request.delete(`${API_URL}/posts/${post.id}`);
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await request.get(`${API_URL}/posts/${post.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('should delete comment', async ({ request }) => {
    const postResponse = await request.post(`${API_URL}/posts`, {
      data: {
        user_id: 1,
        username: 'testuser',
        title: 'Post for Comment Deletion',
        description: 'Test post',
        image_url: 'https://via.placeholder.com/400',
        pet_type: 'Dog'
      }
    });

    const post = await postResponse.json();

    const commentResponse = await request.post(`${API_URL}/posts/${post.id}/comments`, {
      data: {
        post_id: post.id,
        user_id: 2,
        username: 'commenter',
        text: 'Comment to delete'
      }
    });

    const comment = await commentResponse.json();

    const deleteResponse = await request.delete(`${API_URL}/comments/${comment.id}`);
    expect(deleteResponse.status()).toBe(200);
  });

  test('should return 404 for non-existent post', async ({ request }) => {
    const response = await request.get(`${API_URL}/posts/99999`);
    expect(response.status()).toBe(404);
  });

  test('should return 404 for non-existent comment', async ({ request }) => {
    const response = await request.delete(`${API_URL}/comments/99999`);
    expect(response.status()).toBe(404);
  });
});
