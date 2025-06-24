import React from 'react';
import { TabContainer, TabItem, TabContent } from './TabGroup.styles';
import { TabGroupProps } from './types';

const TabGroup: React.FC<TabGroupProps> = ({ options, value, onChange }) => {
  return (
    <TabContainer>
      {options.map((option) => (
        <TabItem
          key={option.value}
          isSelected={option.value === value}
          onClick={() => onChange(option.value)}
          type="button"
          aria-selected={option.value === value}
          role="tab"
        >
          <TabContent>
            {option.label}
          </TabContent>
        </TabItem>
      ))}
    </TabContainer>
  );
};

export default TabGroup;
