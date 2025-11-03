
import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">User Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900 transition-all hover:scale-105"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-4xl font-bold text-slate-600 dark:text-slate-300 ring-4 ring-white dark:ring-slate-800">
             {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</h3>
            <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="major" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Major</label>
              <input type="text" name="major" id="major" value={formData.major} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed"/>
            </div>
            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Year of Study</label>
              <input type="text" name="yearOfStudy" id="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contact" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact</label>
              <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} disabled={!isEditing} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:bg-slate-100 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed"/>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-3">
              <button type="button" onClick={handleCancel} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;