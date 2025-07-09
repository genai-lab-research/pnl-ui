import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageInput } from './MessageInput';

describe('MessageInput', () => {
  it('renders with default placeholder', () => {
    render(<MessageInput />);
    expect(screen.getByPlaceholderText('Type your message')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<MessageInput placeholder="Enter your text here" />);
    expect(screen.getByPlaceholderText('Enter your text here')).toBeInTheDocument();
  });

  it('handles text input', () => {
    const handleChange = jest.fn();
    render(<MessageInput onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Type your message');
    fireEvent.change(input, { target: { value: 'Hello world' } });
    
    expect(handleChange).toHaveBeenCalledWith('Hello world');
  });

  it('calls onSend when send button is clicked', () => {
    const handleSend = jest.fn();
    render(<MessageInput onSend={handleSend} value="Test message" />);
    
    const sendButton = screen.getByLabelText('Send message');
    fireEvent.click(sendButton);
    
    expect(handleSend).toHaveBeenCalledWith('Test message');
  });

  it('calls onSend when Enter key is pressed', () => {
    const handleSend = jest.fn();
    render(<MessageInput onSend={handleSend} value="Test message" />);
    
    const input = screen.getByPlaceholderText('Type your message');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(handleSend).toHaveBeenCalledWith('Test message');
  });

  it('disables send button when input is empty', () => {
    render(<MessageInput value="" />);
    
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('calls attachment handler when attachment button is clicked', () => {
    const handleAttachment = jest.fn();
    render(<MessageInput onAttachmentClick={handleAttachment} />);
    
    const attachButton = screen.getByLabelText('Attach file');
    fireEvent.click(attachButton);
    
    expect(handleAttachment).toHaveBeenCalled();
  });

  it('calls voice handler when voice button is clicked', () => {
    const handleVoice = jest.fn();
    render(<MessageInput onVoiceClick={handleVoice} />);
    
    const voiceButton = screen.getByLabelText('Voice message');
    fireEvent.click(voiceButton);
    
    expect(handleVoice).toHaveBeenCalled();
  });

  it('disables all interactions when disabled prop is true', () => {
    render(<MessageInput disabled />);
    
    const input = screen.getByPlaceholderText('Type your message');
    const sendButton = screen.getByLabelText('Send message');
    const attachButton = screen.getByLabelText('Attach file');
    const voiceButton = screen.getByLabelText('Voice message');
    
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
    expect(attachButton).toBeDisabled();
    expect(voiceButton).toBeDisabled();
  });
});