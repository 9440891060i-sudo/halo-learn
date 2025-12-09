import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

function GlassesModel() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Mouse-based rotation
      const mouseX = state.mouse.x * 0.3;
      const mouseY = state.mouse.y * 0.15;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouseY * 0.5,
        0.05
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.02 : 1}
    >
      {/* Frame - Main bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.08, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left lens frame */}
      <mesh position={[-0.9, 0, 0]}>
        <torusGeometry args={[0.55, 0.04, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right lens frame */}
      <mesh position={[0.9, 0, 0]}>
        <torusGeometry args={[0.55, 0.04, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left lens */}
      <mesh position={[-0.9, 0, 0]}>
        <circleGeometry args={[0.52, 32]} />
        <meshStandardMaterial 
          color="#111111" 
          transparent 
          opacity={0.3}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Right lens */}
      <mesh position={[0.9, 0, 0]}>
        <circleGeometry args={[0.52, 32]} />
        <meshStandardMaterial 
          color="#111111" 
          transparent 
          opacity={0.3}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Left temple (arm) */}
      <mesh position={[-1.75, 0, 0.4]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right temple (arm) */}
      <mesh position={[1.75, 0, 0.4]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left temple end */}
      <mesh position={[-2.15, -0.15, 0.55]} rotation={[0.4, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right temple end */}
      <mesh position={[2.15, -0.15, 0.55]} rotation={[0.4, -0.3, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Nose bridge */}
      <mesh position={[0, -0.15, 0.1]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left speaker indicator */}
      <mesh position={[-1.5, 0, 0.12]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Right speaker indicator */}
      <mesh position={[1.5, 0, 0.12]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

const Glasses3D = () => {
  return (
    <div className="w-full h-[300px] sm:h-[400px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        <pointLight position={[0, 0, 3]} intensity={0.3} />
        <GlassesModel />
      </Canvas>
      <p className="text-center text-xs text-muted-foreground/40 mt-2 font-extralight">
        Move mouse to rotate
      </p>
    </div>
  );
};

export default Glasses3D;
