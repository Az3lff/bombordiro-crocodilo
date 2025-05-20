import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export function DebugRay({
  origin,
  direction,
  length = 2,
  color = "red",
}: {
  origin: THREE.Vector3;
  direction: THREE.Vector3;
  length?: number;
  color?: string;
}) {
  const { scene } = useThree();

  useEffect(() => {
    const points = [
      origin.clone(),
      origin.clone().add(direction.clone().normalize().multiplyScalar(length)),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    return () => {
      scene.remove(line);
      geometry.dispose();
      material.dispose();
    };
  }, [origin, direction, length, color, scene]);

  return null;
}