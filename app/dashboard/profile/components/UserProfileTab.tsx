'use client';
import { useState, useEffect } from 'react';
import { User, Upload, Save, Mail, Shield, Calendar } from 'lucide-react';

interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  role: 'brand_admin' | 'brand_user' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

const UserProfileTab: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});

  // Try to get user data from auth context first
  useEffect(() => {
    // Check if we can get user data from auth context
    const getUserFromAuth = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const userData: UserProfileData = {
            id: user.id,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            role: 'brand_admin', // Default role
            status: user.email_confirmed_at ? 'active' : 'pending',
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at,
          };
          setProfileData(userData);
          setFormData(userData);
        } else {
          // Fallback to API call if no auth user
          fetchUserProfile();
        }
      } catch (error) {
        fetchUserProfile();
      }
    };

    getUserFromAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile/user');
      const result = await response.json();
      
      if (result.success) {
        setProfileData(result.data);
        setFormData(result.data);
      } else {
        //console.error('Error fetching user profile:', result.error);
      }
    } catch (error) {
      //console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Upload avatar if changed
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', avatarFile);
        uploadFormData.append('type', 'avatar');
        
        const uploadResponse = await fetch('/api/profile/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          avatarUrl = uploadResult.data.url;
        }
      }

      // Update user profile
      const response = await fetch('/api/profile/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          avatar_url: avatarUrl,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setProfileData(result.data);
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview('');
      } else {
        //console.error('Error saving user profile:', result.error);
      }
    } catch (error) {
      //console.error('Error saving user profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading only if no profile data
  if (!profileData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* Mobile */}
        <div className="flex gap-3 md:hidden justify-end mb-4 ">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Modifier le profil
            </button>
          )}
        </div>

          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <User className="text-purple-600" />
            Profil utilisateur
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
        <div className="flex gap-3 hidden md:flex">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Modifier le profil
            </button>
          )}
        </div>
      </div>

      {/* Avatar Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Photo de profil</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarPreview || profileData?.avatar_url ? (
              <img
                src={avatarPreview || profileData?.avatar_url}
                alt="Profile picture"
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <User size={32} className="text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
              disabled={!isEditing}
            />
            <label
              htmlFor="avatar-upload"
              className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-colors ${
                isEditing
                  ? 'hover:bg-gray-50 hover:border-gray-400'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Upload size={16} />
              {avatarFile ? 'Changer la photo' : 'Upload Photo'}
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Recommandé: 200x200px, PNG ou JPG
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            value={formData.first_name || ''}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
          </label>
          <input
            type="text"
            value={formData.last_name || ''}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={formData.email || ''}
              disabled
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Email ne peut pas être modifié. Contactez le support si vous avez besoin de mettre à jour votre email.
          </p>
        </div>
      </div>

      {/* Account Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-400" />
              <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium capitalize">
                {formData.role?.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Votre rôle détermine les actions que vous pouvez effectuer
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <span className={`px-3 py-2 rounded-lg font-medium capitalize ${
              formData.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : formData.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {formData.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Membre depuis
            </label>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-700">
                {profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dernière mise à jour
            </label>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-700">
                {profileData?.updated_at ? new Date(profileData.updated_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Mot de passe</h4>
             {/*  <p className="text-sm text-gray-600">Dernière modification il y a 30 jours</p> */}
            </div>
            <button className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium">
              Changer le mot de passe
            </button>
          </div>

          {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Authentification en deux facteurs</h4>
                <p className="text-sm text-gray-600">Ajoutez une couche supplémentaire de sécurité</p>
            </div>
            <button className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium">
              Activer la 2FA
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfileTab;
