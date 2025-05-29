import { StoryFn, Meta } from '@storybook/react';
import { Box, Stack, Typography } from '@mui/material';
import { Chip } from '../../shared/components/ui/Chip';

export default {
  title: 'UI/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: 'A versatile chip component for displaying status indicators, counters, or category labels.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/...',
    },
  },
  argTypes: {
    variant: {
      options: ['filled', 'outlined'],
      control: { type: 'select' },
      description: 'The visual style of the chip',
      table: {
        defaultValue: { summary: 'filled' },
      },
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'select' },
      description: 'The size of the chip',
      table: {
        defaultValue: { summary: 'small' },
      },
    },
    status: {
      options: ['active', 'inactive', 'default', 'in-progress'],
      control: { type: 'select' },
      description: 'Determines the color scheme of the chip',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    value: {
      control: 'text',
      description: 'The content to display within the chip',
      table: {
        defaultValue: { summary: '0' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the chip will be displayed in a disabled state',
      table: {
        defaultValue: { summary: false },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the chip is clicked',
    },
  },
} as Meta<typeof Chip>;

// Basic template for individual stories
const Template: StoryFn<typeof Chip> = (args) => <Chip {...args} />;

// Story for active state
export const Active = Template.bind({});
Active.args = {
  variant: 'filled',
  size: 'small',
  status: 'active',
  value: 0,
};
Active.parameters = {
  docs: {
    description: {
      story: 'Active state typically indicates a selected or enabled item.',
    },
  },
};

// Story for inactive state
export const Inactive = Template.bind({});
Inactive.args = {
  variant: 'filled',
  size: 'small',
  status: 'inactive',
  value: 0,
};
Inactive.parameters = {
  docs: {
    description: {
      story: 'Inactive state indicates an unselected or disabled item.',
    },
  },
};

// Story for default state
export const Default = Template.bind({});
Default.args = {
  variant: 'filled',
  size: 'small',
  status: 'default',
  value: 0,
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default state using the primary color from the theme.',
    },
  },
};

// Story with text value
export const WithText = Template.bind({});
WithText.args = {
  variant: 'filled',
  size: 'small',
  status: 'active',
  value: 'Active',
};
WithText.parameters = {
  docs: {
    description: {
      story: 'Chips can contain text instead of numeric values.',
    },
  },
};

// Story for medium size
export const Medium = Template.bind({});
Medium.args = {
  variant: 'filled',
  size: 'medium',
  status: 'active',
  value: 0,
};
Medium.parameters = {
  docs: {
    description: {
      story: 'Medium size chip with increased height and padding.',
    },
  },
};

// Story for outlined variant
export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  size: 'small',
  status: 'active',
  value: 0,
};
Outlined.parameters = {
  docs: {
    description: {
      story: 'Outlined variant with transparent background and colored border.',
    },
  },
};

// Story for disabled state
export const Disabled = Template.bind({});
Disabled.args = {
  variant: 'filled',
  size: 'small',
  status: 'active',
  value: 0,
  disabled: true,
};
Disabled.parameters = {
  docs: {
    description: {
      story: 'Disabled state with reduced opacity and no interaction.',
    },
  },
};

// Story for in-progress status
export const InProgress = Template.bind({});
InProgress.args = {
  variant: 'filled',
  size: 'small',
  status: 'in-progress',
  value: 'In progress',
};
InProgress.parameters = {
  docs: {
    description: {
      story: 'In Progress state for indicating ongoing tasks or processes.',
    },
  },
};

// Group showcase story with multiple variants
export const ChipShowcase: StoryFn = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>Chip Component Variants</Typography>

    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Status Variations</Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4} sx={{ 
      '& > div': { mb: { xs: 1, sm: 0 } } 
    }}>
      <Chip value="Active" status="active" />
      <Chip value="Inactive" status="inactive" />
      <Chip value="Default" status="default" />
      <Chip value="In progress" status="in-progress" />
    </Stack>

    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Size Variations</Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4} sx={{ 
      '& > div': { mb: { xs: 1, sm: 0 } } 
    }} alignItems="flex-start">
      <Chip value="Small" size="small" status="active" />
      <Chip value="Medium" size="medium" status="active" />
    </Stack>

    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Variant Styles</Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4} sx={{ 
      '& > div': { mb: { xs: 1, sm: 0 } } 
    }}>
      <Chip value="Filled" variant="filled" status="active" />
      <Chip value="Outlined" variant="outlined" status="active" />
      <Chip value="In progress" variant="filled" status="in-progress" />
      <Chip value="In progress" variant="outlined" status="in-progress" />
    </Stack>

    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Numeric Values</Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4} sx={{ 
      '& > div': { mb: { xs: 1, sm: 0 } } 
    }}>
      <Chip value={0} status="active" />
      <Chip value={12} status="inactive" />
      <Chip value={999} status="default" />
    </Stack>

    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Text Overflow Handling</Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4} sx={{ 
      '& > div': { mb: { xs: 1, sm: 0 }, maxWidth: '100%' } 
    }}>
      <Chip value="Short" status="active" />
      <Chip value="Medium length text" status="inactive" />
      <Chip value="This is a very long text that will be truncated with ellipsis" status="default" />
    </Stack>

    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Responsive Behavior</Typography>
    <Typography variant="body2" sx={{ mb: 1 }}>
      Resize the window to see responsive adjustments at different breakpoints:
    </Typography>
    
    <Box sx={{ 
      p: 2, 
      border: '1px dashed #ccc', 
      borderRadius: 1, 
      mb: 4,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2,
      alignItems: 'flex-start'
    }}>
      <Box>
        <Typography variant="caption" display="block" mb={1}>
          Desktop View (≥ 900px)
        </Typography>
        <Chip value="Responsive" status="active" />
      </Box>
      
      <Box>
        <Typography variant="caption" display="block" mb={1}>
          Tablet View (600px - 899px)
        </Typography>
        <Chip value="Responsive" status="inactive" />
      </Box>
      
      <Box>
        <Typography variant="caption" display="block" mb={1}>
          Mobile View (&lt; 600px)
        </Typography>
        <Chip value="Responsive" status="default" />
      </Box>
      
      <Box>
        <Typography variant="caption" display="block" mb={1}>
          Small Mobile (&lt; 375px)
        </Typography>
        <Chip value="Responsive" status="in-progress" />
      </Box>
    </Box>
  </Box>
);

ChipShowcase.parameters = {
  docs: {
    description: {
      story: 'A showcase of various chip configurations and styles.',
    },
  },
};