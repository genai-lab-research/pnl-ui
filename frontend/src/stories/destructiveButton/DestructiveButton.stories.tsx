import { StoryFn, Meta } from '@storybook/react';
import { DestructiveButton } from '../../shared/components/ui/DestructiveButton';

export default {
  title: 'UI/DestructiveButton',
  component: DestructiveButton,
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
} as Meta<typeof DestructiveButton>;

const Template: StoryFn<typeof DestructiveButton> = (args) => <DestructiveButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Delete Container',
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Delete Container',
  disabled: true,
};

export const Small = Template.bind({});
Small.args = {
  children: 'Delete Container',
  size: 'small',
};

export const Large = Template.bind({});
Large.args = {
  children: 'Delete Container',
  size: 'large',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  children: 'Delete Container',
  fullWidth: true,
};