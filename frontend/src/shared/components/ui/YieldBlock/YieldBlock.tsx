import * as React from 'react';
import { YieldBlockProps } from './types';
import {
  YieldBlockContainer,
  YieldLabel,
  ValueContainer,
  IconWrapper,
  ValueText
} from './YieldBlock.styles';
import { GardenCartIcon } from './icons';
import { colors } from '../../../styles';

export const YieldBlock: React.FC<YieldBlockProps> = ({
  label = 'Yield',
  value,
  increment,
  className,
}) => {
  return (
    <YieldBlockContainer className={className}>
      <YieldLabel>{label}</YieldLabel>
      <ValueContainer>
        <IconWrapper>
          <GardenCartIcon />
        </IconWrapper>
        <ValueText>
          {value} {increment && <span style={{ color: colors.status.success }}>{increment}</span>}
        </ValueText>
      </ValueContainer>
    </YieldBlockContainer>
  );
};