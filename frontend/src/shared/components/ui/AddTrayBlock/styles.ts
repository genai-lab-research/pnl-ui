import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 162px;
  height: 301px;
  position: relative;
  gap: 10px;
`;

export const TopStack = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

export const SlotBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 8px;
  background-color: #E7EBF2;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 10px;
  color: #09090B;
  text-transform: uppercase;
  height: 18px;
  width: 151px;
  box-sizing: border-box;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 151px;
  height: 273px;
  border: 1px solid #E6EAF1;
  border-radius: 6px;
  background-color: #F7F9FD;
  box-shadow: 0px 2px 0px 0px #E7EBF2;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 8px;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  
  &:active {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const ButtonText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: #49454F;
`;