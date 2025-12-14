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

// Uncomment to set custom focal length
// focallen(3000);

/* ============================================
 * UI Control Variables
 * ============================================ */

// Rotation angles (0-360 degrees)
let xrange = parseFloat(document.getElementById('xid').value);  // X-axis rotation
let yrange = parseFloat(document.getElementById('yid').value);  // Y-axis rotation
let zrange = parseFloat(document.getElementById('zid').value);  // Z-axis rotation

// Translation values (position offset)
let ktx = parseFloat(document.getElementById('tx').value);      // X translation
let kty = parseFloat(document.getElementById('ty').value);      // Y translation
let ktz = parseFloat(document.getElementById('tz').value);      // Z translation

// Focal length for perspective (currently unused)
let focalid = parseFloat(document.getElementById('fid').value);

/* ============================================
 * Main Animation Loop
 * ============================================
 * Updates at ~1000fps (1ms interval)
 * Reads slider values and re-renders the cube
 */
setInterval(() => {
    // Read current rotation values from sliders
    xrange = parseFloat(document.getElementById('xid').value);
    yrange = parseFloat(document.getElementById('yid').value);
    zrange = parseFloat(document.getElementById('zid').value);
    
    // Read current translation values from sliders
    ktx = parseFloat(document.getElementById('tx').value);
    kty = parseFloat(document.getElementById('ty').value);
    ktz = parseFloat(document.getElementById('tz').value);
    
    // Read focal length (for future use)
    focalid = parseFloat(document.getElementById('fid').value);

    // Uncomment to enable dynamic focal length
    // focallen(focalid);
    
    // Apply transformations and render
    Rotate(xrange, yrange, zrange, ktx, kty, ktz);
    main_renderer_function();
}, 1);

/* ============================================
 * Initial Render Calls
 * ============================================
 * Multiple calls ensure the cube is visible
 * immediately when the page loads
 */
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
main_renderer_function();
