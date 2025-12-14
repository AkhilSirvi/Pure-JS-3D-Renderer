/**
 * ============================================
 * Application Entry Point & UI Controller
 * ============================================
 * This script initializes the 3D renderer and handles
 * user interactions through range sliders.
 * ============================================
 */

// Initialize the canvas for rendering
Canvas_Define(document.getElementById('myCanvas'));

/* ============================================
 * DOM Element References
 * ============================================ */

// Slider elements
const sliders = {
    xid: document.getElementById('xid'),
    yid: document.getElementById('yid'),
    zid: document.getElementById('zid'),
    tx: document.getElementById('tx'),
    ty: document.getElementById('ty'),
    tz: document.getElementById('tz'),
    fid: document.getElementById('fid')
};

// Value display elements
const displays = {
    xid: document.getElementById('xid-value'),
    yid: document.getElementById('yid-value'),
    zid: document.getElementById('zid-value'),
    tx: document.getElementById('tx-value'),
    ty: document.getElementById('ty-value'),
    tz: document.getElementById('tz-value'),
    fid: document.getElementById('fid-value')
};

// Reset button
const resetBtn = document.getElementById('reset-btn');

/* ============================================
 * Default Values
 * ============================================ */
const defaults = {
    xid: 0,
    yid: 0,
    zid: 0,
    tx: 250,
    ty: 200,
    tz: 200,
    fid: 3000
};

/* ============================================
 * UI Control Variables
 * ============================================ */

// Rotation angles (0-360 degrees)
let xrange = parseFloat(sliders.xid.value);  // X-axis rotation
let yrange = parseFloat(sliders.yid.value);  // Y-axis rotation
let zrange = parseFloat(sliders.zid.value);  // Z-axis rotation

// Translation values (position offset)
let ktx = parseFloat(sliders.tx.value);      // X translation
let kty = parseFloat(sliders.ty.value);      // Y translation
let ktz = parseFloat(sliders.tz.value);      // Z translation

// Focal length for perspective
let focalid = parseFloat(sliders.fid.value);

/* ============================================
 * Helper Functions
 * ============================================ */

/**
 * Updates the value display next to each slider
 * @param {string} id - The slider ID
 * @param {number} value - The current value
 */
function updateDisplay(id, value) {
    if (displays[id]) {
        // Add degree symbol for rotation values
        if (['xid', 'yid', 'zid'].includes(id)) {
            displays[id].textContent = `${Math.round(value)}°`;
        } else {
            displays[id].textContent = Math.round(value);
        }
    }
}

/**
 * Updates all value displays
 */
function updateAllDisplays() {
    updateDisplay('xid', sliders.xid.value);
    updateDisplay('yid', sliders.yid.value);
    updateDisplay('zid', sliders.zid.value);
    updateDisplay('tx', sliders.tx.value);
    updateDisplay('ty', sliders.ty.value);
    updateDisplay('tz', sliders.tz.value);
    updateDisplay('fid', sliders.fid.value);
}

/**
 * Resets all sliders to their default values
 */
function resetAllControls() {
    for (const [key, value] of Object.entries(defaults)) {
        if (sliders[key]) {
            sliders[key].value = value;
        }
    }
    updateAllDisplays();
}

/* ============================================
 * Event Listeners
 * ============================================ */

// Reset button click handler
if (resetBtn) {
    resetBtn.addEventListener('click', resetAllControls);
}

// Add change listeners to all sliders for instant display update
for (const [key, slider] of Object.entries(sliders)) {
    if (slider) {
        slider.addEventListener('input', () => {
            updateDisplay(key, slider.value);
        });
    }
}

/* ============================================
 * Main Animation Loop
 * ============================================
 * Updates at ~60fps (16ms interval) for smooth animation
 * Reads slider values and re-renders the cube
 */
setInterval(() => {
    // Read current rotation values from sliders
    xrange = parseFloat(sliders.xid.value);
    yrange = parseFloat(sliders.yid.value);
    zrange = parseFloat(sliders.zid.value);
    
    // Read current translation values from sliders
    ktx = parseFloat(sliders.tx.value);
    kty = parseFloat(sliders.ty.value);
    ktz = parseFloat(sliders.tz.value);
    
    // Read focal length
    focalid = parseFloat(sliders.fid.value);

    // Apply focal length for perspective control
    setFocalLength(focalid);

    // Apply transformations and render
    Rotate(xrange, yrange, zrange, ktx, kty, ktz);
    main_renderer_function();
}, 16);  // ~60fps for smooth performance

/* ============================================
 * Initialization
 * ============================================ */

// Set initial display values
updateAllDisplays();

// Initial render
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
