import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

export interface GrowthStageImageProps {
  /**
   * Source URL of the image to display
   */
  imageSrc: string;
  /**
   * Age of the plant in days (d) or other unit
   */
  age?: string;
  /**
   * Width of the component
   */
  width?: number | string;
  /**
   * Height of the component
   */
  height?: number | string;
  /**
   * Optional border radius override
   */
  borderRadius?: number | string;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Alternative text for the image
   */
  alt?: string;
  /**
   * Optional callback for when the image is clicked
   */
  onClick?: () => void;
}

/**
 * GrowthStageImage component displays a plant growth image with an age indicator overlay.
 * 
 * The component shows a square image of a plant/seedling at a specific growth stage,
 * with an optional semi-transparent age indicator in the bottom-left corner.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <GrowthStageImage 
 *   imageSrc="/images/seedling.jpg" 
 *   age="15d" 
 * />
 * 
 * // With custom dimensions
 * <GrowthStageImage 
 *   imageSrc="/images/seedling.jpg" 
 *   age="15d" 
 *   width={200}
 *   height={200}
 * />
 * ```
 */
export const GrowthStageImage: React.FC<GrowthStageImageProps> = ({
  imageSrc,
  age = '',
  width = 100,
  height = 100,
  borderRadius = 4,
  className,
  alt = 'Plant growth stage image',
  onClick,
}) => {
  return (
    <Paper
      sx={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
        overflow: 'hidden',
        boxShadow: 1,
        cursor: onClick ? 'pointer' : 'default',
      }}
      className={className}
      onClick={onClick}
    >
      {/* Main Image */}
      <Box
        component="img"
        src={imageSrc}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      
      {/* Age indicator overlay */}
      {age && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '4px 8px',
            borderTopRightRadius: 4,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '16px',
            }}
          >
            {age}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default GrowthStageImage;