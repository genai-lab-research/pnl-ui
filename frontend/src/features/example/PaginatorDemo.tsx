import React, { useState } from 'react';
import { Paginator } from '../../shared/components/ui/Paginator';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`;

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  color: #333;
`;

const Content = styled.div`
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const PaginatorDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5;

  return (
    <Container>
      <Title>Paginator Component Demo</Title>
      <Content>
        <div>
          <p>This is page content for page {currentPage}</p>
          <p>Use the paginator below to navigate between pages.</p>
        </div>
      </Content>
      <Paginator 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
};

export default PaginatorDemo;