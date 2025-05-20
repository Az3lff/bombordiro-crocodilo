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
  turn: (direction: 'LEFT' | 'RIGHT') => Promise<void>;
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

  const leftMotorSpeed = motorsStore.getLeftSpeed();
  const rightMotorSpeed = motorsStore.getRightSpeed();

  const sensorVisibility = useUnit($sensorVisible);

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
    const backside = new THREE.Vector3(-1, 0, 0).applyEuler(rotation).normalize();
    const right = new THREE.Vector3(0, 0, 1).applyEuler(rotation).normalize();
    const left = new THREE.Vector3(0, 0, -1).applyEuler(rotation).normalize();
    // Инициализация глобального объекта, если его нет
    if (!window.turns) {
      window.turns = {
        forward: false,
        left: false,
        right: false
      };
    }

    raycaster.current.far = 1.5;

    // === Направо ===
    const offsetRight = base.clone()
      .add(forward.clone().multiplyScalar(0))
      .add(right.clone().multiplyScalar(0.25));
    raycaster.current.set(offsetRight, right);
    const rightClear = raycaster.current.intersectObjects(mazeWalls.current, true).length === 0;
    if (rightClear && !prevTurns.current.right) {
      window.turns.right = !rightClear;
      console.log("✅ Открыт поворот НАПРАВО →");
    }
    prevTurns.current.right = rightClear;
    window.turns.right = !rightClear;

    // === Налево ===
    const offsetLeft = base.clone()
      .add(forward.clone().multiplyScalar(0))
      .add(left.clone().multiplyScalar(0.25));
    raycaster.current.set(offsetLeft, left);
    const leftClear = raycaster.current.intersectObjects(mazeWalls.current, true).length === 0;
    if (leftClear && !prevTurns.current.left) {
      window.turns.left = !leftClear;
      console.log("✅ Открыт поворот НАЛЕВО ←");
    }
    prevTurns.current.left = leftClear;
    window.turns.left = !leftClear;

    // === Вперёд ===
    const offsetForward = base.clone().add(forward.clone().multiplyScalar(0.5));
    const offsetBackside = base.clone().add(backside.clone().multiplyScalar(0.5));
    raycaster.current.set(offsetForward, forward);
    const forwardClear = raycaster.current.intersectObjects(mazeWalls.current, true).length === 0;
    if (!forwardClear && prevTurns.current.forward !== false) {
      window.turns.forward = forwardClear;
      console.log("⛔️ ВПЕРЕДИ СТЕНА");
    }
    prevTurns.current.forward = forwardClear;
    window.turns.forward = forwardClear;

    // Отладочные лучи
    sensorVisibility && setDebugRay(
      <>
        <DebugRay origin={offsetRight} direction={right} length={1} color="orange" />
        <DebugRay origin={offsetLeft} direction={left} length={1} color="orange" />
        <DebugRay origin={offsetForward} direction={forward} length={1} color={forwardClear ? "cyan" : "red"} />
        <DebugRay origin={offsetBackside} direction={backside} length={1} color={'orange'} />
      </>
    );
  };



  useFrame(() => {
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

    async turn(direction: 'LEFT' | 'RIGHT') {
      if (!modelRef.current) return;

      const angle = direction === 'LEFT' ? Math.PI / 2 : -Math.PI / 2;
      const steps = 10;
      const stepAngle = angle / steps;
      const delay = 300 / steps;

      for (let i = 0; i < steps; i++) {
        modelRef.current.rotation.y += stepAngle;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    },

    // drive(leftSpeed: number, rightSpeed: number) {
    //   leftMotorSpeedRef.current = leftSpeed;
    //   rightMotorSpeedRef.current = rightSpeed;
    // },


    // checkPath(side: 'right') {
    //   switch (side) {
    //     case 'right': return checkDirection(new THREE.Vector3(1, 0, 0), 1.5);
    //     default: return false;
    //   }
    // }
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
