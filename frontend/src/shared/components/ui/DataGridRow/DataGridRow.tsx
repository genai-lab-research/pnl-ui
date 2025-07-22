import React from 'react';
import { DataGridRowProps } from './types';
import DataGridCell from './DataGridCell';
import {
  RowContainer,
  GenerationBlock,
  CropNameContainer,
  GenerationContainer,
  StandardContainer,
  Chip,
  CropNameText,
  StandardText,
  ChipText
} from './DataGridRow.styles';

const DataGridRow: React.FC<DataGridRowProps> = ({
  cropName,
  generation,
  cycles,
  seedingDate,
  harvestDate,
  inspectionDate,
  beds,
  status
}) => {
  return (
    <RowContainer>
      <GenerationBlock>
        <DataGridCell grow>
          <CropNameContainer>
            <CropNameText>{cropName}</CropNameText>
          </CropNameContainer>
        </DataGridCell>
        
        <DataGridCell>
          <GenerationContainer>
            <StandardText>{generation}</StandardText>
          </GenerationContainer>
        </DataGridCell>
        
        <DataGridCell>
          <StandardContainer>
            <StandardText>{cycles}</StandardText>
          </StandardContainer>
        </DataGridCell>
        
        <DataGridCell>
          <StandardContainer>
            <StandardText>{seedingDate}</StandardText>
          </StandardContainer>
        </DataGridCell>
        
        <DataGridCell>
          <StandardContainer>
            <StandardText>{harvestDate}</StandardText>
          </StandardContainer>
        </DataGridCell>
        
        <DataGridCell>
          <StandardContainer>
            <StandardText>{inspectionDate}</StandardText>
          </StandardContainer>
        </DataGridCell>
        
        <DataGridCell>
          <StandardContainer>
            <StandardText>{beds}</StandardText>
          </StandardContainer>
        </DataGridCell>
        
        <DataGridCell>
          <StandardContainer>
            <Chip>
              <ChipText>{status.count}</ChipText>
            </Chip>
          </StandardContainer>
        </DataGridCell>
      </GenerationBlock>
    </RowContainer>
  );
};

export default DataGridRow;