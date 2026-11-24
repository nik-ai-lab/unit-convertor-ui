# 🌡️ Unit Converter UI

**Note:** This is a playground project built with the help of AI that is created primarily for experimentation, learning, and exploring ideas. It is not intended to be a open-source project. It is not intended to be used in production environments.

> A modern, cloud-native Single Page Application (SPA) built with **Svelte 5** and **Vite**, designed as an extensible frontend and educational platform playground for the [`unit-convertor-go`](https://github.com/nikfarjam/unit-convertor-go) microservice.

---

## 🚀 Key Features

- **⚡ Real-time Unit Conversion**: Instant bidirectional conversion with automatic formatting and formula hints.
- **🧱 Extensible Multi-Unit Architecture**: Modular registry supporting multiple unit categories (Temperature active; easily extensible to Length, Weight, Volume, etc.).
- **🔄 Standalone Mock Engine**: Pure-JS client-side converter allowing full offline development and testing without running the backend service.
- **📊 Thermal & Visual Gauge**: Visual representation of temperature values and category zones (Freezing, Cool, Comfortable, Warm, Boiling).
- **⚡ Quick Presets**: One-click common reference values (e.g. Freezing 0°C, Room Temp 20°C, Body Temp 37°C, Boiling 100°C).
- **📜 Conversion History**: Local history log with copy-to-clipboard, rerun conversion, and item deletion.
- **🟢 Live Backend Health Polling**: Automatic polling indicator showing backend connectivity status and service version.
- **⚙️ Dynamic Runtime Configuration**: Configurable API endpoint via in-app Settings modal, LocalStorage, or Kubernetes ConfigMap (`/config.js`).
- **🐳 Cloud-Native & Container Ready**: Multi-stage `Dockerfile`, Nginx reverse proxy with `/healthz` probes, and complete Kubernetes manifests.

---

## 🛠️ Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) + `@sveltejs/vite-plugin-svelte`
- **Styling**: Modern CSS variables, responsive Grid/Flexbox layouts, glassmorphism UI
- **Server / Runtime**: Nginx Alpine (production), Node.js (development)
- **Containerization**: Docker multi-stage build
---

## 📁 Project Structure

```text
unit-converter-ui/
├── public/                        # Static assets & runtime config placeholder
│   └── config.js                  # Dynamic runtime config injection point
├── src/
│   ├── lib/
│   │   ├── components/            # Svelte 5 UI Components
│   │   │   ├── CategoryTabs.svelte       # Category switch tab bar
│   │   │   ├── ConverterCard.svelte      # Main conversion form & result display
│   │   │   ├── Footer.svelte             # Live backend status, UI & API version badges
│   │   │   ├── Header.svelte             # Navigation header & settings trigger
│   │   │   ├── HistoryLog.svelte         # Session conversion history
│   │   │   ├── PresetButtons.svelte      # Dynamic quick presets
│   │   │   ├── SettingsModal.svelte      # API URL & mock mode configuration
│   │   │   └── TemperatureScale.svelte   # Thermal visualizer gauge
│   │   ├── constants/
│   │   │   └── units.js                  # Centralized unit & category registry
│   │   ├── services/
│   │   │   ├── api.js                    # REST API client (/converter, /version)
│   │   │   └── mockConverter.js          # Client-side fallback engine
│   │   └── stores/
│   │       ├── configStore.js            # App, endpoint & version store
│   │       └── converterStore.js         # Reactive conversion & history store
│   ├── App.svelte                 # Root application component
│   ├── app.css                    # Global design tokens & CSS variables
│   └── main.js                    # Svelte 5 mount entrypoint
├── docker-compose.yml             # Full-stack Compose definition (UI + Go API)
├── Dockerfile                     # Multi-stage production container build
├── nginx.conf                     # Production Nginx reverse-proxy configuration
├── vite.config.js                 # Vite development proxy configuration
├── API_DOCUMENTATION.md           # Backend REST API specification
└── package.json                   # Dependencies & build scripts
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** (v9 or later)

### Installation

```bash
# Clone the repository
git clone https://github.com/nikfarjam/unit-converter-ui.git
cd unit-converter-ui

# Install dependencies
npm install
```

### Development Server

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Compile and optimize for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 🔌 Connecting to the Backend Service

By default, the application connects to the Go backend service ([`unit-convertor-go`](https://github.com/nikfarjam/unit-convertor-go)) via the `/api` proxy.

### Development Proxy (CORS Avoidance)

In development, Vite proxies requests from `/api/*` to `http://localhost:9090/*` (defined in `vite.config.js`), preventing browser cross-origin (CORS) blocks:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

### Changing the API Endpoint in the UI

1. Click the **Settings** (⚙️) icon in the top right header.
2. Enter your custom backend base URL (e.g. `/api` or `http://localhost:9090`).
3. Click **Test Ping** to verify connectivity.
4. Click **Save & Apply**.

---

## ⚡ Mock Engine Mode (Offline Development)

If the Go backend is not running, you can enable **Mock Engine Mode**:

1. Open **Settings** (⚙️).
2. Toggle **Mock Engine Mode** to `ON`.
3. Conversions will execute locally inside the browser using pure JavaScript matching the exact backend rounding and formulas.

---

## 📐 Adding New Unit Categories

The codebase is designed so that adding new categories (such as Length, Weight, Volume, Speed) requires **no UI or store changes**—simply register them in [`src/lib/constants/units.js`](src/lib/constants/units.js):

```javascript
// src/lib/constants/units.js
export const UNIT_CATEGORIES = {
  temperature: { ... },
  
  // Example: Adding Length
  length: {
    id: 'length',
    label: 'Length',
    icon: '📏',
    defaultFrom: 'METER',
    defaultTo: 'FOOT',
    defaultInput: '10',
    units: [
      { id: 'METER', label: 'Meters (m)', symbol: 'm', factor: 1 },
      { id: 'FOOT', label: 'Feet (ft)', symbol: 'ft', factor: 0.3048 },
      { id: 'KILOMETER', label: 'Kilometers (km)', symbol: 'km', factor: 1000 },
      { id: 'MILE', label: 'Miles (mi)', symbol: 'mi', factor: 1609.344 }
    ],
    presets: [
      { label: 'Marathon (42.195 km)', value: 42.195, from: 'KILOMETER', to: 'MILE' },
      { label: '100m Sprint', value: 100, from: 'METER', to: 'FOOT' }
    ]
  }
};
```

---

## 🐳 Docker & Container Deployment

### Run with Docker Compose / Podman Compose (Recommended)

Run both the frontend UI and the Go backend service together:

```bash
# Start full stack with Docker Compose
docker compose up -d

# Or with Podman Compose
podman-compose up -d
```

- **Frontend UI**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:9090](http://localhost:9090)

### Standalone Container Build & Run

```bash
# Build the container image
docker build -t unit-converter-ui:latest .

# Run the container on port 8080
docker run -d -p 8080:80 --name unit-converter-ui unit-converter-ui:latest
```

Open [http://localhost:8080](http://localhost:8080).

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
