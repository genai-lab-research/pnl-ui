import styled from '@emotion/styled';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1440px;
  height: 959px;
  background-color: #F6F7FA;
  position: relative;
`;

export const MessagesArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 16px 0;
  overflow-y: auto;
  position: relative;
`;

export const MessagesContainer = styled.div`
  width: 879px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MessageRow = styled.div<{ type: 'user' | 'bot' }>`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-left: ${props => props.type === 'user' ? '150px' : '0'};
  padding-right: ${props => props.type === 'bot' ? '150px' : '0'};
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

export const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 11px;
`;

export const Timestamp = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #5C697C;
  letter-spacing: -0.12px;
  line-height: 10.5px;
`;

export const MessageBubble = styled.div<{ type: 'user' | 'bot' }>`
  background-color: ${props => props.type === 'user' ? '#E3E7EB' : '#FFFFFF'};
  border-radius: 12px;
  padding: 12px 19px;
  ${props => props.type === 'bot' && `
    box-shadow: 0px 2px 5px rgba(30, 39, 51, 0.08);
  `}
`;

export const MessageText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #191A1C;
  letter-spacing: -0.14px;
  line-height: 20px;
  margin: 0;
  text-align: left;
`;

export const UserAvatar = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: #818EA1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AvatarText = styled.span`
  font-size: 21px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 24px;
`;

export const BotAvatar = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 49px;
  background-color: #465269;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 5px 0;
  align-items: center;
`;

export const TypingDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #5C697C;
  animation: typing 1.4s infinite;
  
  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      opacity: 0.3;
    }
    30% {
      opacity: 1;
    }
  }
`;

export const MessageInputWrapper = styled.div`
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  width: 879px;
`;

export const EmptySpace = styled.div`
  height: 24px;
`;