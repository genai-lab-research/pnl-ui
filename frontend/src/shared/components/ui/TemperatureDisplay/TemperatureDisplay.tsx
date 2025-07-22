import React from 'react';
import { TemperatureDisplayProps } from './types';
import {
  Container,
  Card,
  Title,
  ReadingRow,
  IconWrapper,
  TemperatureText
} from './TemperatureDisplay.styles';

const ThermostatIcon = () => (
  <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M6 22.5C8.07107 22.5 9.75 20.8211 9.75 18.75C9.75 17.3524 8.96024 16.1365 7.8 15.5066V3.75C7.8 2.64543 6.90457 1.75 5.8 1.75C4.69543 1.75 3.8 2.64543 3.8 3.75V15.5066C2.63976 16.1365 1.85 17.3524 1.85 18.75C1.85 20.8211 3.52893 22.5 5.6 22.5H6Z"
      fill="#000000"
    />
  </svg>
);

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  currentTemperature,
  targetTemperature,
  unit = '°C',
  title = 'Air Temperature',
  className
}) => {
  return (
    <Container className={className}>
      <Card>
        <Title>{title}</Title>
        <ReadingRow>
          <IconWrapper>
            <ThermostatIcon />
          </IconWrapper>
          <TemperatureText>
            {currentTemperature}{unit} / {targetTemperature}{unit}
          </TemperatureText>
        </ReadingRow>
      </Card>
    </Container>
  );
};

export default TemperatureDisplay;