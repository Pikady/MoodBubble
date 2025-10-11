# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mobile-first emotional wellness app called "情绪泡泡" (Mood Bubble) that allows users to:
- Write emotional notes in 4 categories (goodnight, gratitude, emotion, thought)
- Chat with an AI companion using text or voice input
- View and manage their notes in a grouped card interface
- Experience interactive character animations and emotional feedback

## Development Commands

```bash
# Development
pnpm dev              # Start development server (uses Turbopack)
pnpm build            # Build for production
pnpm start            # Start production server

# Note: No lint/test commands configured yet
```

## Architecture & Key Patterns

### Configuration-Driven Design
The app uses a central configuration pattern in `src/lib/noteConfig.ts` that defines:
- 4 note types with colors, labels, prompts, and ordering
- All UI theming derives from this config
- Changing colors/copy updates the entire app

### Mobile-First Constraints
- ALL touch targets must be 44px minimum (`h-11` class)
- Use safe area utilities: `safe-area-top`, `safe-area-bottom`
- Sticky bottom inputs with `pb-[env(safe-area-inset-bottom)]`
- No actual focus on home input - direct route navigation to avoid keyboard flicker

### Page Flow & Navigation
1. Home (`/`) → Chat (`/chat`) via input click (no real focus)
2. Home右上 button → Note Type Selection (`/notes/new`)
3. Type card → Note Composition (`/notes/new/[type]`)
4. Submit → Loading Animation (`/notes/loading`) → Notes Box (`/notes?highlight={id}`) with highlighted card

### Voice & Audio System
- **Voice Recording**: Press-and-hold voice input with visual feedback
- **AudioLines Component**: Animated recording indicator with customizable styling
- **Real-time Feedback**: Visual recording states and animation transitions
- **Touch-friendly**: Supports both mouse and touch events for mobile

### Animation & Character System
- **Mascot Animations**: Interactive character responses to user actions
- **Loading States**: Multi-phase loading animations (chewing → done → grow horn)
- **Framer Motion**: Smooth transitions and micro-interactions
- **Emotional Feedback**: Character evolves based on user interactions

### Component Architecture
- **AppShell**: Handles safe areas, top navigation, main content area
- **TopBar**: Back button, title, right action buttons
- **NoteComposer**: Sticky bottom input with character count and loading states
- **InputField**: Chat interface with voice recording, text input, and send functionality
- **MessageList**: Chat message display with bubble styling and animations
- **AudioLines**: Voice recording animation component with customizable appearance
- **NoteBox**: Card-based note display with grouping and management features
- All cards use `rounded-2xl shadow-sm p-4` pattern

### Data Layer
- **Supabase**: Auth + RLS-protected data
- **Client reads**: SWR hooks with RLS filtering
- **Writes**: Server Actions only (no direct client mutations)
- **AI**: Edge API route (`/api/ai/chat`) with SSE streaming

### State Management
- SWR for data fetching with automatic revalidation
- Local component state for UI interactions
- Server Actions for all mutations

### Type Safety
- Strict TypeScript with defined NoteType union
- Central type definitions in `src/lib/types.ts`
- Configuration extends base types

## Critical Implementation Details

### Note Type System
```typescript
type NoteType = 'goodnight' | 'gratitude' | 'emotion' | 'thought';
```
Never hardcode these values - always import from types/noteConfig.

### Safe Area Handling
AppShell automatically adds bottom safe area. For sticky inputs:
```tsx
<div className="sticky bottom-0 bg-white border-t">
  <div className="pb-[env(safe-area-inset-bottom)]">
    {/* content */}
  </div>
</div>
```

### Server Actions Pattern
All writes go through Server Actions with proper error handling:
```typescript
export async function createNoteWithAI({ type, content }) {
  // 1. Validate user
  // 2. Insert note
  // 3. Call AI service
  // 4. Update with AI reply
  // 5. Return result
}
```

### Mobile Input Handling
- Home page input: `onClick` → `router.push('/chat')` (no focus)
- Chat/Note inputs: real focus with proper keyboard handling
- Use `useKeyboardSpacer` hook for keyboard avoidance

### Color System
All colors derive from `NOTE_CONFIG[type].color` and `NOTE_CONFIG[type].cardBg`. Never hardcode colors for note-related UI.

### Chat Interface Implementation
Chat bubbles use distinct styling for user vs assistant messages:
```tsx
// User messages (right-aligned, white background)
className="bg-white text-black rounded-br-none"
style={{ boxShadow: "0 4px 20px rgba(92, 95, 95, 0.3)" }}

// Assistant messages (left-aligned, black background)
className="bg-black text-white rounded-bl-none"
style={{ boxShadow: "0 4px 20px rgba(201, 194, 194, 0.73)" }}
```

### Voice Input System
Voice recording uses press-and-hold pattern with visual feedback:
```tsx
onMouseDown={startVoice}
onMouseUp={stopVoice}
onMouseLeave={() => isRecording && stopVoice()}
onTouchStart={(e) => { e.preventDefault(); startVoice(); }}
onTouchEnd={(e) => { e.preventDefault(); stopVoice(); }}
```

### Animation States & Transitions
Loading animations use phased transitions with fade effects:
```tsx
const switchPhase = useCallback((targetPhase: LOADING_PHASE) => {
  setIsVisible(false); // Fade out
  setTimeout(() => {
    setCurLoadingPhase(targetPhase);
    setTimeout(() => {
      setIsVisible(true); // Fade in
    }, 300);
  }, 300);
}, []);
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Current Status

- ✅ Basic project structure and routing
- ✅ Mobile-first layout system
- ✅ Configuration-driven theming
- ✅ Chat interface with text and voice input
- ✅ Voice recording with AudioLines animation component
- ✅ Message bubbles with distinct styling for user/assistant
- ✅ Multi-phase loading animations (chewing → done → grow horn)
- ✅ Character mascot animations and emotional feedback
- ✅ Optimized user authentication with Supabase JWT
- ✅ Async chat history synchronization
- ✅ Chat interface z-index layer fixes
- ✅ Enhanced note submission loading animations
- ⏳ Real OpenAI integration for chat responses
- ⏳ Supabase database schema needs to be created
- ⏳ Real-time voice-to-text processing needed

## File Structure Conventions

- `src/components/` - Reusable UI components
  - `chat/` - Chat interface components (InputField, MessageList)
  - `audiolines/` - Voice recording animation components
  - `notes/` - Note-related components (NoteCard, NoteTypeCard, etc.)
  - `notebox/` - Note display and management components
  - `mascot/` - Character animation components
  - `layout/` - Layout components (AppShell, TopBar)
  - `ui/` - Base UI components (Button, Card, Input, etc.)
- `src/lib/` - Utilities and configurations
- `src/hooks/` - Custom React hooks
- `src/app/actions/` - Server Actions
- `public/images/` - Static assets organized by feature:
  - `chat/` - Chat interface icons and bubbles
  - `mascot/` - Character animations and decorations
- Component files match export names: `NoteCard.tsx` exports `NoteCard`