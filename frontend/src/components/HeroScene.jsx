import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Box, Environment } from "@react-three/drei";

function SofaMesh() {
    const g = useRef();
    useFrame((s) => { if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.25; });
    return (
        <group ref={g}>
            <Box args={[2.4, 0.35, 1.1]} position={[0, -0.3, 0]}>
                <meshStandardMaterial color="#4c1d95" metalness={0.3} roughness={0.4} />
            </Box>
            <Box args={[2.4, 0.7, 0.35]} position={[0, 0.1, -0.38]}>
                <meshStandardMaterial color="#5b21b6" metalness={0.3} roughness={0.4} />
            </Box>
            <Box args={[0.35, 0.55, 1.1]} position={[-1.03, 0.0, 0]}>
                <meshStandardMaterial color="#6d28d9" metalness={0.2} roughness={0.5} />
            </Box>
            <Box args={[0.35, 0.55, 1.1]} position={[1.03, 0.0, 0]}>
                <meshStandardMaterial color="#6d28d9" metalness={0.2} roughness={0.5} />
            </Box>
            {[[-1.0, -0.6, -0.4], [1.0, -0.6, -0.4], [-1.0, -0.6, 0.4], [1.0, -0.6, 0.4]].map((p, i) => (
                <Box key={i} args={[0.12, 0.28, 0.12]} position={p}>
                    <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </Box>
            ))}
        </group>
    );
}

function FloatingOrb({ pos, color, speed = 1 }) {
    const m = useRef();
    useFrame((s) => {
        if (m.current) m.current.position.y = pos[1] + Math.sin(s.clock.elapsedTime * speed) * 0.3;
    });
    return (
        <mesh ref={m} position={pos}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
    );
}

export default function HeroScene() {
    return (
        <Canvas camera={{ position: [0, 0.5, 4.5], fov: 50 }} style={{ background: "transparent" }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[3, 3, 3]} intensity={1.5} color="#a78bfa" />
            <pointLight position={[-3, 2, -2]} intensity={1} color="#fbbf24" />
            <pointLight position={[0, -2, 2]} intensity={0.5} color="#60a5fa" />
            <Suspense fallback={null}>
                <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                    <SofaMesh />
                </Float>
                <FloatingOrb pos={[-2.2, 0.8, 0]} color="#7c3aed" speed={1.2} />
                <FloatingOrb pos={[2.2, 0.5, 0.5]} color="#fbbf24" speed={0.8} />
                <FloatingOrb pos={[0, 1.5, -1]} color="#60a5fa" speed={1.5} />
                <Environment preset="night" />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
        </Canvas>
    );
}
