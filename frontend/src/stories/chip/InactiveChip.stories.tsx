import { StoryFn, Meta } from '@storybook/react';
import { Box } from '@mui/material';
import { Chip } from '../../shared/components/ui/Chip';

export default {
  title: 'UI/Chip/InactiveChip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: 'Implementation of the Inactive Chip component from component_429-15032.json.',
      },
    },
  },
} as Meta<typeof Chip>;

// Basic template for individual stories
const Template: StoryFn<typeof Chip> = (args) => <Chip {...args} />;

// Story for the exact component from JSON
export const InactiveChipFromJson = Template.bind({});
InactiveChipFromJson.args = {
  variant: 'filled',
  size: 'small',
  status: 'inactive',
  value: 'Inactive',
};
InactiveChipFromJson.parameters = {
  docs: {
    description: {
      story: 'This is an exact implementation of component_429-15032.json with a light gray background (#F4F4F5) and dark text (#18181B) using Inter SemiBold 12px font.'
    },
  },
};

// A display of the chip in different contexts
export const InactiveChipShowcase: StoryFn = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="inactive" value="Inactive" size="small" />
      <span>Small Inactive Chip</span>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="inactive" value="Inactive" size="medium" />
      <span>Medium Inactive Chip</span>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="inactive" value="Inactive" variant="outlined" />
      <span>Outlined Inactive Chip</span>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="inactive" value="Inactive" disabled />
      <span>Disabled Inactive Chip</span>
    </Box>
  </Box>
);