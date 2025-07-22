import styled from '@emotion/styled';

export const SelectContainer = styled.div<{ width?: number | string }>`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '372px')};
  height: 40px;
  display: flex;
  flex-direction: column;
`;

export const SelectInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(76, 78, 100, 0.22);
  border-radius: 6px;
`;

export const InactiveContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 0 8px 5px;
  gap: 8px;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export const Label = styled.span`
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.15px;
  text-align: left;
  color: rgba(76, 78, 100, 0.6);
  flex-grow: 1;
  padding: 0 12px;
`;

export const ArrowContainer = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  color: rgba(76, 78, 100, 0.54);
`;
