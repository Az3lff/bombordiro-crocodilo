import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

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
  const lineRef = useRef<THREE.Line>(null);
  const { scene } = useThree();

  useEffect(() => {
    const points = [
      origin.clone(),
      origin.clone().add(direction.clone().normalize().multiplyScalar(length)),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);
    lineRef.current = line;
    scene.add(line);

    return () => {
      scene.remove(line);
      geometry.dispose();
      material.dispose();
    };
  }, [origin, direction, length, color, scene]);

  return null;
}
