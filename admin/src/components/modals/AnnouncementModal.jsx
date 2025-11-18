import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AnnouncementModal = ({ announcement, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: 'Announcement',
    imageUrl: '',
    publishDate: new Date().toISOString().split('T')[0],
    tags: '',
    isPublished: true
  });

  useEffect(() => {
    if (announcement) {
      setFormData({
        ...announcement,
        tags: announcement.tags ? announcement.tags.join(', ') : ''
      });
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {announcement ? 'Edit Announcement' : 'Add New Announcement'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt *
            </label>
            <input
              type="text"
              name="excerpt"
              required
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the announcement"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              name="content"
              required
              rows="6"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Achievement">Achievement</option>
                <option value="Research">Research</option>
                <option value="Event">Event</option>
                <option value="Announcement">Announcement</option>
                <option value="Publication">Publication</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date *
              </label>
              <input
                type="date"
                name="publishDate"
                required
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tag1, Tag2, Tag3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              required
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Publish Immediately</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {announcement ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;