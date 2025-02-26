import "./style.css";
import { SolarSystem } from "./scene/solar-system";
import { PLANET_DATA } from "./scene/planet-data";

// Get the app container
const appContainer = document.querySelector<HTMLDivElement>("#app")!;

// Initialize the solar system
const solarSystem = new SolarSystem(appContainer);

// Create the sun
solarSystem.createSun();

// Create all planets
Object.values(PLANET_DATA).forEach((planetData) => {
  solarSystem.createPlanet(planetData);
});

// Start the animation loop
solarSystem.animate();

// Add instructions to the console
console.log("Solar System Simulation");
console.log("- Click on a planet to view details and move camera to it");
console.log("- Click elsewhere or on the close button to hide the info panel");
console.log("- Use mouse to rotate, zoom and pan the view");
