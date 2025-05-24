import { Canvas, useStore } from "@react-three/fiber";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useCallback, useEffect, useRef } from "react";
import Maze from "../Maze";
import { Player } from "../Player";
import CameraControls from "../Camera-controls";
import { setPlayerRef, } from "../../Entities/block/player/store/store";
import { $sensorVisible, setIsSensorVisible } from "../../Entities/sensor-control/store";
import { useUnit } from "effector-react";
import CollapsiblePanel from "../../Widgets/Debug-window/ui";

export default function Scene() {
  const controlsRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  const sensorVisibility = useUnit($sensorVisible);

  const INITIAL_POSITION = [10.5, 0.2, 1.1];
  const INITIAL_ROTATION = Math.PI / 2;

  const handlePlayerRef = useCallback((refInstance: any) => {
    if (refInstance) {
      playerRef.current = refInstance;
      setPlayerRef(refInstance);
    }
  }, []);

  const resetPlayerPosition = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.setTranslation(INITIAL_POSITION, true);
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      const model = playerRef.current.getObjectByName('player-model');
      if (model) {
        model.rotation.y = INITIAL_ROTATION;
      }
    }
  }, []);

  return (
    <KeyboardControls
      map={[
        { name: "moveForward", keys: ["KeyW"] },
        { name: "moveBackward", keys: ["KeyS"] },
        { name: "moveLeft", keys: ["KeyA"] },
        { name: "moveRight", keys: ["KeyD"] },
        { name: "cameraUp", keys: ["ArrowUp"] },
        { name: "cameraDown", keys: ["ArrowDown"] },
        { name: "cameraLeft", keys: ["ArrowLeft"] },
        { name: "cameraRight", keys: ["ArrowRight"] },
      ]}
    >
      <button style={{
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 10,
        padding: '8px 16px',
        background: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }} onClick={() => setIsSensorVisible(!sensorVisibility)}>{sensorVisibility ? 'Скрыть датчик стены' : 'Отобразить датчик стены'}</button>
      <CollapsiblePanel />
      <Canvas
        shadows
        camera={{
          position: [0, 20, 30],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        style={{
          height: "100vh",
          width: "60vw",
          background: "#fafafa",
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 30, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <Physics>
          <Maze />
          <Player ref={handlePlayerRef} />
        </Physics>

        <OrbitControls
          makeDefault
          minDistance={10}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2}
          keys={{
            LEFT: "",
            UP: "",
            RIGHT: "",
            BOTTOM: "",
          }}
          ref={controlsRef}
        />
        <CameraControls controlsRef={controlsRef} />
      </Canvas>
    </KeyboardControls>
  );
}
