import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Mail, Camera, Save, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>((user as any)?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: (user as any)?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);
      setIsUploadingAvatar(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (token === 'fake-access-token-for-testing') {
          // Dev mode: just show preview
          await updateProfile({ avatar: base64 });
          toast.success('Avatar updated!');
        } else {
          const res = await api.put('/auth/avatar', { avatar: base64 });
          if (res.data.success) {
            await updateProfile({ avatar: res.data.data.avatar });
            toast.success('Avatar updated successfully!');
          }
        }
      } catch (err) {
        toast.error('Failed to upload avatar.');
        setAvatarPreview((user as any)?.avatar || null);
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(res.error || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Manage your personal information and preferences.</p>
      </div>

      <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="relative">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {/* Avatar display */}
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: '2px solid rgba(139,92,246,0.4)' }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Camera button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: '#f97316', border: '2px solid #1a1040', color: 'white' }}
            >
              {isUploadingAvatar
                ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Camera size={14} />
              }
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{formData.name || user?.name}</h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{user?.role === 'teacher' ? 'Instructor' : 'Student'}</p>
            <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Click the camera icon to change your photo</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Full Name</label>
              <div className="relative">
                <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all disabled:opacity-50"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(59,130,246,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all disabled:opacity-50"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(59,130,246,0.5)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className="w-full p-4 rounded-xl text-sm text-white outline-none transition-all disabled:opacity-50 resize-none"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.border = '1px solid rgba(59,130,246,0.5)')}
              onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)')}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                  style={{ color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
