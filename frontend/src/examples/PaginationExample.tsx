import React, { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Pagination } from '../shared/components/ui';

const PaginationExample: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // In a real application, this would trigger data fetching for the new page
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pagination Example
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="body1" paragraph>
            This is an example of the Pagination component. The current page is {currentPage} of {totalPages}.
          </Typography>
          <Typography variant="body2" paragraph>
            Click the Previous or Next buttons to navigate through the pages.
          </Typography>
          
          {/* Display some mock content based on current page */}
          <Box 
            sx={{ 
              p: 3, 
              my: 2, 
              height: '200px', 
              border: '1px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h5">
              Content for Page {currentPage}
            </Typography>
          </Box>
          
          {/* Default pagination */}
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Full Width Pagination
          </Typography>
          <Box sx={{ my: 2, width: '100%', border: '1px dashed #ccc', p: 2 }}>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              fullWidth
            />
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Custom Label Pagination
          </Typography>
          <Box sx={{ my: 2 }}>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showingText="Page"
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PaginationExample;