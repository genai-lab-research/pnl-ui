import React from 'react';
import { BotIcon } from './BotIcon';

interface Talk2DBButtonProps {
  isOpen?: boolean;
}

export const Talk2DBButton: React.FC<Talk2DBButtonProps> = ({ isOpen = false }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '6px',
      border: isOpen ? 'none' : '1px solid #455168',
      backgroundColor: isOpen ? 'rgba(69, 81, 104, 1)' : 'transparent',
      transition: 'all 0.2s ease',
    }}>
      <BotIcon 
        width={24} 
        height={24} 
        className={isOpen ? 'inverted' : ''} 
      />
      <span style={{ 
        fontSize: '14px',
        fontWeight: 500,
        color: isOpen ? '#FFFFFF' : '#455168',
        fontFamily: 'Roboto, sans-serif',
      }}>
        Talk2DB
      </span>
    </div>
  );
};