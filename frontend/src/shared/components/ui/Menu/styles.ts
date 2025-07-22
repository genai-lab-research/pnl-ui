import styled from '@emotion/styled';

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 145px;
  height: 96px;
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 4px 0;
  box-shadow: 
    0px 1px 2px 0px rgba(0, 0, 0, 1),
    0px 2px 6px 2px rgba(0, 0, 0, 1);
  position: relative;
`;

export const MenuItemContainer = styled.div<{ hasTopBorder?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 4px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-top: ${props => props.hasTopBorder ? '1px solid #E9EDF4' : 'none'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.88);
  }

  &:first-of-type {
    height: 32px;
  }

  &:nth-of-type(2) {
    height: 24px;
    padding-top: 0;
    padding-bottom: 0;
  }

  &:last-of-type {
    height: 32px;
  }
`;

export const MenuItemText = styled.span`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(76, 78, 100, 0.87);
  text-align: left;
  text-transform: none;
`;