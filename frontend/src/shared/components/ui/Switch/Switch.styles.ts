import styled from '@emotion/styled';
import { component, opacity } from '../../../styles/colors';

export const SwitchContainer = styled.div`
  position: relative;
  display: flex;
  width: 60px;
  height: 38px;
  border-radius: 5px;
`;

export const SwitchFrame = styled.div`
  position: absolute;
  display: flex;
  width: 58px;
  height: 38px;
`;

export const SlideFrame = styled.div<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 38px;
  padding: 12px;
  opacity: 0.38;
`;

export const SlideTrack = styled.div<{ checked: boolean }>`
  width: 100%;
  height: 14px;
  background-color: ${props => props.checked ? component.switchTrack : 'black'};
  border-radius: 7px;
  transition: background-color 300ms;
`;

export const KnobFrame = styled.div<{ checked: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 9px;
  left: ${props => props.checked ? '20px' : '0'};
  transition: left 300ms;
`;

export const Knob = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${component.switchThumb};
  border-radius: 50%;
  box-shadow:
    0px 1px 3px 0px ${opacity.secondary12},
    0px 1px 1px 0px ${opacity.secondary12},
    0px 2px 1px -1px ${opacity.secondary12};
`;

export const HiddenInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 1;

  &:disabled {
    cursor: not-allowed;
  }
`;