import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Layers, Palette, Cpu } from 'lucide-react';

export default function ThreeModelViewer({
  geometryType = 'gear',
  color = '#f97316',
  materialType = 'pla-silk',
  showControls = true,
  height = '380px',
  interactive = true,
}) {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeColor, setActiveColor] = useState(color);
  const [sliceProgress, setSliceProgress] = useState(100);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const meshGroupRef = useRef(null);
  const materialRef = useRef(null);
  const requestRef = useRef(null);

  const previewColors = [
    { name: 'Сигнальный оранжевый', hex: '#FF5A1F' },
    { name: 'Золото (Silk)', hex: '#D4AF37' },
    { name: 'Карбоновый черный', hex: '#1E293B' },
    { name: 'Белый фарфор', hex: '#F8FAFC' },
    { name: 'Изумрудный шелк', hex: '#10B981' },
    { name: 'Серый металлик', hex: '#64748B' },
  ];

  useEffect(() => {
    setActiveColor(color);
  }, [color]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const heightPx = container.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 75, 120);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(50, 80, 50);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf97316, 0.5);
    dirLight2.position.set(-60, 40, -40);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x38bdf8, 0.3, 200);
    pointLight.position.set(0, -20, 60);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(100, 20, 0xf97316, 0x1e293b);
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    const plateGeo = new THREE.BoxGeometry(104, 2, 104);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.2,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = -21;
    scene.add(plateMesh);

    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    const meshMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeColor),
      metalness: materialType.includes('silk') ? 0.35 : 0.1,
      roughness: materialType.includes('silk') ? 0.25 : 0.5,
      wireframe: wireframe,
    });
    materialRef.current = meshMaterial;

    buildModelGeometry(group, geometryType, meshMaterial);
    camera.lookAt(0, 0, 0);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      group.rotation.y += deltaX * 0.015;
      group.rotation.x += deltaY * 0.01;
      group.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, group.rotation.x));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      if (!interactive) return;
      e.preventDefault();
      camera.position.z += e.deltaY * 0.08;
      camera.position.z = Math.max(50, Math.min(220, camera.position.z));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        group.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(requestRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [geometryType]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.wireframe = wireframe;
      materialRef.current.color.set(activeColor);
    }
  }, [wireframe, activeColor]);

  useEffect(() => {
    if (meshGroupRef.current) {
      const scale = sliceProgress / 100;
      meshGroupRef.current.scale.y = scale;
      meshGroupRef.current.position.y = (scale - 1) * 15;
    }
  }, [sliceProgress]);

  function buildModelGeometry(parentGroup, type, material) {
    while (parentGroup.children.length > 0) {
      parentGroup.remove(parentGroup.children[0]);
    }

    if (type === 'gear') {
      const cylinderGeo = new THREE.CylinderGeometry(20, 20, 10, 32);
      const mainCylinder = new THREE.Mesh(cylinderGeo, material);
      parentGroup.add(mainCylinder);

      const teethCount = 14;
      for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        const toothGeo = new THREE.BoxGeometry(5, 10, 7);
        const tooth = new THREE.Mesh(toothGeo, material);
        tooth.position.x = Math.cos(angle) * 21;
        tooth.position.z = Math.sin(angle) * 21;
        tooth.rotation.y = -angle;
        parentGroup.add(tooth);
      }

      const innerRingGeo = new THREE.TorusGeometry(8, 2, 16, 32);
      const innerRing = new THREE.Mesh(innerRingGeo, material);
      innerRing.rotation.x = Math.PI / 2;
      parentGroup.add(innerRing);
    } else if (type === 'ornament_napkin') {
      const baseGeo = new THREE.BoxGeometry(50, 4, 30);
      const base = new THREE.Mesh(baseGeo, material);
      base.position.y = -10;
      parentGroup.add(base);

      for (let side of [-12, 12]) {
        const wingGroup = new THREE.Group();
        wingGroup.position.z = side;

        const archGeo = new THREE.CylinderGeometry(18, 22, 4, 32, 1, false, 0, Math.PI);
        const arch = new THREE.Mesh(archGeo, material);
        arch.rotation.z = Math.PI / 2;
        arch.position.y = 8;
        wingGroup.add(arch);

        const hornGeoL = new THREE.TorusGeometry(8, 2, 16, 32, Math.PI * 1.4);
        const hornL = new THREE.Mesh(hornGeoL, material);
        hornL.position.set(-10, 8, 0);
        hornL.rotation.z = 0.5;
        wingGroup.add(hornL);

        const hornGeoR = new THREE.TorusGeometry(8, 2, 16, 32, Math.PI * 1.4);
        const hornR = new THREE.Mesh(hornGeoR, material);
        hornR.position.set(10, 8, 0);
        hornR.rotation.z = -0.5;
        wingGroup.add(hornR);

        parentGroup.add(wingGroup);
      }
    } else if (type === 'lithophane') {
      const curveGeo = new THREE.CylinderGeometry(30, 30, 45, 48, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
      const panel = new THREE.Mesh(curveGeo, material);
      panel.position.y = 5;
      parentGroup.add(panel);

      const standGeo = new THREE.CylinderGeometry(34, 36, 8, 32);
      const stand = new THREE.Mesh(standGeo, material);
      stand.position.y = -16;
      parentGroup.add(stand);
    } else if (type === 'bracket') {
      const flange1Geo = new THREE.BoxGeometry(40, 8, 40);
      const flange1 = new THREE.Mesh(flange1Geo, material);
      flange1.position.y = -12;
      parentGroup.add(flange1);

      const flange2Geo = new THREE.BoxGeometry(40, 40, 8);
      const flange2 = new THREE.Mesh(flange2Geo, material);
      flange2.position.set(0, 8, -16);
      parentGroup.add(flange2);

      const ribGeo = new THREE.ConeGeometry(16, 24, 4);
      const rib = new THREE.Mesh(ribGeo, material);
      rib.position.set(0, -2, -4);
      rib.rotation.y = Math.PI / 4;
      parentGroup.add(rib);
    } else if (type === 'mask') {
      const sphereGeo = new THREE.IcosahedronGeometry(22, 1);
      const head = new THREE.Mesh(sphereGeo, material);
      head.scale.set(0.9, 1.2, 1.1);
      head.position.y = 2;
      parentGroup.add(head);

      const visorGeo = new THREE.BoxGeometry(26, 6, 12);
      const visor = new THREE.Mesh(visorGeo, material);
      visor.position.set(0, 4, 15);
      parentGroup.add(visor);
    } else {
      const cylGeo = new THREE.CylinderGeometry(15, 22, 45, 16);
      const mesh = new THREE.Mesh(cylGeo, material);
      mesh.position.y = 2;
      parentGroup.add(mesh);
    }
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group select-none"
      style={{ height }}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
        <span className="font-mono text-slate-300">Стол 256×256 мм</span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
        <Cpu className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-slate-300 font-mono">Слои: {Math.round((sliceProgress / 100) * 480)} / 480</span>
      </div>

      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
            {previewColors.map((c) => (
              <button
                key={c.hex}
                title={c.name}
                onClick={() => setActiveColor(c.hex)}
                className={`w-5 h-5 rounded-full border transition-all ${
                  activeColor === c.hex ? 'border-white scale-110 shadow-sm' : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[11px]">Срез:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={sliceProgress}
              onChange={(e) => setSliceProgress(Number(e.target.value))}
              className="w-20 accent-orange-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setWireframe(!wireframe)}
              title="Сетка полигонов"
              className={`p-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                wireframe
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Сетка</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Авто-вращение"
              className={`p-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                autoRotate
                  ? 'bg-orange-500 text-white border-orange-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[11px] text-slate-300 px-3 py-1 rounded-full border border-slate-800">
        Вращение левой кнопкой мыши • Масштабирование колесиком
      </div>
    </div>
  );
}
