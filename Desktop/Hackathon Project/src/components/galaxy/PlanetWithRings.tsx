/**
 * PlanetWithRings - Detailed 3D planet with glowing surface lights and rings
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const PlanetWithRings = () => {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.001;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += 0.0005;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={[15, -8, -20]}>
      {/* Planet glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.3, 32, 32]} />
        <meshBasicMaterial
          color="#9333ea"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main planet */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#4c1d95"
          emissive="#7c3aed"
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Surface lights (cities) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.05, 64, 64]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rings */}
      <mesh ref={ringsRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[4, 6, 64]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring glow */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[3.8, 6.2, 64]} />
        <meshBasicMaterial
          color="#e9d5ff"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light for planet illumination */}
      <pointLight position={[5, 5, 5]} intensity={2} color="#a78bfa" distance={20} />
    </group>
  );
};
