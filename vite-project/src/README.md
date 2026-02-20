# Project Structure

## File Organization

```
src/
├── main.ts                      # App initialization and DOM setup
├── types.ts                     # TypeScript interfaces (Album)
├── state.ts                     # Global state management (albums array)
├── utils.ts                     # Helper functions (image loading, audio duration)
└── components/
    ├── albumForm.ts             # Form submission and album creation
    ├── albumGrid.ts             # Grid drag/drop, play/close buttons
    ├── albumSidebar.ts          # Sidebar rendering and drag start
    └── albumModal.ts            # Modal for editing album details
```

## Key Changes from Original

### Before (Single File)
- Everything in one file: ~200 lines
- Hard to maintain and extend
- Unclear dependencies

### After (Modular)
- Separated by responsibility
- Each component has a clear purpose
- Easy to add new features
- Better testability

## Component Responsibilities

### `main.ts`
- Sets up initial HTML structure
- Initializes all components
- Sets up Sortable and Lucide icons

### `state.ts`
- Single source of truth for `albums` array
- Provides CRUD operations: `addAlbum()`, `removeAlbum()`, `updateAlbum()`, `getAlbum()`
- All state modifications go through this module

### `components/albumForm.ts`
- Handles form submission
- Creates new albums with default audio times
- Adds to both state and sidebar

### `components/albumGrid.ts`
- Drag and drop from sidebar to grid
- Play button: previews audio clip
- Close button: removes album from grid slot
- **Note:** Grid removal only removes from UI, not from state

### `components/albumSidebar.ts`
- Renders albums in the sidebar list
- Makes items draggable
- Provides functions to update/remove sidebar items

### `components/albumModal.ts`
- Modal dialog for editing album details
- Edit: artist, album name, song name, times, description
- Updates both state and sidebar display
- Call `showModal(albumIndex)` to open for an album

## How to Add Features

### Example: Add "Edit" button to sidebar items

1. In `albumSidebar.ts`, modify `addAlbumToSidebar()`:
```typescript
const editBtn = document.createElement('button');
editBtn.textContent = 'Edit';
editBtn.addEventListener('click', () => {
    showModal(albumIndex);
});
newItem.appendChild(editBtn);
```

2. Import `showModal` from `albumModal.ts`

### Example: Add "Remove from collection" in sidebar

1. In `albumSidebar.ts`:
```typescript
const removeBtn = document.createElement('button');
removeBtn.addEventListener('click', () => {
    removeAlbum(albumIndex);
    removeAlbumFromSidebar(albumIndex);
    // Also remove from grid if present
});
```

## Build Configuration

Make sure your bundler (Vite, Webpack, etc.) is configured to use `src/main.ts` as the entry point instead of the old single file.
