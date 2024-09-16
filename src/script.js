import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'


const gui = new GUI()
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//* Textures
// const textureLoader = new THREE.TextureLoader()
// const sunTexture = textureLoader.load('./textures/matcaps/4.jpg')
// const earthTexture = textureLoader.load('./textures/matcaps/7.jpg')


// earthTexture.colorSpace = THREE.SRGBColorSpac


//* Meshes
const planets = [];
function createPlanet(size, distanceFromSun, texturePath, orbitSpeed,) {
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load(texturePath);
    planetTexture.colorSpace = THREE.SRGBColorSpace

    const planetMaterial = new THREE.MeshMatcapMaterial({ matcap: planetTexture });
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    planet.userData = { orbitRadius: distanceFromSun, orbitSpeed: orbitSpeed, orbitAngle: 0 };  // Add custom data for orbit

    planet.position.set(distanceFromSun, 0, 0);  // Initial position on the X-axis
    scene.add(planet);

    planets.push(planet);  // Add to planets array for updating the orbit in the render loop
}


//#region //* Sun
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('./textures/matcaps/sun.jpg');
sunTexture.colorSpace = THREE.SRGBColorSpace

const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshMatcapMaterial({ matcap: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

//#endregion

//* Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// scene.add(directionalLight)
// const pointLight = new THREE.PointLight(0xffffff, 1, 100)
// // pointLight.position.set(50, 50, 50)
// scene.add(pointLight)

// Create planets with different sizes, distances, textures, and speeds
createPlanet(0.05, 1, './textures/matcaps/mercury.jpg', 0.02);  // Mercury
createPlanet(0.1, 3, './textures/matcaps/venus.jpg', 0.01);  // Venus
createPlanet(0.1, 5, './textures/matcaps/earth.jpg', 0.009);  // Earth
createPlanet(0.09, 7, './textures/matcaps/mars.jpg', 0.008);  // Mars
createPlanet(1.0, 9, './textures/matcaps/jupiter.jpg', 0.007);  // Jupiter
createPlanet(0.8, 11, './textures/matcaps/saturn.jpg', 0.006, true);  // Saturn
createPlanet(0.5, 13, './textures/matcaps/uranus.jpg', 0.005);  // Uranus
createPlanet(0.5, 14, './textures/matcaps/neptune.jpg', 0.004);  // Neptune


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 20

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // console.log(elapsedTime);

    // Update controls
    controls.update()

    planets.forEach(planet => {
        // Increase the orbit angle based on the orbit speed
        planet.userData.orbitAngle += planet.userData.orbitSpeed;

        // Calculate new X and Z positions (since we're orbiting on the XZ plane)
        const x = Math.cos(planet.userData.orbitAngle) * planet.userData.orbitRadius;
        const z = Math.sin(planet.userData.orbitAngle) * planet.userData.orbitRadius;

        // Update the planet's position
        planet.position.set(x, 0, z);
    });

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()