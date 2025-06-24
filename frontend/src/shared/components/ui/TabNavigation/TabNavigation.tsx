import React from 'react';
import { TabNavigationProps } from './types';
import {
  TabContainer,
  TabItem,
  StateLayer,
  TabContent,
  TabLabel,
  TabIndicator
} from './TabNavigation.styles';

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange
}) => {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <TabContainer>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <TabItem 
            key={tab.id}
            active={isActive}
            onClick={() => handleTabClick(tab.id)}
          >
            <StateLayer active={isActive}>
              <TabContent>
                <TabLabel active={isActive}>{tab.label}</TabLabel>
              </TabContent>
            </StateLayer>
            {isActive && <TabIndicator />}
          </TabItem>
        );
      })}
    </TabContainer>
  );
};
