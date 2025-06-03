import React, { useState } from 'react';
import { TrayGridviewCrops } from '../shared/components/ui/TrayGridviewCrops';
import { Box, Typography, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '600px',
  margin: '0 auto',
}));

const ControlContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ExamplesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const TrayGridviewCropsExample: React.FC = () => {
  const [value, setValue] = useState(75);
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(20);

  const handleValueChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleRowsChange = (_event: Event, newValue: number | number[]) => {
    setRows(newValue as number);
  };

  const handleColumnsChange = (_event: Event, newValue: number | number[]) => {
    setColumns(newValue as number);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Grid Progress Display Example
      </Typography>
      
      <TrayGridviewCrops
        title="SLOT 1"
        value={value}
        rows={rows}
        columns={columns}
        gridSizeText={`${rows}x${columns} Grid`}
        itemCount={Math.round(rows * columns * 0.85)} // Just a sample calculation
        itemLabel="crops"
      />
      
      <ControlContainer>
        <Typography variant="h6" gutterBottom>
          Interactive Controls
        </Typography>
        
        <SliderContainer>
          <Typography id="progress-slider-label">
            Progress Value: {value}%
          </Typography>
          <Slider
            aria-labelledby="progress-slider-label"
            value={value}
            onChange={handleValueChange}
            min={0}
            max={100}
            step={1}
          />
        </SliderContainer>
        
        <SliderContainer>
          <Typography id="rows-slider-label">
            Rows: {rows}
          </Typography>
          <Slider
            aria-labelledby="rows-slider-label"
            value={rows}
            onChange={handleRowsChange}
            min={2}
            max={20}
            step={1}
          />
        </SliderContainer>
        
        <SliderContainer>
          <Typography id="columns-slider-label">
            Columns: {columns}
          </Typography>
          <Slider
            aria-labelledby="columns-slider-label"
            value={columns}
            onChange={handleColumnsChange}
            min={2}
            max={30}
            step={1}
          />
        </SliderContainer>
      </ControlContainer>
      
      <ExamplesContainer>
        <TrayGridviewCrops
          title="LOW"
          value={25}
          rows={10}
          columns={20}
          gridSizeText="10x20 Grid"
          itemCount={170}
          itemLabel="crops"
        />
        
        <TrayGridviewCrops
          title="MEDIUM"
          value={50}
          rows={10}
          columns={20}
          gridSizeText="10x20 Grid"
          itemCount={170}
          itemLabel="crops"
        />
        
        <TrayGridviewCrops
          title="HIGH"
          value={90}
          rows={10}
          columns={20}
          gridSizeText="10x20 Grid"
          itemCount={170}
          itemLabel="crops"
        />
        
        <TrayGridviewCrops
          title="DISABLED"
          value={75}
          rows={10}
          columns={20}
          gridSizeText="10x20 Grid"
          itemCount={170}
          itemLabel="crops"
          disabled
        />
      </ExamplesContainer>
    </Container>
  );
};

export default TrayGridviewCropsExample;
EOL < /dev/null