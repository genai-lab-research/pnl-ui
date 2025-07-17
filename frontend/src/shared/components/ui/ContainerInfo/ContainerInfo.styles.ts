import styled from '@emotion/styled';
import { background, text, border, status } from '../../../styles/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${border.primary};
  border-radius: 8px;
  background-color: ${background.primary};
  width: 100%;
  box-sizing: border-box;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

export const SectionWithBorder = styled(Section)`
  border-bottom: 1px solid ${border.primary};
`;

export const SectionTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: ${text.primary};
  margin: 0 0 24px 0;
`;

export const FieldsContainer = styled.div`
  display: flex;
`;

export const LabelsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-right: 16px;
`;

export const ValuesColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
`;

export const Label = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${text.secondary};
`;

export const Value = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${text.secondary};
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  padding: 3px 11px;
  background-color: ${status.successDark};
  border-radius: 9999px;
  align-items: center;
  justify-content: center;
`;

export const StatusText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: ${background.paper};
`;

export const TypeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SeedTypes = styled(Value)`
  margin-top: 10px;
`;

export const Notes = styled(Value)`
  font-size: 14px;
  line-height: 16.94px;
  color: ${text.primary};
`;