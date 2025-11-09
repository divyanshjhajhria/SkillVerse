// Initialize the application
let galaxy;
let allSkills = [];
let userSkills = [];
let recommendations = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize galaxy visualization
    galaxy = new Galaxy('galaxyCanvas');
    
    // Load initial data
    loadAllSkills();
    loadUserSkills();
    
    // Setup event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add skill button
    document.getElementById('addSkillBtn').addEventListener('click', openAddSkillModal);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Search functionality
    document.getElementById('skillSearch').addEventListener('input', filterAvailableSkills);
    
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterAvailableSkills();
        });
    });
}

// Load all available skills
async function loadAllSkills() {
    try {
        const response = await fetch('/api/skills');
        allSkills = await response.json();
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Load user's skills
async function loadUserSkills() {
    try {
        const response = await fetch('/api/user_skills');
        userSkills = await response.json();
        renderUserSkills();
        updateGalaxyVisualization();
        loadRecommendations();
    } catch (error) {
        console.error('Error loading user skills:', error);
    }
}

// Load recommendations
async function loadRecommendations() {
    try {
        const response = await fetch('/api/recommendations');
        recommendations = await response.json();
        renderRecommendations();
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

// Render user skills
function renderUserSkills() {
    const container = document.getElementById('userSkills');
    
    if (userSkills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🌟</div>
                <div class="empty-state-text">No skills yet. Add your first skill to start building your galaxy!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userSkills.map(skill => `
        <div class="skill-item">
            <div class="skill-info">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-category">${skill.category}</div>
            </div>
            <div class="skill-actions">
                <button class="btn btn-danger" onclick="removeSkill(${skill.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

// Render recommendations
function renderRecommendations() {
    const container = document.getElementById('recommendations');
    
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🌠</div>
                <div class="empty-state-text">Add more skills to unlock connector recommendations!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-card">
            <div class="rec-header">
                <div class="rec-name">${rec.name}</div>
                <div class="rec-badge">CONNECTOR</div>
            </div>
            <div class="rec-description">${rec.description}</div>
            <div class="rec-connects">
                <span>🔗 Bridges:</span>
                <span>${rec.connects[0]}</span>
                <span>↔</span>
                <span>${rec.connects[1]}</span>
            </div>
            <div class="rec-actions">
                <button class="btn btn-primary" onclick="addRecommendedSkill(${rec.id})">Learn This!</button>
                <button class="btn btn-info" onclick="showSkillInfo(${rec.id}, '${rec.name}', '${rec.description}', '${rec.learning_resources}', null)">Learn More</button>
            </div>
        </div>
    `).join('');
}

// Open add skill modal
function openAddSkillModal() {
    const modal = document.getElementById('addSkillModal');
    modal.style.display = 'block';
    renderAvailableSkills();
}

// Filter available skills
function filterAvailableSkills() {
    const searchTerm = document.getElementById('skillSearch').value.toLowerCase();
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    
    const filtered = allSkills.filter(skill => {
        // Filter out already learned skills
        if (userSkills.some(us => us.id === skill.id)) return false;
        
        // Filter by search term
        if (searchTerm && !skill.name.toLowerCase().includes(searchTerm) && 
            !skill.description.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Filter by category
        if (activeCategory !== 'all' && skill.category !== activeCategory) {
            return false;
        }
        
        return true;
    });
    
    renderFilteredSkills(filtered);
}

// Render available skills
function renderAvailableSkills() {
    filterAvailableSkills();
}

// Render filtered skills
function renderFilteredSkills(skills) {
    const container = document.getElementById('availableSkills');
    
    if (skills.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-text">No skills found matching your criteria.</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = skills.map(skill => `
        <div class="available-skill-card" onclick="addSkill(${skill.id})">
            <div class="available-skill-name">${skill.name}</div>
            <div class="available-skill-category">${skill.category}</div>
            <div class="available-skill-description">${skill.description}</div>
        </div>
    `).join('');
}

// Add skill to user's collection
async function addSkill(skillId) {
    try {
        const response = await fetch('/api/user_skills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skill_id: skillId })
        });
        
        if (response.ok) {
            // Close modal and reload data
            document.getElementById('addSkillModal').style.display = 'none';
            await loadUserSkills();
            
            // Show success animation (you could add a toast notification here)
            console.log('Skill added successfully!');
        }
    } catch (error) {
        console.error('Error adding skill:', error);
    }
}

// Add recommended skill
async function addRecommendedSkill(skillId) {
    await addSkill(skillId);
}

// Remove skill from user's collection
async function removeSkill(skillId) {
    if (!confirm('Are you sure you want to remove this skill from your galaxy?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/remove_skill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skill_id: skillId })
        });
        
        if (response.ok) {
            await loadUserSkills();
        }
    } catch (error) {
        console.error('Error removing skill:', error);
    }
}

// Show skill information modal
function showSkillInfo(skillId, name, description, learningResources, connects) {
    const modal = document.getElementById('infoModal');
    document.getElementById('infoTitle').textContent = name;
    document.getElementById('infoDescription').textContent = description;
    
    const connectsDiv = document.getElementById('infoConnects');
    if (connects) {
        connectsDiv.innerHTML = `
            <div class="rec-connects" style="margin: 15px 0;">
                <span>🔗 Bridges:</span>
                <span>${connects[0]}</span>
                <span>↔</span>
                <span>${connects[1]}</span>
            </div>
        `;
    } else {
        connectsDiv.innerHTML = '';
    }
    
    document.getElementById('infoLearnLink').href = learningResources;
    modal.style.display = 'block';
}

// Update galaxy visualization
async function updateGalaxyVisualization() {
    try {
        const response = await fetch('/api/galaxy_data');
        const data = await response.json();
        
        if (data.nodes.length === 0) {
            // Show empty galaxy state
            const canvas = document.getElementById('galaxyCanvas');
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#94a3b8';
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Add skills to see your galaxy!', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        galaxy.setData(data.nodes, data.links);
    } catch (error) {
        console.error('Error updating galaxy:', error);
    }
}

// Expose functions globally for inline onclick handlers
window.addSkill = addSkill;
window.addRecommendedSkill = addRecommendedSkill;
window.removeSkill = removeSkill;
window.showSkillInfo = showSkillInfo;