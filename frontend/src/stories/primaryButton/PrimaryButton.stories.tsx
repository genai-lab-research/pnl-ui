import { StoryFn, Meta } from '@storybook/react';
import { PrimaryButton } from '../../shared/components/ui/PrimaryButton';

export default {
  title: 'UI/PrimaryButton',
  component: PrimaryButton,
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof PrimaryButton>;

const Template: StoryFn<typeof PrimaryButton> = (args) => <PrimaryButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Create Container',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Create Container',
  disabled: true,
};

export const Small = Template.bind({});
Small.args = {
  children: 'Create Container',
  size: 'small',
};

export const Large = Template.bind({});
Large.args = {
  children: 'Create Container',
  size: 'large',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  children: 'Create Container',
  fullWidth: true,
};