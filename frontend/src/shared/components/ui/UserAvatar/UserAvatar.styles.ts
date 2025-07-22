import styled from '@emotion/styled';

export const AvatarContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  position: relative;
`;

export const AvatarImage = styled.img<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 64px;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;