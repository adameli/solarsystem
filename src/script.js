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
// const sunTexture = textureLoader.load('./textures/matcaps/4.png')
// const earthTexture = textureLoader.load('./textures/matcaps/7.png')


// earthTexture.colorSpace = THREE.SRGBColorSpace

//* Orbit planet function
function orbitPlanet(planet, radius, speed) {
    let angle = 0

    gsap.to(planet.position, {
        duration: speed,
        repeat: -1,  // Infinite loop
        modifiers: {
            x: () => Math.cos(angle) * radius,  // Update X position based on the angle
            z: () => Math.sin(angle) * radius,  // Update Z position based on the angle
        },
        onUpdate: () => {
            angle += 0.02;  // Increment the angle each time the update happens
        }
    });
}

// Earth orbits at radius 5 with a 10s period


//* Meshes
const planets = [];

// Create a planet object and add it to the scene and the planets array
function createPlanet(size, distanceFromSun, texturePath, orbitSpeed) {
    const textureLoader = new THREE.TextureLoader();
    const planetTexture = textureLoader.load(texturePath);
    planetTexture.colorSpace = THREE.SRGBColorSpace

    const planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    planet.userData = { orbitRadius: distanceFromSun, orbitSpeed: orbitSpeed, orbitAngle: 0 };  // Add custom data for orbit

    planet.position.set(distanceFromSun, 0, 0);  // Initial position on the X-axis
    scene.add(planet);

    planets.push(planet);  // Add to planets array for updating the orbit in the render loop
}

// Create the sun and some planets
const sunGeometry = new THREE.SphereGeometry(.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets with different sizes, distances, textures, and speeds
createPlanet(0.1, 5, './textures/matcaps/7.png', 0.01);  // Earth
createPlanet(0.09, 7, './textures/matcaps/1.png', 0.008);  // Mars
createPlanet(1.0, 9, './textures/matcaps/6.png', 0.005);  // Jupiter

//#region //* Sun
// const material = new THREE.MeshMatcapMaterial({
//     matcap: sunTexture
// })
// const geometry = new THREE.SphereGeometry(.5, 64, 64)
// const sun = new THREE.Mesh(geometry, material)
// scene.add(sun)
// //#endregion

// //#region //* Sun
// const earthMaterial = new THREE.MeshMatcapMaterial({
//     matcap: earthTexture
// })
// const geometryEarth = new THREE.SphereGeometry(.1, 64, 64)
// const earth = new THREE.Mesh(geometryEarth, earthMaterial)
// earth.position.set(2, 0, 0)
// scene.add(earth)

// orbitPlanet(earth, 5, 10);
//#endregion

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 10

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