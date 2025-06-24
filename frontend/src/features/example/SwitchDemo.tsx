import React, { useState } from 'react';
import { Switch } from '../../shared/components/ui/Switch';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Label = styled.label`
  min-width: 150px;
  font-size: 16px;
`;

const SwitchDemo: React.FC = () => {
  const [regularSwitchState, setRegularSwitchState] = useState(false);
  const [initialOnSwitchState, setInitialOnSwitchState] = useState(true);

  return (
    <DemoContainer>
      <h1>Switch Component Demo</h1>
      
      <SwitchRow>
        <Label>Default Switch:</Label>
        <Switch 
          checked={regularSwitchState} 
          onChange={setRegularSwitchState} 
        />
        <span>State: {regularSwitchState ? 'ON' : 'OFF'}</span>
      </SwitchRow>
      
      <SwitchRow>
        <Label>Initially ON Switch:</Label>
        <Switch 
          checked={initialOnSwitchState} 
          onChange={setInitialOnSwitchState} 
        />
        <span>State: {initialOnSwitchState ? 'ON' : 'OFF'}</span>
      </SwitchRow>
      
      <SwitchRow>
        <Label>Disabled Switch:</Label>
        <Switch disabled />
        <span>State: OFF (disabled)</span>
      </SwitchRow>
      
      <SwitchRow>
        <Label>Disabled ON Switch:</Label>
        <Switch checked disabled />
        <span>State: ON (disabled)</span>
      </SwitchRow>
    </DemoContainer>
  );
};

export default SwitchDemo;