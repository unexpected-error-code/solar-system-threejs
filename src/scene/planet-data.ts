import * as THREE from "three";
import { CelestialBodyParams } from "./celestial-body";

// Scale factors to make the simulation more visually appealing
// (real scale would make planets too small and too far apart)
const DISTANCE_SCALE = 5; // Reduced from 10 to make orbits smaller
const SIZE_SCALE = 1.5; // Slightly reduced from 2

// Planet data with approximate values
export const PLANET_DATA: Record<string, CelestialBodyParams> = {
  mercury: {
    name: "Mercury",
    radius: 0.38 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0xaaaaaa,
    rotationSpeed: 0.004,
    orbitSpeed: 0.04,
    orbitRadius: 3.9 * DISTANCE_SCALE,
    orbitInclination: 7,
    orbitEccentricity: 0.205,
  },

  venus: {
    name: "Venus",
    radius: 0.95 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0xe39e1c,
    rotationSpeed: 0.002,
    orbitSpeed: 0.015,
    orbitRadius: 7.2 * DISTANCE_SCALE,
    orbitInclination: 3.4,
    orbitEccentricity: 0.007,
  },

  earth: {
    name: "Earth",
    radius: 1 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0x2233ff,
    rotationSpeed: 0.01,
    orbitSpeed: 0.01,
    orbitRadius: 10 * DISTANCE_SCALE,
    orbitInclination: 0,
    orbitEccentricity: 0.017,
  },

  mars: {
    name: "Mars",
    radius: 0.53 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0xc1440e,
    rotationSpeed: 0.008,
    orbitSpeed: 0.008,
    orbitRadius: 15 * DISTANCE_SCALE,
    orbitInclination: 1.9,
    orbitEccentricity: 0.094,
  },

  jupiter: {
    name: "Jupiter",
    radius: 11.2 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0xd8ca9d,
    rotationSpeed: 0.04,
    orbitSpeed: 0.002,
    orbitRadius: 52 * DISTANCE_SCALE,
    orbitInclination: 1.3,
    orbitEccentricity: 0.049,
  },

  saturn: {
    name: "Saturn",
    radius: 9.45 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0xead6b8,
    rotationSpeed: 0.038,
    orbitSpeed: 0.0009,
    orbitRadius: 95 * DISTANCE_SCALE,
    orbitInclination: 2.5,
    orbitEccentricity: 0.057,
    hasRings: true,
    ringsInnerRadius: 10.7 * SIZE_SCALE,
    ringsOuterRadius: 14 * SIZE_SCALE,
    ringsColor: 0xc6a780,
  },

  uranus: {
    name: "Uranus",
    radius: 4 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0x5580aa,
    rotationSpeed: 0.03,
    orbitSpeed: 0.0004,
    orbitRadius: 192 * DISTANCE_SCALE,
    orbitInclination: 0.8,
    orbitEccentricity: 0.046,
    hasRings: true,
    ringsInnerRadius: 4.5 * SIZE_SCALE,
    ringsOuterRadius: 6 * SIZE_SCALE,
    ringsColor: 0x5580aa,
  },

  neptune: {
    name: "Neptune",
    radius: 3.88 * SIZE_SCALE,
    position: new THREE.Vector3(0, 0, 0),
    color: 0x366896,
    rotationSpeed: 0.032,
    orbitSpeed: 0.0001,
    orbitRadius: 301 * DISTANCE_SCALE,
    orbitInclination: 1.8,
    orbitEccentricity: 0.011,
  },
};
