import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/AdminLayout';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'Computer Science Department',
    siteDescription: 'Welcome to the official website of the Computer Science Department. Discover our programs, research, and community.',
    email: 'contact@cs.university.edu',
    phone: '(123) 456-7890',
    address: '123 University Drive, Tech City, 12345',
    facebook: 'https://facebook.com/csdept',
    twitter: 'https://twitter.com/csdept',
    linkedin: 'https://linkedin.com/company/csdept',
    maintenanceMode: false
  });

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    contact: false,
    social: false,
    maintenance: false,
    system: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  const handleCancel = () => {
    toast.info('Changes cancelled');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('general')}
              className="w-full flex justify-between items-center p-6 hover:bg-gray-50"
            >
              <h2 className="text-xl font-bold text-gray-900">General</h2>
              {expandedSections.general ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections.general && (
              <div className="p-6 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Title
                  </label>
                  <input
                    type="text"
                    name="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    name="siteDescription"
                    rows="4"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="w-full flex justify-between items-center p-6 hover:bg-gray-50"
            >
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              {expandedSections.contact ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections.contact && (
              <div className="p-6 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('social')}
              className="w-full flex justify-between items-center p-6 hover:bg-gray-50"
            >
              <h2 className="text-xl font-bold text-gray-900">Social Media</h2>
              {expandedSections.social ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections.social && (
              <div className="p-6 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={settings.facebook}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={settings.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={settings.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Maintenance Mode */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('maintenance')}
              className="w-full flex justify-between items-center p-6 hover:bg-gray-50"
            >
              <h2 className="text-xl font-bold text-gray-900">Maintenance Mode</h2>
              {expandedSections.maintenance ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections.maintenance && (
              <div className="p-6 border-t">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Enable Maintenance Mode</span>
                    <p className="text-sm text-gray-600">When enabled, visitors will see a maintenance page</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('system')}
              className="w-full flex justify-between items-center p-6 hover:bg-gray-50"
            >
              <h2 className="text-xl font-bold text-gray-900">System Information</h2>
              {expandedSections.system ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections.system && (
              <div className="p-6 border-t space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Database</span>
                  <span className="font-medium">MongoDB Atlas</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Server Status</span>
                  <span className="font-medium text-green-600">Online</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="font-medium">2024-10-07 14:30:00</span>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;