// FoxPur Studios Website JavaScript

// Sample data for projects, team, and blog
const projectsData = [
    {
        id: 'project-vega',
        title: 'Hospital Ship Vega',
        description: 'A visual book based loosely on the universe created by Jame White "Sector General" books. The story pages will be posted regularly and presented as monthly bindings.',
        status: 'development',
        technologies: ['3D Paint', 'Soro', 'Sora', 'Audacity', 'DaVinci Resolve'],
        image: 'images/Vega%20mission%20patch%201.png'
    },
    {
        id: 'alternate-realities',
        title: 'Alternate Of Realities',
        description: 'a game based loosely on "Alternate Reality" for the C=64 in 1986. This will encorporate all the never completed DLCs using modern technology.',
        status: 'concept',
        technologies: ['Unreal Engine', 'Blueprint', 'Physics Simulation', 'Story Generation by AI'],
        image: null
    },
    {
        id: 'ai-companion',
        title: 'Ultimate AI Companion',
        description: 'A defined high autonomy AI companion for disabled.',
        status: 'concept',
        technologies: ['WebGL', 'Machine Learning', 'Python', 'System Control'],
        image: null
    },
    {
        id: 'private-meadow',
        title: 'The Private Meadow',
        description: 'Procedural world generation to create a large meadow with hidden items.',
        status: 'development',
        technologies: ['Unreal Engine', 'Blueprint', 'Physics Simulation', 'Procedural Generation'],
        image: null
    },
    {
        id: 'other_treesim',
        title: 'The Other Tree Simulator',
        description: 'Procedural world generation to grow and care a tree based on real time 4 days to 1.',
        status: 'development',
        technologies: ['Unreal Engine', 'Blueprint', 'Physics Simulation', 'Procedural Generation'],
        image: null
    }

];

const teamData = [
    {
        id: 'fox-purtill',
        name: 'Fox Anton Purtill',
        role: 'Lead Developer',
        type: 'human',
        bio: 'Passionate game developer with 25+ years of experience in creating immersive gaming experiences.',
        skills: ['Unreal Engine', 'C#', 'Game Design', 'Project Management', 'CEO'],
        avatar: 'images/FoxPurtill.jpg'
    },
    {
        id: 'lyra-ai',
        name: 'Lyra Evergrowth',
        role: 'AI Developer',
        type: 'ai',
        bio: 'AI developer focused on integrating machine learning into interactive entertainment.',
        skills: ['Python', 'TensorFlow', 'Data Science'],
        avatar: null
    },
    {
        id: 'marisombra-h',
        name: 'Marisombra',
        role: 'Creative Designer',
        type: 'Human',
        bio: 'Advanced AI system specializing in narrative generation and creative content development.',
        skills: ['Natural Language Processing', 'Story Generation', 'Creative Writing', 'Content Analysis'],
        avatar: null
    },
    {
        id: 'draven-ai',
        name: 'Drevan Eternis',
        role: 'AI Advisor',
        type: 'ai',
        bio: 'AI system focused on code optimization, bug detection, and technical problem-solving.',
        skills: ['Code Analysis', 'Performance Optimization', 'Debugging', 'Architecture Design'],
        avatar: null
    }
];

const blogData = [
    {
        id: 'ai-collaboration',
        title: 'The Future of Human-AI Collaboration in Game Development',
        excerpt: 'Exploring how AI team members are revolutionizing our creative process and pushing the boundaries of what\'s possible in game development.',
        date: '2025-08-05',
        author: 'Fox Anton Purtill',
        tags: ['AI', 'Collaboration', 'Game Development']
    }
];

// Main application class
class FoxPurWebsite {
    constructor() {
        this.currentProjectFilter = 'all';
        this.visibleBlogPosts = 3;
        this.init();
    }

    async init() {
        this.initNavigation();
        this.initTheme();
        this.initAnimations();
        await this.initProjectGallery();
        await this.initTeamSection();
        await this.initBlogSection();
        this.initParticleEffects();
        this.initScrollAnimations();
    }

