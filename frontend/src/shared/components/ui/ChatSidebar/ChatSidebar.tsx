import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { MessageInput } from '../MessageInput';
import { Talk2DBHeader } from '../Talk2DBHeader';
import { ChatSidebarProps, Message } from './types';
import BotIcon from '../../../../assets/Bot.png';
import { talk2DBService } from '../../../../api/talk2dbService';
import {
  StyledDrawer,
  ChatContainer,
  MessagesContainer,
  MessageRow,
  MessageBubble,
  BotAvatar,
  UserAvatar,
  TypingIndicator,
  TypingDot,
  ChartImage,
  StyledTableContainer,
  MessageInputContainer
} from './ChatSidebar.styles';



export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  open,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello, I\'m your personal assistant. I\'m here to help determine the perfect product for your client. Tell me about your client!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // Show typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'bot',
      content: '',
      timestamp: '',
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Send message to API
      const response = await talk2DBService.sendMessage(content);

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: response.data,
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      // Add error message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      expanded={expanded}
    >
      <ChatContainer expanded={expanded}>
        <Talk2DBHeader
          title="Talk2DB"
          onClose={onClose}
          onExpand={handleExpand}
          showBotIcon
          expanded={expanded}
        />
        <MessagesContainer expanded={expanded}>
          {messages.map((message) => (
            <MessageRow key={message.id} type={message.type}>
              {message.type === 'bot' ? (
                <BotAvatar>
                  <img src={BotIcon} alt="Bot" width={20} height={20} />
                </BotAvatar>
              ) : (
                <UserAvatar>U</UserAvatar>
              )}
              <MessageBubble type={message.type}>
                {message.isTyping ? (
                  <TypingIndicator>
                    <TypingDot />
                    <TypingDot />
                    <TypingDot />
                  </TypingIndicator>
                ) : (
                  <>
                    {message.content}
                    {message.data?.base_64_image && (
                      <ChartImage
                        src={`data:image/png;base64,${message.data.base_64_image}`}
                        alt="Chart visualization"
                      />
                    )}
                    {message.data?.results && message.data.results.length > 0 && (
                      <StyledTableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              {Object.keys(message.data.results[0]).map((key) => (
                                <TableCell key={key}>{key}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {message.data.results.map((row, index) => (
                              <TableRow key={index}>
                                {Object.values(row).map((value, cellIndex) => (
                                  <TableCell key={cellIndex}>{String(value)}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                    )}
                  </>
                )}
              </MessageBubble>
            </MessageRow>
          ))}
        </MessagesContainer>
        <MessageInputContainer expanded={expanded}>
          <MessageInput
            placeholder="Type your message"
            onSend={handleSendMessage}
          />
        </MessageInputContainer>
      </ChatContainer>
    </StyledDrawer>
  );
};