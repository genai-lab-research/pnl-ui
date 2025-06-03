# Page 3 Components

## FooterContainer

A container component for page footer actions, typically used for form or dialog actions.

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| primaryActionLabel | string | - | Primary action button label. If not provided, the primary button will not be shown |
| secondaryActionLabel | string | - | Secondary action button label (usually "Close" or "Cancel"). If not provided, the secondary button will not be shown |
| onPrimaryAction | () => void | - | Handler for the primary action button |
| onSecondaryAction | () => void | - | Handler for the secondary action button |
| primaryActionDisabled | boolean | false | If true, the primary action button will be disabled |
| secondaryActionDisabled | boolean | false | If true, the secondary action button will be disabled |
| children | React.ReactNode | - | Additional content to display in the footer container |
| ...BoxProps | - | - | All other props are passed to the underlying Box component |

### Usage Example

```tsx
import { FooterContainer } from '../shared/components/ui/FooterContainer';

// Basic usage
<FooterContainer
  primaryActionLabel="Provision & Print ID"
  secondaryActionLabel="Close"
  onPrimaryAction={() => console.log('Provision action')}
  onSecondaryAction={() => console.log('Close action')}
/>

// With disabled primary action
<FooterContainer
  primaryActionLabel="Provision & Print ID"
  secondaryActionLabel="Close"
  onPrimaryAction={() => console.log('Provision action')}
  onSecondaryAction={() => console.log('Close action')}
  primaryActionDisabled={true}
/>

// With additional content
<FooterContainer
  primaryActionLabel="Provision & Print ID"
  secondaryActionLabel="Close"
  onPrimaryAction={() => console.log('Provision action')}
  onSecondaryAction={() => console.log('Close action')}
>
  <div>Additional information can be displayed here</div>
</FooterContainer>
```

### Features

- Clean, modern Material UI design
- Flexible layout with primary and secondary actions
- Optional additional content area
- Support for disabled states
- Responsive layout that adapts to different widths
- Pixel-perfect match to design specifications
- Box shadow for subtle elevation
- Consistent button styling with the rest of the application

## TrayChart

A compact line chart component for displaying trend data with minimal visual elements.

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| title | string | - | The title of the chart |
| subtitle | string | 'h, accum' | Optional subtitle or description of the data |
| data | Array<[number, number]> | - | The data points for the chart [x, y] |
| xStart | number | 0 | Start value for x-axis |
| xEnd | number | - | End value for x-axis (defaults to max x value in data) |
| width | number \| string | '100%' | The width of the chart |
| height | number \| string | 40 | The height of the chart |
| className | string | - | Optional CSS class name |

### Usage Example

```tsx
import { TrayChart } from '../shared/components/ui/TrayChart';

// Sample data for light accumulation
const lightData = [
  [0, 0],
  [50, 40],
  [100, 80],
  [150, 120],
  [200, 160],
  [250, 220],
  [270, 270],
];

// Basic usage
<TrayChart 
  title="Light" 
  subtitle="h, accum" 
  data={lightData} 
  width="100%" 
  height={40}
  xStart={0}
  xEnd={270}
/>

// With custom dimensions
<TrayChart 
  title="Light" 
  subtitle="h, accum" 
  data={lightData} 
  width={300} 
  height={50}
  xStart={0}
  xEnd={270}
/>
```

### Features

- Minimalist design with focus on the data trend
- Displays start and end values
- Supports hover interaction for detailed values
- Customizable width and height
- Responsive layout
- Compatible with Material UI theme

## TrayValue

A compact component for displaying small numerical values in a pill-shaped container.

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| value | number \| string | - | The numerical value to display |
| backgroundColor | string | '#FFFFFF' | Background color of the component |
| textColor | string | '#000000' | Text color of the component |
| width | number \| string | 'auto' | Width of the component |
| height | number \| string | 20 | Height of the component |
| className | string | - | Optional CSS class name |

### Usage Example

```tsx
import { TrayValue } from '../shared/components/ui/TrayValue';

// Basic usage
<TrayValue value={0.0004} />

// With custom colors
<TrayValue 
  value={0.0004} 
  backgroundColor="#F0F8FF" 
  textColor="#0066CC" 
/>

// With custom dimensions
<TrayValue 
  value={0.0004} 
  width={60} 
  height={24}
/>

// Negative value with red text
<TrayValue 
  value={-0.0004} 
  textColor="#FF0000"
/>

// Long value that gets truncated
<TrayValue 
  value={0.00042387}
  width={60}
/>
```

