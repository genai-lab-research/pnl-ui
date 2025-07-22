import React from 'react';
import { TabContainer, TabItem, TabContent, IconWrapper, LabelWrapper } from './VerticalFarmingTabGroup.styles';
import { VerticalFarmingTabGroupProps } from './types';

const VerticalFarmingTabGroup: React.FC<VerticalFarmingTabGroupProps> = ({ options, value, onChange }) => {
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
            {option.icon && (
              <IconWrapper>
                {option.icon}
              </IconWrapper>
            )}
            <LabelWrapper>
              {option.label}
            </LabelWrapper>
          </TabContent>
        </TabItem>
      ))}
    </TabContainer>
  );
};

export default VerticalFarmingTabGroup;
