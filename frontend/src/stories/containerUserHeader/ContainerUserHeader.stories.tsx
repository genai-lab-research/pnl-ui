import type { Meta, StoryObj } from '@storybook/react';
import { ContainerUserHeader } from '../../shared/components/ui/ContainerUserHeader';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FaceIcon from '@mui/icons-material/Face';
import AgricultureIcon from '@mui/icons-material/Agriculture';

/**
 * The ContainerUserHeader component displays container information with a user avatar, title, timestamp, and username.
 */
const meta = {
  title: 'Components/ContainerUserHeader',
  component: ContainerUserHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    avatarColor: { control: 'color' },
    avatarIcon: { control: false },
    className: { control: 'text' },
  },
} satisfies Meta<typeof ContainerUserHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default display of the ContainerUserHeader component with all fields populated.
 */
export const Default: Story = {
  args: {
    title: 'Seeded Salanova Cousteau in Nursery',
    timestamp: 'April 13, 2025 - 12:30 PM',
    userName: 'Emily Chen',
    avatarColor: '#489F68',
  },
};

/**
 * Example of a very long title that demonstrates the text wrapping behavior.
 */
export const LongTitle: Story = {
  args: {
    title: 'This is a very long container title that should demonstrate how text wrapping works on different screen sizes to ensure proper display of lengthy content',
    timestamp: 'April 13, 2025 - 12:30 PM',
    userName: 'Emily Chen',
  },
};

/**
 * Example with a custom icon in the avatar.
 */
export const CustomIcon: Story = {
  args: {
    title: 'White Lettuce Harvest Planning',
    timestamp: 'April 15, 2025 - 09:15 AM',
    userName: 'Michael Johnson',
    avatarColor: '#4CAF50',
    avatarIcon: <AgricultureIcon />,
  },
};

/**
 * Example with minimal information - just the title.
 */
export const MinimalInfo: Story = {
  args: {
    title: 'Tomato Growth Analysis',
    avatarColor: '#8BC34A',
  },
};

/**
 * Example with different avatar styles.
 */
export const AvatarVariations: Story = {
  args: {
    title: "Default Avatar Style",
    timestamp: "April 13, 2025 - 12:30 PM",
    userName: "Emily Chen",
  },
  render: (args) => (
    <div className="space-y-4">
      <ContainerUserHeader
        {...args}
        title="Default Avatar Style"
        avatarColor="#489F68"
      />
      
      <ContainerUserHeader
        {...args}
        title="Custom Icon Avatar"
        timestamp="April 14, 2025 - 10:45 AM"
        userName="David Wong"
        avatarColor="#2196F3"
        avatarIcon={<FaceIcon />}
      />
      
      <ContainerUserHeader
        {...args}
        title="Outline Icon Avatar"
        timestamp="April 15, 2025 - 09:15 AM"
        userName="Sarah Miller"
        avatarColor="#9C27B0"
        avatarIcon={<PersonOutlineIcon />}
      />
    </div>
  ),
};

/**
 * Example showing responsive behavior at different widths.
 */
export const ResponsiveBehavior: Story = {
  args: {
    title: "Seeded Salanova Cousteau in Nursery",
    timestamp: "April 13, 2025 - 12:30 PM",
    userName: "Emily Chen",
  },
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Full Width</h3>
        <ContainerUserHeader {...args} />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Medium Width (500px)</h3>
        <div style={{ width: '500px', border: '1px dashed #ccc' }}>
          <ContainerUserHeader {...args} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Small Width (300px)</h3>
        <div style={{ width: '300px', border: '1px dashed #ccc' }}>
          <ContainerUserHeader {...args} />
        </div>
      </div>
    </div>
  ),
};