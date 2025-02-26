# Solar System Simulation

An interactive 3D simulation of our solar system built with Three.js and SolidJS.

## Features

- Realistic 3D representation of the solar system with the sun and all eight planets
- Accurate relative sizes, colors, and orbital characteristics (with scaling for better visualization)
- Interactive camera controls for rotating, zooming, and panning
- Click/tap on planets to view detailed information
- Responsive design that works on both desktop and mobile devices
- Special details like Saturn's and Uranus's rings
- Realistic orbital mechanics including inclination and eccentricity

## Technologies Used

- [Three.js](https://threejs.org/) - 3D graphics library
- [SolidJS](https://www.solidjs.com/) - Reactive JavaScript UI library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/solar-system.git
   cd solar-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

The simulation starts automatically when you open the application. You can:

- Use mouse/touch controls to navigate the 3D space
- Click/tap on any planet to view detailed information about it
- The camera will automatically move to focus on the selected planet
- Click/tap elsewhere or on the close button to return to the full solar system view

## Controls

### Desktop Controls:

- Click and drag to rotate the view
- Scroll to zoom in/out
- Right-click and drag to pan
- Click on a planet to view details and move camera to it
- Click elsewhere or on the close button to hide the info panel

### Touch Device Controls:

- Use one finger to rotate the view
- Use pinch gesture with two fingers to zoom
- Use two fingers to pan the view
- Tap on a planet to view details and move camera to it
- Tap elsewhere or on the close button to hide the info panel

## Project Structure

```
solar-system/
├── public/               # Static assets
├── src/
│   ├── components/       # SolidJS UI components
│   │   ├── instructions-panel/
│   │   └── planet-info-panel/
│   ├── scene/            # Three.js related files
│   │   ├── celestial-body.ts
│   │   ├── planet-data.ts
│   │   └── solar-system.ts
│   ├── main.ts           # Application entry point
│   └── style.css         # Global styles
├── index.html            # HTML entry point
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Development Notes

- The simulation uses scale factors to make the visualization more appealing, as real-scale would make planets too small and too far apart
- Planet data is approximate and simplified for educational purposes
- The project follows specific coding conventions outlined in CONVENTIONS.MD

## License

[MIT](LICENSE)
