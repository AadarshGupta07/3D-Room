import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fragmentShader from './shaders/logo/fragment.glsl'
import vertexShader from './shaders/logo/vertex.glsl'
import gsap from 'gsap'


// Select the loader element
const loaderr = document.getElementById('loader');
// Hide the loader and reveal the page when the content is fully loaded
window.addEventListener('load', () => {
    gsap.to(loaderr, { opacity: 0, duration: 1, onComplete: () => {
      loaderr.style.display = 'none';
      document.body.style.overflowY = 'scroll';
    }});
  });
  
  // Show the loader when the DOM is loading
  document.addEventListener('DOMContentLoaded', () => {
    loaderr.style.display = 'block';
  });
// Debug
const debugObject = {}

// const gui = new dat.GUI({
//     width: 300
// })

//----------Loaders--------
const textureLoader = new THREE.TextureLoader()

// GLTF loader
const gltfLoader = new GLTFLoader()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const light = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(light)

/**
 *  Materials
 */

// Textures

const bakedTexture = textureLoader.load('./baked/Baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

const screenTexture = textureLoader.load('./images/phone.jpg')
// screenTexture.flipY = false
screenTexture.encoding = THREE.sRGBEncoding
const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture })


const tableTexture = textureLoader.load('./baked/wood.jpg')
tableTexture.flipY = false
tableTexture.encoding = THREE.sRGBEncoding

const earTexture = textureLoader.load('./baked/ear.jpg')
earTexture.flipY = false
earTexture.encoding = THREE.sRGBEncoding

const frameOneTexture = textureLoader.load('./images/blank.jpg')
frameOneTexture.flipY = false
frameOneTexture.encoding = THREE.sRGBEncoding

const frameTwoTexture = textureLoader.load('./images/bean.jpg')
frameTwoTexture.flipY = false
frameTwoTexture.encoding = THREE.sRGBEncoding

const frameThreeTexture = textureLoader.load('./images/nikola.jpg')
frameThreeTexture.flipY = false
frameThreeTexture.encoding = THREE.sRGBEncoding

// const drawerTexture = textureLoader.load('drawer.jpg')
// drawerTexture.flipY = false
// drawerTexture.encoding = THREE.sRGBEncoding


let logoMesh;
//model 
gltfLoader.load(
    './models/Room.glb',
    (gltf) => {
        const bakedMesh = gltf.scene.children.find((child) => {
            return child.name === 'merged'
        })

        logoMesh = gltf.scene.children.find((child) => {
            return child.name === 'ThreeJsLogo'
        })
        logoMesh.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                startColor: { value: new THREE.Color(0xff00ff) },
                stopColor: { value: new THREE.Color(0x00ffff) },
                gradientStop: { value: 0.5 },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        })

        const frameOneMesh = gltf.scene.children.find((child) => {
            return child.name === 'frameOne'
        })
        frameOneMesh.material = new THREE.MeshBasicMaterial({ color: 'black' })

        const frametwoMesh = gltf.scene.children.find((child) => {
            return child.name === 'frameTwo'
        })
        frametwoMesh.material = new THREE.MeshBasicMaterial({ map: frameTwoTexture })

        const frameThreeMesh = gltf.scene.children.find((child) => {
            return child.name === 'frameThree'
        })
        frameThreeMesh.material = new THREE.MeshBasicMaterial({ map: frameThreeTexture })

        const tvMesh = gltf.scene.children.find((child) => {
            return child.name === 'tvScreen'
        })
        const monitorMesh = gltf.scene.children.find((child) => {
            return child.name === 'monitor'
        })
        const phoneScreenMesh = gltf.scene.children.find((child) => {
            return child.name === 'phoneScreen'
        })
        phoneScreenMesh.material = screenMaterial
        const tableMesh = gltf.scene.children.find((child) => {
            return child.name === 'woodenDesk'
        })
        tableMesh.material = new THREE.MeshBasicMaterial({ map: tableTexture })

        const earMesh = gltf.scene.children.find((child) => {
            return child.name === 'ear'
        })
        earMesh.material = new THREE.MeshStandardMaterial({ map: earTexture })

        const keyboardKeysMesh = gltf.scene.children.find((child) => {
            return child.name === 'keyboardKeys'
        })
        keyboardKeysMesh.material = new THREE.MeshBasicMaterial({ color: 'white' })

        bakedMesh.material = bakedMaterial
        // bakedMesh.material.wireframe = true
        gltf.scene.scale.set(0.1, 0.1, 0.1)
        scene.add(gltf.scene)

        //Get your video element:
        const momentsVideo = document.getElementById("moments");
        const progressVideo = document.getElementById("progress");

        //Created video texture:
        const momentsVideoTexture = new THREE.VideoTexture(momentsVideo);
        momentsVideoTexture.needsUpdate = true;

        const progressVideoTexture = new THREE.VideoTexture(progressVideo);
        momentsVideoTexture.needsUpdate = true;

        const momentsVideoMaterial = new THREE.MeshBasicMaterial({ map: momentsVideoTexture })
        const progressVideoMaterial = new THREE.MeshBasicMaterial({ map: progressVideoTexture })

        // Adapt the size of the video texture to the display mesh size
        tvMesh.material = momentsVideoMaterial
        monitorMesh.material = progressVideoMaterial

        momentsVideoMaterial.needsUpdate = true;
        progressVideoMaterial.needsUpdate = true;
    }
)

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 0
// camera.position.y = 0
// camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 1
controls.maxDistance = 4
controls.dampingFactor = 0.04
controls.enableRotate = true
controls.enableZoom = true
controls.maxPolarAngle = Math.PI / 2.5
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 0.3
debugObject.clearColor = '#04041a'
renderer.setClearColor(debugObject.clearColor)


const normalBtn = document.querySelector('.normal')
const pcBtn = document.querySelector('.pc')
const tvBtn = document.querySelector('.tv')
camera.position.set(1.9322999431245458, 2.3224482889145444, 2.621535976315913)
camera.rotation.set(-0.7249765245869404, 0.504163269395414, 0.40437645425706287)

normalBtn.addEventListener('click', () => {
    //normal

    gsap.to(camera.position, {
        x: 1.9322999431245458,
        y: 2.3224482889145444,
        z: 2.621535976315913,
        duration: 3,
        onComplete: () => {
            controls.enabled = true;
        }
    })
    gsap.to(camera.rotation, {
        // x: -0.7249765245869404,
        y: 0.504163269395414,
        z: 0.40437645425706287,
        duration: 3.2
    })
    camera.rotation.x = -0.7249765245869404

})

tvBtn.addEventListener('click', () => {
    // tv location
    gsap.to(camera.position, {
        x: -0.26225674707749297,
        y: 0.62850237367485,
        z: 0.9444396378887219,
        duration: 3,
        onComplete: () => {
            controls.enabled = false;
        }
    })
    gsap.to(camera.rotation, {
        x: -1.653069310552916,
        y: -1.3940304484922483,
        z: -1.6543656102609152,
        duration: 3.2
    })
})

pcBtn.addEventListener('click', () => {
    // pc location

    gsap.to(camera.position, {
        x: -0.01547422784075411,
        y: 1,
        z: -0.2881334001576344,
        duration: 3,
        onComplete: () => {
            controls.enabled = false;
        }
    })
    gsap.to(camera.rotation, {
        // x: -6.123233995736766,
        y: 0,
        z: 0,
        duration: 3.2
    })
    camera.rotation.x = -6.123233995736766

})

/**
* Animate
*/
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    // controls.update()
    if (logoMesh) {
        logoMesh.material.uniforms.uTime.value = elapsedTime / 8
    }

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()