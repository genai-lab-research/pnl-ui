import React, { useState } from 'react';
import { ChatHeader } from '../ChatHeader';
import { MessageInput } from '../MessageInput';
import BotIconImage from '../../../../assets/Bot.png';
import {
  ChatContainer,
  MessagesArea,
  MessagesContainer,
  MessageRow,
  MessageContent,
  MessageMeta,
  Timestamp,
  MessageBubble,
  MessageText,
  UserAvatar,
  AvatarText,
  BotAvatar,
  TypingIndicator,
  TypingDot,
  MessageInputWrapper,
  EmptySpace
} from './styles';
import { ChatInterfaceProps, Message } from './types';

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages = [],
  onSendMessage,
  onClose,
  onMinimize,
  title = 'Talk2DB',
  className
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (message: string) => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setInputValue('');
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'user') {
      return (
        <MessageRow key={message.id} type="user">
          <MessageContent>
            <MessageMeta>
              <Timestamp>{message.timestamp}</Timestamp>
            </MessageMeta>
            <MessageBubble type="user">
              <MessageText>{message.content}</MessageText>
            </MessageBubble>
            <EmptySpace />
          </MessageContent>
          <UserAvatar>
            <AvatarText>U</AvatarText>
          </UserAvatar>
        </MessageRow>
      );
    }

    return (
      <MessageRow key={message.id} type="bot">
        <BotAvatar>
          <img src={BotIconImage} alt="Bot" width={20} height={20} />
        </BotAvatar>
        <MessageContent>
          <MessageBubble type="bot">
            {message.isTyping ? (
              <TypingIndicator>
                <TypingDot />
                <TypingDot />
                <TypingDot />
              </TypingIndicator>
            ) : (
              <MessageText>{message.content}</MessageText>
            )}
          </MessageBubble>
        </MessageContent>
      </MessageRow>
    );
  };

  return (
    <ChatContainer className={className}>
      <ChatHeader
        title={title}
        onClose={onClose}
        onMinimize={onMinimize}
        showBotIcon
      />
      <MessagesArea>
        <MessagesContainer>
          {messages.map(renderMessage)}
        </MessagesContainer>
      </MessagesArea>
      <MessageInputWrapper>
        <MessageInput
          placeholder="Type your message"
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
        />
      </MessageInputWrapper>
    </ChatContainer>
  );
};