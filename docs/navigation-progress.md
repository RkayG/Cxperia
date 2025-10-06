# Navigation Progress System

A beautiful, animated progress bar that provides visual feedback during navigation and loading states.

## Features

- 🎨 Beautiful gradient progress bar with shimmer animation
- 🔄 Automatic progress bar on route changes
- 🎛️ Manual control via React hooks
- 📱 Responsive design
- ⚡ Lightweight and performant

## Quick Start

The navigation progress bar is automatically enabled and will show on route changes. No setup required!

## Manual Control

### Using the Context Hook

```tsx
import { useNavigationProgressContext } from '@/contexts/NavigationProgressContext';

function MyComponent() {
  const { startLoading, updateProgress, finishLoading, stopLoading } = useNavigationProgressContext();

  const handleAsyncOperation = async () => {
    startLoading();
    
    // Update progress as needed
    updateProgress(25);
    await someAsyncOperation();
    
    updateProgress(75);
    await anotherAsyncOperation();
    
    finishLoading(); // Auto-hides after completion
  };

  const handleError = () => {
    startLoading();
    updateProgress(50);
    // On error, stop loading immediately
    stopLoading();
  };
}
```

### Using the React Query Integration

```tsx
import { useNavigationProgressWithQuery } from '@/hooks/useNavigationProgressWithQuery';

function MyComponent() {
  const { data, isLoading, error } = useQuery(['myData'], fetchData);
  
  // Automatically shows progress bar based on loading state
  useNavigationProgressWithQuery(isLoading, !!error);
  
  return <div>{/* Your component */}</div>;
}
```

## API Reference

### NavigationProgressContext

| Method | Description |
|--------|-------------|
| `startLoading()` | Start showing the progress bar |
| `updateProgress(progress: number)` | Update progress (0-100) |
| `finishLoading()` | Complete loading and auto-hide |
| `stopLoading()` | Stop loading immediately |

### useNavigationProgressWithQuery

| Parameter | Type | Description |
|-----------|------|-------------|
| `isLoading` | `boolean` | Whether data is currently loading |
| `isError` | `boolean` | Whether there was an error |

## Customization

The progress bar styling can be customized in `components/NavigationProgess.tsx`:

```tsx
// Change colors
style={{
  background: "linear-gradient(90deg, #your-color-1 0%, #your-color-2 50%, #your-color-3 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite",
}}

// Change height
className="fixed top-0 left-0 h-2 ..." // Change h-1 to h-2, h-3, etc.
```

## Examples

### Basic Route Navigation
The progress bar automatically appears when navigating between routes using Next.js `Link` or `router.push()`.

### API Loading States
```tsx
function ProductsPage() {
  const { data, isLoading, error } = useQuery(['products'], fetchProducts);
  
  // Automatically shows progress during loading
  useNavigationProgressWithQuery(isLoading, !!error);
  
  return <div>{/* Your content */}</div>;
}
```

### Manual Progress Control
```tsx
function FileUpload() {
  const { startLoading, updateProgress, finishLoading } = useNavigationProgressContext();

  const handleUpload = async (file: File) => {
    startLoading();
    
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        updateProgress(percentComplete);
      }
    });
    
    xhr.addEventListener('load', () => {
      finishLoading();
    });
    
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };
}
```

## Testing

Visit `/test-navigation` to see the navigation progress bar in action with various scenarios.
