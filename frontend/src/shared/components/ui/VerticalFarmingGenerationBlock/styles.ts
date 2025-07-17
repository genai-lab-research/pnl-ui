import styled from '@emotion/styled';
import { CropStatus } from './types';
import { colors } from '../../../styles';

export const Container = styled.div`
  position: relative;
  width: 162px;
  height: 301px;
  display: flex;
  flex-direction: column;
`;

export const SlotLabel = styled.div`
  position: absolute;
  top: 4px;
  left: 0;
  z-index: 10;
  background-color: white;
  padding: 1px 6px;
  border-radius: 10px;
  border: 1px solid ${colors.secondary.main};
`;

export const SlotLabelText = styled.span`
  font-family: Inter, sans-serif;
  font-size: 8px;
  font-weight: 500;
  line-height: 10px;
  color: ${colors.text.secondary};
  text-transform: uppercase;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 151px;
  height: 280px;
  background-color: ${colors.background.panel};
  border: 1px solid ${colors.border.medium};
  border-radius: 6px;
  padding: 2px 8px;
  gap: 8px;
  box-shadow: 0px 2px 0px ${colors.component.cropVisualization};
  margin-top: 21px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TrayIdText = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: ${colors.text.secondary};
`;

export const ProgressText = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${colors.text.secondary};
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${colors.opacity.black10};
  border-radius: 10px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${colors.gradient.successLinear};
  border-radius: 10px;
`;

export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-top: 2px;
  flex: 1;
  overflow: hidden;
  max-height: 180px;
`;

export const TimelineRow = styled.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`;

export const StatusDot = styled.div<{ status: CropStatus['status'] }>`
  width: 8px;
  height: 8px;
  border-radius: 1px;
  background-color: ${props => {
    switch (props.status) {
      case 'sprout':
        return colors.status.healthy;
      case 'not-ok':
        return colors.status.warning;
      case 'empty':
      default:
        return colors.interactive.disabled;
    }
  }};
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const GridSizeText = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 20px;
  color: ${colors.opacity.textMuted50};
`;

export const CropCountText = styled.span`
  font-family: Roboto, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 20px;
  color: ${colors.text.secondary};
`;