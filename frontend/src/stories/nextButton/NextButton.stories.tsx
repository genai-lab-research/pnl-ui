import { StoryFn, Meta } from '@storybook/react';
import { NextButton } from '../../shared/components/ui/NextButton';

export default {
  title: 'UI/NextButton',
  component: NextButton,
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes the button take the full width of its container',
    },
    hideIcon: {
      control: 'boolean',
      description: 'Hides the forward arrow icon',
    },
    variant: {
      control: { type: 'select', options: ['outlined', 'contained', 'text'] },
      description: 'The variant to use',
    },
    color: {
      control: { type: 'select', options: ['primary', 'secondary'] },
      description: 'The color of the button',
    },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof NextButton>;

const Template: StoryFn<typeof NextButton> = (args) => <NextButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Next',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Next',
  disabled: true,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  children: 'Next',
  fullWidth: true,
};

export const WithoutIcon = Template.bind({});
WithoutIcon.args = {
  children: 'Continue',
  hideIcon: true,
};

export const PrimaryColor = Template.bind({});
PrimaryColor.args = {
  children: 'Next',
  color: 'primary',
};

export const ContainedVariant = Template.bind({});
ContainedVariant.args = {
  children: 'Next',
  variant: 'contained',
};