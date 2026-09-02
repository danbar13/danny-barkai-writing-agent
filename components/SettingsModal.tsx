import React from 'react';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  apiKey?: string;
  onSaveApiKey?: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = () => {
  return null;
};
