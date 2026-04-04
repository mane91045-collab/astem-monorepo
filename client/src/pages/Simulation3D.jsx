import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

function MetroTunnel() {
    return (
        <group>
            {/* Simple tunnel representation */}
            <mesh rotation={[0, 0, 0]}>
                <cylinderGeometry args={[20, 20, 100, 32, 1, true]} />
                <meshStandardMaterial color="#333" side={2} wireframe />
            </mesh>
            
            {/* Heat particles visualization */}
            {[...Array(50)].map((_, i) => (
                <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={[Math.random() * 30 - 15, Math.random() * 30 - 15, Math.random() * 100 - 50]}>
                        <sphereGeometry args={[0.5, 16, 16]} />
                        <meshStandardMaterial 
                            color={i % 2 === 0 ? "#ff4400" : "#ffaa00"} 
                            emissive={i % 2 === 0 ? "#ff4400" : "#ffaa00"}
                            emissiveIntensity={2}
                        />
                    </mesh>
                </Float>
            ))}

            <Text
                position={[0, 10, -20]}
                fontSize={3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                Astem 3D Simulation
            </Text>
        </group>
    );
}

export default function Simulation3D() {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-black relative">
            <header className="absolute top-0 left-0 p-8 z-10 w-full flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-[0.2em]">Live Simulation</h1>
                    <p className="text-orange-500 font-mono text-sm mt-1">Status: Rendering Virtual Environment v2.4</p>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl px-8 py-3 rounded-full border border-white/20 transition-all font-bold"
                >
                    Exit Simulation
                </button>
            </header>

            <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-white font-mono text-xl">Initializing ThreeJS...</div>}>
                <Canvas>
                    <PerspectiveCamera makeDefault position={[50, 50, 50]} />
                    <OrbitControls autoRotate autoRotateSpeed={0.5} enableDamping />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffaa00" />

                    <MetroTunnel />
                </Canvas>
            </Suspense>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl max-w-sm text-center">
                <p className="text-gray-300 text-sm leading-relaxed">
                    Visualizing kinetic-to-thermal energy conversion in Baku Metro tunnels. 
                    Interactive model allows for real-time manipulation of ventilation flows and braking heat capture rates.
                </p>
            </div>
        </div>
    );
}
