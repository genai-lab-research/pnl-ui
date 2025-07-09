import { Meta, StoryObj } from '@storybook/react';
import { VerticalFarmingGeneralInfoBlock } from '../VerticalFarmingGeneralInfoBlock';
import { useState } from 'react';

const meta = {
  title: 'Shared/Components/UI/VerticalFarmingGeneralInfoBlock',
  component: VerticalFarmingGeneralInfoBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VerticalFarmingGeneralInfoBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'General Info',
    isExpanded: false,
  },
};

export const Expanded: Story = {
  args: {
    title: 'General Info',
    isExpanded: true,
  },
};

// Interactive story with state
export const Interactive: Story = {
  args: {
    title: 'General Info',
    isExpanded: false,
  },
  render: (args) => {
    const InteractiveComponent = () => {
      const [isExpanded, setIsExpanded] = useState(args.isExpanded);
      
      return (
        <VerticalFarmingGeneralInfoBlock 
          title={args.title}
          isExpanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      );
    };
    
    return <InteractiveComponent />;
  }
};