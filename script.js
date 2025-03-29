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

// Initialize scene with better lighting setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true // Add transparency support
});
renderer.setSize(800, 600);
renderer.setPixelRatio(window.devicePixelRatio); // For better quality on HiDPI screens
document.getElementById('model-container').appendChild(renderer.domElement);

// Improved lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Brighter ambient
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(1, 1, 1);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

// Enhanced orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;
controls.minDistance = 1;
controls.maxDistance = 100;

// Add grid helper (optional)
const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x888888);
gridHelper.visible = false; // Toggle with button if needed
scene.add(gridHelper);

// Load model with better error handling
const loader = new GLTFLoader();
const modelPath = 'models/ENGR 248 Midterm.gltf';

loader.load(
    modelPath,
    (gltf) => {
        const model = gltf.scene;
        
        // Center and scale model properly
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.sub(center);
        
        // Auto-scale for better viewing
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        model.scale.set(scale, scale, scale);
        
        scene.add(model);
        
        // Position camera
        camera.position.z = 5;
        controls.target.copy(center);
        controls.update();
        
        console.log('Model loaded successfully:', model);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('Error loading model:', error);
        // Display error message to user
        const errorMsg = document.createElement('div');
        errorMsg.style.color = 'red';
        errorMsg.textContent = `Failed to load model: ${error.message}`;
        document.getElementById('model-container').appendChild(errorMsg);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Reset view button
document.getElementById('reset-view')?.addEventListener('click', () => {
    controls.reset();
});

// Add loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.textContent = 'Loading 3D model...';
loadingIndicator.style.position = 'absolute';
loadingIndicator.style.top = '10px';
loadingIndicator.style.left = '10px';
loadingIndicator.style.color = 'black';
document.getElementById('model-container').appendChild(loadingIndicator);

// Remove loading indicator when model loads
loader.load = function (url, onLoad, onProgress, onError) {
    const loader = new THREE.FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType('arraybuffer');
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    
    loader.load(url, (buffer) => {
        this.parse(buffer, url, (gltf) => {
            document.getElementById('model-container').removeChild(loadingIndicator);
            onLoad(gltf);
        }, onError);
    }, onProgress, onError);
};