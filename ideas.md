# Fable5 Pro - Design & Architecture

## Design Philosophy: Modern AI Studio

**Aesthetic:** Premium AI workspace with sophisticated dark mode, golden accents, and fluid interactions. Inspired by professional creative tools (Figma, Adobe) combined with cutting-edge AI aesthetics.

**Core Principles:**
1. **Clarity Through Hierarchy** - Visual weight guides attention to primary actions (chat input, image generation results)
2. **Fluid State Transitions** - Smooth animations between loading, processing, and result states
3. **Contextual Information Density** - Show only relevant controls; hide complexity until needed
4. **Accessible Power** - Advanced features discoverable but not overwhelming for new users

## Color Philosophy

- **Primary Dark:** `oklch(0.141 0.005 285.823)` - Deep navy-black background
- **Accent Gold:** `oklch(0.7 0.15 70)` - Warm golden accent for highlights and CTAs
- **Secondary Purple:** `oklch(0.5 0.15 280)` - Subtle purple for secondary actions
- **Text Light:** `oklch(0.95 0.002 0)` - Near-white for maximum readability

**Emotional Intent:** Sophisticated, trustworthy, creative—like a high-end design studio powered by AI.

## Layout Paradigm

**Sidebar + Main Chat Layout:**
- Left sidebar (280px): Conversation history, model selector, settings
- Main area: Chat interface with message history
- Right panel (collapsible): Image editor/gallery for image-to-image operations

**Asymmetric sections:** Hero with gradient, feature cards with varying heights, staggered image gallery.

## Signature Elements

1. **Gradient Dividers** - Smooth transitions between sections using animated SVG waves
2. **Floating Action Buttons** - Image upload/generation triggers with hover glow effects
3. **Message Bubbles** - User messages in subtle purple, AI responses in dark card with golden border accent
4. **Loading States** - Animated dots with staggered timing, never static spinners

## Interaction Philosophy

- **Hover States:** Subtle lift effect (shadow increase) + color shift on interactive elements
- **Click Feedback:** Micro-scale (0.97) + instant visual confirmation
- **Transitions:** 150-250ms cubic-bezier(0.23, 1, 0.32, 1) for UI state changes
- **Image Operations:** Real-time preview with before/after slider on hover

## Animation Guidelines

- Message entrance: Fade + slide-up (200ms)
- Image generation: Pulse effect on generation button, smooth fade-in for results
- Model selector: Smooth scroll with highlight animation
- Typing indicator: Staggered dot bounce (1.4s loop)
- Modal/Dialog: Scale from 0.95 + fade (300ms)

## Typography System

**Font Pairing:**
- Display: `Poppins Bold` (700) - Headlines, model names, section titles
- Body: `Inter` (400/500/600) - Chat messages, descriptions, UI labels
- Mono: `JetBrains Mono` (400) - Code snippets, technical details

**Hierarchy:**
- H1: 32px / 700 weight / 1.2 line-height
- H2: 24px / 600 weight / 1.3 line-height
- Body: 15px / 400 weight / 1.6 line-height
- Small: 13px / 500 weight / 1.4 line-height

## Brand Essence

**Positioning:** The creative professional's AI companion—chat, generate, edit, and refine images all in one sophisticated interface.

**Personality:** Intelligent, creative, reliable, modern. Speaks in clear, direct language without corporate jargon.

**Voice Examples:**
- ✅ "Generate an image from your description"
- ✅ "Edit multiple images at once—change colors, add elements, refine details"
- ❌ "Welcome to our platform"
- ❌ "Get started today"

## Brand Logo/Icon

**Concept:** Stylized brain with golden glow, representing AI intelligence. Transparent PNG, bold graphic symbol (no text).

## Signature Brand Color

**Golden Accent:** `oklch(0.7 0.15 70)` - Unmistakably Fable5's premium, creative energy.

## Key Features to Implement

### 1. **Chat Interface** (Existing, Enhanced)
- Multi-model support (Puter AI models)
- Vision capabilities (image analysis)
- Markdown rendering with KaTeX math support
- Conversation history with sidebar management

### 2. **Image-to-Image Editor** (NEW)
- **Single Image Editing:**
  - Upload or paste image
  - Describe desired changes (e.g., "change shirt to blue")
  - Real-time preview with before/after slider
  - Download edited image

- **Multi-Image Composition:**
  - Upload 2+ images
  - Describe composition (e.g., "put person from image 1 next to landscape from image 2")
  - AI-powered image merging/compositing
  - Advanced: mask-based editing, selective color changes

### 3. **Image Generation** (Existing, Enhanced)
- Text-to-image with multiple AI models
- Prompt refinement suggestions
- Batch generation support
- Gallery view with metadata

### 4. **Professional UI Polish**
- Dark mode with golden accents
- Smooth loading states
- Error handling with helpful messages
- Responsive design (mobile-first)
- Accessibility (WCAG AA)

## Technical Architecture

**Frontend Stack:**
- React 19 + TypeScript
- Tailwind CSS 4 (OKLCH colors)
- Wouter for routing
- Puter.js SDK for AI/image operations

**Key Integrations:**
- `puter.ai.chat()` - Multi-model chat
- `puter.ai.txt2img()` - Text-to-image generation
- `puter.ai.txt2img()` with `input_images` - Image-to-image editing
- `puter.fs.*` - File storage (if needed)

**State Management:**
- React Context for conversation history
- Local storage for persistence
- Real-time streaming for chat responses

## Development Phases

1. **Phase 1:** Set up professional UI foundation (sidebar, chat layout, dark theme)
2. **Phase 2:** Implement enhanced chat with model selector
3. **Phase 3:** Add image-to-image editing module
4. **Phase 4:** Polish, test, and optimize
