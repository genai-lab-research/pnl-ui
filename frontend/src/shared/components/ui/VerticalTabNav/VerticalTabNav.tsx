import React from 'react';
import { TabContainer, TabItem, TabContent, Indicator } from './VerticalTabNav.styles';
import { VerticalTabNavProps } from './types';

const VerticalTabNav: React.FC<VerticalTabNavProps> = ({ options, value, onChange }) => {
  return (
    <TabContainer>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <TabItem
            key={option.value}
            isSelected={isSelected}
            onClick={() => onChange(option.value)}
            type="button"
            aria-selected={isSelected}
            role="tab"
          >
            <TabContent>
              {option.label}
            </TabContent>
            {isSelected && <Indicator />}
          </TabItem>
        );
      })}
    </TabContainer>
  );
};

export default VerticalTabNav;
