import { StoryFn, Meta } from '@storybook/react';
import { Box } from '@mui/material';
import { Chip } from '../../shared/components/ui/Chip';

export default {
  title: 'UI/Chip/ActiveChip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: 'Implementation of the Active Chip component from component_429-15078.json.',
      },
    },
  },
} as Meta<typeof Chip>;

// Basic template for individual stories
const Template: StoryFn<typeof Chip> = (args) => <Chip {...args} />;

// Story for the exact component from JSON
export const ActiveChipFromJson = Template.bind({});
ActiveChipFromJson.args = {
  variant: 'filled',
  size: 'small',
  status: 'active',
  value: 'Active',
};
ActiveChipFromJson.parameters = {
  docs: {
    description: {
      story: 'This is an exact implementation of component_429-15078.json with a green background (#479F67) and white text (#FAFAFA) using Inter SemiBold 12px font.'
    },
  },
};

// A display of the chip in different contexts
export const ActiveChipShowcase: StoryFn = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="active" value="Active" size="small" />
      <span>Small Active Chip</span>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="active" value="Active" size="medium" />
      <span>Medium Active Chip</span>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="active" value="Active" variant="outlined" />
      <span>Outlined Active Chip</span>
    </Box>

    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Chip status="active" value="Active" disabled />
      <span>Disabled Active Chip</span>
    </Box>
  </Box>
);