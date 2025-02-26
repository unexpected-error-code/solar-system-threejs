import { createSignal, Show, createEffect } from "solid-js";
import { PLANET_DATA } from "../../scene/planet-data";
import { CelestialBodyParams } from "../../scene/celestial-body";
import * as THREE from "three";

// Extended interface that includes description
interface PlanetInfoWithDescription extends CelestialBodyParams {
  description?: string;
}

const PLANET_DESCRIPTIONS: Record<string, string> = {
  Sun: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.",
  Mercury: "Mercury is the smallest and innermost planet in the Solar System. It has no atmosphere to retain heat, causing extreme temperature variations.",
  Venus: "Venus is the second planet from the Sun. It has the densest atmosphere of all terrestrial planets, consisting mainly of carbon dioxide.",
  Earth: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It has one natural satellite, the Moon.",
  Mars: "Mars is the fourth planet from the Sun. It is often referred to as the 'Red Planet' due to its reddish appearance caused by iron oxide on its surface.",
  Jupiter:
    "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all other planets combined.",
  Saturn:
    "Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is known for its prominent ring system, which consists primarily of ice particles with a smaller amount of rocky debris and dust.",
  Uranus:
    "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. It is similar in composition to Neptune.",
  Neptune:
    "Neptune is the eighth and farthest known planet from the Sun. It is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
};

interface PlanetInfoPanelProps {
  isVisible: () => boolean;
  setIsVisible: (value: boolean) => void;
  currentPlanet: () => string | null;
  setCurrentPlanet: (value: string | null) => void;
}

export function PlanetInfoPanel(props: PlanetInfoPanelProps) {
  const [planetDetails, setPlanetDetails] = createSignal<PlanetInfoWithDescription | null>(null);

  // Update planetDetails when currentPlanet changes
  const updatePlanetDetails = () => {
    const planetName = props.currentPlanet();
    if (!planetName) {
      setPlanetDetails(null);
      return;
    }

    const planetKey = planetName.toLowerCase();
    const planetData = PLANET_DATA[planetKey];

    if (!planetData) {
      if (planetName === "Sun") {
        setPlanetDetails({
          name: "Sun",
          radius: 109,
          position: new THREE.Vector3(0, 0, 0),
          color: 0xffff00,
          rotationSpeed: 0,
          orbitSpeed: 0,
          orbitRadius: 0,
          orbitInclination: 0,
          orbitEccentricity: 0,
          description: PLANET_DESCRIPTIONS["Sun"],
        });
      }
      return;
    }

    setPlanetDetails({
      ...planetData,
      description: PLANET_DESCRIPTIONS[planetName] || "No description available.",
    });
  };

  // Call updatePlanetDetails whenever currentPlanet changes
  createEffect(() => {
    // Access the signal to track it
    const planetName = props.currentPlanet();
    updatePlanetDetails();
  });

  const hide = () => {
    props.setIsVisible(false);
    props.setCurrentPlanet(null);
  };

  const createInfoRow = (label: string, value: string) => (
    <div class="flex justify-between py-1">
      <span class="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );

  return (
    <Show when={props.isVisible()}>
      <div class="fixed z-50 top-0 right-0 w-full md:w-96 h-full bg-white shadow-lg p-6 overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{props.currentPlanet()}</h2>
          <button onClick={hide} class="p-2 text-2xl hover:bg-gray-100 rounded-full" aria-label="Close panel">
            &times;
          </button>
        </div>

        <Show when={planetDetails()}>
          <p class="mb-4">{planetDetails()?.description}</p>
          <div class="space-y-2">
            {(() => {
              const details = planetDetails()!;
              return (
                <>
                  {createInfoRow("Radius", `${(details.radius / 1.5).toFixed(2)} Earth radii`)}
                  {details.orbitRadius !== undefined && createInfoRow("Orbit Radius", `${(details.orbitRadius / 5).toFixed(2)} AU`)}
                  {details.orbitSpeed !== undefined && createInfoRow("Orbit Speed", `${(details.orbitSpeed * 100).toFixed(2)} (relative)`)}
                  {details.rotationSpeed !== undefined && createInfoRow("Rotation Speed", `${(details.rotationSpeed * 100).toFixed(2)} (relative)`)}
                  {details.orbitInclination !== undefined &&
                    details.orbitInclination > 0 &&
                    createInfoRow("Orbit Inclination", `${details.orbitInclination.toFixed(1)}°`)}
                  {details.orbitEccentricity !== undefined &&
                    details.orbitEccentricity > 0 &&
                    createInfoRow("Orbit Eccentricity", details.orbitEccentricity.toFixed(3))}
                  {details.hasRings && createInfoRow("Rings", "Yes")}
                </>
              );
            })()}
          </div>
        </Show>
      </div>
    </Show>
  );
}
