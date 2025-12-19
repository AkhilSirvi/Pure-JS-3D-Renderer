/**
 * @fileoverview Pure JavaScript 3D Renderer Engine - Enhanced Edition
 * @description A feature-rich 3D rendering engine with multiple shapes,
 * depth-based coloring, scaling, and advanced mathematical transformations.
 * @author Akhil Sirvi
 * @version 3.0.0
 * @license MIT
 */

'use strict';

/* ============================================
 * VECTOR3 CLASS - 3D Vector Mathematics
 * ============================================ */

/**
 * @class Vector3
 * @description Represents a 3D vector with mathematical operations
 */
class Vector3 {
    /**
     * @param {number} x - X component
     * @param {number} y - Y component
     * @param {number} z - Z component
     */
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Adds another vector to this vector
     * @param {Vector3} v - Vector to add
     * @returns {Vector3} New resulting vector
     */
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    /**
     * Subtracts another vector from this vector
     * @param {Vector3} v - Vector to subtract
     * @returns {Vector3} New resulting vector
     */
    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * Multiplies vector by a scalar
     * @param {number} s - Scalar value
     * @returns {Vector3} New scaled vector
     */
    scale(s) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    /**
     * Calculates the dot product with another vector
     * @param {Vector3} v - Other vector
     * @returns {number} Dot product result
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Calculates the cross product with another vector
     * @param {Vector3} v - Other vector
     * @returns {Vector3} Cross product result
     */
    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    /**
     * Calculates the magnitude (length) of the vector
     * @returns {number} Vector magnitude
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Returns a normalized (unit) vector
     * @returns {Vector3} Unit vector
     */
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector3();
        return this.scale(1 / mag);
    }

    /**
     * Calculates distance to another vector
     * @param {Vector3} v - Other vector
     * @returns {number} Distance
     */
    distanceTo(v) {
        return this.subtract(v).magnitude();
    }

    /**
     * Linear interpolation to another vector
     * @param {Vector3} v - Target vector
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Vector3} Interpolated vector
     */
    lerp(v, t) {
        return new Vector3(
            this.x + (v.x - this.x) * t,
            this.y + (v.y - this.y) * t,
            this.z + (v.z - this.z) * t
        );
    }

    /**
     * Converts to array format
     * @returns {Array<number>} [x, y, z]
     */
    toArray() {
        return [this.x, this.y, this.z];
    }

    /**
     * Creates Vector3 from array
     * @static
     * @param {Array<number>} arr - [x, y, z]
     * @returns {Vector3}
     */
    static fromArray(arr) {
        return new Vector3(arr[0], arr[1], arr[2]);
    }
}

/* ============================================
 * MATRIX4 CLASS - 4x4 Matrix for Transformations
 * ============================================ */

/**
 * @class Matrix4
 * @description 4x4 transformation matrix for 3D operations
 */
class Matrix4 {
    constructor() {
        this.elements = this._identity();
    }

    /**
     * Creates identity matrix
     * @private
     * @returns {Array<number>} 16 element array
     */
    _identity() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * Resets to identity matrix
     * @returns {Matrix4} this
     */
    identity() {
        this.elements = this._identity();
        return this;
    }

