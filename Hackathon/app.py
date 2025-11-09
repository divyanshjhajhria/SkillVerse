from flask import Flask, render_template, request, jsonify
import sqlite3
import json
from datetime import datetime

app = Flask(__name__)

# Initialize database
def init_db():
    conn = sqlite3.connect('data/skillverse.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # User skills table
    c.execute('''CREATE TABLE IF NOT EXISTS user_skills
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  skill_id INTEGER,
                  learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(id),
                  FOREIGN KEY (skill_id) REFERENCES skills(id))''')
    
    # Skills table
    c.execute('''CREATE TABLE IF NOT EXISTS skills
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL,
                  category TEXT NOT NULL,
                  description TEXT,
                  learning_resources TEXT)''')
    
    # Skill connections table
    c.execute('''CREATE TABLE IF NOT EXISTS skill_connections
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  skill1_id INTEGER,
                  skill2_id INTEGER,
                  connector_skill_id INTEGER,
                  strength REAL DEFAULT 1.0,
                  FOREIGN KEY (skill1_id) REFERENCES skills(id),
                  FOREIGN KEY (skill2_id) REFERENCES skills(id),
                  FOREIGN KEY (connector_skill_id) REFERENCES skills(id))''')
    
    conn.commit()
    conn.close()

# Seed initial skills and connections
def seed_data():
    conn = sqlite3.connect('data/skillverse.db')
    c = conn.cursor()
    
    # Check if data already exists
    c.execute("SELECT COUNT(*) FROM skills")
    if c.fetchone()[0] > 0:
        conn.close()
        return
    
    # Seed skills across different domains
    skills = [
        # Computer Science Galaxy
        ("Python", "Computer Science", "Popular programming language", "https://www.python.org/about/gettingstarted/"),
        ("JavaScript", "Computer Science", "Web programming language", "https://developer.mozilla.org/en-US/docs/Learn/JavaScript"),
        ("Machine Learning", "Computer Science", "AI and data science", "https://www.coursera.org/learn/machine-learning"),
        ("Web Development", "Computer Science", "Building websites and apps", "https://www.freecodecamp.org/"),
        ("Data Structures", "Computer Science", "Organizing and managing data", "https://www.geeksforgeeks.org/data-structures/"),
        
        # Art Galaxy
        ("Digital Painting", "Art", "Creating art digitally", "https://www.youtube.com/results?search_query=digital+painting+tutorial"),
        ("Graphic Design", "Art", "Visual communication design", "https://www.canva.com/learn/graphic-design/"),
        ("Animation", "Art", "Bringing visuals to life", "https://www.youtube.com/results?search_query=animation+basics"),
        ("Photography", "Art", "Capturing moments", "https://www.youtube.com/results?search_query=photography+basics"),
        ("3D Modeling", "Art", "Creating 3D objects", "https://www.blender.org/support/tutorials/"),
        
        # Science Galaxy
        ("Biology", "Science", "Study of living organisms", "https://www.khanacademy.org/science/biology"),
        ("Chemistry", "Science", "Study of matter", "https://www.khanacademy.org/science/chemistry"),
        ("Physics", "Science", "Study of matter and energy", "https://www.khanacademy.org/science/physics"),
        ("Neuroscience", "Science", "Study of the nervous system", "https://www.coursera.org/learn/neuroscience"),
        ("Environmental Science", "Science", "Study of the environment", "https://www.khanacademy.org/science/biology/ecology"),
        
        # Business Galaxy
        ("Marketing", "Business", "Promoting products/services", "https://www.hubspot.com/resources"),
        ("Project Management", "Business", "Managing projects effectively", "https://www.pmi.org/learning"),
        ("Finance", "Business", "Managing money and investments", "https://www.investopedia.com/"),
        ("Entrepreneurship", "Business", "Starting and running businesses", "https://www.coursera.org/learn/wharton-entrepreneurship"),
        
        # Music Galaxy
        ("Music Theory", "Music", "Understanding music structure", "https://www.musictheory.net/"),
        ("Audio Engineering", "Music", "Recording and mixing sound", "https://www.youtube.com/results?search_query=audio+engineering+basics"),
        ("Music Production", "Music", "Creating music digitally", "https://www.youtube.com/results?search_query=music+production+tutorial"),
        
        # Connector Skills (Bridge different galaxies)
        ("AI Art Generation", "Connector", "Combines AI and Art", "https://www.midjourney.com/"),
        ("Bioinformatics", "Connector", "Combines Biology and Programming", "https://www.coursera.org/learn/bioinformatics"),
        ("Data Visualization", "Connector", "Combines Data Science and Design", "https://www.tableau.com/learn"),
        ("Creative Coding", "Connector", "Combines Programming and Art", "https://www.youtube.com/results?search_query=creative+coding"),
        ("Game Development", "Connector", "Combines Programming, Art, and Physics", "https://unity.com/learn"),
        ("Scientific Visualization", "Connector", "Combines Science and Programming", "https://www.youtube.com/results?search_query=scientific+visualization"),
        ("UX Design", "Connector", "Combines Psychology, Design, and Tech", "https://www.coursera.org/learn/user-experience-design"),
        ("Music Programming", "Connector", "Combines Music and Programming", "https://sonic-pi.net/"),
        ("Computational Chemistry", "Connector", "Combines Chemistry and Programming", "https://www.youtube.com/results?search_query=computational+chemistry"),
        ("Digital Marketing", "Connector", "Combines Marketing and Web Development", "https://www.google.com/digital-garage/"),
        ("Financial Modeling", "Connector", "Combines Finance and Programming", "https://www.coursera.org/learn/financial-modeling"),
        ("Environmental Data Science", "Connector", "Combines Environmental Science and Data Analysis", "https://www.coursera.org/learn/data-science-environment"),
        ("Neuromorphic Computing", "Connector", "Combines Neuroscience and Computer Science", "https://www.intel.com/content/www/us/en/research/neuromorphic-computing.html"),
    ]
    
    for skill in skills:
        c.execute("INSERT INTO skills (name, category, description, learning_resources) VALUES (?, ?, ?, ?)", skill)
    
    conn.commit()
    
    # Create connections between skills
    connections = [
        # Machine Learning + Art = AI Art Generation
        ("Machine Learning", "Digital Painting", "AI Art Generation"),
        ("Machine Learning", "Graphic Design", "AI Art Generation"),
        ("Python", "Digital Painting", "Creative Coding"),
        ("Python", "Animation", "Creative Coding"),
        
        # Biology + Programming = Bioinformatics
        ("Biology", "Python", "Bioinformatics"),
        ("Biology", "Data Structures", "Bioinformatics"),
        
        # Data + Design = Data Visualization
        ("Machine Learning", "Graphic Design", "Data Visualization"),
        ("Python", "Graphic Design", "Data Visualization"),
        
        # Programming + Art = Game Development
        ("Python", "Animation", "Game Development"),
        ("JavaScript", "3D Modeling", "Game Development"),
        ("Physics", "Programming", "Game Development"),
        
        # Science + Programming = Scientific Visualization
        ("Physics", "Python", "Scientific Visualization"),
        ("Chemistry", "Python", "Scientific Visualization"),
        ("Biology", "Data Visualization", "Scientific Visualization"),
        
        # Psychology + Design + Tech = UX Design
        ("Neuroscience", "Graphic Design", "UX Design"),
        ("Web Development", "Graphic Design", "UX Design"),
        
        # Music + Programming = Music Programming
        ("Music Theory", "Python", "Music Programming"),
        ("Audio Engineering", "Programming", "Music Programming"),
        ("Music Production", "JavaScript", "Music Programming"),
        
        # Chemistry + Programming = Computational Chemistry
        ("Chemistry", "Python", "Computational Chemistry"),
        ("Chemistry", "Machine Learning", "Computational Chemistry"),
        
        # Marketing + Web = Digital Marketing
        ("Marketing", "Web Development", "Digital Marketing"),
        ("Marketing", "Data Visualization", "Digital Marketing"),
        
        # Finance + Programming = Financial Modeling
        ("Finance", "Python", "Financial Modeling"),
        ("Finance", "Data Visualization", "Financial Modeling"),
        
        # Environmental Science + Data = Environmental Data Science
        ("Environmental Science", "Python", "Environmental Data Science"),
        ("Environmental Science", "Data Visualization", "Environmental Data Science"),
        
        # Neuroscience + CS = Neuromorphic Computing
        ("Neuroscience", "Machine Learning", "Neuromorphic Computing"),
        ("Neuroscience", "Python", "Neuromorphic Computing"),
    ]
    
    for conn_data in connections:
        c.execute("SELECT id FROM skills WHERE name = ?", (conn_data[0],))
        skill1_id = c.fetchone()[0]
        c.execute("SELECT id FROM skills WHERE name = ?", (conn_data[1],))
        skill2_id = c.fetchone()[0]
        c.execute("SELECT id FROM skills WHERE name = ?", (conn_data[2],))
        connector_id = c.fetchone()[0]
        
        c.execute("""INSERT INTO skill_connections 
                     (skill1_id, skill2_id, connector_skill_id) 
                     VALUES (?, ?, ?)""", (skill1_id, skill2_id, connector_id))
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/skills', methods=['GET'])
def get_skills():
    conn = sqlite3.connect('data/skillverse.db')
    c = conn.cursor()
    c.execute("SELECT id, name, category, description FROM skills ORDER BY category, name")
    skills = [{"id": row[0], "name": row[1], "category": row[2], "description": row[3]} 
              for row in c.fetchall()]
    conn.close()
    return jsonify(skills)

@app.route('/api/user_skills', methods=['GET', 'POST'])
def user_skills():
    if request.method == 'POST':
        skill_id = request.json.get('skill_id')
        conn = sqlite3.connect('data/skillverse.db')
        c = conn.cursor()
        
        # For simplicity, we're using user_id = 1 (demo user)
        c.execute("INSERT OR IGNORE INTO user_skills (user_id, skill_id) VALUES (1, ?)", (skill_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    
    else:  # GET
        conn = sqlite3.connect('data/skillverse.db')
        c = conn.cursor()
        c.execute("""SELECT s.id, s.name, s.category, s.description 
                     FROM skills s
                     JOIN user_skills us ON s.id = us.skill_id
                     WHERE us.user_id = 1""")
        skills = [{"id": row[0], "name": row[1], "category": row[2], "description": row[3]} 
                  for row in c.fetchall()]
        conn.close()
        return jsonify(skills)

@app.route('/api/remove_skill', methods=['POST'])
def remove_skill():
    skill_id = request.json.get('skill_id')
    conn = sqlite3.connect('data/skillverse.db')
    c = conn.cursor()
    c.execute("DELETE FROM user_skills WHERE user_id = 1 AND skill_id = ?", (skill_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    conn = sqlite3.connect('data/skillverse.db')
    c = conn.cursor()
    
    # Get user's current skills
    c.execute("""SELECT skill_id FROM user_skills WHERE user_id = 1""")
    user_skill_ids = [row[0] for row in c.fetchall()]
    
    if len(user_skill_ids) < 2:
        conn.close()
        return jsonify([])
    
    # Find connector skills for combinations of user's skills
    recommendations = []
    
    for i, skill1_id in enumerate(user_skill_ids):
        for skill2_id in user_skill_ids[i+1:]:
            # Check if there's a connector skill
            c.execute("""
                SELECT DISTINCT s.id, s.name, s.category, s.description, s.learning_resources,
                       s1.name as skill1_name, s2.name as skill2_name
                FROM skill_connections sc
                JOIN skills s ON sc.connector_skill_id = s.id
                JOIN skills s1 ON sc.skill1_id = s1.id
                JOIN skills s2 ON sc.skill2_id = s2.id
                WHERE ((sc.skill1_id = ? AND sc.skill2_id = ?) 
                       OR (sc.skill1_id = ? AND sc.skill2_id = ?))
                AND sc.connector_skill_id NOT IN (SELECT skill_id FROM user_skills WHERE user_id = 1)
            """, (skill1_id, skill2_id, skill2_id, skill1_id))
            
            results = c.fetchall()
            for row in results:
                recommendations.append({
                    "id": row[0],
                    "name": row[1],
                    "category": row[2],
                    "description": row[3],
                    "learning_resources": row[4],
                    "connects": [row[5], row[6]]
                })
    
    conn.close()
    
    # Remove duplicates
    seen = set()
    unique_recommendations = []
    for rec in recommendations:
        if rec['id'] not in seen:
            seen.add(rec['id'])
            unique_recommendations.append(rec)
    
    return jsonify(unique_recommendations)

@app.route('/api/galaxy_data', methods=['GET'])
def get_galaxy_data():
    conn = sqlite3.connect('data/skillverse.db')
    c = conn.cursor()
    
    # Get user's skills with their connections
    c.execute("""SELECT DISTINCT s.id, s.name, s.category 
                 FROM skills s
                 JOIN user_skills us ON s.id = us.skill_id
                 WHERE us.user_id = 1""")
    
    nodes = []
    for row in c.fetchall():
        nodes.append({
            "id": row[0],
            "name": row[1],
            "category": row[2]
        })
    
    # Get connections between user's skills
    user_skill_ids = [node['id'] for node in nodes]
    links = []
    
    if len(user_skill_ids) > 1:
        placeholders = ','.join('?' * len(user_skill_ids))
        c.execute(f"""
            SELECT DISTINCT sc.skill1_id, sc.skill2_id, s.name as connector_name
            FROM skill_connections sc
            JOIN skills s ON sc.connector_skill_id = s.id
            JOIN user_skills us ON sc.connector_skill_id = us.skill_id
            WHERE sc.skill1_id IN ({placeholders})
            AND sc.skill2_id IN ({placeholders})
            AND us.user_id = 1
        """, user_skill_ids + user_skill_ids)
        
        for row in c.fetchall():
            links.append({
                "source": row[0],
                "target": row[1],
                "connector": row[2]
            })
    
    conn.close()
    
    return jsonify({"nodes": nodes, "links": links})

if __name__ == '__main__':
    init_db()
    seed_data()
    app.run(debug=True, host='0.0.0.0', port=5000)