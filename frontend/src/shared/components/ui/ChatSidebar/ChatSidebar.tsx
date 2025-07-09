import React, { useState } from 'react';
import { Drawer, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MessageInput } from '../MessageInput';
import { Talk2DBHeader } from '../Talk2DBHeader';
import { ChatSidebarProps, Message } from './types';
import BotIcon from '../../../../assets/Bot.png';
import { talk2DBService } from '../../../../api/talk2dbService';

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  '& .MuiDrawer-paper': {
    width: expanded ? '100vw' : '400px',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    boxShadow: expanded ? 'none' : '-2px 0 8px rgba(0, 0, 0, 0.1)',
    transition: 'width 0.3s ease-in-out',
    zIndex: expanded ? 1300 : 1200, // Higher z-index when expanded to cover everything
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
  },
  '@keyframes typing': {
    '0%, 60%, 100%': {
      opacity: 0.3,
    },
    '30%': {
      opacity: 1,
    },
  },
}));

const ChatContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: expanded ? '#F8F9FA' : '#FFFFFF',
  padding: expanded ? '0' : '16px',
}));

const MessagesContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  flex: 1,
  overflow: 'auto',
  padding: expanded ? '24px' : '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxWidth: expanded ? '1200px' : '100%',
  margin: expanded ? '0 auto' : '0',
  width: '100%',
}));

const MessageRow = styled('div')<{ type: 'user' | 'bot' }>(({ type }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  flexDirection: type === 'user' ? 'row-reverse' : 'row',
}));

const MessageBubble = styled('div')<{ type: 'user' | 'bot' }>(({ type }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: type === 'user' ? '#4C4E64' : '#F3F4F6',
  color: type === 'user' ? '#FFFFFF' : '#000000',
  fontSize: '14px',
  lineHeight: '20px',
}));

const BotAvatar = styled('div')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#E5E7EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  '& img': {
    filter: 'none', // Ensure the icon displays in its original colors
  },
});

const UserAvatar = styled('div')({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#4C4E64',
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 500,
  flexShrink: 0,
});

const TypingIndicator = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
});

const TypingDot = styled('span')({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#666',
  animation: 'typing 1.4s infinite',
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  },
});

const ChartImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginTop: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

const StyledTableContainer = styled(TableContainer)({
  marginTop: '12px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '& .MuiTableHead-root': {
    backgroundColor: '#F3F4F6',
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: '#374151',
    borderBottom: '2px solid #E5E7EB',
  },
  '& .MuiTableCell-body': {
    color: '#4B5563',
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: '#F9FAFB',
  },
});

const MessageInputContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded?: boolean }>(({ expanded }) => ({
  padding: expanded ? '24px' : '16px',
  maxWidth: expanded ? '1200px' : '100%',
  margin: expanded ? '0 auto' : '0',
  width: '100%',
}));

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  open,
  onClose,
  onMinimize: _onMinimize,
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