    /**
     * Multiplies with another matrix
     * @param {Matrix4} m - Matrix to multiply
     * @returns {Matrix4} New result matrix
     */
    multiply(m) {
        const a = this.elements;
        const b = m.elements;
        const result = new Matrix4();
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result.elements[i * 4 + j] = 
                    a[i * 4 + 0] * b[0 * 4 + j] +
                    a[i * 4 + 1] * b[1 * 4 + j] +
                    a[i * 4 + 2] * b[2 * 4 + j] +
                    a[i * 4 + 3] * b[3 * 4 + j];
            }
        }
        return result;
    }

    /**
     * Applies translation
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Matrix4} this
     */
    translate(x, y, z) {
        this.elements[12] = x;
        this.elements[13] = y;
        this.elements[14] = z;
        return this;
    }

    /**
     * Creates rotation matrix around X axis
     * @static
     * @param {number} angle - Angle in radians
     * @returns {Matrix4}
     */
    static rotationX(angle) {
        const m = new Matrix4();
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m.elements[5] = c;
        m.elements[6] = -s;
        m.elements[9] = s;
        m.elements[10] = c;
        return m;
    }

    /**
     * Creates rotation matrix around Y axis
     * @static
     * @param {number} angle - Angle in radians
     * @returns {Matrix4}
     */
    static rotationY(angle) {
        const m = new Matrix4();
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m.elements[0] = c;
        m.elements[2] = s;
        m.elements[8] = -s;
        m.elements[10] = c;
        return m;
    }

    /**
     * Creates rotation matrix around Z axis
     * @static
     * @param {number} angle - Angle in radians
     * @returns {Matrix4}
     */
    static rotationZ(angle) {
        const m = new Matrix4();
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        m.elements[0] = c;
        m.elements[1] = -s;
        m.elements[4] = s;
        m.elements[5] = c;
        return m;
    }

    /**
     * Creates scaling matrix
     * @static
     * @param {number} sx - Scale X
     * @param {number} sy - Scale Y
     * @param {number} sz - Scale Z
     * @returns {Matrix4}
     */
    static scale(sx, sy, sz) {
        const m = new Matrix4();
        m.elements[0] = sx;
        m.elements[5] = sy;
        m.elements[10] = sz;
        return m;
    }

    /**
     * Transforms a Vector3
     * @param {Vector3} v - Vector to transform
     * @returns {Vector3} Transformed vector
     */
    transformVector(v) {
        const e = this.elements;
        return new Vector3(
            e[0] * v.x + e[4] * v.y + e[8] * v.z + e[12],
            e[1] * v.x + e[5] * v.y + e[9] * v.z + e[13],
            e[2] * v.x + e[6] * v.y + e[10] * v.z + e[14]
        );
    }
}

/* ============================================
 * SHAPE GENERATORS
 * ============================================ */

/**
 * @namespace Shapes
 * @description Factory functions for creating 3D shapes
 */
