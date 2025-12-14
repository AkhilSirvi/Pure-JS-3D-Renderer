# 🎮 Pure JavaScript 3D Renderer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Pure JavaScript](https://img.shields.io/badge/Pure-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen)](https://github.com/AkhilSirvi/Pure-JS-3D-Renderer)

A lightweight, pure JavaScript + HTML5 Canvas 3D renderer that draws 3D objects using only mathematics — **no WebGL, no Three.js, no external libraries**.

## 🌐 Live Demo

**[👉 View the 3D Renderer in Action](https://akhilsirvi.github.io/Pure-JS-3D-Renderer/src/index.html)**

---

## ✨ Features

- 🧮 **Pure Mathematics** — Built entirely on linear algebra and trigonometry
- 🚫 **Zero Dependencies** — No WebGL, no external libraries, just vanilla JavaScript
- 🔄 **Real-time 3D Rotation** — Rotate objects around X, Y, and Z axes
- 📐 **Perspective Projection** — Realistic depth perception with configurable focal length
- 🎯 **Translation Controls** — Move objects in 3D space
- ⚡ **Lightweight** — Minimal codebase, fast rendering
- 📱 **Works Everywhere** — Runs in any modern browser

---

## 🎬 How It Works

### The Math Behind the Magic

This renderer uses fundamental 3D graphics concepts:

#### 1. **Vertex Definition**
A 3D cube is defined by 8 vertices in 3D space (x, y, z coordinates).

```
       f -------- e
      /|         /|
     / |        / |
    b -------- a  |
    |  g ------|-- h
    | /        | /
    |/         |/
    c -------- d
```

#### 2. **Rotation Matrices**
Objects are rotated using 3x3 rotation matrices for each axis:

**X-Axis (Pitch):**
```
| 1    0        0      |
| 0    cos(θ)  -sin(θ) |
| 0    sin(θ)   cos(θ) |
```

**Y-Axis (Yaw):**
```
| cos(θ)   0   sin(θ) |
| 0        1   0      |
|-sin(θ)   0   cos(θ) |
```

**Z-Axis (Roll):**
```
| cos(θ)  -sin(θ)   0 |
| sin(θ)   cos(θ)   0 |
| 0        0        1 |
```

#### 3. **Perspective Projection**
3D points are projected onto a 2D screen using:

```
x' = (focal_length × x) / (focal_length + z)
y' = (focal_length × y) / (focal_length + z)
```

This creates the illusion of depth — objects farther away appear smaller.

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

## 🎮 Controls

| Control | Description |
|---------|-------------|
| **X Rotation Slider** | Rotates the cube around the X-axis (Pitch) |
| **Y Rotation Slider** | Rotates the cube around the Y-axis (Yaw) |
| **Z Rotation Slider** | Rotates the cube around the Z-axis (Roll) |
| **TX Slider** | Moves the cube along the X-axis |
| **TY Slider** | Moves the cube along the Y-axis |
| **TZ Slider** | Moves the cube along the Z-axis (depth) |
| **Focal Length Slider** | Adjusts perspective intensity |

---

## 📁 Project Structure

```
Pure-JS-3D-Renderer/
├── src/
│   ├── 3d_renderer main.js   # Core rendering engine
│   ├── scripts.js            # UI controls & animation loop
│   ├── index.html            # Main HTML page
│   └── style.css             # Styling
├── README.md
├── LICENSE
└── SECURITY.md
```

---

## 🧠 Core Concepts

### Files Explained

| File | Purpose |
|------|---------|
| `3d_renderer main.js` | Contains the 3D math engine: vertex definitions, rotation matrices, matrix multiplication, and perspective projection |
| `scripts.js` | Handles UI interactions and the main animation loop (updates at ~1000fps) |
| `index.html` | The canvas element and slider controls |
| `style.css` | Basic layout styling |

---

## 🔧 Customization

### Change Cube Size
In `3d_renderer main.js`, modify the vertex table values:
```javascript
let vertex_table = {
  a: [100, 100, 100],   // Change 100 to desired size
  // ...
};
```

### Change Line Color
In the `line_maker` function:
```javascript
ctx.strokeStyle = 'black';  // Change to any CSS color
ctx.lineWidth = 1;          // Change line thickness
```

### Adjust Perspective
Modify the focal length:
```javascript
let focal_length = 10000;  // Higher = flatter, Lower = more dramatic
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

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

---

## 📧 Contact

**Akhil Sirvi** - [GitHub Profile](https://github.com/AkhilSirvi)

Project Link: [https://github.com/AkhilSirvi/Pure-JS-3D-Renderer](https://github.com/AkhilSirvi/Pure-JS-3D-Renderer)

---

<p align="center">
  Made with ❤️ and pure JavaScript
</p>
