import * as THREE from "three";

export interface CelestialBodyParams {
  name: string;
  radius: number;
  position: THREE.Vector3;
  color: number;
  emissive?: number;
  emissiveIntensity?: number;
  textureMap?: string;
  rotationSpeed?: number;
  orbitSpeed?: number;
  orbitRadius?: number;
  orbitInclination?: number;
  orbitEccentricity?: number;
  hasRings?: boolean;
  ringsInnerRadius?: number;
  ringsOuterRadius?: number;
  ringsColor?: number;
}

export class CelestialBody {
  public name: string;
  public mesh: THREE.Mesh;
  public orbitLine: THREE.Line | null = null;
  public rings: THREE.Mesh | null = null;
  public trajectory: THREE.Line | null = null;

  private rotationSpeed: number;
  private orbitSpeed: number;
  private orbitRadius: number;
  private orbitInclination: number;
  private orbitEccentricity: number;
  private orbitAngle: number = 0;
  private initialPosition: THREE.Vector3;
  private trajectoryPoints: THREE.Vector3[] = [];
  private maxTrajectoryPoints: number = 200;

  constructor(params: CelestialBodyParams) {
    this.name = params.name;
    this.initialPosition = params.position.clone();
    this.rotationSpeed = params.rotationSpeed || 0;
    this.orbitRadius = params.orbitRadius || 0;
    this.orbitSpeed = params.orbitSpeed || 0;
    this.orbitInclination = params.orbitInclination || 0;
    this.orbitEccentricity = params.orbitEccentricity || 0;

    // Create the geometry for the celestial body
    const geometry = new THREE.SphereGeometry(params.radius, 32, 32);

    // Create the material for the celestial body
    const material = new THREE.MeshStandardMaterial({
      color: params.color,
      emissive: params.emissive || 0x000000,
      emissiveIntensity: params.emissiveIntensity || 0,
      roughness: 0.7,
      metalness: 0.2,
    });

    // If a texture is provided, load and apply it
    if (params.textureMap) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(params.textureMap);
      material.map = texture;
    }

    // Create the mesh for the celestial body
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(params.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Create orbit line if this body orbits
    if (this.orbitRadius > 0) {
      //this.createOrbitLine();
      // Create trajectory line for orbiting bodies
      this.createTrajectory();
    }

    // Create rings if specified
    if (params.hasRings && params.ringsInnerRadius && params.ringsOuterRadius) {
      this.createRings(params.ringsInnerRadius, params.ringsOuterRadius, params.ringsColor || 0xffffff);
    }
  }

  private createOrbitLine(): void {
    // Create an elliptical orbit path
    const curve = new THREE.EllipseCurve(
      0,
      0, // Center x, y
      this.orbitRadius,
      this.orbitRadius * (1 - this.orbitEccentricity), // xRadius, yRadius
      0,
      2 * Math.PI, // startAngle, endAngle
      false, // clockwise
      0 // rotation
    );

    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Convert 2D points to 3D and apply inclination
    const positions = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = point.y;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Apply orbit inclination
    geometry.rotateX((this.orbitInclination * Math.PI) / 180);

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });

    this.orbitLine = new THREE.Line(geometry, material);
  }

  private createRings(innerRadius: number, outerRadius: number, color: number): void {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });

    this.rings = new THREE.Mesh(geometry, material);
    this.rings.rotation.x = Math.PI / 2;
    this.mesh.add(this.rings);
  }

  private createTrajectory(): void {
    // Create a complete elliptical orbit path for the trajectory
    const points: THREE.Vector3[] = [];
    const segments = 200; // Number of segments for a smooth trajectory

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      // Calculate position based on elliptical orbit
      const x = this.orbitRadius * Math.cos(angle);
      const z = this.orbitRadius * (1 - this.orbitEccentricity) * Math.sin(angle);

      // Apply inclination
      const inclinationRad = (this.orbitInclination * Math.PI) / 180;
      const y = z * Math.sin(inclinationRad);
      const adjustedZ = z * Math.cos(inclinationRad);

      // Add point to trajectory
      points.push(new THREE.Vector3(this.initialPosition.x + x, this.initialPosition.y + y, this.initialPosition.z + adjustedZ));
    }

    // Create geometry from points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create material for the trajectory line
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      linewidth: 1,
    });

    // Create the line
    this.trajectory = new THREE.Line(geometry, material);
  }

  public update(deltaTime: number): void {
    // Rotate the body around its axis
    if (this.rotationSpeed !== 0) {
      this.mesh.rotation.y += this.rotationSpeed * deltaTime;
    }

    // Update orbit position if this body orbits
    if (this.orbitRadius > 0 && this.orbitSpeed !== 0) {
      this.orbitAngle += this.orbitSpeed * deltaTime;

      // Calculate new position based on elliptical orbit
      const x = this.orbitRadius * Math.cos(this.orbitAngle);
      const z = this.orbitRadius * (1 - this.orbitEccentricity) * Math.sin(this.orbitAngle);

      // Apply inclination
      const inclinationRad = (this.orbitInclination * Math.PI) / 180;
      const y = z * Math.sin(inclinationRad);
      const adjustedZ = z * Math.cos(inclinationRad);

      // Update position
      this.mesh.position.set(this.initialPosition.x + x, this.initialPosition.y + y, this.initialPosition.z + adjustedZ);
    }
  }
}
