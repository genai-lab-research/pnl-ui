import React from 'react';
import { MessageInput } from '../../../shared/components/ui/MessageInput';

const MessageInputDemo: React.FC = () => {
  const handleSendMessage = (message: string) => {
    console.log('Message sent:', message);
  };

  const handleAttachmentClick = () => {
    console.log('Attachment button clicked');
  };

  const handleVoiceInputClick = () => {
    console.log('Voice input button clicked');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Message Input Component</h2>
      <div style={{ marginTop: '20px' }}>
        <MessageInput 
          placeholder="Type your message"
          onSendMessage={handleSendMessage}
          onAttachmentClick={handleAttachmentClick}
          onVoiceInputClick={handleVoiceInputClick}
        />
      </div>
    </div>
  );
};

export default MessageInputDemo;