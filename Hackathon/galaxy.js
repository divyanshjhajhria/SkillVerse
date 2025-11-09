class Galaxy {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.links = [];
        this.particles = [];
        
        // Mouse interaction
        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1;
        
        // Animation
        this.animationFrame = null;
        
        // Colors for different categories
        this.colors = {
            'Computer Science': '#6366f1',
            'Art': '#ec4899',
            'Science': '#10b981',
            'Business': '#f59e0b',
            'Music': '#8b5cf6',
            'Connector': '#fbbf24'
        };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.onMouseUp());
        
        // Create background particles
        this.createBackgroundParticles();
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }
    
    createBackgroundParticles() {
        // Create distant stars in the background
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                alpha: Math.random() * 0.5 + 0.2,
                twinkleSpeed: Math.random() * 0.02
            });
        }
    }
    
    setData(nodes, links) {
        this.nodes = nodes.map((node, index) => ({
            ...node,
            x: Math.cos(index * 2 * Math.PI / nodes.length) * 150 + this.canvas.width / 2,
            y: Math.sin(index * 2 * Math.PI / nodes.length) * 150 + this.canvas.height / 2,
            vx: 0,
            vy: 0,
            radius: 8
        }));
        
        this.links = links;
        
        // Apply force-directed layout
        this.applyForces();
    }
    
    applyForces() {
        const iterations = 100;
        const repulsion = 3000;
        const attraction = 0.01;
        
        for (let iter = 0; iter < iterations; iter++) {
            // Reset forces
            this.nodes.forEach(node => {
                node.vx = 0;
                node.vy = 0;
            });
            
            // Repulsion between all nodes
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const dx = this.nodes[j].x - this.nodes[i].x;
                    const dy = this.nodes[j].y - this.nodes[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = repulsion / (dist * dist);
                    
                    this.nodes[i].vx -= (dx / dist) * force;
                    this.nodes[i].vy -= (dy / dist) * force;
                    this.nodes[j].vx += (dx / dist) * force;
                    this.nodes[j].vy += (dy / dist) * force;
                }
            }
            
            // Attraction along links
            this.links.forEach(link => {
                const source = this.nodes.find(n => n.id === link.source);
                const target = this.nodes.find(n => n.id === link.target);
                
                if (source && target) {
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = dist * attraction;
                    
                    source.vx += (dx / dist) * force;
                    source.vy += (dy / dist) * force;
                    target.vx -= (dx / dist) * force;
                    target.vy -= (dy / dist) * force;
                }
            });
            
            // Apply forces
            this.nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
            });
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'transparent';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply transformations
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw background particles (twinkling stars)
        this.drawBackgroundParticles();
        
        // Draw links (constellations)
        this.drawLinks();
        
        // Draw nodes (skills)
        this.drawNodes();
        
        // Restore context state
        this.ctx.restore();
    }
    
    drawBackgroundParticles() {
        const time = Date.now() * 0.001;
        
        this.particles.forEach(particle => {
            const alpha = particle.alpha * (0.5 + 0.5 * Math.sin(time * particle.twinkleSpeed));
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x - this.offsetX, particle.y - this.offsetY, 
                        particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawLinks() {
        this.links.forEach(link => {
            const source = this.nodes.find(n => n.id === link.source);
            const target = this.nodes.find(n => n.id === link.target);
            
            if (source && target) {
                // Draw constellation line
                const gradient = this.ctx.createLinearGradient(
                    source.x, source.y, target.x, target.y
                );
                gradient.addColorStop(0, this.colors[source.category] + '80');
                gradient.addColorStop(1, this.colors[target.category] + '80');
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(source.x, source.y);
                this.ctx.lineTo(target.x, target.y);
                this.ctx.stroke();
                
                // Draw glow effect
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 4;
                this.ctx.globalAlpha = 0.2;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        });
    }
    
    drawNodes() {
        this.nodes.forEach(node => {
            const color = this.colors[node.category] || '#6366f1';
            
            // Draw glow
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 3
            );
            gradient.addColorStop(0, color + '60');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw star (node)
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw white core
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw skill name
            this.ctx.fillStyle = '#f1f5f9';
            this.ctx.font = 'bold 12px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            
            // Add text shadow for readability
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(node.name, node.x, node.y + node.radius + 8);
            this.ctx.shadowBlur = 0;
        });
    }
    
    animate() {
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    onMouseDown(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
    }
    
    onMouseMove(e) {
        if (this.isDragging) {
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;
            this.offsetX += dx;
            this.offsetY += dy;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }
    }
    
    onMouseUp() {
        this.isDragging = false;
    }
    
    onWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.scale *= delta;
        this.scale = Math.max(0.5, Math.min(2, this.scale));
    }
    
    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.lastMouseX = e.touches[0].clientX;
            this.lastMouseY = e.touches[0].clientY;
        }
    }
    
    onTouchMove(e) {
        e.preventDefault();
        if (this.isDragging && e.touches.length === 1) {
            const dx = e.touches[0].clientX - this.lastMouseX;
            const dy = e.touches[0].clientY - this.lastMouseY;
            this.offsetX += dx;
            this.offsetY += dy;
            this.lastMouseX = e.touches[0].clientX;
            this.lastMouseY = e.touches[0].clientY;
        }
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Export for use in app.js
window.Galaxy = Galaxy;