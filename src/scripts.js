/**
 * @fileoverview Enhanced Application Controller for 3D Renderer
 * @description Handles UI interactions, animation loop, shape selection, and visual settings
 * @author Akhil Sirvi
 * @version 3.0.0
 * @license MIT
 */

'use strict';

/* ============================================
 * APPLICATION CONFIGURATION
 * ============================================ */

const APP_CONFIG = Object.freeze({
    FRAME_INTERVAL: 16,  // ~60fps
    AUTO_ROTATE_SPEED: 0.5,
    
    DEFAULTS: Object.freeze({
        shape: 'cube',
        xid: 30,
        yid: 45,
        zid: 0,
        tx: 250,
        ty: 200,
        tz: 0,
        sx: 100,
        sy: 100,
        sz: 100,
        fid: 3000,
        lineWidth: 2,
        autoRotate: false,
        uniformScale: true,
        depthColoring: true,
        showVertices: false,
        showAxes: false,
        showGrid: false
    })
});

/* ============================================
 * UI CONTROLLER CLASS
 * ============================================ */

class UIController {
    constructor() {
        // DOM element cache
        this._elements = {
            sliders: {},
            displays: {},
            checkboxes: {},
            buttons: {},
            shapeButtons: [],
            canvas: null,
            shapeName: null,
            fpsCounter: null
        };

        // State
        this._animationId = null;
        this._isRunning = false;
        this._autoRotate = false;
        this._autoRotateAngle = { x: 0, y: 0 };
        this._uniformScale = true;
        this._currentShape = 'cube';
        
        // FPS tracking
        this._frameCount = 0;
        this._lastFpsUpdate = Date.now();
        this._fps = 60;

        // Initialize
        this._cacheElements();
        this._bindEvents();
    }

    /* ----------------------------------------
     * INITIALIZATION
     * ---------------------------------------- */

    _cacheElements() {
        // Sliders
        const sliderIds = ['xid', 'yid', 'zid', 'tx', 'ty', 'tz', 'sx', 'sy', 'sz', 'fid', 'line-width'];
        sliderIds.forEach(id => {
            this._elements.sliders[id] = document.getElementById(id);
            this._elements.displays[id] = document.getElementById(`${id}-value`);
        });

        // Checkboxes
        const checkboxIds = ['auto-rotate', 'uniform-scale', 'depth-coloring', 'show-vertices', 'show-axes', 'show-grid'];
        checkboxIds.forEach(id => {
            this._elements.checkboxes[id] = document.getElementById(id);
        });

        // Buttons
        this._elements.buttons.reset = document.getElementById('reset-btn');
        this._elements.buttons.screenshot = document.getElementById('screenshot-btn');
        this._elements.shapeButtons = document.querySelectorAll('.shape-btn');

        // Other elements
        this._elements.canvas = document.getElementById('myCanvas');
        this._elements.shapeName = document.getElementById('shape-name');
        this._elements.fpsCounter = document.getElementById('fps-counter');
    }

