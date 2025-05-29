import { StoryFn, Meta } from '@storybook/react';
import { PreviousButton } from '../../shared/components/ui/PreviousButton';

export default {
  title: 'UI/PreviousButton',
  component: PreviousButton,
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
      description: 'Hides the back arrow icon',
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
} as Meta<typeof PreviousButton>;

const Template: StoryFn<typeof PreviousButton> = (args) => <PreviousButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Previous',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Previous',
  disabled: true,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  children: 'Previous',
  fullWidth: true,
};

export const WithoutIcon = Template.bind({});
WithoutIcon.args = {
  children: 'Back',
  hideIcon: true,
};

export const PrimaryColor = Template.bind({});
PrimaryColor.args = {
  children: 'Previous',
  color: 'primary',
};

export const ContainedVariant = Template.bind({});
ContainedVariant.args = {
  children: 'Previous',
  variant: 'contained',
};