import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router-dom';
import '@assets/css/main/main_index.css';

function MainIndex() {
  const containerRef = useRef(null);
  const [mainGames, setMainGames] = useState([]);
  const [relatedGames, setRelatedGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Three.js 초기화
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 배경색 설정 (#0A0E1A - 진한 남색)
    scene.background = new THREE.Color('#0A0E1A');

    // OrbitControls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 50;

    // 더미 데이터 업데이트 - 이미지 URL 추가
    const mainGameNodes = [
      { 
        id: 1, 
        title: "Cyberpunk 2077", 
        popularity: 1.5, 
        genre: "RPG",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg"
      },
      { 
        id: 2, 
        title: "Elden Ring", 
        popularity: 1.8, 
        genre: "Action",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg"
      },
      { 
        id: 3, 
        title: "Baldur's Gate 3", 
        popularity: 1.6, 
        genre: "RPG",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg"
      },
      { 
        id: 4, 
        title: "Red Dead Redemption 2", 
        popularity: 1.7, 
        genre: "Action",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg"
      },
      { 
        id: 5, 
        title: "The Witcher 3", 
        popularity: 1.4, 
        genre: "RPG",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg"
      }
    ];

    const relatedGameNodes = [
      { 
        id: 6, 
        title: "Mass Effect", 
        mainNode: 1, 
        genre: "RPG",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1328670/header.jpg"
      },
      { 
        id: 7, 
        title: "Dark Souls 3", 
        mainNode: 2, 
        genre: "Action",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg"
      },
      { 
        id: 8, 
        title: "Divinity: OS 2", 
        mainNode: 3, 
        genre: "RPG",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/435150/header.jpg"
      }
    ];

    // 텍스처 로더 생성
    const textureLoader = new THREE.TextureLoader();

    // 노드 생성 함수 수정
    const createNode = (game, isMain = false) => {
      const geometry = new THREE.SphereGeometry(isMain ? 1.5 : 0.8, 32, 32);
      
      // 텍스처 로드 및 적용
      const texture = textureLoader.load(game.image);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        emissive: isMain ? 0x4A9DFF : 0x2A6DDF,
        emissiveIntensity: 0.2
      });

      const node = new THREE.Mesh(geometry, material);
      
      // 게임 제목 스프라이트 생성
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#ffffff';
      context.font = 'bold 24px Arial';
      context.textAlign = 'center';
      context.fillText(game.title, 128, 32);
      
      const titleTexture = new THREE.CanvasTexture(canvas);
      const titleMaterial = new THREE.SpriteMaterial({ 
        map: titleTexture,
        transparent: true 
      });
      const titleSprite = new THREE.Sprite(titleMaterial);
      
      // 스프라이트 위치 조정
      titleSprite.position.y = isMain ? 2 : 1.2;
      titleSprite.scale.set(4, 1, 1);
      
      // 스프라이트를 노드의 자식으로 추가
      node.add(titleSprite);
      
      node.userData = { ...game, isMain };
      return node;
    };

    // 메인 노드 생성 및 배치
    const mainNodes = mainGameNodes.map((game, i) => {
      const angle = (i / mainGameNodes.length) * Math.PI * 2;
      const node = createNode(game, true);
      const radius = 10;
      node.position.x = Math.cos(angle) * radius;
      node.position.y = Math.sin(angle) * radius;
      scene.add(node);
      return node;
    });

    // 관련 게임 노드 생성 및 연결
    const relatedNodes = relatedGameNodes.map(game => {
      const node = createNode(game);
      const mainNode = mainNodes[game.mainNode - 1];
      const angle = Math.random() * Math.PI * 2;
      const radius = 5;
      node.position.x = mainNode.position.x + Math.cos(angle) * radius;
      node.position.y = mainNode.position.y + Math.sin(angle) * radius;
      node.position.z = Math.random() * 4 - 2;
      scene.add(node);

      // 연결선 생성
      const points = [mainNode.position, node.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4A9DFF,
        transparent: true,
        opacity: 0.3
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);

      return node;
    });

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00FFFF, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 30;

    // 마우스 인터랙션
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([...mainNodes, ...relatedNodes]);

      [...mainNodes, ...relatedNodes].forEach(node => {
        node.material.opacity = 0.9;
        node.material.emissiveIntensity = 0.2;
      });

      if (intersects.length > 0) {
        const hovered = intersects[0].object;
        hovered.material.opacity = 1;
        hovered.material.emissiveIntensity = 0.5;
        
        // 호버 시 게임 제목 표시
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const onClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([...mainNodes, ...relatedNodes]);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        navigate(`/game/${clicked.userData.id}`);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // 애니메이션
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // 노드 자체 회전
      [...mainNodes, ...relatedNodes].forEach(node => {
        node.rotation.x += 0.01;
        node.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 창 크기 변경 대응
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onWindowResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [navigate]);

  return (
    <div className="network-container">
      <div ref={containerRef} className="canvas-container" />
      <div className="overlay">
        <h1>Watson Game Network</h1>
        <p>당신의 취향에 맞는 게임을 발견하세요</p>
      </div>
    </div>
  );
}

export default MainIndex;