const Shapes = {
    /**
     * Creates a cube
     * @param {number} size - Half-width of cube
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    cube(size = 100) {
        const s = size;
        const vertices = [
            new Vector3( s,  s,  s),  // 0: Front top-right
            new Vector3(-s,  s,  s),  // 1: Front top-left
            new Vector3(-s, -s,  s),  // 2: Front bottom-left
            new Vector3( s, -s,  s),  // 3: Front bottom-right
            new Vector3( s,  s, -s),  // 4: Back top-right
            new Vector3(-s,  s, -s),  // 5: Back top-left
            new Vector3(-s, -s, -s),  // 6: Back bottom-left
            new Vector3( s, -s, -s)   // 7: Back bottom-right
        ];
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],  // Front face
            [4, 5], [5, 6], [6, 7], [7, 4],  // Back face
            [0, 4], [1, 5], [2, 6], [3, 7]   // Connecting edges
        ];
        const faces = [
            [0, 1, 2, 3],  // Front
            [4, 5, 6, 7],  // Back
            [0, 4, 7, 3],  // Right
            [1, 5, 6, 2],  // Left
            [0, 1, 5, 4],  // Top
            [3, 2, 6, 7]   // Bottom
        ];
        return { vertices, edges, faces, name: 'Cube' };
    },

    /**
     * Creates a tetrahedron (4-faced pyramid)
     * @param {number} size - Size factor
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    tetrahedron(size = 100) {
        const s = size;
        const vertices = [
            new Vector3(s, s, s),
            new Vector3(s, -s, -s),
            new Vector3(-s, s, -s),
            new Vector3(-s, -s, s)
        ];
        const edges = [
            [0, 1], [0, 2], [0, 3],
            [1, 2], [2, 3], [3, 1]
        ];
        const faces = [
            [0, 1, 2],
            [0, 2, 3],
            [0, 3, 1],
            [1, 3, 2]
        ];
        return { vertices, edges, faces, name: 'Tetrahedron' };
    },

    /**
     * Creates an octahedron (8-faced diamond shape)
     * @param {number} size - Size factor
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    octahedron(size = 100) {
        const s = size;
        const vertices = [
            new Vector3(0, s, 0),   // Top
            new Vector3(0, -s, 0),  // Bottom
            new Vector3(s, 0, 0),   // Right
            new Vector3(-s, 0, 0),  // Left
            new Vector3(0, 0, s),   // Front
            new Vector3(0, 0, -s)   // Back
        ];
        const edges = [
            [0, 2], [0, 3], [0, 4], [0, 5],  // Top to middle
            [1, 2], [1, 3], [1, 4], [1, 5],  // Bottom to middle
            [2, 4], [4, 3], [3, 5], [5, 2]   // Middle ring
        ];
        const faces = [
            [0, 4, 2], [0, 2, 5], [0, 5, 3], [0, 3, 4],
            [1, 2, 4], [1, 5, 2], [1, 3, 5], [1, 4, 3]
        ];
        return { vertices, edges, faces, name: 'Octahedron' };
    },

    /**
     * Creates a pyramid (square base)
     * @param {number} size - Base half-width
     * @param {number} height - Pyramid height
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    pyramid(size = 100, height = 150) {
        const s = size;
        const h = height;
        const vertices = [
            new Vector3(0, h, 0),     // Apex
            new Vector3(s, 0, s),     // Base corners
            new Vector3(-s, 0, s),
            new Vector3(-s, 0, -s),
            new Vector3(s, 0, -s)
        ];
        const edges = [
            [0, 1], [0, 2], [0, 3], [0, 4],  // Apex to base
            [1, 2], [2, 3], [3, 4], [4, 1]   // Base
        ];
        const faces = [
            [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
            [1, 4, 3, 2]  // Base
        ];
        return { vertices, edges, faces, name: 'Pyramid' };
    },

    /**
     * Creates a prism (triangular)
     * @param {number} size - Size factor
     * @param {number} length - Prism length
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    prism(size = 80, length = 150) {
        const s = size;
        const l = length / 2;
        const h = s * Math.sqrt(3) / 2;
        const vertices = [
            // Front triangle
            new Vector3(0, h, l),
            new Vector3(-s, -h/2, l),
            new Vector3(s, -h/2, l),
            // Back triangle
            new Vector3(0, h, -l),
            new Vector3(-s, -h/2, -l),
            new Vector3(s, -h/2, -l)
        ];
        const edges = [
            [0, 1], [1, 2], [2, 0],  // Front triangle
            [3, 4], [4, 5], [5, 3],  // Back triangle
            [0, 3], [1, 4], [2, 5]   // Connecting
        ];
        const faces = [
            [0, 1, 2],
            [3, 5, 4],
            [0, 3, 4, 1],
            [1, 4, 5, 2],
            [2, 5, 3, 0]
        ];
        return { vertices, edges, faces, name: 'Prism' };
    },

    /**
     * Creates a dodecahedron (12-faced)
     * Uses golden ratio for vertex positions
     * @param {number} size - Size factor
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    dodecahedron(size = 60) {
        const phi = (1 + Math.sqrt(5)) / 2;
        // Golden ratio ≈ 1.618 
        const s = size; const a = s; 
        const b = s / phi; 
        const c = s * phi; 
        const vertices = [ 
            // Cube vertices
            new Vector3(a, a, a), new Vector3(a, a, -a),
            new Vector3(a, -a, a), new Vector3(a, -a, -a), 
            new Vector3(-a, a, a), new Vector3(-a, a, -a), 
            new Vector3(-a, -a, a), new Vector3(-a, -a, -a), 
            // Rectangle vertices (XY plane) 
            new Vector3(0, b, c), new Vector3(0, b, -c), 
            new Vector3(0, -b, c), new Vector3(0, -b, -c), 
            // Rectangle vertices (XZ plane) 
            new Vector3(c, 0, b), new Vector3(c, 0, -b), 
            new Vector3(-c, 0, b), new Vector3(-c, 0, -b), 
            // Rectangle vertices (YZ plane) 
            new Vector3(b, c, 0), new Vector3(b, -c, 0), 
            new Vector3(-b, c, 0), new Vector3(-b, -c, 0) 
        ]; 
        
        const edges = [ 
            [0, 8], [0, 12], [0, 16], [1, 9], [1, 13], 
            [1, 16], [2, 10], [2, 12], [2, 17], [3, 11], 
            [3, 13], [3, 17], [4, 8], [4, 14], [4, 18], 
            [5, 9], [5, 15], [5, 18], [6, 10], [6, 14], 
            [6, 19], [7, 11], [7, 15], [7, 19], [11, 9], 
            [10, 8], [15, 14], [13, 12], [16, 18], [17, 19] 
        ];
        
        return { vertices, edges, faces: [], name: 'Dodecahedron' };
    },

    /**
     * Creates a torus (donut shape) - approximation with vertices
     * @param {number} majorRadius - Distance from center to tube center
     * @param {number} minorRadius - Tube radius
     * @param {number} majorSegments - Segments around the ring
     * @param {number} minorSegments - Segments around the tube
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    torus(majorRadius = 80, minorRadius = 30, majorSegments = 16, minorSegments = 8) {
        const vertices = [];
        const edges = [];

        for (let i = 0; i < majorSegments; i++) {
            const theta = (i / majorSegments) * Math.PI * 2;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            for (let j = 0; j < minorSegments; j++) {
                const phi = (j / minorSegments) * Math.PI * 2;
                const cosPhi = Math.cos(phi);
                const sinPhi = Math.sin(phi);

                const x = (majorRadius + minorRadius * cosPhi) * cosTheta;
                const y = minorRadius * sinPhi;
                const z = (majorRadius + minorRadius * cosPhi) * sinTheta;

                vertices.push(new Vector3(x, y, z));

                const current = i * minorSegments + j;
                const nextJ = i * minorSegments + ((j + 1) % minorSegments);
                const nextI = ((i + 1) % majorSegments) * minorSegments + j;

                edges.push([current, nextJ]);
                edges.push([current, nextI]);
            }
        }

        return { vertices, edges, faces: [], name: 'Torus' };
    },

    /**
     * Creates a sphere approximation using latitude/longitude
     * @param {number} radius - Sphere radius
     * @param {number} segments - Number of segments
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    sphere(radius = 100, segments = 12) {
        const vertices = [];
        const edges = [];

        // Create vertices
        for (let lat = 0; lat <= segments; lat++) {
            const theta = (lat / segments) * Math.PI;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let lon = 0; lon < segments; lon++) {
                const phi = (lon / segments) * Math.PI * 2;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = radius * sinTheta * cosPhi;
                const y = radius * cosTheta;
                const z = radius * sinTheta * sinPhi;

                vertices.push(new Vector3(x, y, z));
            }
        }

        // Create edges
        for (let lat = 0; lat < segments; lat++) {
            for (let lon = 0; lon < segments; lon++) {
                const current = lat * segments + lon;
                const next = lat * segments + ((lon + 1) % segments);
                const below = (lat + 1) * segments + lon;

                edges.push([current, next]);
                if (lat < segments) {
                    edges.push([current, below]);
                }
            }
        }

        return { vertices, edges, faces: [], name: 'Sphere' };
    },

    /**
     * Creates coordinate axes
     * @param {number} length - Axis length
     * @returns {Object} { vertices: Vector3[], edges: Array, colors: Array }
     */
    axes(length = 200) {
        const vertices = [
            new Vector3(0, 0, 0),
            new Vector3(length, 0, 0),  // X axis
            new Vector3(0, length, 0),  // Y axis
            new Vector3(0, 0, length)   // Z axis
        ];
        const edges = [
            [0, 1],  // X
            [0, 2],  // Y
            [0, 3]   // Z
        ];
        const colors = ['#ff4444', '#44ff44', '#4444ff'];  // RGB for XYZ
        return { vertices, edges, faces: [], colors, name: 'Axes' };
    },

    /**
     * Creates a grid on the XZ plane
     * @param {number} size - Grid size
     * @param {number} divisions - Number of divisions
     * @returns {Object} { vertices: Vector3[], edges: Array }
     */
    grid(size = 200, divisions = 10) {
        const vertices = [];
        const edges = [];
        const step = size / divisions;
        const half = size / 2;
        let idx = 0;

        for (let i = 0; i <= divisions; i++) {
            const pos = -half + i * step;
            // Lines along Z
            vertices.push(new Vector3(pos, 0, -half));
            vertices.push(new Vector3(pos, 0, half));
            edges.push([idx, idx + 1]);
            idx += 2;
            // Lines along X
            vertices.push(new Vector3(-half, 0, pos));
            vertices.push(new Vector3(half, 0, pos));
            edges.push([idx, idx + 1]);
            idx += 2;
        }

        return { vertices, edges, faces: [], name: 'Grid' };
    }
};

