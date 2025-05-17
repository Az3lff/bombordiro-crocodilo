import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Maze() {
  const { scene } = useGLTF("/models/sapce_maze.glb");

  console.log(scene)

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[4, -1, -8]} receiveShadow>
          <boxGeometry args={[40, 1, 40]} />
          <meshStandardMaterial visible={true} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          object={scene}
          position={[2.5, -2.2, -1]}
          scale={[3, 3, 3]}
          receiveShadow
        />
      </RigidBody>
    </>
  );
}