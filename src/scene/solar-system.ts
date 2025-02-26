import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CelestialBody, CelestialBodyParams } from "./celestial-body";
import { PlanetInfoPanel } from "../components/planet-info-panel/PlanetInfoPanel";
import { PLANET_DATA } from "./planet-data";
import { render } from "solid-js/web";
import { createSignal } from "solid-js";

// Interface for communication between SolarSystem and PlanetInfoPanel
interface PlanetInfoPanelApi {
  show: (name: string) => void;
  hide: () => void;
  isShowing: () => boolean;
}

export class SolarSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock: THREE.Clock;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private planetInfoPanelApi!: PlanetInfoPanelApi;
  private selectedPlanet: CelestialBody | null = null;
  private animatingCamera: boolean = false;

  private celestialBodies: CelestialBody[] = [];
  private stars!: THREE.Points;
  private sunLight!: THREE.PointLight;

  constructor(container: HTMLElement) {
    // Initialize the scene
    this.scene = new THREE.Scene();

    // Initialize the camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    this.camera.position.set(0, 200, 300); // Positioned higher and further back for a better overview

    // Initialize the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Initialize orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 2000; // Increased to allow zooming out to see the entire system

    // Initialize the clock for animation
    this.clock = new THREE.Clock();

    // Initialize raycaster for planet selection
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Initialize planet info panel with SolidJS
    this.initPlanetInfoPanel();

    // Add ambient light - increased intensity for a lighter scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);

    // Create stars background
    this.createStars();

    // Set up event listeners
    this.setupEventListeners(this.renderer.domElement);

    // Handle window resize
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  private initPlanetInfoPanel(): void {
    // Create signals for communication with the SolidJS component
    const [isVisible, setIsVisible] = createSignal(false);
    const [currentPlanet, setCurrentPlanet] = createSignal<string | null>(null);

    // Create the API for the SolarSystem class to interact with the component
    this.planetInfoPanelApi = {
      show: (name: string) => {
        setCurrentPlanet(name);
        setIsVisible(true);
      },
      hide: () => {
        setIsVisible(false);
        setCurrentPlanet(null);
      },
      isShowing: () => isVisible(),
    };

    // Render the SolidJS component
    const container = document.getElementById("planet-info-panel");
    if (container) {
      render(() => {
        // @ts-ignore - JSX in TypeScript file
        return PlanetInfoPanel({
          isVisible,
          setIsVisible,
          currentPlanet,
          setCurrentPlanet,
        });
      }, container);
    }
  }

  private createStars(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      sizeAttenuation: false,
    });

    const starsVertices = [];
    // Increase number of stars from 10,000 to 20,000
    for (let i = 0; i < 20000; i++) {
      // Make the x and z (horizontal) spread wider to cover all planets
      // Neptune's orbit radius is about 301 * 5 = 1505, so we need at least 3000 spread
      const x = THREE.MathUtils.randFloatSpread(3500);
      // Reduce the y (vertical) spread to make it less tall
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(3500);
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));

    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(this.stars);
  }

  public createSun(): CelestialBody {
    // Create a point light for the sun - increased intensity for a brighter scene
    this.sunLight = new THREE.PointLight(0xffffff, 3.0, 1500);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.bias = -0.0001; // Reduce shadow acne
    this.scene.add(this.sunLight);

    // Create the sun
    const sun = new CelestialBody({
      name: "Sun",
      radius: 10,
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.6,
      rotationSpeed: 0.001,
    });

    this.addCelestialBody(sun);
    return sun;
  }

  public createPlanet(params: CelestialBodyParams): CelestialBody {
    const planet = new CelestialBody(params);
    this.addCelestialBody(planet);
    return planet;
  }

  private addCelestialBody(body: CelestialBody): void {
    this.celestialBodies.push(body);
    this.scene.add(body.mesh);

    if (body.orbitLine) {
      this.scene.add(body.orbitLine);
    }

    // Add trajectory line if this body has one (not the Sun)
    if (body.name !== "Sun" && body.trajectory) {
      this.scene.add(body.trajectory);
    }
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const deltaTime = this.clock.getDelta();

    // Update all celestial bodies
    for (const body of this.celestialBodies) {
      body.update(deltaTime);
    }

    // Update controls
    this.controls.update();

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private setupEventListeners(domElement: HTMLCanvasElement): void {
    // Add click event listener for planet selection
    domElement.addEventListener("click", this.onCanvasClick.bind(this));

    // Add touch event listener for planet selection on mobile devices
    domElement.addEventListener("touchend", (event: TouchEvent) => {
      // Prevent default to avoid scrolling/zooming conflicts
      event.preventDefault();

      if (event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        // Convert touch position to mouse position and call onCanvasClick
        const mouseEvent = new MouseEvent("click", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        this.onCanvasClick(mouseEvent);
      }
    });
  }

  private onCanvasClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Find intersections with celestial bodies
    const meshes = this.celestialBodies.map((body) => body.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      // Get the first intersected object
      const selectedObject = intersects[0].object;

      // Find the corresponding celestial body
      const selectedBody = this.celestialBodies.find((body) => body.mesh === selectedObject);

      if (selectedBody) {
        this.selectPlanet(selectedBody);
      }
    } else if (!this.planetInfoPanelApi.isShowing() || (event.target instanceof HTMLElement && !event.target.closest("#planet-info-panel"))) {
      // If clicked on empty space and not on the info panel, hide the panel
      this.planetInfoPanelApi.hide();
      if (this.selectedPlanet) this.selectedPlanet = null;
    }
  }

  private selectPlanet(planet: CelestialBody): void {
    this.selectedPlanet = planet;

    // Show planet info with delay
    setTimeout(() => {
      this.planetInfoPanelApi.show(planet.name);
    }, 1000);

    // Find the planet data to get its radius
    const planetName = planet.name.toLowerCase();
    const planetData =
      planetName === "sun"
        ? { radius: 10 } // Sun's radius from createSun method
        : PLANET_DATA[planetName];

    if (planetData) {
      // Calculate base distance based on planet radius
      // Range from 5 (smallest planets) to 15 (largest planets)
      const minBaseDistance = 5;
      const maxBaseDistance = 25;

      // Get the normalized radius value (0 to 1) based on the range of planet sizes
      // Mercury has radius ~0.38, Jupiter has radius ~11.2
      const minRadius = PLANET_DATA.mercury.radius; // Mercury's radius
      const maxRadius = PLANET_DATA.jupiter.radius; // Jupiter's radius

      // Normalize the radius to a 0-1 range
      const normalizedRadius = Math.min(Math.max((planetData.radius - minRadius) / (maxRadius - minRadius), 0), 1);

      // Calculate base distance using the normalized radius
      // Smaller planets get closer to minBaseDistance, larger planets closer to maxBaseDistance
      const baseDistance = minBaseDistance + normalizedRadius * (maxBaseDistance - minBaseDistance);

      // Apply scaling factor based on planet size category
      let scaleFactor;
      if (planetData.radius < 1) {
        // For very small planets like Mercury
        scaleFactor = 1.2;
      } else if (planetData.radius < 5) {
        // For small to medium planets like Earth, Mars
        scaleFactor = 1.3;
      } else {
        // For large planets like Jupiter, Saturn
        scaleFactor = 1.5;
      }

      const adjustedDistance = baseDistance * scaleFactor;

      // Move camera to the planet with adjusted distance
      this.moveCameraToObject(planet.mesh, adjustedDistance);
    } else {
      // Fallback to default distance if planet data not found
      this.moveCameraToObject(planet.mesh, 50);
    }
  }

  private moveCameraToObject(object: THREE.Object3D, distance: number): void {
    this.animatingCamera = true;

    // Get the object's position
    const targetPosition = object.position.clone();

    // Calculate the camera position at the specified distance from the object
    // Reduced y-offset for a more direct view of the planets
    const offset = new THREE.Vector3(distance, distance * 0.15, distance);
    const cameraTargetPosition = targetPosition.clone().add(offset);

    // Store initial camera position for animation
    const startPosition = this.camera.position.clone();
    const startTime = Date.now();
    const duration = 1000; // Animation duration in milliseconds

    // Animation function
    const animateCamera = () => {
      if (!this.animatingCamera) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smoother animation
      const easeProgress = this.easeInOutCubic(progress);

      // Interpolate between start and target positions
      const newPosition = new THREE.Vector3().lerpVectors(startPosition, cameraTargetPosition, easeProgress);

      // Update camera position
      this.camera.position.copy(newPosition);

      // Make camera look at the object
      this.camera.lookAt(targetPosition);
      this.controls.target.copy(targetPosition);

      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      } else {
        this.animatingCamera = false;
      }
    };

    // Start animation
    animateCamera();
  }

  // Easing function for smoother camera movement
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
