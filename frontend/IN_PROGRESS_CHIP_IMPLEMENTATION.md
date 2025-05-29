# Active Chip Component Implementation

## Component Details
This document describes the implementation of the Active Chip component based on the specifications in `component_429-15078.json`.

## Design Specifications
- **Component Name:** Vertical Farming Control Panel (Copy)
- **Type:** Chip
- **Background Color:** #479F67 (Green)
- **Text Color:** #FAFAFA (White)
- **Font:** Inter SemiBold, 12px
- **Line Height:** 16px (110.17% of font size)
- **Text Content:** "Active"
- **Border Radius:** 12px (based on the existing chip implementation)

## Implementation
The component has been implemented using the existing Chip component in the codebase. The existing implementation already includes all necessary styling for the active state, including:

- Correct background color (#479F67)
- Correct text color (#FAFAFA)
- Proper font family, size and weight
- Proper line height
- Hover, focus, and disabled states
- Responsive behavior for different screen sizes

## Usage

```tsx
// Basic usage
<Chip value="Active" status="active" />

// For medium size
<Chip value="Active" status="active" size="medium" />

// Outlined variant
<Chip value="Active" status="active" variant="outlined" />

// Disabled state
<Chip value="Active" status="active" disabled />
```

## Storybook
A dedicated Storybook story has been created to showcase this specific component:
- Location: `src/stories/chip/ActiveChip.stories.tsx`
- Stories:
  - `ActiveChipFromJson`: Exact implementation matching the JSON
  - `ActiveChipShowcase`: Various examples in different contexts

## Example Component
An example component demonstrating the Active Chip has been implemented:
- Location: `src/examples/ChipExample.tsx`

## Verification
The component has been checked against the specifications in the JSON and image:
- ✅ Background color matches (#479F67)
- ✅ Text color matches (#FAFAFA)
- ✅ Font family and weight match (Inter SemiBold)
- ✅ Font size and line height match (12px/16px)
- ✅ Text content matches ("Active")
- ✅ Component is responsive