### Features

- Pixel-perfect match to design specifications
- Compact and lightweight component
- Customizable colors and dimensions
- Handles overflow with ellipsis
- Compatible with Material UI theme
- Clean, minimalist appearance with subtle shadow and border

## EnvironmentDashboard

A comprehensive dashboard component for displaying environmental metrics in a vertical farming control panel.

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| className | string | - | Optional CSS class name for additional styling |
| width | number \| string | '100%' | Optional width of the component |
| height | number \| string | 'auto' | Optional height of the component |
| areaData | Array<[number, number]> | (sample data) | Data for Area chart (m²) |
| lightData | Array<[number, number]> | (sample data) | Data for Light chart (h, accum) |
| waterData | Array<[number, number]> | (sample data) | Data for Water chart (h, accum) |
| airTempData | Array<[number, number]> | (sample data) | Data for Air temperature chart (°C) |
| humidityData | Array<[number, number]> | (sample data) | Data for Humidity chart (% RH) |
| co2Data | Array<[number, number]> | (sample data) | Data for CO₂ chart (ppm) |
| waterTempData | Array<[number, number]> | (sample data) | Data for Water temperature chart (°C) |
| phData | Array<[number, number]> | (sample data) | Data for pH chart |
| ecData | Array<[number, number]> | (sample data) | Data for EC chart (% mS/cm) |

### Usage Example

```tsx
import { EnvironmentDashboard } from '../shared/components/ui/EnvironmentDashboard';

// Sample data for charts
const areaData = [[0, 0], [50, 0.0006], [100, 0.0009], [150, 0.0010], [200, 0.0011], [250, 0.0012]];
const lightData = [[0, 0], [50, 40], [100, 80], [150, 120], [200, 160], [250, 220], [270, 270]];
const waterData = [[0, 0], [50, 5], [100, 10], [150, 15], [200, 20], [250, 25], [270, 29]];
const airTempData = [[0, 21.0], [50, 21.1], [100, 21.1], [150, 21.0], [200, 21.2], [250, 21.1], [270, 21.2]];

// Basic usage with minimal props (uses default sample data for unspecified metrics)
<EnvironmentDashboard 
  width="400px" 
  areaData={areaData}
  lightData={lightData}
/>

// Complete usage with all metrics specified
<EnvironmentDashboard 
  width="400px"
  areaData={areaData}
  lightData={lightData}
  waterData={waterData}
  airTempData={airTempData}
  humidityData={humidityData}
  co2Data={co2Data}
  waterTempData={waterTempData}
  phData={phData}
  ecData={ecData}
/>
```

### Features

- Comprehensive dashboard for environmental monitoring
- Displays multiple metrics in a compact, organized layout
- Uses TrayChart components for consistent visualization
- Configurable data for each environmental metric
- Responsive design that adapts to different widths
- Pixel-perfect match to design specifications
- Clean, modern Material UI styling
- Properly labeled units for each metric
- Consistent information hierarchy and visual structure

## GrowthStageImage

A component for displaying plant growth stage images with an age indicator overlay.

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| imageSrc | string | - | Source URL of the image to display |
| age | string | '' | Age of the plant in days (d) or other unit |
| width | number \| string | 100 | Width of the component |
| height | number \| string | 100 | Height of the component |
| borderRadius | number \| string | 4 | Border radius of the component |
| className | string | - | Optional CSS class name |
| alt | string | 'Plant growth stage image' | Alternative text for the image |
| onClick | () => void | - | Optional callback for when the image is clicked |

### Usage Example

```tsx
import { GrowthStageImage } from '../shared/components/ui/GrowthStageImage';

// Basic usage
<GrowthStageImage 
  imageSrc="/images/seedling.jpg" 
  age="15d" 
/>

// With custom dimensions
<GrowthStageImage 
  imageSrc="/images/seedling.jpg" 
  age="15d" 
  width={200}
  height={200}
/>

// With rounded corners
<GrowthStageImage 
  imageSrc="/images/seedling.jpg" 
  age="15d" 
  borderRadius={16}
/>

// With click handler
<GrowthStageImage 
  imageSrc="/images/seedling.jpg" 
  age="15d" 
  onClick={() => console.log('Image clicked')}
/>
```

