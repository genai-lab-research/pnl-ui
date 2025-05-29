# Container User Header Implementation Plan

## 1. Component Analysis

Based on the JSON data and reference image, this component includes:

- A green circular avatar (person icon with white color)
- A main title text ("Seeded Salanova Cousteau in Nursery")
- A timestamp with icon ("April 13, 2025 - 12:30 PM")
- A user name ("Emily Chen")
- A border on the bottom of the container

## 2. Responsive Breakpoints

We'll use the existing Material UI breakpoints already set up in the project:
- xs: 0px - 599px (mobile)
- sm: 600px - 899px (tablet)
- md: 900px - 1199px (small desktop)
- lg: 1200px - 1535px (large desktop)
- xl: 1536px and above (extra large screens)

## 3. Responsive Implementation Strategy

### Phase 1: Base Component Structure
- Create a `ContainerUserHeader` component using Material UI
- Implement proper flexbox layout with three main sections:
  - Avatar section (left)
  - Text content section (center/expanding)
  - Optional actions section (right, if needed in future)

### Phase 2: Desktop Implementation
- Set proper sizing and spacing between elements
- Implement the green avatar with person icon
- Style the title with proper font size, weight, and color
- Create a metadata row with timestamp and user name
- Add a subtle bottom border

### Phase 3: Responsive Adaptations
- Ensure proper text wrapping for long titles
- Adjust spacing between elements on smaller screens
- Possibly stack metadata elements on very small screens

### Phase 4: Edge Case Handling
- Handle long titles with proper wrapping
- Ensure proper spacing when metadata is long
- Support optional props for customizing the appearance

## 4. Component Props

The component will accept these props:
- `title`: The main title text
- `timestamp`: Date/time string
- `userName`: User name string
- `avatarColor`: Background color for the avatar (default to green)
- `avatarIcon`: Optional custom icon for the avatar
- `className`: Custom CSS class for the container

## 5. Accessibility Considerations
- Ensure proper semantic HTML structure
- Add appropriate aria attributes
- Maintain color contrast ratios
- Support keyboard navigation

## 6. Specific Responsive Adjustments

### Avatar
- Desktop: 40px size
- Tablet: 36px size
- Mobile: 32px size

### Title Text
- Desktop: 14px, medium weight
- Tablet: Same as desktop
- Mobile: Consider 13px for very small screens

### Metadata Text
- Desktop: 12px, regular weight
- Tablet: Same as desktop
- Mobile: Same size, but may adjust layout

## 7. Implementation Approach

We will use Material UI components with Tailwind CSS for styling. The component will leverage:
- Material UI's `Avatar` component for the green circle
- Material UI's `Typography` for text elements
- Flexbox layout for responsive behavior
- Tailwind utility classes for styling and spacing