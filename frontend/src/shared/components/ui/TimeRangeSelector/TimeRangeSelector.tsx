import React from 'react';
import { TimeRangeSelectorProps, TimeRange } from './types';
import {
  Container,
  Option,
  StateLayer,
  TabContents,
  Label
} from './TimeRangeSelector.styles';

const TIME_RANGES: TimeRange[] = ['Week', 'Month', 'Quarter', 'Year'];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onRangeChange,
  className
}) => {
  return (
    <Container className={className}>
      {TIME_RANGES.map((range) => (
        <Option 
          key={range}
          isSelected={selectedRange === range}
          onClick={() => onRangeChange(range)}
        >
          <StateLayer>
            <TabContents>
              <Label isSelected={selectedRange === range}>{range}</Label>
            </TabContents>
          </StateLayer>
        </Option>
      ))}
    </Container>
  );
};

export default TimeRangeSelector;