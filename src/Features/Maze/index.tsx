import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useUnit } from "effector-react";
import { $currentMap } from "../../Entities/maps/current-map-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Maze() {
  const { scene } = useGLTF("/models/wall_movement.glb");

  const map = useUnit($currentMap)

  const navigate = useNavigate()

  useEffect(() => {
    if (!map) {
      navigate('/lesson-selection')
    }
  }, [map])

  console.log(map)

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