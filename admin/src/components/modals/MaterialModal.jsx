import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const MaterialModal = ({ material, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    courseCode: '',
    subject: '',
    semester: 'Fall 2024',
    materialType: 'PDF',
    fileUrl: '',
    fileSize: '',
    uploadedBy: 'Admin'
  });

  useEffect(() => {
    if (material) {
      setFormData(material);
    }
  }, [material]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {material ? 'Edit Study Material' : 'Upload New Material'}
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
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                name="courseCode"
                required
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="CS101"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                name="course"
                required
                value={formData.course}
                onChange={handleChange}
                placeholder="Introduction to Programming"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester *
              </label>
              <select
                name="semester"
                required
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2024">Spring 2024</option>
                <option value="Summer 2024">Summer 2024</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Type *
            </label>
            <select
              name="materialType"
              required
              value={formData.materialType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="PPT">PPT</option>
              <option value="VIDEO">VIDEO</option>
              <option value="LINK">LINK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File URL *
            </label>
            <input
              type="url"
              name="fileUrl"
              required
              value={formData.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/file.pdf"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Size
            </label>
            <input
              type="text"
              name="fileSize"
              value={formData.fileSize}
              onChange={handleChange}
              placeholder="2.5 MB"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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
              {material ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;