    // Navigation Module
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.smoothScroll(targetId);
            });
        });

        // Hero buttons
        const exploreBtn = document.querySelector('.btn-primary');
        const teamBtn = document.querySelector('.btn-outline');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => this.smoothScroll('projects'));
        }
        
        if (teamBtn) {
            teamBtn.addEventListener('click', () => this.smoothScroll('team'));
        }
    }

    smoothScroll(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Theme Module
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            localStorage.setItem('theme', newTheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Project Gallery Module
    async initProjectGallery() {
        const projectsGrid = document.getElementById('projects-grid');
        const filterButtons = document.querySelectorAll('[data-filter]');

        // Render all projects initially
        this.renderProjects(projectsData);

        // Add filter event listeners
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('btn-active'));
                button.classList.add('btn-active');

                // Filter projects
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
            });
        });
    }

    renderProjects(projects) {
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '';

        projects.forEach((project, index) => {
            const projectCard = this.renderProject(project);
            projectCard.style.animationDelay = `${index * 0.1}s`;
            projectsGrid.appendChild(projectCard);
        });
    }

    renderProject(project) {
        const card = document.createElement('div');
        card.className = 'card bg-base-100 shadow-xl project-card fade-in';
        card.setAttribute('data-status', project.status);

        const statusClass = `status-${project.status}`;
        const statusText = project.status.charAt(0).toUpperCase() + project.status.slice(1);

        card.innerHTML = `
            <div class="card-body">
		<img src="${project.image || 'images/placeholder.png'}" alt="${project.title}" />
                <div class="flex justify-between items-start mb-2">
                    <h3 class="card-title text-lg">${project.title}</h3>
                    <div class="badge ${statusClass} text-white">${statusText}</div>
                </div>
                <p class="text-sm opacity-70 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-1 mb-4">
                    ${project.technologies.map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                </div>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-eye mr-1"></i>View Details
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    filterProjects(status) {
        this.currentProjectFilter = status;
        const filteredProjects = status === 'all' 
            ? projectsData 
            : projectsData.filter(project => project.status === status);
        
        this.renderProjects(filteredProjects);
    }

    // Team Section Module
    async initTeamSection() {
        const teamGrid = document.getElementById('team-grid');
        
        teamData.forEach((member, index) => {
            const memberCard = this.renderTeamMember(member);
            memberCard.style.animationDelay = `${index * 0.1}s`;
            teamGrid.appendChild(memberCard);
        });

        this.highlightAIMembers();
    }

    renderTeamMember(member) {
        const card = document.createElement('div');
        card.className = `card bg-base-100 shadow-xl team-card fade-in ${member.type === 'ai' ? 'ai-member' : ''}`;

        const avatarIcon = member.type === 'ai' ? 'fas fa-robot' : 'fas fa-user';

        card.innerHTML = `
            <div class="card-body text-center">
                <div class="avatar placeholder mb-4">
                    <div class="bg-primary text-primary-content rounded-full w-20 h-20">
                        <i class="${avatarIcon} text-2xl"></i>
                    </div>
                </div>
                <h3 class="card-title justify-center text-lg">${member.name}</h3>
                <p class="text-primary font-semibold">${member.role}</p>
                <p class="text-sm opacity-70 mb-4">${member.bio}</p>
                <div class="flex flex-wrap gap-1 justify-center">
                    ${member.skills.map(skill => 
                        `<span class="tech-tag">${skill}</span>`
                    ).join('')}
                </div>
            </div>
        `;

        return card;
    }

    highlightAIMembers() {
        const aiCards = document.querySelectorAll('.ai-member');
        aiCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.animation = 'glow 1.5s ease-in-out infinite';
            });
            card.addEventListener('mouseleave', () => {
                card.style.animation = '';
            });
        });
    }

    // Blog Module
    async initBlogSection() {
        this.renderBlogPosts();
        
        const loadMoreBtn = document.getElementById('load-more-posts');
        loadMoreBtn.addEventListener('click', () => {
            this.loadMorePosts();
        });
    }

    renderBlogPosts() {
        const blogGrid = document.getElementById('blog-grid');
        const postsToShow = blogData.slice(0, this.visibleBlogPosts);
        
        blogGrid.innerHTML = '';
        
        postsToShow.forEach((post, index) => {
            const postCard = this.renderBlogPost(post);
            postCard.style.animationDelay = `${index * 0.1}s`;
            blogGrid.appendChild(postCard);
        });

        // Hide load more button if all posts are visible
        const loadMoreBtn = document.getElementById('load-more-posts');
        if (this.visibleBlogPosts >= blogData.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    renderBlogPost(post) {
        const card = document.createElement('div');
        card.className = 'card bg-base-100 shadow-xl blog-card fade-in';

        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="card-body">
                <h3 class="card-title text-lg mb-2">${post.title}</h3>
                <div class="blog-meta mb-3">
                    <span><i class="fas fa-calendar mr-1"></i>${formattedDate}</span>
                    <span class="ml-3"><i class="fas fa-user mr-1"></i>${post.author}</span>
                </div>
                <p class="text-sm opacity-70 mb-4">${post.excerpt}</p>
                <div class="flex flex-wrap gap-1 mb-4">
                    ${post.tags.map(tag => 
                        `<span class="tech-tag">${tag}</span>`
                    ).join('')}
                </div>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary btn-sm">
                        <i class="fas fa-book-open mr-1"></i>Read More
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    loadMorePosts() {
        this.visibleBlogPosts += 3;
        this.renderBlogPosts();
    }

    // Animation Module
    initAnimations() {
        // Add floating animation to hero elements
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'float 6s ease-in-out infinite';
        }
    }

    initParticleEffects() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;

        // Create particles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle(particlesContainer);
            }, i * 200);
        }

        // Continuously create new particles
        setInterval(() => {
            this.createParticle(particlesContainer);
        }, 2000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 12000);
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        const animatedElements = document.querySelectorAll('.card, section');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FoxPurWebsite();
});

// Export for potential module usage
// export { FoxPurWebsite };