    _bindEvents() {
        // Slider input handlers
        Object.entries(this._elements.sliders).forEach(([id, slider]) => {
            slider?.addEventListener('input', () => {
                this._updateDisplay(id);
                
                // Handle uniform scaling
                if (this._uniformScale && ['sx', 'sy', 'sz'].includes(id)) {
                    const value = slider.value;
                    ['sx', 'sy', 'sz'].forEach(scaleId => {
                        if (scaleId !== id && this._elements.sliders[scaleId]) {
                            this._elements.sliders[scaleId].value = value;
                            this._updateDisplay(scaleId);
                        }
                    });
                }
            });
        });

        // Checkbox handlers
        this._elements.checkboxes['auto-rotate']?.addEventListener('change', (e) => {
            this._autoRotate = e.target.checked;
        });

        this._elements.checkboxes['uniform-scale']?.addEventListener('change', (e) => {
            this._uniformScale = e.target.checked;
        });

        this._elements.checkboxes['depth-coloring']?.addEventListener('change', (e) => {
            renderer.settings.depthColoring = e.target.checked;
        });

        this._elements.checkboxes['show-vertices']?.addEventListener('change', (e) => {
            renderer.settings.showVertices = e.target.checked;
        });

        this._elements.checkboxes['show-axes']?.addEventListener('change', (e) => {
            renderer.settings.showAxes = e.target.checked;
        });

        this._elements.checkboxes['show-grid']?.addEventListener('change', (e) => {
            renderer.settings.showGrid = e.target.checked;
        });

        // Shape button handlers
        this._elements.shapeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this._elements.shapeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const shape = btn.dataset.shape;
                this._currentShape = shape;
                renderer.setShape(shape);
                
                if (this._elements.shapeName) {
                    this._elements.shapeName.textContent = btn.textContent;
                }
            });
        });

        // Reset button
        this._elements.buttons.reset?.addEventListener('click', () => this.resetControls());

        // Screenshot button
        this._elements.buttons.screenshot?.addEventListener('click', () => this._takeScreenshot());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this._handleKeyboard(e));
    }

    _handleKeyboard(event) {
        // Ignore if typing in an input
        if (event.target.tagName === 'INPUT') return;

        switch(event.key.toLowerCase()) {
            case 'r':
                this.resetControls();
                break;
            case ' ':
                event.preventDefault();
                this._isRunning ? this.stop() : this.start();
                break;
            case 'a':
                this._autoRotate = !this._autoRotate;
                if (this._elements.checkboxes['auto-rotate']) {
                    this._elements.checkboxes['auto-rotate'].checked = this._autoRotate;
                }
                break;
            case 'v':
                renderer.settings.showVertices = !renderer.settings.showVertices;
                if (this._elements.checkboxes['show-vertices']) {
                    this._elements.checkboxes['show-vertices'].checked = renderer.settings.showVertices;
                }
                break;
            case 'g':
                renderer.settings.showGrid = !renderer.settings.showGrid;
                if (this._elements.checkboxes['show-grid']) {
                    this._elements.checkboxes['show-grid'].checked = renderer.settings.showGrid;
                }
                break;
            case 'x':
                renderer.settings.showAxes = !renderer.settings.showAxes;
                if (this._elements.checkboxes['show-axes']) {
                    this._elements.checkboxes['show-axes'].checked = renderer.settings.showAxes;
                }
                break;
        }
    }

    /* ----------------------------------------
     * DISPLAY UPDATES
     * ---------------------------------------- */

    _updateDisplay(id) {
        const display = this._elements.displays[id];
        const slider = this._elements.sliders[id];
        
        if (!display || !slider) return;

        const value = parseFloat(slider.value);
        
        if (['xid', 'yid', 'zid'].includes(id)) {
            display.textContent = `${Math.round(value)}°`;
        } else if (['sx', 'sy', 'sz'].includes(id)) {
            display.textContent = (value / 100).toFixed(1);
        } else {
            display.textContent = Math.round(value);
        }
    }

    _updateAllDisplays() {
        Object.keys(this._elements.sliders).forEach(id => this._updateDisplay(id));
    }

    _updateFPS() {
        this._frameCount++;
        const now = Date.now();
        const elapsed = now - this._lastFpsUpdate;
        
        if (elapsed >= 1000) {
            this._fps = Math.round((this._frameCount * 1000) / elapsed);
            this._frameCount = 0;
            this._lastFpsUpdate = now;
            
            if (this._elements.fpsCounter) {
                this._elements.fpsCounter.textContent = `${this._fps} FPS`;
            }
        }
    }

    /* ----------------------------------------
     * CONTROLS
     * ---------------------------------------- */

    resetControls() {
        // Reset sliders
        Object.entries(APP_CONFIG.DEFAULTS).forEach(([key, value]) => {
            const slider = this._elements.sliders[key];
            if (slider) {
                slider.value = value;
            }
        });

        // Reset checkboxes
        if (this._elements.checkboxes['auto-rotate']) {
            this._elements.checkboxes['auto-rotate'].checked = APP_CONFIG.DEFAULTS.autoRotate;
            this._autoRotate = APP_CONFIG.DEFAULTS.autoRotate;
        }
        if (this._elements.checkboxes['uniform-scale']) {
            this._elements.checkboxes['uniform-scale'].checked = APP_CONFIG.DEFAULTS.uniformScale;
            this._uniformScale = APP_CONFIG.DEFAULTS.uniformScale;
        }
        if (this._elements.checkboxes['depth-coloring']) {
            this._elements.checkboxes['depth-coloring'].checked = APP_CONFIG.DEFAULTS.depthColoring;
            renderer.settings.depthColoring = APP_CONFIG.DEFAULTS.depthColoring;
        }
        if (this._elements.checkboxes['show-vertices']) {
            this._elements.checkboxes['show-vertices'].checked = APP_CONFIG.DEFAULTS.showVertices;
            renderer.settings.showVertices = APP_CONFIG.DEFAULTS.showVertices;
        }
        if (this._elements.checkboxes['show-axes']) {
            this._elements.checkboxes['show-axes'].checked = APP_CONFIG.DEFAULTS.showAxes;
            renderer.settings.showAxes = APP_CONFIG.DEFAULTS.showAxes;
        }
        if (this._elements.checkboxes['show-grid']) {
            this._elements.checkboxes['show-grid'].checked = APP_CONFIG.DEFAULTS.showGrid;
            renderer.settings.showGrid = APP_CONFIG.DEFAULTS.showGrid;
        }

        // Reset shape
        this._elements.shapeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.shape === 'cube') {
                btn.classList.add('active');
            }
        });
        renderer.setShape('cube');
        this._currentShape = 'cube';
        if (this._elements.shapeName) {
            this._elements.shapeName.textContent = 'Cube';
        }

        // Reset auto-rotate angle
        this._autoRotateAngle = { x: 0, y: 0 };

        this._updateAllDisplays();
        this._renderFrame();
    }

    _getSliderValues() {
        const getValue = (id) => parseFloat(this._elements.sliders[id]?.value || 0);
        
        return {
            rotationX: getValue('xid'),
            rotationY: getValue('yid'),
            rotationZ: getValue('zid'),
            translateX: getValue('tx'),
            translateY: getValue('ty'),
            translateZ: getValue('tz'),
            scaleX: getValue('sx') / 100,
            scaleY: getValue('sy') / 100,
            scaleZ: getValue('sz') / 100,
            focalLength: getValue('fid'),
            lineWidth: getValue('line-width')
        };
    }

    _takeScreenshot() {
        if (!this._elements.canvas) return;
        
        const link = document.createElement('a');
        link.download = `3d-render-${this._currentShape}-${Date.now()}.png`;
        link.href = this._elements.canvas.toDataURL('image/png');
        link.click();
    }

    /* ----------------------------------------
     * ANIMATION
     * ---------------------------------------- */

    _renderFrame() {
        const values = this._getSliderValues();
        
        // Handle auto-rotation
        let rotX = values.rotationX;
        let rotY = values.rotationY;
        
        if (this._autoRotate) {
            this._autoRotateAngle.y += APP_CONFIG.AUTO_ROTATE_SPEED;
            this._autoRotateAngle.x += APP_CONFIG.AUTO_ROTATE_SPEED * 0.3;
            rotX += this._autoRotateAngle.x;
            rotY += this._autoRotateAngle.y;
        }

        // Update renderer settings
        renderer.focalLength = values.focalLength;
        renderer.settings.lineWidth = values.lineWidth;
        
        // Apply transformations
        renderer.transform({
            rotationX: rotX,
            rotationY: rotY,
            rotationZ: values.rotationZ,
            translateX: values.translateX,
            translateY: values.translateY,
            translateZ: values.translateZ,
            scaleX: values.scaleX,
            scaleY: values.scaleY,
            scaleZ: values.scaleZ
        });
        
        // Render
        renderer.render();
        
        // Update FPS counter
        this._updateFPS();
    }

    _tick() {
        this._renderFrame();
    }

    start() {
        if (this._isRunning) return;
        
        this._isRunning = true;
        this._animationId = setInterval(() => this._tick(), APP_CONFIG.FRAME_INTERVAL);
        console.info('🎬 Animation started');
    }

    stop() {
        if (!this._isRunning) return;
        
        this._isRunning = false;
        if (this._animationId) {
            clearInterval(this._animationId);
            this._animationId = null;
        }
        console.info('⏸️ Animation paused');
    }

    init() {
        // Set up canvas
        if (this._elements.canvas) {
            renderer.canvas = this._elements.canvas;
        } else {
            console.error('UIController: Canvas element not found');
            return;
        }

        // Set initial shape
        renderer.setShape('cube');

        // Apply default settings
        renderer.settings.depthColoring = APP_CONFIG.DEFAULTS.depthColoring;
        renderer.settings.showVertices = APP_CONFIG.DEFAULTS.showVertices;
        renderer.settings.showAxes = APP_CONFIG.DEFAULTS.showAxes;
        renderer.settings.showGrid = APP_CONFIG.DEFAULTS.showGrid;

        // Update displays
        this._updateAllDisplays();
        
        // Initial render
        this._renderFrame();
        
        // Start animation
        this.start();
        
        console.info('✅ 3D Renderer v3.0 initialized');
        console.info('📚 Available shapes:', Object.keys(Shapes).join(', '));
        console.info('⌨️ Keyboard: Space=pause, R=reset, A=auto-rotate, V=vertices, G=grid, X=axes');
    }
}

/* ============================================
 * APPLICATION INITIALIZATION
 * ============================================ */

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new UIController();
    app.init();
});

// Fallback
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!app) {
            app = new UIController();
            app.init();
        }
    }, 1);
}

/* ============================================
 * EXPORTS
 * ============================================ */

if (typeof window !== 'undefined') {
    window.UIController = UIController;
    window.APP_CONFIG = APP_CONFIG;
}