/* ============================================
 * COLOR UTILITIES
 * ============================================ */

/**
 * @namespace ColorUtils
 * @description Utility functions for color manipulation
 */
const ColorUtils = {
    /**
     * Converts HSL to RGB hex string
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {string} Hex color string
     */
    hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    },

    /**
     * Gets color based on Z-depth
     * @param {number} z - Z coordinate
     * @param {number} minZ - Minimum Z value
     * @param {number} maxZ - Maximum Z value
     * @returns {string} Hex color string
     */
    depthColor(z, minZ = -200, maxZ = 200) {
        const normalized = (z - minZ) / (maxZ - minZ);
        const hue = 200 + normalized * 60;  // Blue to cyan
        const lightness = 30 + normalized * 40;
        return this.hslToHex(hue, 80, lightness);
    },

    /**
     * Interpolates between two colors
     * @param {string} color1 - Start color (hex)
     * @param {string} color2 - End color (hex)
     * @param {number} t - Interpolation factor (0-1)
     * @returns {string} Interpolated color (hex)
     */
    lerp(color1, color2, t) {
        const c1 = parseInt(color1.slice(1), 16);
        const c2 = parseInt(color2.slice(1), 16);
        
        const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
        const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
        
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }
};

/* ============================================
 * ENHANCED 3D RENDERER CLASS
 * ============================================ */

