import { createSignal, onMount } from "solid-js";

export function InstructionsPanel() {
  const [isCollapsed, setIsCollapsed] = createSignal(false);
  const [isTouchDevice, setIsTouchDevice] = createSignal(false);

  onMount(() => {
    // Check if device has touch capabilities
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed());
  };

  return (
    <div
      class={`fixed top-0 left-0 p-4 bg-black/50 text-white rounded-br-lg z-10 transition-all duration-300 ${isCollapsed() ? "w-12 h-12 overflow-hidden" : ""}`}
    >
      {isCollapsed() ? (
        <button onClick={toggleCollapse} class="w-full h-full flex items-center justify-center text-xl" aria-label="Expand instructions">
          ?
        </button>
      ) : (
        <>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-bold">Solar System Simulation</h3>
            <button
              onClick={toggleCollapse}
              class="ml-4 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full"
              aria-label="Collapse instructions"
            >
              −
            </button>
          </div>
          <div class="text-sm space-y-1">
            {isTouchDevice() ? (
              <>
                <p>
                  <strong>Instructions:</strong>
                </p>
                <p>• Use one finger to rotate</p>
                <p>• Pinch with two fingers to zoom</p>
                <p>• Use two fingers to pan</p>
                <p>• Tap on a planet to view details</p>
              </>
            ) : (
              <>
                <p>
                  <strong>Instructions:</strong>
                </p>
                <p>• Use mouse to rotate, zoom and pan</p>
                <p>• Click on a planet to view details</p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
