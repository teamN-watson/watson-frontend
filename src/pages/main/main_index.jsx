import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import '@assets/css/main/main_index.css';

// 게임 데이터 (예시)
const gameData = [
  {
    id: 1,
    title: 'RimWorld',
    price: 37500,
    image: 'https://example.com/rimworld.jpg',
    description: '재미있는 게임입니다.',
  },
  // ... 다른 게임 데이터
];

function MainIndex() {
  const containerRef = useRef(null);
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Three.js 초기화
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 배경색 설정
    scene.background = new THREE.Color('#0A0E1A');

    // 게임 노드 생성 함수
    const createGameNode = (game, index) => {
      const geometry = new THREE.SphereGeometry(game.popularity * 0.1, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0x4A9DFF,
        transparent: true,
        opacity: 0.8,
      });
      const node = new THREE.Mesh(geometry, material);
      
      // 노드 위치 설정 (원형으로 배치)
      const angle = (index / 20) * Math.PI * 2;
      const radius = 10;
      node.position.x = Math.cos(angle) * radius;
      node.position.y = Math.sin(angle) * radius;
      node.position.z = 0;

      return node;
    };

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00FFFF, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // 카메라 위치 설정
    camera.position.z = 20;

    // 더미 게임 데이터
    const dummyGames = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Game ${i + 1}`,
      popularity: Math.random() * 2 + 1,
      genre: ['RPG', 'Action', 'Adventure'][Math.floor(Math.random() * 3)],
    }));

    // 게임 노드 생성 및 추가
    const nodes = dummyGames.map((game, index) => createGameNode(game, index));
    nodes.forEach(node => scene.add(node));

    // 연결선 생성 (같은 장르의 게임끼리 연결)
    const createConnections = () => {
      dummyGames.forEach((game1, i) => {
        dummyGames.forEach((game2, j) => {
          if (i < j && game1.genre === game2.genre) {
            const geometry = new THREE.BufferGeometry().setFromPoints([
              nodes[i].position,
              nodes[j].position,
            ]);
            const material = new THREE.LineBasicMaterial({
              color: 0x4A9DFF,
              transparent: true,
              opacity: 0.3,
            });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
          }
        });
      });
    };

    createConnections();

    // 애니메이션 함수
    const animate = () => {
      requestAnimationFrame(animate);

      // 노드 회전
      nodes.forEach(node => {
        node.rotation.x += 0.01;
        node.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 마우스 이벤트 처리
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes);

      nodes.forEach(node => {
        node.material.opacity = 0.8;
      });

      if (intersects.length > 0) {
        intersects[0].object.material.opacity = 1;
      }
    };

    const onClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes);

      if (intersects.length > 0) {
        const index = nodes.indexOf(intersects[0].object);
        navigate(`/game/${dummyGames[index].id}`);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

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
    <div className="main-container">
      <div ref={containerRef} className="canvas-container" />
      <div className="overlay">
        <h1>Watson Game Network</h1>
        <p>인기 게임들을 탐험해보세요</p>
      </div>
    </div>
  );
}

export default MainIndex;