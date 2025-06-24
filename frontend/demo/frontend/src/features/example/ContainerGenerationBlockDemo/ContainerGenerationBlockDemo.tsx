import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { ContainerGenerationBlock } from '../../../shared/components/ContainerGenerationBlock';

/**
 * Demo component showcasing the ContainerGenerationBlock with different states
 */
const ContainerGenerationBlockDemo: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Container Generation Block
      </Typography>
      
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Active Status:
          </Typography>
          <ContainerGenerationBlock
            label="Physical container | Tenant-123 | Development"
            status={{
              label: "Active",
              type: "active"
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Inactive Status:
          </Typography>
          <ContainerGenerationBlock
            label="Physical container | Tenant-123 | Development"
            status={{
              label: "Inactive",
              type: "inactive"
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Error Status:
          </Typography>
          <ContainerGenerationBlock
            label="Physical container | Tenant-123 | Development"
            status={{
              label: "Error",
              type: "error"
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Warning Status:
          </Typography>
          <ContainerGenerationBlock
            label="Physical container | Tenant-123 | Development"
            status={{
              label: "Warning",
              type: "warning"
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Custom Icon:
          </Typography>
          <ContainerGenerationBlock
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6L8 1L14 6V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V6Z" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 14V8H10V14" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Custom icon | Tenant-456 | Production"
            status={{
              label: "Active",
              type: "active"
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default ContainerGenerationBlockDemo;