'use client';
import { X, Send, Bug, Lightbulb, MessageCircle, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/brands/use-mobile';

interface PlatformFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const feedbackTypes = [
  { 
    value: 'bug_report', 
    label: 'Signaler un bug', // Bug Report 
    icon: <Bug size={20} className="text-red-500" />,
    description: 'Signaler un bug ou un problème'
  },
  { 
    value: 'feature_request', 
    label: 'Demander une fonctionnalité', // Feature Request 
    icon: <Lightbulb size={20} className="text-yellow-500" />,
    description: 'Demander une nouvelle fonctionnalité' // Suggest a new feature
  },
  { 
    value: 'general_feedback', 
    label: 'Feedback général', // General Feedback 
    icon: <MessageCircle size={20} className="text-blue-500" />,
    description: 'Partager vos thoughts' // Share your thoughts
  },
  { 
    value: 'support', 
    label: 'Support', // Support 
    icon: <HelpCircle size={20} className="text-green-500" />,
    description: 'Obtenir de l\'aide ou du support' // Get help or support
  },
];

const priorityOptions = [
  { value: 'low', label: 'Faible', color: 'text-gray-500' },
  { value: 'medium', label: 'Moyen', color: 'text-blue-500' },
  { value: 'high', label: 'Haut', color: 'text-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-500' }, // Urgent 
];

const PlatformFeedbackModal: React.FC<PlatformFeedbackModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    type: 'general_feedback',
    subject: '',
    message: '',
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/platform-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: any = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          type: 'general_feedback',
          subject: '',
          message: '',
          priority: 'medium',
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden ${
        isMobile ? 'mx-4' : ''
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            {/* Send Feedback */}
            <h2 className="text-xl font-semibold text-gray-900">Envoyer un feedback</h2>
            {/* Help us improve the platform by sharing your feedback */}
            <p className="text-sm text-gray-600 mt-1">
              Aidez-nous à améliorer la plateforme en partageant votre feedback
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Feedback Type */}
          <div>
            {/* What type of feedback is this? */}
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quel type de feedback est ce ?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feedbackTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    formData.type === type.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {type.icon}
                    <div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            {/* Priority Level */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {priorityOptions.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            {/* Subject */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sujet *
            </label>
            {/* Brief description of your feedback */}
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brève description de votre feedback"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message * {/* Message */}
            </label>
            {/* Please provide detailed information about your feedback... */}
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Veuillez fournir des informations détaillées sur votre feedback..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              required
            />
          </div>


          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {/* Feedback submitted successfully! */}
                <span className="text-sm font-medium">Feedback soumis avec succès!</span> {/* Feedback submitted successfully! */}
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {/* Failed to submit feedback. Please try again. */}
                <span className="text-sm font-medium">Erreur lors de l'envoi du feedback. Veuillez réessayer.</span> {/* Failed to submit feedback. Please try again. */}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {/* Cancel */}
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.subject.trim() || !formData.message.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {/* Submitting... */}
                  Envoi...
                </>
              ) : (
                <>
                  <Send size={16} />
                  {/* Send Feedback */}
                  Envoyer un feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlatformFeedbackModal;
