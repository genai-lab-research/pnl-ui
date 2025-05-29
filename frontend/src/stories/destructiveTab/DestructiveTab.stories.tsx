import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Tabs } from '@mui/material';
import { DestructiveTab } from '../../shared/components/ui/DestructiveTab';

// Create wrapper components for stories to avoid ESLint hook errors
const DefaultDestructiveTabExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} customIndicatorColor="#3545EE">
      <DestructiveTab label="Configuring" />
    </Tabs>
  );
};

const DestructiveTabInTabGroupExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '400px' }}>
      <Tabs value={value} onChange={handleChange} customIndicatorColor="#3545EE">
        <DestructiveTab label="Configuring" isFirst />
        <DestructiveTab label="Monitoring" />
        <DestructiveTab label="Analysis" isLast />
      </Tabs>
    </Box>
  );
};

const EqualWidthDestructiveTabsExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '400px' }}>
      <Tabs value={value} onChange={handleChange} equalWidth customIndicatorColor="#3545EE">
        <DestructiveTab label="Configuring" isFirst equalWidth />
        <DestructiveTab label="Monitoring" equalWidth />
        <DestructiveTab label="Analysis" isLast equalWidth />
      </Tabs>
    </Box>
  );
};

const DisabledDestructiveTabExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} customIndicatorColor="#3545EE">
      <DestructiveTab label="Configuring" />
      <DestructiveTab label="Restricted" disabled />
    </Tabs>
  );
};

// Example that exactly matches the reference image
const ReferenceDesignDestructiveTabExample = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '201.5px', height: '32px' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        customIndicatorColor="#3545EE"
        sx={{
          borderRadius: '2px',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          padding: '0',
        }}
      >
        <DestructiveTab
          label="Configuring"
          sx={{
            width: '201.5px', 
            height: '32px',
            padding: '6px 12px',
            borderRadius: '2px',
            fontFamily: 'Inter',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            color: 'rgba(68, 68, 76, 0.87)', 
          }}
        />
      </Tabs>
    </Box>
  );
};

const meta: Meta<typeof DestructiveTab> = {
  title: 'UI/DestructiveTab',
  component: DestructiveTab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DestructiveTab>;

export const Default: Story = {
  render: () => <DefaultDestructiveTabExample />
};

export const InTabGroup: Story = {
  render: () => <DestructiveTabInTabGroupExample />
};

export const EqualWidth: Story = {
  render: () => <EqualWidthDestructiveTabsExample />
};

export const Disabled: Story = {
  render: () => <DisabledDestructiveTabExample />
};

// Story that exactly matches the reference design
export const ReferenceDesign: Story = {
  render: () => <ReferenceDesignDestructiveTabExample />,
  parameters: {
    layout: 'centered',
  }
};