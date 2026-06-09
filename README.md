# SwissKnife

SwissKnife is a desktop utility app built with **Tauri**, **React**, **TypeScript**, and **Tailwind CSS**. It brings together converters, encoders/decoders, formatters, and generators in a modern, responsive interface.

## Key Features

- Convert between different data types:
  - Text case
  - Number bases
  - Units
  - Colors
  - JSON ↔ YAML
  - Dates ↔ Unix timestamp
  - Image conversion
- Encode / Decode:
  - Base64
  - Hex
  - JWT
  - URL
- Formatters:
  - JSON
  - XML
  - SQL
  - Text inspector
- Generators:
  - Passwords
  - UUIDs
  - Lorem Ipsum
  - Emails
  - Hashes

## Tech Stack

- **Tauri v2**
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Rust** (Tauri backend)

## Requirements

- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/)

## Usage

```bash
# Install dependencies
bun install

# Start in development mode
bun run tauri:dev
```

Alternatively, to run only the web UI with Vite:

```bash
bun run dev
```

## Production Build

```bash
bun run tauri:build
```

## Project Structure

- `src/` – React application source
  - `components/` – UI components and app layout
  - `screens/` – main app screens
  - `pages/` – route-connected page wrappers
  - `lib/` – utilities and helper functions
- `src-tauri/` – Tauri configuration and Rust backend

## Useful Scripts

- `bun run dev` — run Vite in development mode
- `bun run build` — compile TypeScript and build Vite production files
- `bun run preview` — preview the Vite build
- `bun run tauri:dev` — run the Tauri app in development mode
- `bun run tauri:build` — build the desktop app for production
- `bun run lint` — run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Open a pull request

## License

MIT
