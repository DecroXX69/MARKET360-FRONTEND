import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styles from './Bubbles.module.css';

const Bubbles = () => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const bubbles = useRef([]);

  useEffect(() => {
    // Initialize Three.js scene
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup with better lighting capabilities
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    
    // Create iridescent texture for soap bubble effect
    const createIridescentTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      // Create a radial gradient with multiple color stops for prism effect
      const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.1,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.5
      );
      
      gradient.addColorStop(0.0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.2, 'rgba(255, 180, 255, 0.7)');
      gradient.addColorStop(0.4, 'rgba(100, 200, 255, 0.6)');
      gradient.addColorStop(0.6, 'rgba(195, 255, 195, 0.5)');
      gradient.addColorStop(0.8, 'rgba(255, 255, 180, 0.4)');
      gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.1)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      return new THREE.CanvasTexture(canvas);
    };
    
    // Create environment map for reflections
    const createEnvMap = () => {
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
      cubeRenderTarget.texture.type = THREE.HalfFloatType;
      
      // Simplified environment map with gradient colors
      const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      scene.background = new THREE.Color(0xffffff);
      cubeCamera.update(renderer, scene);
      scene.background = null;
      
      return cubeRenderTarget.texture;
    };
    
    const envMap = createEnvMap();
    
    // Create bubbles in a circular spread
    const createBubble = (index, totalBubbles) => {
      // Calculate position in a circular pattern
      const angle = (index / totalBubbles) * Math.PI * 2;
      const radius = Math.random() * 3 + 8; // Large radius for spread out arrangement
      
      // Position based on circular arrangement plus some randomness
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 3;
      
      // Vary z for depth
      const z = (Math.random() - 0.5) * 5;
      
      // Vary size but maintain realistic bubble proportions
      const size = Math.random() * 1.5 + 0.8;
      
      // Create highly detailed sphere for the bubble
      const geometry = new THREE.SphereGeometry(size, 128, 128);
      
      // Create the iridescent texture
      const iridescentTexture = createIridescentTexture();
      
      // Material settings for realistic soap bubbles
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        metalness: 0.1,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2,
        reflectivity: 1.0,
        iridescence: 0.8,
        iridescenceIOR: 1.8,
        envMap: envMap,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
        alphaMap: createIridescentTexture(),
        transmission: 0.99,
        thickness: 0.5,
        ior: 1.33
      });
      
      const bubble = new THREE.Mesh(geometry, material);
      bubble.position.set(x, y, z);
      
      // Store initial position for animation
      bubble.userData = {
        initialX: x,
        initialY: y,
        initialZ: z,
        speed: Math.random() * 0.001 + 0.0005, // Very slow movement for realistic bubbles
        angle: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 0.2 + 0.1, // Subtle movement
        rotationSpeed: (Math.random() - 0.5) * 0.003, // Very slow rotation
        phase: Math.random() * Math.PI * 2,
        // For simulating bubble drift
        driftX: (Math.random() - 0.5) * 0.001,
        driftY: (Math.random() - 0.5) * 0.001,
        size: size
      };
      
      scene.add(bubble);
      return bubble;
    };
    
    // Enhanced lighting for bubble iridescence
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    scene.add(new THREE.DirectionalLight(0xffffff, 1.0));
    
    // Create more bubbles but spread them out in a circular pattern
    const totalBubbles = 12;
    for (let i = 0; i < totalBubbles; i++) {
      bubbles.current.push(createBubble(i, totalBubbles));
    }
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight
      };
    };
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    // Animation loop with subtle realistic movement
    const animate = () => {
      const time = Date.now() * 0.0005;
      
      bubbles.current.forEach((bubble, index) => {
        const { 
          initialX, initialY, initialZ, 
          speed, angle, amplitude, rotationSpeed,
          phase, driftX, driftY, size
        } = bubble.userData;
        
        // Simulating subtle floating with sine waves of different frequencies
        const floatY = Math.sin(time * speed + phase) * amplitude;
        const floatX = Math.cos(time * speed * 0.7 + phase) * (amplitude * 0.5);
        
        // Add slow circular motion
        const circleX = Math.cos(angle + time * 0.1) * 0.02;
        const circleY = Math.sin(angle + time * 0.1) * 0.02;
        
        // Calculate slow drift movement
        bubble.userData.initialX += driftX;
        bubble.userData.initialY += driftY + 0.0001; // Slight upward drift
        
        // Apply all movements
        bubble.position.x = bubble.userData.initialX + floatX + circleX;
        bubble.position.y = bubble.userData.initialY + floatY + circleY;
        bubble.position.z = initialZ + Math.sin(time * 0.2 + index) * 0.1;
        
        // Very subtle rotation for realistic bubble movement
        bubble.rotation.x += rotationSpeed * 0.2;
        bubble.rotation.y += rotationSpeed * 0.15;
        
        // Update iridescence based on viewing angle for prism effect
        const viewAngle = camera.position.angleTo(bubble.position);
        bubble.material.iridescenceIOR = 1.8 - (viewAngle * 0.2);
        
        // Subtle scale variation for breathing effect
        const breathingScale = 1 + Math.sin(time * 0.3 + index * 0.5) * 0.01;
        bubble.scale.set(breathingScale, breathingScale, breathingScale);
        
        // Subtle mouse interaction - gentle attraction or repulsion
        const distX = bubble.position.x - (mousePosition.current.x - 0.5) * 10;
        const distY = bubble.position.y - (mousePosition.current.y - 0.5) * -10;
        const dist = Math.sqrt(distX * distX + distY * distY);
        
        if (dist < 5) {
          // Slight movement away from mouse for realism
          bubble.position.x += distX * 0.001;
          bubble.position.y += distY * 0.001;
          
          // Increase iridescence when near mouse
          bubble.material.iridescence = Math.min(0.9, bubble.material.iridescence + 0.01);
        } else {
          // Return to normal iridescence
          bubble.material.iridescence = Math.max(0.7, bubble.material.iridescence - 0.01);
        }
      });
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      cancelAnimationFrame(animationRef.current);
      mountRef.current?.removeChild(renderer.domElement);
      
      // Dispose of geometries and materials
      bubbles.current.forEach((bubble) => {
        bubble.geometry.dispose();
        bubble.material.dispose();
        if (bubble.material.map) bubble.material.map.dispose();
        if (bubble.material.alphaMap) bubble.material.alphaMap.dispose();
        scene.remove(bubble);
      });
      
      bubbles.current = [];
      envMap.dispose();
    };
  }, []);
  
  return <div ref={mountRef} className={styles.bubbleContainer}></div>;
};

export default Bubbles;