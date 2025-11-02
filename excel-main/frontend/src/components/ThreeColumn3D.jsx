import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeColumn3D = ({ xData, yData, title }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !xData || !yData) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x3b82f6, 0xe5e7eb);
    scene.add(gridHelper);

    // Process data
    const maxY = Math.max(...yData.filter(v => typeof v === 'number'));
    const dataLength = Math.min(xData.length, yData.length, 50); // Limit to 50 bars

    // Create bars
    for (let i = 0; i < dataLength; i++) {
      const value = typeof yData[i] === 'number' ? yData[i] : 0;
      const height = (value / maxY) * 10;

      const geometry = new THREE.BoxGeometry(0.5, height, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        shininess: 100,
      });
      const bar = new THREE.Mesh(geometry, material);
      
      const xPos = (i - dataLength / 2) * 0.8;
      bar.position.set(xPos, height / 2, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;
      
      scene.add(bar);
    }

    // Axes
    const axesMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
    
    // X-axis
    const xGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(10, 0, 0),
    ]);
    const xAxis = new THREE.Line(xGeometry, axesMaterial);
    scene.add(xAxis);

    // Y-axis
    const yGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 12, 0),
    ]);
    const yAxis = new THREE.Line(yGeometry, axesMaterial);
    scene.add(yAxis);

    // Animation loop
    let angle = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Slow rotation
      angle += 0.003;
      camera.position.x = 15 * Math.cos(angle);
      camera.position.z = 15 * Math.sin(angle);
      camera.lookAt(0, 3, 0);
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [xData, yData]);

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <div ref={containerRef} className="flex-1" style={{ minHeight: '400px' }} data-testid="three-3d-container" />
    </div>
  );
};

export default ThreeColumn3D;
