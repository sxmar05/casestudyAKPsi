import React, { useState } from 'react';
import { addData } from '../firebase/firestoreService';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

const Quiz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    commuteTime: '',
    workspacePreference: '',
    noiseLevel: '',
    paidAccess: false,
    foodPreferences: '',
    spaceSize: '',
    amenities: [],
    workHours: {
      start: '',
      end: '',
    },
    workDays: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'paidAccess') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else if (name === 'workDays') {
        setFormData(prev => ({
          ...prev,
          workDays: checked
            ? [...prev.workDays, value]
            : prev.workDays.filter(day => day !== value)
        }));
      } else if (name === 'amenities') {
        setFormData(prev => ({
          ...prev,
          amenities: checked
            ? [...prev.amenities, value]
            : prev.amenities.filter(amenity => amenity !== value)
        }));
      }
    } else if (name.startsWith('workHours.')) {
      const hourField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        workHours: {
          ...prev.workHours,
          [hourField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await addData('userPreferences', {
        userId,
        ...formData,
        timestamp: new Date().toISOString()
      });

      navigate('/dashboard'); // Adjust this route as needed
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const amenitiesList = [
    'WiFi',
    'Power Outlets',
    'Meeting Rooms',
    'Printing Services',
    'Coffee/Tea',
    'Parking',
    'Bike Storage',
    'Shower Facilities'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Workspace Preferences
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Location/Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Commute Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Commute Time (minutes)
            </label>
            <input
              type="number"
              name="commuteTime"
              value={formData.commuteTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Workspace Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Workspace Type
            </label>
            <select
              name="workspacePreference"
              value={formData.workspacePreference}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select preference</option>
              <option value="private">Private Office</option>
              <option value="shared">Shared Space</option>
              <option value="openPlan">Open Plan</option>
              <option value="booth">Individual Booth</option>
            </select>
          </div>

          {/* Noise Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Noise Level
            </label>
            <select
              name="noiseLevel"
              value={formData.noiseLevel}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select noise level</option>
              <option value="silent">Silent</option>
              <option value="quiet">Quiet</option>
              <option value="moderate">Moderate</option>
              <option value="lively">Lively</option>
            </select>
          </div>

          {/* Paid Access */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="paidAccess"
              checked={formData.paidAccess}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Willing to pay for workspace access
            </label>
          </div>

          {/* Food Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Service Preferences
            </label>
            <select
              name="foodPreferences"
              value={formData.foodPreferences}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select preference</option>
              <option value="none">No food service needed</option>
              <option value="snacks">Snacks only</option>
              <option value="cafe">Café on premises</option>
              <option value="restaurant">Full restaurant</option>
            </select>
          </div>

          {/* Space Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Space Size
            </label>
            <select
              name="spaceSize"
              value={formData.spaceSize}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select size</option>
              <option value="small">Small (1-2 people)</option>
              <option value="medium">Medium (3-5 people)</option>
              <option value="large">Large (6-10 people)</option>
              <option value="xlarge">Extra Large (10+ people)</option>
            </select>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Amenities
            </label>
            <div className="grid grid-cols-2 gap-4">
              {amenitiesList.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">{amenity}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Work Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Hours
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">Start Time</label>
                <input
                  type="time"
                  name="workHours.start"
                  value={formData.workHours.start}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">End Time</label>
                <input
                  type="time"
                  name="workHours.end"
                  value={formData.workHours.end}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Work Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {daysOfWeek.map(day => (
                <div key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    name="workDays"
                    value={day}
                    checked={formData.workDays.includes(day)}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">{day}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quiz;