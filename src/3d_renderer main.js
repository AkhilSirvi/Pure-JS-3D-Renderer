/**
 * ============================================
 * Pure JavaScript 3D Renderer
 * ============================================
 * A lightweight 3D rendering engine that renders
 * a 3D cube using perspective projection.
 * 
 * Features:
 * - 3D rotation around X, Y, Z axes
 * - Perspective projection
 * - Translation support
 * - Real-time rendering with canvas
 * ============================================
 */

/**
 * Vertex Table - Defines the 8 corners of a cube
 * Each vertex is defined by [x, y, z] coordinates
 * 
 * Cube vertices layout:
 *       f -------- e
 *      /|         /|
 *     / |        / |
 *    b -------- a  |
 *    |  g ------|-- h
 *    | /        | /
 *    |/         |/
 *    c -------- d
 * 
 * Front face: a, b, c, d (z = 100)
 * Back face: e, f, g, h (z = -100)
 */
let vertex_table = {
  //  x    y    z
  a: [100, 100, 100],    // Front top-right
  b: [-100, 100, 100],   // Front top-left
  c: [-100, -100, 100],  // Front bottom-left
  d: [100, -100, 100],   // Front bottom-right
  e: [100, 100, -100],   // Back top-right
  f: [-100, 100, -100],  // Back top-left
  g: [-100, -100, -100], // Back bottom-left
  h: [100, -100, -100],  // Back bottom-right
};

/* ============================================
 * Utility Functions for Data Conversion
 * ============================================ */

/**
 * Converts an object of vertices to a 2D array
 * Used for matrix multiplication operations
 * @param {Object} obj - The vertex table object
 * @returns {Array} - 2D array of vertex coordinates
 */
function objectToArray(obj) {
  let keys = Object.keys(obj);
  let result = keys.map(key => {
      return obj[key];
  });
  return result;
}

/**
 * Converts a 2D array back to an object with letter keys
 * Keys are assigned as 'a', 'b', 'c', etc.
 * @param {Array} arr - 2D array of transformed coordinates
 * @returns {Object} - Vertex table object with letter keys
 */
function arrayToObject(arr) {
  let result = {};
  arr.forEach((subArray, index) => {
      // Convert index to letter: 0 -> 'a', 1 -> 'b', etc.
      let key = String.fromCharCode(97 + index);
      result[key] = subArray;
  });
  return result;
}


/* ============================================
 * Matrix Operations
 * ============================================ */

/**
 * Performs matrix multiplication (row × column)
 * Essential for applying rotation transformations to vertices
 * 
 * Matrix multiplication formula: C[i][j] = Σ(A[i][k] × B[k][j])
 * 
 * @param {Array} m1 - First matrix (vertices matrix)
 * @param {Array} m2 - Second matrix (rotation matrix)
 * @returns {Array} - Resulting transformed matrix
 * @throws {Error} - If matrix dimensions are incompatible
 */
