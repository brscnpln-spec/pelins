# Design Guidelines: Raspberry Pi Touch Display Family App

## Design Approach
**Utility-Focused Design System** optimized for touch interaction on small displays (800x480 to 1024x600). Drawing from Material Design principles for touch feedback and Apple HIG for clarity and simplicity, adapted specifically for kiosk-mode usage on Raspberry Pi hardware.

## Core Design Principles
1. **Touch-First**: Every interactive element optimized for finger interaction
2. **Context-Appropriate**: Child-friendly playfulness for ritual/monster features, adult-friendly clarity for dashboard
3. **Immediate Clarity**: Zero cognitive load - purpose must be instantly clear
4. **Deliberate Simplicity**: No visual noise, every element serves a clear function

---

## Typography

**Font Families** (via Google Fonts CDN):
- Primary: Inter or Poppins (clean, highly legible on screens)
- Display/Headings: Quicksand or Fredoka (friendly, rounded for child-facing screens)

**Type Scale**:
- Base text: 18px (minimum for touch screen readability)
- Secondary text: 16px
- Large body: 20-24px
- Card titles: 28-32px
- Page headings: 36-48px
- Hero/primary headings: 52-64px

**Weights**: Regular (400), Medium (500), Bold (700)

---

## Layout System

**Spacing Primitives** (Tailwind units):
- Primary set: `p-4, p-6, p-8` for consistent component padding
- Gaps: `gap-4, gap-6` for spacing between elements
- Section spacing: `py-8, py-12` for vertical rhythm
- Touch targets: `min-h-16, min-w-16` (64px minimum)

**Grid Structure**:
- Full-screen pages: Single column for Sleep Ritual and Monster Detector
- Dashboard: 2-3 column grid on larger displays (1024x600), single column on smaller (800x480)
- Maximum content width: `max-w-6xl` centered for larger screens

**Landscape Optimization**:
- Horizontal layout prioritized
- Navigation: Bottom tab bar (60px height minimum) or side rail (80px width)
- Content area: Account for navigation space, use remaining viewport

---

## Component Library

### Navigation
**Bottom Tab Bar** (recommended for landscape touch):
- Height: 72px minimum
- 3 tabs: Sleep Ritual | Monster Detector | Dashboard
- Each tab: 60x60px icon with 14px label below
- Active state: Clear visual indicator (not color-dependent)
- Spacing: Evenly distributed across screen width

### Buttons
**Primary Action Buttons**:
- Minimum size: 60px height × 120px width
- Corner radius: 12px (rounded-xl)
- Text: 18-20px, medium weight
- Padding: px-8 py-4
- Full-width on mobile (w-full)

**Step Completion Buttons** (Sleep Ritual):
- Large cards: 200px × 180px minimum on 1024x600
- 160px × 140px on 800x480
- Icon: 48-64px size
- Label: 24px below icon
- Status indicator: Checkmark overlay (32px) when complete

**Scan Button** (Monster Detector):
- Circular: 200px diameter
- Center of screen
- Icon/text: 24px
- Prominent, impossible to miss

### Cards & Containers
**Dashboard Event Cards**:
- Minimum height: 80px
- Padding: p-4
- Border radius: rounded-lg (8px)
- Left border accent (4px) for visual hierarchy
- Time: 16px regular, Event title: 18px medium

**Status Cards** (Home Assistant):
- Compact: 100px × 100px
- Icon: 32px
- Label: 14px
- Value/state: 20px bold

### Progress Indicators
**Sleep Ritual Progress**:
- Bar: 8px height, full width
- Or: Large text indicator "2/3 completed" (24px)
- Position: Bottom of screen above navigation

**Monster Scan Animation**:
- Radar circle: 160px diameter
- Rotating scan line animation (CSS transform)
- Center of screen during scan
- Duration: 3-5 seconds

### Feedback & Animations
**Completion Celebration**:
- Full-screen overlay (z-50)
- Confetti/stars animation (2 seconds)
- Success message: 32-36px
- Auto-dismiss after celebration

**Touch Feedback**:
- Subtle scale transform on press (scale-95)
- No hover states (touch device)
- Clear active/pressed visual state

