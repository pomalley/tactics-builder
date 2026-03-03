# 5PFH Tactics Army Builder

A lightweight web application for building armies for **Five Parsecs From Home: Tactics**.

**Live Version:** [pomalley.github.io/tactics-builder/](https://pomalley.github.io/tactics-builder/)

> [!NOTE]
> This is vibe-coded, mostly with Antigravity and Gemini CLI. I did (and do) personally review all the code, though.

> [!TIP]
> Requests, bugs, and so on go in the [issue tracker](https://github.com/pomalley/tactics-builder/issues).

## Usage

Hopefully the UI is self-explanatory: add units and change their equipment with the buttons and dropdowns. A couple points worth noting:

- Data is stored in your browser storage. There are no plans for a backend.
- "Free edit mode" allows adding any item or effect to any model or unit, but changing unit options after will override edits without warning.
- Models, units, and the army can be renamed by just clicking on the name.

Unit and vehicle options are from the _5PFH: Tactics_ army builder and vehicles sections of the rulebook. Not yet included are creatures and anything from the expansion.

## Tech Stack

- **Framework:** [Vue 3](https://vuejs.org/) (Composition API)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Hosting:** GitHub Pages (via GitHub Actions)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```