/**
 * @class Renderer3D
 * @description Advanced 3D rendering engine with multiple features
 */
class Renderer3D {
    /**
     * Creates a new 3D Renderer instance
     * @param {HTMLCanvasElement} canvas - The canvas element to render to
     */
    constructor(canvas = null) {
        /** @private {HTMLCanvasElement} */
        this._canvas = canvas;
        
        /** @private {CanvasRenderingContext2D} */
        this._ctx = canvas?.getContext('2d') || null;
        
        /** @private {number} Focal length for perspective */
        this._focalLength = 3000;
        
        /** @private {Object} Current shape data */
        this._shape = Shapes.cube(100);
        
        /** @private {Array<Vector3>} Transformed vertices */
        this._transformedVertices = [];
        
        /** @private {Object} Render settings */
        this._settings = {
            showVertices: false,
            showAxes: false,
            showGrid: false,
            depthColoring: true,
            wireframeColor: '#4f46e5',
            vertexColor: '#ef4444',
            vertexSize: 4,
            lineWidth: 2,
            backgroundColor: null,
            scale: { x: 1, y: 1, z: 1 }
        };

        /** @private {Object} Transformation state */
        this._transform = {
            rotation: new Vector3(0, 0, 0),
            translation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1)
        };
    }

    /* ----------------------------------------
     * GETTERS AND SETTERS
     * ---------------------------------------- */

    get canvas() { return this._canvas; }
    set canvas(canvas) {
        this._canvas = canvas;
        this._ctx = canvas?.getContext('2d') || null;
    }

    get focalLength() { return this._focalLength; }
    set focalLength(value) { this._focalLength = Math.max(1, value); }

    get settings() { return this._settings; }

    /* ----------------------------------------
     * SHAPE MANAGEMENT
     * ---------------------------------------- */

    /**
     * Sets the current shape to render
     * @param {string} shapeName - Name of the shape
     * @param {...any} args - Arguments for shape creation
     */
    setShape(shapeName, ...args) {
        const shapeCreator = Shapes[shapeName.toLowerCase()];
        if (shapeCreator) {
            this._shape = shapeCreator(...args);
        } else {
            console.warn(`Shape "${shapeName}" not found. Available: ${Object.keys(Shapes).join(', ')}`);
        }
    }

    /**
     * Sets a custom shape
     * @param {Object} shape - Shape object with vertices and edges
     */
    setCustomShape(shape) {
        this._shape = shape;
    }

    /* ----------------------------------------
     * TRANSFORMATION METHODS
     * ---------------------------------------- */

    /**
     * Applies transformations to the shape
     * @param {Object} params - Transformation parameters
     */
    transform({ 
        rotationX = 0, rotationY = 0, rotationZ = 0, 
        translateX = 0, translateY = 0, translateZ = 0,
        scaleX = 1, scaleY = 1, scaleZ = 1 
    }) {
        const DEG_TO_RAD = Math.PI / 180;
        
        // Create transformation matrices
        const rotX = Matrix4.rotationX(rotationX * DEG_TO_RAD);
        const rotY = Matrix4.rotationY(rotationY * DEG_TO_RAD);
        const rotZ = Matrix4.rotationZ(rotationZ * DEG_TO_RAD);
        const scale = Matrix4.scale(scaleX, scaleY, scaleZ);
        
        // Combine transformations: Scale -> RotZ -> RotY -> RotX -> Translate
        let transform = scale.multiply(rotZ).multiply(rotY).multiply(rotX);
        
        // Transform all vertices
        this._transformedVertices = this._shape.vertices.map(v => {
            const transformed = transform.transformVector(v);
            return new Vector3(
                transformed.x + translateX,
                transformed.y + translateY,
                transformed.z + translateZ
            );
        });

        // Store transform state
        this._transform = {
            rotation: new Vector3(rotationX, rotationY, rotationZ),
            translation: new Vector3(translateX, translateY, translateZ),
            scale: new Vector3(scaleX, scaleY, scaleZ)
        };
    }

    /* ----------------------------------------
     * PROJECTION METHODS
     * ---------------------------------------- */

    /**
     * Projects a 3D point to 2D using perspective projection
     * @private
     * @param {Vector3} vertex - 3D vertex
     * @returns {Object} { x, y, scale }
     */
    _projectVertex(vertex) {
        const scale = this._focalLength / (this._focalLength + vertex.z);
        return {
            x: vertex.x * scale,
            y: vertex.y * scale,
            scale: scale,
            z: vertex.z
        };
    }

    /* ----------------------------------------
     * RENDERING METHODS
     * ---------------------------------------- */

    /**
     * Clears the canvas
     * @private
     */
    _clearCanvas() {
        if (!this._ctx || !this._canvas) return;
        
        if (this._settings.backgroundColor) {
            this._ctx.fillStyle = this._settings.backgroundColor;
            this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        } else {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }

    /**
     * Draws a line with optional depth-based coloring
     * @private
     */
    _drawLine(x1, y1, x2, y2, z1, z2, color = null) {
        if (!this._ctx) return;

        let strokeColor = color || this._settings.wireframeColor;
        
        if (this._settings.depthColoring && !color) {
            const avgZ = (z1 + z2) / 2;
            strokeColor = ColorUtils.depthColor(avgZ);
        }

        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.strokeStyle = strokeColor;
        this._ctx.lineWidth = this._settings.lineWidth;
        this._ctx.lineCap = 'round';
        this._ctx.stroke();
    }

    /**
     * Draws a vertex point
     * @private
     */
    _drawVertex(x, y, size = null) {
        if (!this._ctx) return;
        
        const radius = size || this._settings.vertexSize;
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2);
        this._ctx.fillStyle = this._settings.vertexColor;
        this._ctx.fill();
    }

    /**
     * Renders the grid
     * @private
     */
    _renderGrid() {
        if (!this._settings.showGrid) return;
        
        const grid = Shapes.grid(300, 10);
        const projectedGrid = grid.vertices.map(v => {
            const transformed = new Vector3(
                v.x + this._transform.translation.x,
                v.y + this._transform.translation.y - 100,
                v.z + this._transform.translation.z
            );
            return this._projectVertex(transformed);
        });

        this._ctx.globalAlpha = 0.3;
        grid.edges.forEach(([i, j]) => {
            const p1 = projectedGrid[i];
            const p2 = projectedGrid[j];
            this._drawLine(p1.x, p1.y, p2.x, p2.y, p1.z, p2.z, '#666666');
        });
        this._ctx.globalAlpha = 1;
    }

    /**
     * Renders the coordinate axes
     * @private
     */
    _renderAxes() {
        if (!this._settings.showAxes) return;
        
        const axes = Shapes.axes(150);
        const projectedAxes = axes.vertices.map(v => {
            const transformed = new Vector3(
                v.x + this._transform.translation.x,
                v.y + this._transform.translation.y,
                v.z + this._transform.translation.z
            );
            return this._projectVertex(transformed);
        });

        axes.edges.forEach(([i, j], idx) => {
            const p1 = projectedAxes[i];
            const p2 = projectedAxes[j];
            this._ctx.lineWidth = 3;
            this._drawLine(p1.x, p1.y, p2.x, p2.y, p1.z, p2.z, axes.colors[idx]);
        });
        this._ctx.lineWidth = this._settings.lineWidth;
    }

    /**
     * Main render function
     * @public
     */
    render() {
        if (!this._ctx || !this._canvas) {
            console.warn('Renderer3D: No canvas context available');
            return;
        }

        // Clear canvas
        this._clearCanvas();

        // Render helpers
        this._renderGrid();
        this._renderAxes();

        // Project all vertices
        const projectedVertices = this._transformedVertices.map(v => this._projectVertex(v));

        // Sort edges by depth for proper rendering (painter's algorithm)
        const edgesWithDepth = this._shape.edges.map(([i, j]) => {
            const avgZ = (this._transformedVertices[i].z + this._transformedVertices[j].z) / 2;
            return { edge: [i, j], depth: avgZ };
        });
        edgesWithDepth.sort((a, b) => a.depth - b.depth);

        // Draw edges (back to front)
        edgesWithDepth.forEach(({ edge: [i, j] }) => {
            const p1 = projectedVertices[i];
            const p2 = projectedVertices[j];
            this._drawLine(
                p1.x, p1.y, 
                p2.x, p2.y,
                this._transformedVertices[i].z,
                this._transformedVertices[j].z
            );
        });

        // Draw vertices
        if (this._settings.showVertices) {
            projectedVertices.forEach((p, i) => {
                const size = this._settings.vertexSize * p.scale;
                this._drawVertex(p.x, p.y, Math.max(2, size));
            });
        }
    }
}

/* ============================================
 * GLOBAL INSTANCE & LEGACY API
 * ============================================ */

const renderer = new Renderer3D();

// Legacy API for backward compatibility
function Canvas_Define(canvasElement) {
    renderer.canvas = canvasElement;
}

function setFocalLength(value) {
    renderer.focalLength = value;
}

function Rotate(x, y, z, tx, ty, tz) {
    renderer.transform({
        rotationX: x,
        rotationY: y,
        rotationZ: z,
        translateX: tx,
        translateY: ty,
        translateZ: tz
    });
}

function main_renderer_function() {
    renderer.render();
}

/* ============================================
 * EXPORTS
 * ============================================ */

if (typeof window !== 'undefined') {
    window.Vector3 = Vector3;
    window.Matrix4 = Matrix4;
    window.Shapes = Shapes;
    window.ColorUtils = ColorUtils;
    window.Renderer3D = Renderer3D;
    window.renderer = renderer;
}
