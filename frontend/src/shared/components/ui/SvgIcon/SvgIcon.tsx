import React from 'react';

interface SvgIconProps {
  path?: string;
  id: string;
  width?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  onClick?: () => void;
}

const SvgIcon: React.FC<SvgIconProps> = ({ 
  path, 
  id,
  width = 24, 
  color = 'currentColor', 
  className = '', 
  style = {},
  alt = 'Icon',
  onClick,
  ...props 
}) => {
  const iconStyle: React.CSSProperties = {
    width: width,
    fill: color,
    display: 'inline-block',
    verticalAlign: 'middle',
    ...style
  };

  return (
    <img
      id={id}
      src={path}
      alt={alt}
      style={iconStyle}
      className={className}
      onClick={onClick}
      {...props}
    />
  );
};

export default SvgIcon;