### Features

- Displays plant growth images with a semi-transparent age indicator overlay
- Customizable dimensions and border radius
- Interactive with optional click handler
- Responsive design
- Compatible with Material UI theme
- Clean, modern appearance with subtle shadow

## TimelineControls

A component that provides standard media player controls for timeline navigation including previous, play/pause, next, and repeat buttons.

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| playState | 'playing' \| 'paused' | 'paused' | Current play state |
| onPlayPauseClick | () => void | - | Callback fired when play/pause button is clicked |
| onPreviousClick | () => void | - | Callback fired when previous button is clicked |
| onNextClick | () => void | - | Callback fired when next button is clicked |
| onRepeatClick | () => void | - | Callback fired when repeat button is clicked |
| disabled | boolean | false | If true, will disable all controls |
| className | string | - | Custom class name for additional styling |

### Usage Example

```tsx
import { TimelineControls, PlayState } from '../shared/components/ui/TimelineControls';
import { useState } from 'react';

// With state management
const TimelineExample = () => {
  const [playState, setPlayState] = useState<PlayState>('paused');
  
  const handlePlayPause = () => {
    setPlayState(prevState => prevState === 'playing' ? 'paused' : 'playing');
  };
  
  return (
    <TimelineControls 
      playState={playState}
      onPlayPauseClick={handlePlayPause}
      onPreviousClick={() => console.log('Previous clicked')}
      onNextClick={() => console.log('Next clicked')}
      onRepeatClick={() => console.log('Repeat clicked')}
    />
  );
};

// Disabled state
<TimelineControls 
  playState="paused"
  disabled
/>

// Fixed playing state
<TimelineControls 
  playState="playing"
  onPlayPauseClick={() => console.log('Play/Pause clicked')}
  onPreviousClick={() => console.log('Previous clicked')}
  onNextClick={() => console.log('Next clicked')}
  onRepeatClick={() => console.log('Repeat clicked')}
/>
```

### Features

- Clean, modern Material UI design
- Supports play/pause, previous, next, and repeat actions
- Interactive buttons with proper focus and hover states
- Accessible with keyboard navigation and ARIA attributes
- Pixel-perfect match to design specifications
- Disabled state styling
- Responsive layout

## TimelineComponent

A component that displays a timeline visualization with selectable intervals and labels.

### Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| selectedInterval | number | - | The current selected interval index (0-based) |
| onIntervalClick | (index: number) => void | - | Callback fired when an interval is clicked |
| labels | { start?: string; end?: string; } | { start: '01\nApr', end: '15\nApr' } | Labels to display at the start and end of the timeline |
| intervalCount | number | 12 | Number of intervals to show |
| disabled | boolean | false | If true, will disable all interactions |
| className | string | - | Custom class name for additional styling |

### Usage Example

```tsx
import { TimelineComponent } from '../shared/components/ui/TimelineComponent';
import { useState } from 'react';

// With state management
const TimelineExample = () => {
  const [selectedInterval, setSelectedInterval] = useState<number>(3);
  
  return (
    <TimelineComponent 
      selectedInterval={selectedInterval}
      onIntervalClick={setSelectedInterval}
      labels={{ start: '01\nApr', end: '15\nApr' }}
      intervalCount={12}
    />
  );
};

// Custom interval count
<TimelineComponent 
  selectedInterval={2}
  onIntervalClick={(index) => console.log(`Interval ${index} clicked`)}
  intervalCount={20}
/>

// Custom labels
<TimelineComponent 
  selectedInterval={5}
  labels={{ start: 'Jan', end: 'Dec' }}
  intervalCount={12}
/>

// Disabled state
<TimelineComponent 
  selectedInterval={3}
  intervalCount={10}
  disabled
/>
```

### Features

- Clean, minimalist design for timeline visualization
- Customizable number of intervals
- Interactive interval selection
- Customizable start and end labels
- Supports multiline labels with line breaks
- Visual highlighting of the selected interval
- Accessible with keyboard navigation and ARIA attributes
- Disabled state styling
- Responsive layout
- Compatible with Material UI theme