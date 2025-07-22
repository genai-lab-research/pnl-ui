import * as React from 'react';
import { 
  SwitchContainer,
  SwitchFrame,
  SlideFrame,
  SlideTrack,
  KnobFrame,
  Knob,
  HiddenInput
} from './Switch.styles';
import { SwitchProps } from './types';

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  disabled = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <SwitchContainer>
      <HiddenInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <SwitchFrame>
        <SlideFrame checked={checked}>
          <SlideTrack checked={checked} />
        </SlideFrame>
        <KnobFrame checked={checked}>
          <Knob />
        </KnobFrame>
      </SwitchFrame>
    </SwitchContainer>
  );
};

export default Switch;