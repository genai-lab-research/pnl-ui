import React, { useState, KeyboardEvent } from 'react';
import { MessageInputContainer, StyledInput, SendButton } from './styles';
import { SendIcon } from './icons';
import { MessageInputProps } from './types';

export const MessageInput: React.FC<MessageInputProps> = ({
  placeholder = 'Type your message',
  value: controlledValue,
  onChange,
  onSend,
  onAttachmentClick: _onAttachmentClick,
  onVoiceClick: _onVoiceClick,
  disabled = false,
  className
}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend?.(value);
      if (!isControlled) {
        setInternalValue('');
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MessageInputContainer className={className}>
      <StyledInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      
      <SendButton
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <SendIcon />
      </SendButton>
    </MessageInputContainer>
  );
};