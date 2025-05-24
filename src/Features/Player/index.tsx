import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { forwardRef, JSX, useEffect, useImperativeHandle, useRef, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { motorsStore } from "../../Entities/block/speed/store";
import { DebugRay } from "../Debug";
import { useUnit } from "effector-react";
import { $sensorVisible } from "../../Entities/sensor-control/store";

interface PlayerRef {
  moveForward: () => Promise<boolean>;
  turnLeft: (angle: number) => Promise<void>;
  turnRight: (angle: number) => Promise<void>;
}

export const Player = forwardRef<PlayerRef>((props, ref) => {
  const { scene } = useGLTF("/models/bobot.glb");
  const playerRef = useRef<any>(null);
  const modelRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  const { scene: threeScene } = useThree();
  const speed = 5;
  const targetVelocity = useRef(new THREE.Vector3());
  const currentVelocity = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const mazeWalls = useRef<THREE.Object3D[]>([]);
  const prevTurns = useRef({ right: false, left: false, forward: false });

  const [debugRay, setDebugRay] = useState<JSX.Element | null>(null);

  const sensorVisibility = useUnit($sensorVisible);

  const INITIAL_POSITION = [10.5, 0.2, 1.1] as [number, number, number];
  const INITIAL_ROTATION = Math.PI / 2;

  const resetPosition = () => {
    if (playerRef.current) {
      playerRef.current.setNextKinematicTranslation(INITIAL_POSITION);
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
    if (modelRef.current) {
      modelRef.current.rotation.y = INITIAL_ROTATION;
    }
  };

  useEffect(() => {
    if (!sensorVisibility) {
      setDebugRay(null)
    }
  }, [sensorVisibility])

  useEffect(() => {
    const walls: THREE.Mesh[] = [];
    threeScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        walls.push(obj as THREE.Mesh);
        console.log("Объект:", obj.name, "Тип:", obj.type);
      }
    });
    mazeWalls.current = walls;
    console.log("Найдено мешей стен:", walls.length);
  }, [threeScene]);

  const checkTurns = () => {
    if (!playerRef.current || !modelRef.current) return;

    const position = playerRef.current.translation();
    const base = new THREE.Vector3(position.x, position.y + 0.5, position.z);
    const rotation = modelRef.current.rotation;

    const forward = new THREE.Vector3(1, 0, 0).applyEuler(rotation).normalize();
    const back = new THREE.Vector3(-1, 0, 0).applyEuler(rotation).normalize();
    const left = new THREE.Vector3(0, 0, -1).applyEuler(rotation).normalize();
    const right = new THREE.Vector3(0, 0, 1).applyEuler(rotation).normalize();

    const directions = {
      forward,
      back,
      left,
      right,
    };

    const distances: Record<string, number> = {};

    raycaster.current.far = 20;

    const debugRays: JSX.Element[] = [];

    for (const [dirName, dirVector] of Object.entries(directions)) {
      const origin = base.clone().add(dirVector.clone().multiplyScalar(0.5));
      raycaster.current.set(origin, dirVector);

      const intersections = raycaster.current.intersectObjects(mazeWalls.current, true);
      const distance = intersections.length > 0 ? intersections[0].distance : 20;

      distances[dirName] = distance;

      if (sensorVisibility) {
        debugRays.push(
            <DebugRay
                key={dirName}
                origin={origin}
                direction={dirVector}
                length={1}
                color={distance < 20 ? "red" : "cyan"}
            />
        );
      }
    }

    // Сохраняем значения для использования Blockly-блоком
    window.wallSensorData = distances;

    // Показываем лучи
    setDebugRay(sensorVisibility ? <>{debugRays}</> : null);
  };



  useFrame(() => {
    const leftMotorSpeed = motorsStore.getLeftSpeed();
    const rightMotorSpeed = motorsStore.getRightSpeed();

    const { moveForward, moveBackward, moveLeft, moveRight } = getKeys();
    const rotationSpeed = 3;
    const acceleration = 10;

    checkTurns(); // Проверка поворота на каждом кадре

    if (playerRef.current && modelRef.current) {
      const left = leftMotorSpeed;
      const right = rightMotorSpeed;

      const direction = new THREE.Vector3(1, 0, 0).applyEuler(modelRef.current.rotation);

      // Обнаружение разворота на месте
      if (left === -right) {
        // Крутимся на месте
        targetVelocity.current.set(0, 0, 0);
        modelRef.current.rotation.y -= right * 0.05; // поворот зависит от одного мотора
      } else {
        // Плавное движение и поворот как у автомобиля
        const forwardSpeed = (left + right) / 2;
        const turnStrength = (right - left) / 2;

        targetVelocity.current.copy(direction).multiplyScalar(forwardSpeed);
        modelRef.current.rotation.y -= turnStrength * 0.01;
      }

    }

    if (modelRef.current) {
      if (moveLeft) modelRef.current.rotation.y += rotationSpeed * 0.01;
      if (moveRight) modelRef.current.rotation.y -= rotationSpeed * 0.01;
    }

    //targetVelocity.current.set(0, 0, 0);
    if (moveForward || moveBackward) {
      const direction = new THREE.Vector3(moveForward ? 1 : -1, 0, 0);
      if (modelRef.current) {
        direction.applyEuler(modelRef.current.rotation);
      }
      targetVelocity.current.copy(direction).multiplyScalar(speed);
    }

    currentVelocity.current.lerp(targetVelocity.current, acceleration * 0.01);

    if (playerRef.current) {
      const linvel = playerRef.current.linvel();
      const change = new THREE.Vector3(
        currentVelocity.current.x - linvel.x,
        0,
        currentVelocity.current.z - linvel.z
      );
      playerRef.current.applyImpulse(change.multiplyScalar(playerRef.current.mass()), true);
    }
  });

  useImperativeHandle(ref, () => ({
    async moveForward() {
      if (!modelRef.current) return false;

      const direction = new THREE.Vector3(1, 0, 0);
      direction.applyEuler(modelRef.current.rotation);

      playerRef.current.applyImpulse(
        direction.multiplyScalar(5 * playerRef.current.mass()),
        true
      );

      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    },
    resetPosition,
    async turnLeft(angle: number) {
      if (!modelRef.current) return;

      const angleRad = THREE.MathUtils.degToRad(angle);
      const steps = 10;
      const stepAngle = angleRad / steps;
      const delay = 300 / steps;

      for (let i = 0; i < steps; i++) {
        modelRef.current.rotation.y += stepAngle;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    },
    async turnRight(angle: number) {
      if (!modelRef.current) return;

      const angleRad = THREE.MathUtils.degToRad(-angle);
      const steps = 10;
      const stepAngle = angleRad / steps;
      const delay = 300 / steps;

      for (let i = 0; i < steps; i++) {
        modelRef.current.rotation.y += stepAngle;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    },

  }));

  return (
    <>
      <RigidBody
        ref={playerRef as any}
        position={[10.5, 0.2, 1.1]}
        colliders="cuboid"
        restitution={0.1}
        friction={0.8}
        linearDamping={0.2}
        lockRotations
      >
        <group ref={modelRef} rotation-y={Math.PI / 2}>
          <primitive object={scene} scale={[0.3, 0.3, 0.3]} castShadow />
        </group>
      </RigidBody>
      {debugRay}
    </>
  );
});
