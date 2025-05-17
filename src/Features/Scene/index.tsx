import { Canvas } from "@react-three/fiber";
import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useCallback, useEffect, useRef } from "react";
import Maze from "../Maze";
import { Player } from "../Player";
import CameraControls from "../Camera-controls";
import { $playerRef, startMoving, setPlayerRef, stopMoving, turnLeft } from "../../Entities/block/player/store/store";

declare global {
  interface Window {
    player: any; // или укажи более точный тип, если хочешь: PlayerRef
    movePlayerForward: any;
    stopMoving: any
    turns: any
    turnRight: any
    turnLeft: any
  }
}

export default function Scene() {
  const controlsRef = useRef<any>(null);
  const playerRef = useRef<PlayerRef | null>(null); // ⬅️ создаём ref

  const handlePlayerRef = useCallback((refInstance: any) => {
      if (refInstance) {
          playerRef.current = refInstance;
          setPlayerRef(refInstance);

          let leftMotorSpeed = 0;
          let rightMotorSpeed = 0;

          window.setMotor = async (side: "LEFT" | "RIGHT", speed: number) => {
              if (side === "LEFT") {
                  leftMotorSpeed = speed;
              } else {
                  rightMotorSpeed = speed;
              }

              if (playerRef.current) {
                  playerRef.current.drive(leftMotorSpeed, rightMotorSpeed);
              }
          };
      }
  }, []);

  const click = () => {
    console.log("click, playerRef in store", $playerRef.getState());
    turnLeft()
  }

  const secondClick = () => {
    console.log("click, playerRef in store", $playerRef.getState());
    stopMoving()
  }

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
      {/* <button style={{position: 'absolute', left: 450}} onClick={click}>кнопка</button>
      <button style={{position: 'absolute', left: 510}} onClick={secondClick}>кнопка 2</button> */}
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
