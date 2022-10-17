import { useEffect } from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.x = 0;
    camera.position.z = 0;
    camera.position.y = 20;
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById('myThreeJsCanvas')
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xFFC0CB, 2);
    ambientLight.castShadow = true;
    ambientLight.physicallyCorrectLights = true;
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.castShadow = true;
    spotLight.position.set(12, 64, 32);
    spotLight.physicallyCorrectLights = true;
    scene.add(spotLight);

    const spotLight2 = new THREE.SpotLight(0xffffff, 2);
    spotLight.castShadow = false;
    spotLight.position.set(12, -64, -32);
    spotLight.physicallyCorrectLights = true;
    scene.add(spotLight2);

    const loader = new GLTFLoader().setPath('https://raw.githubusercontent.com/GanyuHail/bl3/main/src/');
    loader.load('baesLogoMaster4.gltf', function (gltf) {
      antialias = true; 
      scene.add(gltf.scene);
    });

    document.addEventListener('mousedown', onMouseDown);

    function onMouseDown(event) {
      event.preventDefault();
      
      const mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerheight) * 2 - 1, 0.5)
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse3D, camera)
      const intersects = raycaster.intersectObjects(objects, true);
      if (intersects.length > 0) {
        console.log("click!");
        //intersects[0].object.material.color.setHex(Math.random() * 0xffffff)
      }
    };

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
};

export default App;
