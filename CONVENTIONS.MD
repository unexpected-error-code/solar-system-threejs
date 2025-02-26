# Naming Conventions for Our TypeScript Solid.js & Three.js Project

## File and Directory Structure

### Files

- **General:**
  - Use **kebab-case** for file names (e.g., `user-profile.tsx`, `three-scene.ts`) to ensure readability and consistency.
  - Name files after their primary export. For example, if the main component is `Button`, the file should be named `Button.tsx`.

### Directories

- **Components:**
  - Place components in a dedicated folder (e.g., `components/`), with subdirectories as needed (e.g., `components/buttons/`).
- **Styles:**
  - Use css modules with a components inside a directory like `components/buttons/`.
- **Pages:**
  - Use a directory like `pages/` for view-level components or routes.
- **Three.js / 3D Scenes:**
  - Use a directory `scene/` for files related to Three.js (e.g., `main-scene.ts`, `orbit-controls.ts`).
- **Utilities, Hooks, and Services:**
  - Organize these in directories like `utils/`, `hooks/`, and `services/` with file names in kebab-case (e.g., `fetch-data.ts`, `use-animation.ts`).

## Code Naming Conventions

### Components (Solid.js)

- **Component Names:**
  - Use PascalCase for component names (e.g., `UserProfile`, `ThreeScene`).
  - Files should match the component name when exporting a single component (e.g., `UserProfile.tsx`).
- **Props and State:**
  - Use camelCase for prop names (e.g., `userName`, `isActive`).
  - Suffix prop type definitions with `Props` (e.g., `UserProfileProps`).

### Three.js Specific

- **Scene, Camera, and Mesh Objects:**
  - Use camelCase for instances (e.g., `mainScene`, `orbitCamera`), and PascalCase for custom classes (e.g., `MainScene`, `OrbitCamera`).
- **Materials, Textures, and Geometries:**
  - Follow a similar pattern: camelCase for instances and PascalCase for custom classes.

### TypeScript Specific

- **Interfaces and Types:**
  - Use PascalCase (e.g., `UserProfile` for interfaces; consider using a suffix like `Props` for component props).
- **Enums:**
  - Use PascalCase for enum names (e.g., `AnimationState`) and UPPERCASE for enum members (e.g., `IDLE`, `RUNNING`).

### Functions, Variables, and Constants

- **Functions:**
  - Use camelCase (e.g., `initializeScene()`, `fetchUserData()`), and consider appending `Async` for async functions.
- **Variables:**
  - Use camelCase for local variables and class properties (e.g., `tempMesh`, `userSettings`).
- **Constants:**
  - Use UPPERCASE with underscores for immutable values (e.g., `DEFAULT_LIGHT_INTENSITY`).

## Solid.js & Three.js Specific

### Solid.js

- **Store Naming:**
  - Name reactive stores in camelCase and optionally use a `$` suffix (e.g., `userStore$`).
- **Signal Variables:**
  - When using `createSignal`, follow the pattern `[value, setValue]` (e.g., `[count, setCount]`).

### Three.js

- **Object Naming:**
  - Use descriptive names for scene objects and controls (e.g., `ambientLight`, `rotateControl`).
- **Custom Classes:**
  - Use PascalCase for classes that extend Three.js objects (e.g., `CustomMesh`, `AdvancedMaterial`).

## Consistency and Readability

- **Avoid Abbreviations:**
  - Prefer full words unless the abbreviation is standard (e.g., `config` vs. `cfg`).
- **Documentation:**
  - Document components, functions, and types using JSDoc or a similar style.
- **Linting and Formatting:**
  - Use ESLint (with TypeScript and Solid.js plugins) and Prettier to enforce these conventions across your project.
