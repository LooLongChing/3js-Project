import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameter = {}
parameter.count = 100000
parameter.size = 0.01
parameter.radius = 5
parameter.branches = 3
parameter.spin = 1
parameter.randomness = 0.2
parameter.randomnessPower = 3
parameter.insideColor = '#ff6030'
parameter.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    if(geometry !== null){
        /**
         * Destroy old galaxy
         */
        if(points !== null){
            geometry.dispose()
            material.dispose()
            scene.remove(points)
        }
    }

    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameter.count * 3)
    const colors = new Float32Array(parameter.count * 3)

    const colorInside = new THREE.Color(parameter.insideColor)
    const colorOutside = new THREE.Color(parameter.outsideColor)

    for(let i = 0; i < parameter.count; i++){
        const i3 = i * 3

        // Position
        // Adjust the radius calculation to concentrate more particles at radius = 0
        const radius = Math.pow(Math.random(), 2) * parameter.radius; // Square the random value to bias towards 0
        const spinAngle = radius * parameter.spin
        const branchAngle =  (i % parameter.branches) / parameter.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameter.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameter.radius)

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
    
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameter.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Point
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateGalaxy()
gui.add(parameter, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameter, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameter, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameter, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameter, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameter, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameter, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameter, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameter, 'outsideColor').onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()