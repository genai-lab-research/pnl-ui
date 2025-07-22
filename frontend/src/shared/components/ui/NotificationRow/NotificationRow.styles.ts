import styled from '@emotion/styled';

export const NotificationContainer = styled.div`
  display: flex;
  position: relative;
  width: 389.33px;
  height: 64px;
  align-items: center;
  padding: 12px 0;
  border: 1px solid rgba(69, 81, 104, 0.1);
  gap: 16px;
`;

export const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 30px;
  background-color: #489F68;
  color: white;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 270px;
`;

export const NotificationMessage = styled.div`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #000000;
`;

export const MetaContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const TimestampContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ClockIcon = styled.div`
  display: flex;
  align-items: center;
  color: rgba(69, 81, 104, 0.5);
`;

export const Timestamp = styled.div`
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #71717A;
`;

export const AuthorName = styled.div`
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #71717A;
`;

export const ComponentSet = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 389.33px;
  border: 1px solid #9747FF;
  border-radius: 5px;
`;