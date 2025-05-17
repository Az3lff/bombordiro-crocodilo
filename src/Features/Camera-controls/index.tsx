import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FC, RefObject } from "react";
import { OrbitControls } from "three-stdlib";

interface CameraControlsProps {
  controlsRef: RefObject<OrbitControls>;
}

const CameraControls: FC<CameraControlsProps> = ({ controlsRef }) => {
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();

  useFrame(() => {
    const {
      cameraUp,
      cameraDown,
      cameraLeft,
      cameraRight
    } = getKeys();

    const moveSpeed = 0.5;
    const moveVector = new THREE.Vector3();

    if (cameraUp) moveVector.z -= moveSpeed;
    if (cameraDown) moveVector.z += moveSpeed;
    if (cameraLeft) moveVector.x -= moveSpeed;
    if (cameraRight) moveVector.x += moveSpeed;

    moveVector.applyQuaternion(camera.quaternion);
    moveVector.y = 0;

    camera.position.add(moveVector);
    if (controlsRef.current) {
      controlsRef.current.target.add(moveVector);
    }
  });

  return null;
};

export default CameraControls;