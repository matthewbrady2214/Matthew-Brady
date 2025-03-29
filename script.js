document.addEventListener('DOMContentLoaded', function() {
    // Get your form element
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    // Add event listener for form submission
    if (form) {
        form.addEventListener('submit', function(event) {
            // Prevent the default form submission
            event.preventDefault();
            
            // Update button to show loading state
            const submitButton = form.querySelector('.submit-btn');
            const originalText = submitButton.innerText;
            submitButton.innerText = 'Sending...';
            submitButton.disabled = true;
            
            // Clear any previous status messages
            formStatus.innerHTML = '';
            formStatus.className = 'form-status';
            
            // Get form data
            const formData = new FormData(form);
            
            // Send the data to Formspree
            fetch('https://formspree.io/f/xkgjvrla', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Show success message
                formStatus.innerHTML = 'Thanks! Your message has been sent.';
                formStatus.className = 'form-status success';
                
                // Reset the form
                form.reset();
            })
            .catch(error => {
                // Show error message
                formStatus.innerHTML = 'Oops! There was a problem submitting your form. Please try again.';
                formStatus.className = 'form-status error';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitButton.innerText = originalText;
                submitButton.disabled = false;
            });
        });
    }
});


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Initialize scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer configuration
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});
renderer.setSize(800, 600);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
document.getElementById('model-container').appendChild(renderer.domElement);

// Enhanced lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(1, 1, 1);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

// Orbit controls with improved feel
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.8;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;
controls.minDistance = 0.5;
controls.maxDistance = 50;
controls.target.set(0, 0, 0);

// Debug helpers (toggleable)
const axesHelper = new THREE.AxesHelper(2);
axesHelper.visible = false;
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x888888);
gridHelper.visible = false;
scene.add(gridHelper);

// Model loading with robust error handling
const loader = new GLTFLoader();
let currentModel = null;

// Loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.innerHTML = `
    <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
    ">
        Loading 3D model...
        <div style="
            margin-top: 10px;
            height: 4px;
            background: #444;
            width: 200px;
        ">
            <div id="progress-bar" style="
                height: 100%;
                width: 0%;
                background: #4CAF50;
                transition: width 0.1s;
            "></div>
        </div>
    </div>
`;
document.getElementById('model-container').appendChild(loadingIndicator);

// Load your SolidWorks model
loader.load(
    'models/EGR 248 Midterm.gltf',
    (gltf) => {
        // Success callback
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('Error loading model:', error);
        // Check if it's a 404 error
        fetch('models/EGR 248 Midterm.gltf')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                if (text.startsWith('<!')) {
                    throw new Error('Server returned HTML (likely 404)');
                }
            })
            .catch(err => {
                console.error('File check failed:', err);
                alert(`Model file not found. Please ensure:
                - EGR 248 Midterm.gltf
                - EGR 248 Midterm.bin
                are in the models/ folder`);
            });
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Responsive handling
function handleResize() {
    const container = document.getElementById('model-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.addEventListener('resize', handleResize);
handleResize(); // Initial sizing

// Debug controls
document.getElementById('reset-view')?.addEventListener('click', () => {
    controls.reset();
});

document.getElementById('toggle-grid')?.addEventListener('click', () => {
    gridHelper.visible = !gridHelper.visible;
});

document.getElementById('toggle-axes')?.addEventListener('click', () => {
    axesHelper.visible = !axesHelper.visible;
});