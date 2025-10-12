'use client';
import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Trash2, AlertTriangle, Save } from 'lucide-react';

interface AccountSettings {
  notifications: {
    email_notifications: boolean;
    push_notifications: boolean;
    marketing_emails: boolean;
    security_alerts: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private';
    data_sharing: boolean;
    analytics_tracking: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    date_format: string;
    theme: 'light' | 'dark' | 'system';
  };
}

const AccountSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<AccountSettings>({
    notifications: {
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      security_alerts: true,
    },
    privacy: {
      profile_visibility: 'private',
      data_sharing: false,
      analytics_tracking: true,
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      date_format: 'MM/DD/YYYY',
      theme: 'system',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasFetchedSettings, setHasFetchedSettings] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Only fetch settings if user explicitly requests it or on first load
  useEffect(() => {
    if (!hasFetchedSettings) {
      fetchSettings();
    }
  }, [hasFetchedSettings]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/profile/settings');
      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
      } else {
        //console.error('Error fetching settings:', result.error);
        // Keep default settings if API fails
      }
      setHasFetchedSettings(true);
    } catch (error) {
      setHasFetchedSettings(true);
      // Keep default settings if API fails
    }
  };

  const handleNotificationChange = (key: keyof AccountSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: keyof AccountSettings['privacy'], value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key: keyof AccountSettings['preferences'], value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
      } else {
       // console.error('Error saving settings:', result.error);
      }
    } catch (error) {
      //console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError('');

      // Validate inputs
      if (!deletePassword.trim()) {
        setDeleteError('Le mot de passe est requis');
        return;
      }

      if (deleteConfirmation !== 'DELETE') {
        setDeleteError('Veuillez entrer SUPPRIMER pour confirmer');
        return;
      }

      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: deletePassword,
          confirmation: deleteConfirmation,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Account deleted successfully
      setShowDeleteModal(false);
        
        // Clear form data
        setDeletePassword('');
        setDeleteConfirmation('');
        setDeleteError('');
        
        // Redirect to home page or login
        window.location.href = '/';
      } else {
        setDeleteError(result.error || 'Erreur lors de la suppression du compte');
      }
    } catch (error) {
      setDeleteError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteConfirmation('');
    setDeleteError('');
  };

  // No loading state - render with default settings immediately

  return (
    <div className="space-y-8 mb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Settings className="text-purple-600" />
            Paramètres du compte
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez vos préférences et vos paramètres de sécurité
          </p>
        </div>
        {/* <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <Save size={16} />
          {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </button> */}
      </div>

      {/* Notifications */}
      {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>Notifications
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notifications par email</h4>
              <p className="text-sm text-gray-600">Receive important updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email_notifications}
                onChange={(e) => handleNotificationChange('email_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notifications push</h4>
              <p className="text-sm text-gray-600">Get real-time updates in your browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push_notifications}
                onChange={(e) => handleNotificationChange('push_notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Emails marketing</h4>
              <p className="text-sm text-gray-600">Receive product updates and promotional content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.marketing_emails}
                onChange={(e) => handleNotificationChange('marketing_emails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Alertes de sécurité</h4>
              <p className="text-sm text-gray-600">Get notified about security-related activities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.security_alerts}
                onChange={(e) => handleNotificationChange('security_alerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy 
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900">Confidentialité & Données</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Visibilité du profil</h4>
              <p className="text-sm text-gray-600">Control who can see your profile information</p>
            </div>
            <select
              value={settings.privacy.profile_visibility}
              onChange={(e) => handlePrivacyChange('profile_visibility', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Partage de données</h4>
              <p className="text-sm text-gray-600">Allow sharing of anonymized data for product improvement</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.data_sharing}
                onChange={(e) => handlePrivacyChange('data_sharing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
                <h4 className="font-medium text-gray-900">Analyse des données</h4>
              <p className="text-sm text-gray-600">Aidez-nous à améliorer la plateforme avec l'analyse d'utilisation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.analytics_tracking}
                onChange={(e) => handlePrivacyChange('analytics_tracking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences 
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Préférences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
                <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="fr">Français</option>
              <option value="de">Allemand</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TimezoneZone
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Temps Est</option>
              <option value="America/Chicago">Temps Central</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Temps Pacifique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format de date
            </label>
            <select
              value={settings.preferences.date_format}
              onChange={(e) => handlePreferenceChange('date_format', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thème
            </label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
                <option value="system">Système</option>
              <option value="light">Lumière</option>
              <option value="dark">Sombre</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" />
          <h3 className="text-lg font-medium text-red-900">Zone dangereuse</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center md:flex-row flex-col justify-between">
            <div>
              <h4 className="font-medium text-red-900">Supprimer le compte</h4>
              <p className="text-sm text-red-700">
                Supprimez définitivement votre compte et toutes les données associées. Cette action ne peut pas être annulée.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center mt-4 md:mt-0 gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Supprimer le compte</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Cette action ne peut pas être annulée et supprimera définitivement toutes vos données, y compris les expériences, les produits et les analyses.
            </p>
            
            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entrez votre mot de passe pour confirmer
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Votre mot de passe"
                disabled={isDeleting}
              />
            </div>

            {/* Confirmation Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-bold text-red-600">SUPPRIMER</span> pour confirmer
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Type SUPPRIMER ici"
                disabled={isDeleting}
              />
            </div>

            {/* Error Message */}
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                  Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword.trim() || deleteConfirmation !== 'SUPPRIMER'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer le compte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettingsTab;
