# RNext Server

## Overview

**RNext Server** is an Express-based server that serves two different applications:

1. **Next.js Application** (Primary App)
2. **Standalone React App** (CMS/Admin Panel under `/rnext-admin` route)

The server handles both applications seamlessly, ensuring proper routing and static file serving for the standalone React app.

---

## Features

- **Primary App**: Serves the Next.js app for all routes except `/rnext-admin`.
- **CMS/Admin Panel**: Serves the standalone React app (built with Vite) under `/rnext-admin` and its assets (CSS, JS, images, etc.).
- **Static File Handling**: Efficiently serves static files like `index.html`, `vite.svg`, and assets for the React app.

---

## File Structure

```
dist/
├── index.js         # RNext Server entry point
└── cms-build/       # Standalone React app build
    ├── index.html
    ├── assets/
    │   ├── *.js
    │   └── *.css
    └── vite.svg
```

---

## Usage

1. Build your standalone React app and place the output in `cms-build`.
2. Start the server:
   ```bash
   node dist/index.js
   ```
3. Access the applications:
    - Next.js App: `http://localhost:3000`
    - CMS/Admin Panel: `http://localhost:3000/rnext-admin`

---

## Requirements

- Node.js
- Express
- Next.js