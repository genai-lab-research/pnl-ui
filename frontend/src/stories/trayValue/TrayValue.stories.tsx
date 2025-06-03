import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TrayValue, TrayValueProps } from '../../shared/components/ui/TrayValue';

export default {
  title: 'Components/TrayValue',
  component: TrayValue,
  argTypes: {
    value: {
      control: 'text',
      description: 'The numerical value to display',
      defaultValue: '0.0004',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the component',
    },
    textColor: {
      control: 'color',
      description: 'Text color of the component',
    },
    width: {
      control: { type: 'number', min: 20, max: 200, step: 5 },
      description: 'Width of the component in pixels',
    },
    height: {
      control: { type: 'number', min: 10, max: 50, step: 2 },
      description: 'Height of the component in pixels',
    },
  },
} as Meta;

const Template: Story<TrayValueProps> = (args) => <TrayValue {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: '0.0004',
};

export const CustomColors = Template.bind({});
CustomColors.args = {
  value: '0.0004',
  backgroundColor: '#F0F8FF', // Light blue background
  textColor: '#0066CC', // Blue text
};

export const LargerSize = Template.bind({});
LargerSize.args = {
  value: '0.0004',
  width: 60,
  height: 24,
};

export const NegativeValue = Template.bind({});
NegativeValue.args = {
  value: '-0.0004',
  textColor: '#FF0000', // Red text for negative values
};

export const LongValue = Template.bind({});
LongValue.args = {
  value: '0.00042387',
  width: 60, // Shows how the component handles overflow
};