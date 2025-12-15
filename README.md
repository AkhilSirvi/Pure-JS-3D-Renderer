# 🎮 Pure JavaScript 3D Renderer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Pure JavaScript](https://img.shields.io/badge/Pure-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen)](https://github.com/AkhilSirvi/Pure-JS-3D-Renderer)
[![ES6+](https://img.shields.io/badge/ES6+-Classes-blue)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

A **feature-rich, pure JavaScript + HTML5 Canvas 3D renderer** that draws 3D objects using only mathematics — **no WebGL, no Three.js, no external libraries**. Now with **8 geometric shapes**, **vector/matrix math classes**, **depth coloring**, and a **beautiful modern UI**.

## 🌐 Live Demo

**[👉 View the 3D Renderer in Action](https://akhilsirvi.github.io/Pure-JS-3D-Renderer/src/index.html)**

---

## ✨ Features

### 🎨 **Shapes & Geometry**
| Shape | Description |
|-------|-------------|
| 🧊 **Cube** | Classic 8-vertex box |
| 🔺 **Tetrahedron** | 4-vertex Platonic solid |
| 💎 **Octahedron** | 6-vertex dual of cube |
| 🏔️ **Pyramid** | Square base with apex |
| 📐 **Prism** | Triangular cross-section |
| ⭐ **Dodecahedron** | 20-vertex using golden ratio φ |
| 🍩 **Torus** | Parametric donut shape |
| 🌍 **Sphere** | UV-sphere with subdivisions |

### 🧮 **Mathematical Foundation**
- **Vector3 Class** — Full 3D vector operations (add, subtract, dot, cross, normalize, lerp)
- **Matrix4 Class** — 4×4 transformation matrices for rotation
- **Perspective Projection** — Realistic depth with configurable focal length
- **Golden Ratio Mathematics** — Used for Dodecahedron vertices (φ = (1+√5)/2)

### 🎛️ **Interactive Controls**
- **Shape Selection** — Switch between 8 different shapes
- **3-Axis Rotation** — Rotate around X, Y, Z independently
- **3-Axis Translation** — Move objects in 3D space
- **Non-Uniform Scaling** — Scale X, Y, Z independently
- **Auto-Rotate Mode** — Automatic continuous rotation
- **Visual Toggles** — Depth coloring, vertices, axes, grid

### ⌨️ **Keyboard Shortcuts**
| Key | Action |
|-----|--------|
| `Space` | Pause/Resume animation |
| `R` | Reset all transforms |
| `A` | Toggle auto-rotate |
| `V` | Toggle vertex display |
| `G` | Toggle reference grid |
| `X` | Toggle coordinate axes |
| `S` | Save screenshot |

### 🎨 **Visual Effects**
- **Depth-Based Coloring** — Edges change hue based on Z-depth (HSL math)
- **Vertex Rendering** — Display 3D points as circles
- **Coordinate Axes** — X (red), Y (green), Z (blue)
- **Reference Grid** — XY plane grid for spatial reference
- **Modern Dark UI** — Beautiful responsive interface with animations

---

## 🧠 The Math Behind the Magic

### Vector Operations

The `Vector3` class provides essential 3D math:

```javascript
// Dot Product: scalar projection
dot(v) = x₁x₂ + y₁y₂ + z₁z₂

// Cross Product: perpendicular vector
cross(v) = (y₁z₂ - z₁y₂, z₁x₂ - x₁z₂, x₁y₂ - y₁x₂)

// Normalize: unit vector
normalize() = v / |v|

// Linear Interpolation
lerp(a, b, t) = a + (b - a) × t
```

### Rotation Matrices (4×4)

Objects are rotated using proper transformation matrices:

**X-Axis Rotation (Pitch):**
```
| 1    0        0       0 |
| 0    cos(θ)  -sin(θ)  0 |
| 0    sin(θ)   cos(θ)  0 |
| 0    0        0       1 |
```

**Y-Axis Rotation (Yaw):**
```
| cos(θ)   0   sin(θ)  0 |
| 0        1   0       0 |
|-sin(θ)   0   cos(θ)  0 |
| 0        0   0       1 |
```

**Z-Axis Rotation (Roll):**
```
| cos(θ)  -sin(θ)   0   0 |
| sin(θ)   cos(θ)   0   0 |
| 0        0        1   0 |
| 0        0        0   1 |
```

### Perspective Projection

3D points are projected onto the 2D screen:

```
x' = (f × x) / (f + z)
y' = (f × y) / (f + z)

where f = focal_length
```

This creates realistic depth — objects farther away appear smaller.

### Golden Ratio (Dodecahedron)

The Dodecahedron uses the golden ratio for vertex positions:

```
φ = (1 + √5) / 2 ≈ 1.618

Vertices include combinations of:
(±1, ±1, ±1)
(0, ±1/φ, ±φ)
(±1/φ, ±φ, 0)
(±φ, 0, ±1/φ)
```

### Depth-Based Coloring

Edge colors are calculated using HSL color space:

```javascript
// Calculate depth factor (0 to 1)
depthFactor = (avgZ - minZ) / (maxZ - minZ)

// Map to hue (240° blue → 0° red)
hue = 240 - (depthFactor × 240)

// Create HSL color
color = hsl(hue, 80%, 50%)
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- That's it! No build tools or package managers required.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkhilSirvi/Pure-JS-3D-Renderer.git
   ```

2. **Navigate to the project**
   ```bash
   cd Pure-JS-3D-Renderer
   ```

3. **Open in browser**
   ```bash
   # Simply open the HTML file
   open src/index.html
   
   # Or use a local server
   npx serve src
   ```

---

## 📁 Project Structure

```
Pure-JS-3D-Renderer/
├── src/
│   ├── 3d_renderer main.js   # Core 3D engine with Vector3, Matrix4, Shapes
│   ├── scripts.js            # UIController class & animation loop
│   ├── index.html            # Modern UI with all controls
│   └── style.css             # Dark theme with CSS variables
├── README.md
├── LICENSE
└── SECURITY.md
```

---

## 🧩 Architecture

### Class Overview

| Class | Purpose |
|-------|---------|
| `Vector3` | 3D vector mathematics (add, dot, cross, normalize, lerp) |
| `Matrix4` | 4×4 transformation matrices for rotation |
| `Shapes` | Namespace containing all 8 shape generators |
| `ColorUtils` | HSL to hex conversion for depth coloring |
| `Renderer3D` | Main rendering engine with all features |
| `UIController` | Handles all UI interactions and animation |

### Shape Generator Pattern

Each shape is generated by a factory function:

```javascript
Shapes.createCube = (size) => ({
    vertices: { /* 8 vertex positions */ },
    edges: [ /* pairs of connected vertices */ ]
});

Shapes.createDodecahedron = (size) => {
    const phi = (1 + Math.sqrt(5)) / 2;  // Golden ratio
    // ... vertex calculations using φ
};
```

---

## 🔧 Customization

### Add a New Shape

1. Create a generator function in `Shapes` namespace:
   ```javascript
   Shapes.createMyShape = (size) => ({
       vertices: {
           a: [x1, y1, z1],
           b: [x2, y2, z2],
           // ...
       },
       edges: [
           ['a', 'b'],
           ['b', 'c'],
           // ...
       ]
   });
   ```

2. Add button in `index.html`:
   ```html
   <button class="shape-btn" data-shape="myShape">My Shape</button>
   ```

### Modify Colors

In `3d_renderer main.js`, adjust the `ColorUtils` class:
```javascript
static depthToColor(depth, min, max) {
    const hue = 240 - (factor * 240);  // Adjust hue range
    const saturation = 80;              // Adjust saturation
    const lightness = 50;               // Adjust lightness
    // ...
}
```

### Change Default Settings

In `scripts.js`, modify the `defaultState` object:
```javascript
this.defaultState = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    // ... other defaults
};
```

---

## 🎓 Learning Resources

This project demonstrates core computer graphics concepts:

- **Linear Algebra** — Vectors, matrices, transformations
- **Trigonometry** — Rotation using sin/cos
- **Projection** — 3D to 2D perspective mapping
- **Color Theory** — HSL color space, depth perception
- **Platonic Solids** — Regular polyhedra geometry
- **Golden Ratio** — Mathematical constants in nature

---

## 🤝 Contributing

Contributions are welcome! Ideas for enhancements:

- 🔦 **Lighting & Shading** — Add Phong or Gouraud shading
- 📦 **OBJ Import** — Load external 3D models
- 🎬 **Animation System** — Keyframe-based animations
- 🖱️ **Mouse Controls** — Click and drag rotation
- 🌈 **Texture Mapping** — Apply images to surfaces

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with pure mathematics and a passion for understanding 3D graphics from the ground up
- Inspired by the fundamentals of computer graphics and linear algebra
- Dodecahedron geometry based on classical Platonic solid mathematics

---

## 📧 Contact

**Akhil Sirvi** - [GitHub Profile](https://github.com/AkhilSirvi)

Project Link: [https://github.com/AkhilSirvi/Pure-JS-3D-Renderer](https://github.com/AkhilSirvi/Pure-JS-3D-Renderer)

---

<p align="center">
  <strong>Made with ❤️ and pure JavaScript mathematics</strong>
  <br>
  <sub>No WebGL • No Three.js • No Dependencies</sub>
</p>