---

## Page-Specific Layouts

### Sleep Ritual Page
```
┌─────────────────────────────────────┐
│ "Tonight's Sleep Ritual"     Date   │  (Top bar: 60px)
├─────────────────────────────────────┤
│                                     │
│   [Teeth]    [Toilet]   [Pajamas]  │  (3 large cards, horizontal)
│   (card)     (card)      (card)    │  (Each 200×180px with gap-6)
│                                     │
│   ✓ Icon     🚽 Icon     👕 Icon    │
│   Checked    Tap to      Tap to    │
│              complete    complete   │
│                                     │
├─────────────────────────────────────┤
│ Progress: ▓▓▓▓░░░░ 2/3              │  (Progress bar: 40px)
└─────────────────────────────────────┘
│  [Ritual] [Monster] [Dashboard]    │  (Nav: 72px)
└─────────────────────────────────────┘
```

### Monster Detector Page
```
┌─────────────────────────────────────┐
│ "Monster Detector 3000"             │  (Top bar: 60px)
├─────────────────────────────────────┤
│                                     │
│                                     │
│         ┌─────────────┐             │
│         │  👾 START   │             │  (200px circle button)
│         │    SCAN     │             │  (Centered vertically)
│         └─────────────┘             │
│                                     │
│   [Scan animation shown here]       │
│   or "No monsters found! ✓"         │
│                                     │
├─────────────────────────────────────┤
│  [Ritual] [Monster] [Dashboard]    │  (Nav: 72px)
└─────────────────────────────────────┘
```

### Family Dashboard Page
```
┌─────────────────────────────────────────────┐
│ "Good Evening, Family"           Today's Date│  (Header: 60px)
├──────────────────┬──────────────────────────┤
│ Calendar Events  │  Weather & Home          │
│                  │                          │
│ 9:00 Dentist    │  ☁️ 18°C Cloudy          │
│ 14:00 Piano     │  Tomorrow: 16°C          │
│ 18:30 Dinner    │                          │
│                  │  🏠 Home Status          │
│ [3 event cards] │  💡 Room Light: ON       │
│                  │  🌡️ Temperature: 21.5°C  │
│                  │  🪟 Window: Closed       │
│                  │                          │
│                  │  [3 status cards]        │
├──────────────────┴──────────────────────────┤
│  [Ritual] [Monster] [Dashboard]             │  (Nav: 72px)
└─────────────────────────────────────────────┘
```

**Dashboard Responsive**:
- 1024x600: 2-column layout (Calendar 60% | Weather+Home 40%)
- 800x480: Single column, scrollable

---

## Icons
Use **Heroicons** via CDN (outline style for clarity on touch screens):
- Tooth/sparkles for teeth
- Generic icon for toilet
- T-shirt/pajamas for clothing
- Calendar for events
- Cloud/sun for weather
- Light bulb, thermometer, etc. for Home Assistant entities
- Check circle for completed states
- Size: 48px for card icons, 32px for status icons, 24px for navigation

---

## Accessibility & Touch Optimization
- All interactive elements: 60×60px minimum
- Spacing between buttons: 16px minimum to prevent mis-taps
- High contrast ratios (will be defined in color phase)
- No reliance on color alone for states (use icons + text)
- Touch feedback: Immediate visual response (scale/opacity change)
- No hover-dependent interactions
- Focus states for accessibility (keyboard navigation in settings)

---

## Special Considerations

**Child-Facing Screens** (Ritual, Monster):
- Large, friendly typography (Quicksand/Fredoka)
- Positive language in all messaging
- Generous spacing (no cramped layouts)
- Clear visual hierarchy: One primary action per screen
- Success states emphasized with animation and size

**Parent-Facing Screen** (Dashboard):
- Information density over playfulness
- Inter/Poppins for professional clarity
- Efficient use of space for multiple data points
- Scannable layout with clear sections

**Kiosk Mode Optimization**:
- No complex navigation patterns
- All primary functions accessible in 1-2 taps
- Bottom navigation always visible (no collapsing)
- Full-screen layouts (no browser chrome considerations)