To implement a high-quality UI with **MUI (Material UI) Grid v2** and a modular structure that Gemini Antigravity can execute, we need to focus on **Component-Driven Development**.

In 2026, the standard is **MUI Grid v2** (imported as `Grid2` or simply `Grid` in v6+). It replaces the old "item/container" prop system with a more intuitive, nested-friendly CSS Grid/Flexbox hybrid.

---

## 🎨 Frontend Architecture: Atomic/Feature-Based

To prevent the frontend from becoming a "spaghetti" of components, we will use a **Feature-Based** structure. This keeps your UI logic close to the business features.

---

## 🤖 Prompt for Gemini Antigravity (Frontend)

Copy this into your Agent Manager to begin the frontend scaffold:

> **Mission:** Build a responsive React/TS frontend using MUI Grid v2 and a scalable feature-based architecture.
> **Project Rules:**
> 1. **MUI Version:** Use MUI v6+ with **Grid v2** (`@mui/material/Grid2`).
> 2. **Responsive Strategy:** Use the `size` prop instead of the legacy `xs/sm/md` props. (e.g., `<Grid size={{ xs: 12, md: 6 }}>`).
> 3. **Theming:** All colors and spacing must come from a centralized `src/theme/theme.ts` using `createTheme`. No hardcoded hex codes.
> 4. **Folder Structure:** Use `src/features/[feature-name]` for page-specific UI and `src/components/common` for shared UI (Buttons, Inputs).
> 5. **Clean Code:** Use the `sx` prop for one-off layout tweaks, but move complex styles to `styled()` components to keep JSX clean.
> 
> 
> **Task 1:** Set up the MUI ThemeProvider and a global `theme.ts` with custom primary/secondary colors.
> **Task 2:** Create a `MainLayout` using MUI `Box` and `Grid` that includes a responsive Sidebar and Header.
> **Task 3:** Create a "Dashboard" feature folder with a responsive grid of "Stat Cards" that reorders based on screen size (1 column on mobile, 3 on desktop).

---

## 🛠️ Phase-by-Phase Implementation Plan

### **Phase 1: The Design System (The Foundation)**

**Goal:** Create a single source of truth for the UI's "look and feel."

* **Task 1.1:** Initialize the theme in `src/theme/`. Define the palette, typography, and default component overrides (e.g., making all Buttons `variant="contained"` by default).
* **Task 1.2:** Wrap the root application in `<ThemeProvider theme={theme}>` and include `<CssBaseline />` for consistent cross-browser resets.

### **Phase 2: Layout & Navigation (The Skeleton)**

**Goal:** Use MUI Grid v2 to create the high-level application shell.

* **Task 2.1:** Build a `ResponsiveLayout.tsx`.
* Use a **Grid container** for the main structure.
* Use `display: { xs: 'none', md: 'block' }` on the sidebar to hide it on mobile.


* **Task 2.2:** Implement a "Burger Menu" Drawer for mobile users.

### **Phase 3: Feature Development (The Content)**

**Goal:** Build actual UI screens using the **Grid v2 `size` prop**.

* **Task 3.1:** Build a "Resource Grid."
* **Logic:** `<Grid container spacing={3}>`.
* **Items:** `<Grid size={{ xs: 12, sm: 6, lg: 4 }}>` for cards.


* **Task 3.2:** Ensure all components are **accessible (WCAG)** by using MUI’s built-in ARIA support and semantic HTML (`component="section"`, `component="nav"`).

---

## 💡 Pro-Tip for 2026: The "Size" Prop

When telling Gemini to write your Grid code, emphasize the modern `size` syntax. It’s cleaner and more type-safe:

```tsx
// Modern MUI Grid v2 Syntax
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 8 }}>
    <MainContent />
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    <Sidebar />
  </Grid>
</Grid>

```

**Would you like me to generate a specific TypeScript interface for your Theme configuration to ensure the agent doesn't break your styling types?**