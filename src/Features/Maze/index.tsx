import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useUnit } from "effector-react";
import { $currentMap } from "../../Entities/maps/current-map-store";

export default function Maze() {
  const map = useUnit($currentMap)

  const { scene } = useGLTF(map?.map_url ?? '');

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
          position={[6, -0.52, -2]}
          scale={[3, 3, 3]}
          receiveShadow
        />
      </RigidBody>
    </>
  );
}