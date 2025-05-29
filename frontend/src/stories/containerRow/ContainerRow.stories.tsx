import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import ContainerRow from '../../shared/components/ui/ContainerRow';

export default {
  title: 'Components/ContainerRow',
  component: ContainerRow,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <Story />
          </TableBody>
        </Table>
      </TableContainer>
    ),
  ],
} as Meta<typeof ContainerRow>;

const Template: StoryFn<typeof ContainerRow> = (args) => <ContainerRow {...args} />;

export const VirtualFarm = Template.bind({});
VirtualFarm.args = {
  data: {
    isVirtualFarm: true,
    name: 'virtual-farm-04',
    environments: ['PROD', 'DEV'],
    tenant: 'tenant-123',
    purpose: 'Development',
    location: 'Agriville, USA',
    status: 'Connected',
    created: '30/01/2025',
    modified: '30/01/2025',
    hasAlerts: true,
  },
};

export const RegularContainer = Template.bind({});
RegularContainer.args = {
  data: {
    isVirtualFarm: false,
    name: 'container-123',
    environments: ['PROD'],
    tenant: 'tenant-456',
    purpose: 'Production',
    location: 'Farmington, USA',
    status: 'Connected',
    created: '15/01/2025',
    modified: '20/01/2025',
    hasAlerts: false,
  },
};

export const Maintenance = Template.bind({});
Maintenance.args = {
  data: {
    isVirtualFarm: true,
    name: 'virtual-farm-05',
    environments: ['DEV'],
    tenant: 'tenant-789',
    purpose: 'Research',
    location: 'Techville, Canada',
    status: 'Maintenance',
    created: '10/01/2025',
    modified: '25/01/2025',
    hasAlerts: true,
  },
};

export const Inactive = Template.bind({});
Inactive.args = {
  data: {
    isVirtualFarm: false,
    name: 'container-456',
    environments: ['PROD', 'DEV'],
    tenant: 'tenant-101',
    purpose: 'Development',
    location: 'Silicon Valley, USA',
    status: 'Inactive',
    created: '01/01/2025',
    modified: '01/01/2025',
    hasAlerts: false,
  },
};

export const Striped = Template.bind({});
Striped.args = {
  data: {
    isVirtualFarm: true,
    name: 'virtual-farm-06',
    environments: ['PROD'],
    tenant: 'tenant-202',
    purpose: 'Production',
    location: 'Seattle, USA',
    status: 'Connected',
    created: '05/01/2025',
    modified: '15/01/2025',
    hasAlerts: false,
  },
  isStriped: true,
};