import React, { useState } from 'react';

function CreatePostModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    pet_type: 'Dog'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSubmit(formData);
      setFormData({ title: '', description: '', image_url: '', pet_type: 'Dog' });
    }
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div className="modal-header">Create New Post</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's your question or story?"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about your pet or question..."
              required
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Pet Type</label>
            <select name="pet_type" value={formData.pet_type} onChange={handleChange}>
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Rabbit</option>
              <option>Hamster</option>
              <option>Other</option>
            </select>
          </div>

          <button type="submit" style={{ width: '100%' }}>Post</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
