import { useEffect } from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import DRACOLoader from 'three-dracoloader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let selectedObject = null;

function App() {
  useEffect(() => {

    const progressBar = document.getElementById('progress-bar');
    THREE.DefaultLoadingManager.onProgress = function (url, loaded, total) {
      progressBar.value = (loaded / total) * 100;
    };
    THREE.DefaultLoadingManager.onStart = function (url, loaded, total) {
      progressBar.value = (loaded / total) * 100;
    };
    const progressBarContainer = document.querySelector('.progress-bar-container');
    THREE.DefaultLoadingManager.onLoad = function () {
      progressBarContainer.style.display = 'none';
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.x = 0;
    camera.position.z = 5;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    const canvas = document.getElementById('myThreeJsCanvas')
    const renderer = new THREE.WebGLRenderer({
      canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    //spotLight.castShadow = true;
    spotLight.position.set(12, 64, 32);
    spotLight.physicallyCorrectLights = true;
    scene.add(spotLight);

    // const spotLight2 = new THREE.SpotLight(0xffffff, 1.5);
    // // //spotLight.castShadow = true;
    // spotLight2.position.set(-12, -64, -32);
    // spotLight.physicallyCorrectLights = true;
    // scene.add(spotLight2);

    const loader = new GLTFLoader().setPath('https://raw.githubusercontent.com/GanyuHail/romance/main/src/');
    var dracoLoader = new DRACOLoader();
    DRACOLoader.setDecoderPath('/three-dracoloader');
    loader.setDRACOLoader(dracoLoader);

    loader.load('romance.gltf', function (gltf) {
      scene.add(gltf.scene);
    });
    //   function (xhr) {
    //     console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    //   },

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onMouseDown);
    window.addEventListener('touchend', touchEnd);

    function onPointerMove(event) {
      if (selectedObject) {
        //selectedObject.material.color.set('white');
        selectedObject = null;
      }

      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let i = 0; i < intersects.length; i++) {
        const intersect = intersects[i];

        if (intersect && intersect.object) {
          selectedObject = intersect.object;
          intersect.object.material.color.set("pink");
        }
      }
    };

    function onMouseDown(event) {
      if (selectedObject) {
        window.location.href = "https://www.romancefc.com/";
      }
    };

    function touchEnd(event) {
      if (selectedObject) {
        window.location.href = "https://www.romancefc.com/";
      }
    };

    function render() {
      renderer.render(scene, camera);
    };

    window.requestAnimationFrame(render);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    animate();

    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
    });
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
};

export default App;
