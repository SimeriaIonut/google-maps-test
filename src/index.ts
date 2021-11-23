import "./style.css";

import { Tween, update, Easing } from "@tweenjs/tween.js";
import { AmbientLight, DirectionalLight, Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ThreeJSOverlayView } from "@googlemaps/three";

let map: google.maps.Map;

const cameraOptions: google.maps.CameraOptions = {
  tilt: 65,
  heading: 0,
  zoom: 6,
  center: { lat: 50.913320505188125, lng: 23.046264581148943 }
};

const mapOptions = {
  ...cameraOptions,
  mapId: "15431d2b469f209e"
};

function animateToPos(position: GeolocationPosition) {
  let animationFrameId: number = 0;
  new Tween(cameraOptions) // Create a new tween that modifies 'cameraOptions'.
    .to(
      {
        tilt: 65,
        zoom: 17,
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      },
      5000
    ) // Move to destination in 15 second.
    .easing(Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(() => {
      map.moveCamera(cameraOptions);
    })
    .onComplete(() => cancelAnimationFrame(animationFrameId))
    .onStop(() => cancelAnimationFrame(animationFrameId))
    .start(); // Start the tween immediately.

  // Setup the animation loop.
  function animate(time: number) {
    animationFrameId = requestAnimationFrame(animate);
    update(time);
  }

  animationFrameId = requestAnimationFrame(animate);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      animateToPos(position);
    });
  }
}

function initMap(): void {
  map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    mapOptions
  );

  // Three.js
  const scene = new Scene();
  const ambientLight = new AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);
  const directionalLight = new DirectionalLight(0xffffff, 0.25);
  directionalLight.position.set(0, 10, 50);
  scene.add(directionalLight);

  // // Load the model.
  // const loader = new GLTFLoader();
  // const url =
  // "https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf";

  // loader.load(url, (gltf) => {
  //   gltf.scene.scale.set(10, 10, 10);
  //   gltf.scene.rotation.x = Math.PI / 2;
  //   scene.add(gltf.scene);

  //   let { tilt, heading, zoom } = mapOptions;

  //   const animate = () => {
  //     if (tilt < 67.5) {
  //       tilt += 0.5;
  //     } else if (heading <= 360) {
  //       heading += 0.2;
  //       zoom -= 0.0005;
  //     } else {
  //       // exit animation loop
  //       return;
  //     }

  //     map.moveCamera({ tilt, heading, zoom });

  //     requestAnimationFrame(animate);
  //   };

  //   requestAnimationFrame(animate);
  // });

  // new ThreeJSOverlayView({
  //   map,
  //   scene,
  //   anchor: { ...mapOptions.center, altitude: 100 }
  // });

  getLocation();
}
export { initMap };