function m_mul_row_to_column(m1, m2) {
    // Validate matrix dimensions for multiplication
    if (m1[0].length !== m2.length) {
        throw new Error("Incompatible dimensions for matrix multiplication");
    }

    let result = [];
    // Iterate through rows of first matrix
    for (let i = 0; i < m1.length; i++) {
        result[i] = [];
        // Iterate through columns of second matrix
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            // Calculate dot product of row and column
            for (let k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

/* ============================================
 * 3D Transformation Functions
 * ============================================ */

/**
 * Applies rotation and translation transformations to the cube
 * Uses rotation matrices for each axis (X, Y, Z)
 * 
 * Rotation matrices used:
 * 
 * X-axis rotation (Pitch):
 * | 1    0        0      |
 * | 0    cos(θ)  -sin(θ) |
 * | 0    sin(θ)   cos(θ) |
 * 
 * Y-axis rotation (Yaw):
 * | cos(θ)   0   sin(θ) |
 * | 0        1   0      |
 * |-sin(θ)   0   cos(θ) |
 * 
 * Z-axis rotation (Roll):
 * | cos(θ)  -sin(θ)   0 |
 * | sin(θ)   cos(θ)   0 |
 * | 0        0        1 |
 * 
 * @param {number} x - Rotation angle around X-axis (degrees)
 * @param {number} y - Rotation angle around Y-axis (degrees)
 * @param {number} z - Rotation angle around Z-axis (degrees)
 * @param {number} tx - Translation along X-axis
 * @param {number} ty - Translation along Y-axis
 * @param {number} tz - Translation along Z-axis
 */
function Rotate(x, y, z, tx, ty, tz) {
  // Convert degrees to radians (required for Math.sin/cos)
  let anglews = x * (Math.PI / 180)  // X-axis rotation angle in radians
  let angleze = y * (Math.PI / 180)  // Y-axis rotation angle in radians
  let angleaz = z * (Math.PI / 180)  // Z-axis rotation angle in radians
  
  // Define 3x3 rotation matrices for each axis
  let x_axis_rotation_matrix = [[1, 0, 0], [0, Math.cos(anglews), -(Math.sin(anglews))], [0,Math.sin(anglews),Math.cos(anglews)]]
  let y_axis_rotation_matrix = [[Math.cos(angleze), 0, Math.sin(angleze)], [0, 1, 0], [-(Math.sin(angleze)), 0,Math.cos(angleze)]]
  let z_axis_rotation_matrix = [[Math.cos(angleaz), -(Math.sin(angleaz)), 0], [Math.sin(angleaz), Math.cos(angleaz), 0], [0,0,1]]
  
  // Store translation values
  let transletx = tx;
  let translety = ty;
  let transletz = tz;
  
  // Store pivot point for rotation (center of cube)
  let xnot = transletx;
  let ynot = translety;
  let znot = transletz;

  // Reset cube to origin before applying transformations
  // This ensures rotations happen around the center of the cube
  vertex_table = {
    //  x    y    z
    a: [100 + transletx - xnot, 100 + translety - ynot, 100 + transletz - znot],
    b: [-100 + transletx - xnot, 100 + translety - ynot, 100 + transletz - znot],
    c: [-100 + transletx - xnot, -100 + translety - ynot, 100 + transletz - znot],
    d: [100 + transletx - xnot, -100 + translety - ynot, 100 + transletz - znot],
    e: [100 + transletx - xnot, 100 + translety - ynot, -100 + transletz - znot],
    f: [-100 + transletx - xnot, 100 + translety - ynot, -100 + transletz - znot],
    g: [-100 + transletx - xnot, -100 + translety - ynot, -100 + transletz - znot],
    h: [100 + transletx - xnot, -100 + translety - ynot, -100 + transletz - znot],
  }
  
  // Apply rotations in order: Z-axis → Y-axis → X-axis
  // Order matters! Different orders produce different results
  vertex_table = arrayToObject(m_mul_row_to_column(objectToArray(vertex_table), z_axis_rotation_matrix))
  vertex_table = arrayToObject(m_mul_row_to_column(objectToArray(vertex_table), y_axis_rotation_matrix))
  vertex_table = arrayToObject(m_mul_row_to_column(objectToArray(vertex_table), x_axis_rotation_matrix))

  // Translate the rotated cube back to its desired position
  for (const key in vertex_table) {
    let table_key = vertex_table[key];  
    vertex_table[key][0] = table_key[0] + xnot  // Apply X translation
    vertex_table[key][1] = table_key[1] + ynot  // Apply Y translation
    vertex_table[key][2] = table_key[2] + znot  // Apply Z translation
  }
}

/* ============================================
 * Canvas Drawing Functions
 * ============================================ */

// Global reference to the canvas element
let Canvas_Data = '';

/**
 * Sets the canvas element to be used for rendering
 * @param {HTMLCanvasElement} String - The canvas DOM element
 * @returns {HTMLCanvasElement} - The canvas element
 */
function Canvas_Define(String) {
    return Canvas_Data = String;
}

/**
 * Draws a line on the canvas between two points
 * Used to render the edges of the 3D cube
 * 
 * @param {number} startX - Starting X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endX - Ending X coordinate
 * @param {number} endY - Ending Y coordinate
 * @param {boolean} clearCanvas - If true, clears canvas before drawing
 */
function line_maker(startX, startY, endX, endY, clearCanvas = false) {
  var canvas = Canvas_Data;
  var ctx = canvas.getContext('2d');
  
  // Optionally clear the canvas before drawing
  if (clearCanvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw the line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = 'black';  // Line color
  ctx.lineWidth = 1;          // Line thickness
  ctx.stroke();
}
/* ============================================
 * Perspective Projection & Rendering
 * ============================================ */

/**
 * Focal length for perspective projection
 * Higher values = less perspective distortion (more orthographic)
 * Lower values = more dramatic perspective effect
 */
let focal_length = 3000;

/**
 * Sets the focal length for perspective projection
 * @param {number} value - The new focal length value
 */
function setFocalLength(value) {
    focal_length = value;
}

/**
 * Main rendering function - Projects 3D vertices to 2D and draws the cube
 * 
 * Uses perspective projection formula:
 *   x' = (focal_length * x) / (focal_length + z)
 *   y' = (focal_length * y) / (focal_length + z)
 * 
 * This creates the illusion of depth by making distant objects appear smaller
 */
function main_renderer_function() {
  var canvas = Canvas_Data;
  var ctx = canvas.getContext('2d');
  
  // Clear the canvas for fresh rendering
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Apply perspective projection to each vertex
  // Formula: projected = (focal_length * coordinate) / (focal_length + z_depth)
  
  // Vertex A projection (front top-right)
  let a_x_P = (focal_length * vertex_table.a[0]) / (focal_length + vertex_table.a[2]);
  let a_y_P = (focal_length * vertex_table.a[1]) / (focal_length + vertex_table.a[2]);
  
  // Vertex B projection (front top-left)
  let b_x_P = (focal_length * vertex_table.b[0]) / (focal_length + vertex_table.b[2]);
  let b_y_P = (focal_length * vertex_table.b[1]) / (focal_length + vertex_table.b[2]);
  
  // Vertex C projection (front bottom-left)
  let c_x_P = (focal_length * vertex_table.c[0]) / (focal_length + vertex_table.c[2]);
  let c_y_P = (focal_length * vertex_table.c[1]) / (focal_length + vertex_table.c[2]);
  
  // Vertex D projection (front bottom-right)
  let d_x_P = (focal_length * vertex_table.d[0]) / (focal_length + vertex_table.d[2]);
  let d_y_P = (focal_length * vertex_table.d[1]) / (focal_length + vertex_table.d[2]);
  
  // Vertex E projection (back top-right)
  let e_x_P = (focal_length * vertex_table.e[0]) / (focal_length + vertex_table.e[2]);
  let e_y_P = (focal_length * vertex_table.e[1]) / (focal_length + vertex_table.e[2]);
  
  // Vertex F projection (back top-left)
  let f_x_P = (focal_length * vertex_table.f[0]) / (focal_length + vertex_table.f[2]);
  let f_y_P = (focal_length * vertex_table.f[1]) / (focal_length + vertex_table.f[2]);
  
  // Vertex G projection (back bottom-left)
  let g_x_P = (focal_length * vertex_table.g[0]) / (focal_length + vertex_table.g[2]);
  let g_y_P = (focal_length * vertex_table.g[1]) / (focal_length + vertex_table.g[2]);
  
  // Vertex H projection (back bottom-right)
  let h_x_P = (focal_length * vertex_table.h[0]) / (focal_length + vertex_table.h[2]);
  let h_y_P = (focal_length * vertex_table.h[1]) / (focal_length + vertex_table.h[2]);


  /**
   * Edge Table - Defines the 12 edges of the cube
   * Each edge connects two vertices: [startX, startY, endX, endY]
   * 
   * Edge structure:
   * - Edges 1-4: Front face (a-b, b-c, c-d, d-a)
   * - Edges 5-8: Connecting edges (front to back)
   * - Edges 9-12: Back face (e-f, f-g, g-h, h-e)
   */
  let edge_table = {
    // Front face edges
    1: [a_x_P, a_y_P, b_x_P, b_y_P],   // Top edge (a → b)
    2: [b_x_P, b_y_P, c_x_P, c_y_P],   // Left edge (b → c)
    3: [c_x_P, c_y_P, d_x_P, d_y_P],   // Bottom edge (c → d)
    4: [d_x_P, d_y_P, a_x_P, a_y_P],   // Right edge (d → a)
    
    // Connecting edges (front to back)
    5: [a_x_P, a_y_P, e_x_P, e_y_P],   // a → e
    6: [b_x_P, b_y_P, f_x_P, f_y_P],   // b → f
    7: [c_x_P, c_y_P, g_x_P, g_y_P],   // c → g
    8: [d_x_P, d_y_P, h_x_P, h_y_P],   // d → h
    
    // Back face edges
    9: [e_x_P, e_y_P, f_x_P, f_y_P],   // Top edge (e → f)
    10: [f_x_P, f_y_P, g_x_P, g_y_P],  // Left edge (f → g)
    11: [g_x_P, g_y_P, h_x_P, h_y_P],  // Bottom edge (g → h)
    12: [h_x_P, h_y_P, e_x_P, e_y_P],  // Right edge (h → e)
  };
  
  /**
   * Renders all edges by iterating through the edge table
   * and drawing lines between connected vertices
   */
  function edge() {
    for (const key in edge_table) {
      let table_key = edge_table[key];
      // Draw line from (startX, startY) to (endX, endY)
      line_maker(table_key[0], table_key[1], table_key[2], table_key[3]);
    }
  }
  
  // Execute edge rendering
  edge();
}