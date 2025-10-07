# Component Library Documentation

## Overview

Cxperia uses a comprehensive component library built on top of Radix UI primitives and styled with Tailwind CSS. All components are TypeScript-first and follow accessibility best practices.

## Component Categories

### 🎨 UI Components (`/components/ui/`)
Base UI components built on Radix UI:

- **Button** - Various button styles and states
- **Input** - Form input components
- **Modal** - Dialog and modal components
- **Dropdown** - Dropdown menus and selects
- **Card** - Content containers
- **Skeleton** - Loading placeholders
- **Toast** - Notification system
- **Tooltip** - Contextual help
- **Sheet** - Side panels and drawers

### 🧩 Feature Components
Feature-specific components:

- **TutorialCard** - Tutorial display cards
- **ExperienceCard** - Experience preview cards
- **QRCodeGenerator** - QR code generation
- **BrandColorPicker** - Color selection interface
- **FeatureSlider** - Feature showcase slider
- **NavigationProgress** - Loading progress indicator

### 📱 Layout Components
Layout and navigation components:

- **SectionNavigation** - Experience section navigation
- **CurvedBottomNav** - Mobile bottom navigation
- **MobileBottomNavbar** - Mobile navigation bar
- **SidebarLayout** - Dashboard sidebar
- **HeaderBold/HeaderLight** - Experience headers

## Component Usage

### Basic Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="lg">
  Click me
</Button>
```

### Modal Component

```tsx
import { Modal } from '@/components/ui/modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

### Tutorial Card

```tsx
import { TutorialCard } from '@/components/TutorialCard';

<TutorialCard
  tutorial={tutorial}
  brandLogo={brandLogo}
  brandName={brandName}
  onCardClick={handleCardClick}
/>
```

## Component Props

### Button Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### Modal Props

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  disabled?: boolean;
}
```

### TutorialCard Props

```typescript
interface TutorialCardProps {
  tutorial: Tutorial;
  brandLogo?: string;
  brandName?: string;
  onCardClick: (tutorial: Tutorial) => void;
}
```

## Styling Guidelines

### Tailwind CSS Classes

Components use Tailwind CSS for styling:

```tsx
// Primary button
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
  Primary Button
</button>

// Card component
<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  Card Content
</div>
```

### Responsive Design

All components are mobile-first and responsive:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

### Dark Mode Support

Components support dark mode:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Dark mode content
</div>
```

## Accessibility

All components follow WCAG 2.1 guidelines:

### Keyboard Navigation

```tsx
// Focusable elements
<button
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
  tabIndex={0}
>
  Accessible Button
</button>
```

### Screen Reader Support

```tsx
// ARIA labels
<button aria-label="Close modal">
  <X className="w-4 h-4" />
</button>

// ARIA descriptions
<div role="dialog" aria-describedby="modal-description">
  <p id="modal-description">Modal content</p>
</div>
```

## Animation and Transitions

Components use Framer Motion for animations:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

## State Management

Components integrate with Zustand stores:

```tsx
import { useExperienceStore } from '@/store/brands/useExperienceStore';

const MyComponent = () => {
  const { experience, updateExperience } = useExperienceStore();
  
  return (
    <div>
      {experience?.name}
    </div>
  );
};
```

## Testing Components

### Unit Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('button handles click', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Storybook Stories

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};
```

## Customization

### Theme Customization

Components can be customized through CSS variables:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --border-radius: 0.5rem;
}
```

### Component Variants

Use class-variance-authority for component variants:

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

## Performance Optimization

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <HeavyComponent />
  </Suspense>
);
```

### Memoization

```tsx
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering logic
  return <div>{data}</div>;
});
```

## Best Practices

1. **Always use TypeScript** for component props
2. **Follow accessibility guidelines** (WCAG 2.1)
3. **Use semantic HTML** elements
4. **Implement proper error boundaries**
5. **Test components thoroughly**
6. **Document component APIs**
7. **Use consistent naming conventions**
8. **Optimize for performance**

## Component Examples

### Complete Tutorial Card

```tsx
import { TutorialCard } from '@/components/TutorialCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TutorialCardProps {
  tutorial: Tutorial;
  isLoading?: boolean;
  onCardClick: (tutorial: Tutorial) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  isLoading = false,
  onCardClick,
}) => {
  if (isLoading) {
    return <TutorialCardSkeleton />;
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onCardClick(tutorial)}
    >
      {/* Card content */}
    </div>
  );
};
```

### Responsive Modal

```tsx
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export const ResponsiveModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        {children}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary">
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
```

## Support

For component-related questions:

- **Storybook**: Interactive component documentation
- **GitHub Issues**: [Component Issues](https://github.com/your-org/cxperia/issues)
- **Email**: components@cxperia.com
