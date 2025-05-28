import React, { useState } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, IconButton } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { SearchInputContainer } from '../../shared/components/ui/Container';

const meta = {
  title: 'Container/SearchInputContainer',
  component: SearchInputContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInputContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search containers...',
  },
};

export const WithFilterButton: Story = {
  args: {
    placeholder: 'Search containers...',
    children: (
      <IconButton color="primary" aria-label="filter">
        <FilterListIcon />
      </IconButton>
    ),
  },
};

export const WithMultipleActions: Story = {
  args: {
    placeholder: 'Search containers...',
    children: (
      <>
        <IconButton color="primary" aria-label="filter">
          <FilterListIcon />
        </IconButton>
        <Button variant="outlined" size="small">
          Clear
        </Button>
      </>
    ),
  },
};

// Interactive example with state management
export const Interactive = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const handleToggleFilter = () => {
    setIsFiltering(!isFiltering);
  };

  const handleClear = () => {
    setSearchValue('');
    setIsFiltering(false);
  };

  return (
    <SearchInputContainer
      placeholder="Search containers..."
      value={searchValue}
      onChange={setSearchValue}
      children={
        <>
          <IconButton
            color={isFiltering ? 'secondary' : 'primary'}
            aria-label="filter"
            onClick={handleToggleFilter}
          >
            <FilterListIcon />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClear}
            disabled={!searchValue && !isFiltering}
          >
            Clear
          </Button>
        </>
      }
    />
  );
};
