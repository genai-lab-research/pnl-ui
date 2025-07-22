import React from 'react';
import { styled } from '@mui/material/styles';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownContent = styled('div')({
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    marginTop: '16px',
    marginBottom: '8px',
    fontWeight: 600,
  },
  '& h1': {
    fontSize: '24px',
  },
  '& h2': {
    fontSize: '20px',
  },
  '& h3': {
    fontSize: '18px',
  },
  '& p': {
    marginBottom: '12px',
    lineHeight: '1.6',
  },
  '& ul, & ol': {
    marginBottom: '12px',
    paddingLeft: '20px',
  },
  '& li': {
    marginBottom: '4px',
  },
  '& code': {
    backgroundColor: '#f5f5f5',
    padding: '2px 4px',
    borderRadius: '3px',
    fontSize: '13px',
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    borderRadius: '6px',
    overflow: 'auto',
    marginBottom: '12px',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& blockquote': {
    borderLeft: '4px solid #e0e0e0',
    paddingLeft: '16px',
    marginLeft: '0',
    marginBottom: '12px',
    fontStyle: 'italic',
  },
  '& strong': {
    fontWeight: 600,
  },
  '& em': {
    fontStyle: 'italic',
  },
});

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple markdown renderer for basic formatting
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <MarkdownContent
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};