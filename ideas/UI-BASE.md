For an admin portal in 2026, the key is a **Responsive Hybrid Shell**. This means the navigation adapts automatically: it's a fixed sidebar on desktop, a "mini" rail on tablets, and a hidden hamburger menu on mobile.

By using **MUI v6** and **Grid v2**, you get a much cleaner syntax for these shifts.

---

## 🤖 Prompt for Gemini Antigravity (Admin Dashboard)

Copy this into your agent to build the responsive framework:

> **Mission:** Build a mobile-first Admin Dashboard using MUI v6 and Grid v2.
> **Layout Requirements:**
> 1. **Hybrid Sidebar:** >    - **Mobile:** `temporary` variant (hidden, toggles via FAB or Burger menu).
> * **Tablet (sm/md):** `mini-variant` (icons only to save space).
> * **Desktop (lg+):** `permanent` variant (full labels and width).
> 
> 
> 2. **Responsive Grid:** Use the `size` prop to ensure dashboard cards are 1-column on mobile, 2-column on tablet, and 3/4-column on desktop.
> 3. **Theming:** Enable **Dark Mode** support by default in the theme config using CSS variables (`colorScheme`).
> 4. **Components:** Use `AppBar`, `Drawer`, and `Main` as the core shell structure. Ensure `Main` content has responsive padding (`p: { xs: 2, md: 4 }`).
> 
> 
> **Task 1:** Implement a `DashboardLayout` component that manages the `mobileOpen` state and uses the `useMediaQuery` hook to switch Drawer variants.
> **Task 2:** Create a "StatsGrid" component using `Grid2` that renders 4 `Card` components with different responsive sizes.
> **Task 3:** Setup the `App.tsx` with `CssBaseline` and a `ThemeProvider` that supports system-preference dark mode.

---

## 🛠️ Implementation Plan: The "Admin-First" Strategy

### **Phase 1: The Adaptive Shell**

**Goal:** Create a layout that doesn't feel "crowded" on a tablet.

* **Task 1.1:** Build `Sidebar.tsx`. Use MUI's `breakpoints.down('md')` to switch between a `persistent` drawer and a `temporary` mobile drawer.
* **Task 1.2:** Implement the **Mini-Variant** logic: On tablet sizes, the sidebar should shrink to 64px width (showing icons only) rather than disappearing.

### **Phase 2: Data-Heavy Components**

**Goal:** Ensure tables and forms work on touch devices.

* **Task 2.1:** Build a **Responsive Data Table**.
* *Tip:* For small screens, use a "Card View" or horizontal scrolling container for tables.


* **Task 2.2:** Use MUI `TextField` with `fullWidth` and `Stack` components for forms, ensuring inputs are large enough for thumb-tapping on tablets.

### **Phase 3: The Dashboard Grid (v2)**

**Goal:** Intelligent content reflow.

* **Task 3.1:** Implement the "Bento Box" layout using Grid v2.
* Example: A large "Revenue Chart" card that takes `size={{ xs: 12, lg: 8 }}` and a smaller "Recent Activity" card that takes `size={{ xs: 12, lg: 4 }}`.



---

## 📏 Breakpoint Cheat Sheet for your Agent

Tell the agent to follow these specific 2026 MUI breakpoints for your dashboard:

| Device | Breakpoint | Layout Behavior |
| --- | --- | --- |
| **Mobile** | `xs` (< 600px) | Drawer: Hidden; Grid: 1 column; Padding: 8px |
| **Small Tablet** | `sm` (600px+) | Drawer: Mini-Rail; Grid: 2 columns; Padding: 16px |
| **Large Tablet** | `md` (900px+) | Drawer: Mini-Rail; Grid: 2 columns; Padding: 24px |
| **Desktop** | `lg` (1200px+) | Drawer: Permanent; Grid: 3-4 columns; Padding: 32px |

**Would you like me to generate the specific TypeScript theme override that enables the "Mini-Variant" sidebar transition?**
