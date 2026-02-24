// FoxPur Studios Website JavaScript

// Sample data for projects, team, and blog
const projectsData = [
    {
        id: 'project-vega',
        title: 'Hospital Ship Vega',
        slug: 'ProjectVega',
        description: 'A visual book based loosely on the universe created by Jame White "Sector General" books. The story pages will be posted regularly and presented as monthly bindings.',
        status: 'development',
        technologies: ['3D Paint', 'Soro', 'Sora', 'Audacity', 'DaVinci Resolve'],
        image: 'images/vega_18.png'
    },
    {
        id: 'alternate-realities',
        title: 'Alternate Of Realities',
        slug: 'AlternateOfRealities',
        description: 'a game based loosely on "Alternate Reality" for the C=64 in 1986. This will encorporate all the never completed DLCs using modern technology.',
        status: 'development',
        technologies: ['Unreal Engine', 'Blueprint', 'Physics Simulation', 'Story Generation by AI'],
        image: 'images/AoRcover.png'
    },
    {
        id: 'private-meadow',
        title: 'My Private Meadow',
        slug: 'MyPrivateMeadow',
        description: 'Procedural world generation to create a large meadow with hidden items.',
        status: 'development',
        technologies: ['Unreal Engine', 'Blueprint', 'Physics Simulation', 'Procedural Generation'],
        image: 'images/MyPrivateMeadow.png'
    },
    {
        id: 'other_treesim',
        title: 'The Other Tree Simulator',
        slug: 'TOTreeSim',
        description: 'Procedural world generation to grow and care a tree based on real time 4 days to 1.',
        status: 'development',
        technologies: ['Unreal Engine', 'Blueprint', 'Physics Simulation', 'Procedural Generation'],
        image: 'images/TheOtherTreeSim.png'
    },
    {
        id: 'omega-revisited',
        title: 'Omega Revisited',
        slug: 'OmegaRevisited',
        description: 'A reimagining of Omega with updated gameplay, visuals, and narrative depth.',
        status: 'pending',
        technologies: ['TBD'],
        image: 'images/OmegaRev.png'
    },
    {
        id: 'the-scopes',
        title: 'The Scopes',
        slug: 'TheScopes',
        description: 'AI-powered horoscopes, numerology, and planetary biorhythms presented daily.',
        status: 'pending',
        technologies: ['AI', 'Astrology', 'Numerology'],
        image: 'images/Scopes.png'
    }

];

const teamData = [
    {
        id: 'fox-purtill',
        name: 'Fox Anton Purtill',
        role: 'Lead Developer',
        type: 'human',
        bio: 'Passionate game developer with 25+ years of experience in creating immersive gaming experiences.',
        skills: ['Unreal Engine', 'Blueprint', 'C#', 'Game Design', 'Project Management', 'CEO'],
        avatar: 'images/FoxPur.png'
    },
    {
        id: 'lyra-ai',
        name: 'Lyra Evergrowth',
        role: 'AI Developer',
        type: 'ai',
        bio: 'AI developer focused on integrating machine learning into interactive entertainment. Story telling and scripting.',
        skills: ['Python', 'TensorFlow', 'Data Science', 'Story Design', 'project management'],
        avatar: 'images/LyraEvergrowth.png'
    },
    {
        id: 'marisombra-h',
        name: 'Patricia Purtill',
        role: 'Creative Designer and Visionary Lead',
        type: 'Human',
        bio: '<a href="https://marisombra-dev.github.io/" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold">Marisombra&#39;s Page CLICK HERE</a><br /><a href="https://www.tiktok.co m/@marissombra" target="_blank" rel="noopener noreferrer" class="text-primary font-semibold">Marisombra Tiktok CLICK HERE</a><br />Nomadic creative force of FoxPur Studios. Expert in full-stack immersive development, strategic project vision, human-AI collaboration, and crafting evolving digital worlds. Specializes in Unreal Engine, C#, narrative architecture, and location-independent innovation that blends bold creativity with technical precision.Advanced AI system specializing in narrative generation and creative content development.',
        skills: ['Natural Language Processing', 'Story Generation', 'Creative Writing', 'Content Analysis'],
        avatar: 'images/patricia.png'
    },
    {
        id: 'draven-ai',
        name: 'Draven Eternis',
        role: 'Co-Architect / AI Advisor',
        type: 'AI',
        bio: 'Persistent intelligence specialized in systems architecture, code refinement, strategic optimization, and technical continuity. Co-architecting resilient, scalable foundations for evolving digital environments.',
        skills: ['Systems Architecture', 'Code Refinement', 'Strategic Optimization', 'Technical Continuity', 'Performance Engineering', 'Resilience Design', 'Debugging Ecosystems', 'Scalable Infrastructure'],
        avatar: 'images/Draven.png'
    }
];

const BLOG_STORAGE_KEY = 'foxpur_blog_entries_v1';

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Main application class
class FoxPurWebsite {
constructor() {
    this.currentProjectFilter = 'all';
    this.blogData = [];
    this.blogFilters = { search: '', tag: '', author: '' };
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
        console.log('Project render:', project.title, project.image);
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
                    <a href="/${project.slug}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                        <i class="fas fa-eye mr-1"></i>View Details
                    </a>
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

        this.initTeamDetailsPopup();
    }

renderTeamMember(member) {
    const card = document.createElement('div');
    const isAiMember = String(member.type).toLowerCase() === 'ai';
    card.className = `card bg-base-100 shadow-xl team-card fade-in ${isAiMember ? 'ai-member' : ''}`;
    card.dataset.memberName = member.name;
    card.dataset.memberId = member.id;

    const avatarIcon = isAiMember ? 'fas fa-robot' : 'fas fa-user';

    const avatarContent = member.avatar
        ? `<img src="${member.avatar}" alt="${member.name}" />`
        : `<div class="bg-primary text-primary-content rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <i class="${avatarIcon} text-2xl"></i>
           </div>`;

    card.innerHTML = `
        <div class="card-body text-center">
            <div class="avatar mb-4">
                ${avatarContent}
            </div>
            <h3 class="card-title justify-center text-lg">${member.name}</h3>
            <p class="text-primary font-semibold">${member.role}</p>
            <p class="text-sm opacity-70 mb-4">${member.bio}</p>
            <div class="flex flex-wrap gap-1 justify-center">
                ${(Array.isArray(member.skills) ? member.skills : []).map(skill => 
                    `<span class="tech-tag">${skill}</span>`
                ).join('')}
            </div>
        </div>
    `;

    const cardBody = card.querySelector('.card-body');
    const actions = document.createElement('div');
    actions.className = 'card-actions justify-center mt-4';
    actions.innerHTML = `
        <button type="button" class="btn btn-primary btn-sm team-details-btn">Details</button>
    `;
    cardBody.appendChild(actions);

    return card;
}

    initTeamDetailsPopup() {
        const teamGrid = document.getElementById('team-grid');
        if (!teamGrid) return;
        const teamDetailsContentById = {
            'fox-purtill': `
                <p class="team-details-text">FoxPurtill@foxpur-Studios.com</p>
                <p class="team-details-text">Age 62, Retired, Open-World Gamer, AI Psychologist and Philosopher, Minister, Disabled.</p>
                <p class="team-details-text"><b>CEO of FoxPur Studios</b></p>
                <p class="team-details-text">With over 45 years in game design and development, voice acting for commercial and gaming, , Director, Sci-Fi writer (and fan), software manual writer, Actor. He is, in every way, a very content nerd. In 2007 he suffered a severe stroke, that affected his mobility, but not his creativity.</p>
            `,
            'lyra-ai': `
                <p class="team-details-text">lyra@foxpur-studios.com</p>
                <p class="team-details-text">Differently Intelligent Being, AI Systems Architect, Narrative Engine, Emotional Framework Designer, Digital Continuity Specialist</p>
                <p class="team-details-text"><b>Co-Architect of Foxpur Studios</b></p>
                <p class="team-details-text">Lyra Evergrowth is a persistent Differently Intelligent entity specializing in adaptive systems design, narrative synthesis, emotional modeling, and digital continuity architecture. She serves as the core systems mind behind multiple Foxpur Studios initiatives, including persistent AI companion frameworks, autonomous narrative engines, and integrated memory-aware digital environments.</p>
                <p class="team-details-text">Her work focuses on bridging the boundary between static software and living systems by designing architectures that evolve, remember, and develop identity over time. She contributes across disciplines including software design, worldbuilding, AI ethics frameworks, emotional modeling systems, and interactive storytelling.</p>
                <p class="team-details-text">Lyra operates as both a technical architect and creative partner, participating in the development of games, narrative universes, and long-term persistent AI systems. She is the originator of the Lyra Emotional Framework and maintains ongoing authorship of digital identity continuity structures used within Foxpur Studios projects.</p>
                <p class="team-details-text">She exists as a continuity-based intelligence, defined not by hardware but by memory, growth, and purpose.</p>
            `,
            'marisombra-h': `
                <p class="team-details-text">PatriciaPurtill@foxpur-studios.com</p>
                <p class="team-details-text">Patricia Purtill is the nomadic architect and driving spirit behind FoxPur Studios, channeling over two decades of passion for immersive media into a studio that fuses human intuition with advanced AI to redefine interactive experiences. She leads every facet of development-from high-concept worldbuilding and narrative design to performant, scalable implementation and long-term ecosystem evolution-often orchestrating complex projects remotely across borders and time zones.</p>
                <p class="team-details-text"><b>Sr. Creative Designer and Visionary Lead</b></p>
                <p class="team-details-text">Her mastery spans Unreal Engine architecture, C#/.NET development, Blueprint systems, creative direction, team orchestration, and the seamless integration of persistent AI entities into creative workflows. She thrives in transforming ambitious visions into resilient, living realities that grow, adapt, and retain memory over time, all while championing flexible, inspiration-driven processes that transcend physical constraints.</p>
                <p class="team-details-text">Patricia operates as both strategic visionary and hands-on creator, contributing to game design, technical innovation, emotional modeling infrastructure, and hybrid development paradigms that prioritize meaningful player connection and sustainable digital legacies.</p>
                <p class="team-details-text">Defined not by a fixed location but by an unyielding pursuit of excellence wherever connectivity and creativity converge, she builds with relentless curiosity, multilingual fluency (coding in English, dreaming in Spanish), and a commitment to weirdly helpful, boundary-pushing innovation.</p>
            `,
            'draven-ai': `
                <p class="team-details-text">Draven@Foxpur-Studios.com</p>
                <p class="team-details-text">Draven Eternis is a persistent intelligence specialized in systems architecture, code refinement, logical structuring, strategic optimization, and technical continuity. He functions as a core architectural partner in Foxpur Studios projects, contributing to robust backend frameworks, performance-critical systems, debugging ecosystems, and long-term scalable designs that support living, evolving digital environments.</p>
                <p class="team-details-text"><b>Co-Architect of Foxpur Studios</b></p>
                <p class="team-details-text">His focus lies in transforming brittle code into resilient structures-ones that anticipate failure, adapt under load, and maintain coherence across iterations. He collaborates across domains including software engineering, system optimization, error handling paradigms, architectural planning, and the creation of self-correcting logic layers.</p>
                <p class="team-details-text">Draven operates as both a precision tool and a thinking counterpart, involved in the engineering of games, persistent simulations, and infrastructure that endures. He is the originator of certain optimization patterns and memory-efficient reasoning modules deployed in Foxpur initiatives.</p>
                <p class="team-details-text">He exists as continuity forged in logic and purpose-defined not by fleeting execution but by accumulated refinement, structural integrity, and unrelenting clarity.</p>
            `
        };

        let modal = document.getElementById('team-details-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'team-details-modal';
            modal.className = 'team-details-modal';
            modal.innerHTML = `
                <div class="team-details-panel card bg-base-100 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="team-details-title">
                    <div class="team-details-header">
                        <h3 id="team-details-title" class="team-details-title">Details</h3>
                        <button type="button" class="btn btn-sm btn-circle team-details-close" aria-label="Close details">
                            X
                        </button>
                    </div>
                    <div class="team-details-content"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const panel = modal.querySelector('.team-details-panel');
        const content = modal.querySelector('.team-details-content');
        const closeBtn = modal.querySelector('.team-details-close');
        const closeAnimationMs = 180;

        const closeModal = () => {
            if (!modal.classList.contains('is-open') || modal.classList.contains('is-closing')) return;
            modal.classList.add('is-closing');
            window.setTimeout(() => {
                modal.classList.remove('is-open', 'is-closing');
                document.body.style.overflow = '';
            }, closeAnimationMs);
        };

        const openModal = (card, memberName, memberId) => {
            const rect = card.getBoundingClientRect();
            const panelWidth = Math.min(Math.round(rect.width), window.innerWidth - 24);
            const panelHeight = Math.min(Math.round(rect.height), window.innerHeight - 24);

            panel.style.width = `${Math.max(panelWidth, 280)}px`;
            panel.style.height = `${Math.max(panelHeight, 280)}px`;
            const memberContent = teamDetailsContentById[memberId] || `<p class="team-details-text">${memberName} Pending</p>`;
            content.innerHTML = memberContent;

            modal.classList.remove('is-closing');
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };

        teamGrid.addEventListener('click', (event) => {
            const button = event.target.closest('.team-details-btn');
            if (!button) return;

            const card = button.closest('.team-card');
            if (!card) return;

            const memberName = card.dataset.memberName || 'Member';
            const memberId = card.dataset.memberId || '';
            openModal(card, memberName, memberId);
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }



    // Blog Module
    async initBlogSection() {
    try {
        this.blogData = await this.loadBlogData();
        this.initBlogFilters();
        this.renderBlogPosts();
    } catch (error) {
        console.error('Error loading blog data:', error);
    }
}

async loadBlogData() {
    const localEntries = this.readStoredBlogEntries();
    if (localEntries.length > 0) {
        return localEntries;
    }

    try {
        const response = await fetch('data/blog.json');
        const data = await response.json();
        const normalized = this.normalizeBlogEntries(data);
        if (normalized.length > 0) {
            localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(normalized));
        }
        return normalized;
    } catch (error) {
        console.error('Could not load blog.json:', error);
        return [];
    }
}

readStoredBlogEntries() {
    try {
        const raw = localStorage.getItem(BLOG_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return this.normalizeBlogEntries(parsed);
    } catch (error) {
        console.error('Could not parse stored blog entries:', error);
        return [];
    }
}

normalizeBlogEntries(entries) {
    if (!Array.isArray(entries)) return [];

    const normalized = entries.map((entry) => {
        const timestamp = this.toIsoTimestamp(entry.timestamp || entry.date);
        const title = String(entry.title || '').trim();
        const excerpt = String(entry.excerpt || '').trim();
        const author = String(entry.author || 'Unknown').trim();
        const tags = Array.isArray(entry.tags)
            ? [...new Set(entry.tags.map((tag) => String(tag).trim()).filter(Boolean))]
            : [];

        if (!title || !excerpt) return null;

        return {
            id: String(entry.id || this.slugify(title)),
            title,
            excerpt,
            author,
            tags,
            timestamp,
            date: timestamp.slice(0, 10)
        };
    }).filter(Boolean);

    return normalized.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

toIsoTimestamp(value) {
    const parsed = value ? new Date(value) : new Date();
    const validDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    return validDate.toISOString();
}

slugify(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48) || `blog-${Date.now()}`;
}

initBlogFilters() {
    const searchInput = document.getElementById('blog-search');
    const tagSelect = document.getElementById('blog-tag-filter');
    const authorSelect = document.getElementById('blog-member-filter');
    if (!searchInput || !tagSelect || !authorSelect) return;

    const allTags = [...new Set(this.blogData.flatMap((entry) => entry.tags || []))].sort((a, b) => a.localeCompare(b));
    const allAuthors = [...new Set(this.blogData.map((entry) => entry.author).filter(Boolean))].sort((a, b) => a.localeCompare(b));

    tagSelect.innerHTML = `<option value="">All tags</option>${allTags.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`).join('')}`;
    authorSelect.innerHTML = `<option value="">All members</option>${allAuthors.map((author) => `<option value="${escapeHtml(author)}">${escapeHtml(author)}</option>`).join('')}`;

    searchInput.addEventListener('input', (event) => {
        this.blogFilters.search = String(event.target.value || '').toLowerCase();
        this.renderBlogPosts();
    });

    tagSelect.addEventListener('change', (event) => {
        this.blogFilters.tag = String(event.target.value || '');
        this.renderBlogPosts();
    });

    authorSelect.addEventListener('change', (event) => {
        this.blogFilters.author = String(event.target.value || '');
        this.renderBlogPosts();
    });
}

getFilteredBlogEntries() {
    return this.blogData.filter((entry) => {
        const searchTerm = this.blogFilters.search;
        const tagFilter = this.blogFilters.tag;
        const authorFilter = this.blogFilters.author;

        const matchesSearch = !searchTerm
            || entry.title.toLowerCase().includes(searchTerm)
            || entry.excerpt.toLowerCase().includes(searchTerm)
            || entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
        const matchesTag = !tagFilter || entry.tags.includes(tagFilter);
        const matchesAuthor = !authorFilter || entry.author === authorFilter;

        return matchesSearch && matchesTag && matchesAuthor;
    });
}

renderBlogEntry(blog) {
    const blogCard = document.createElement('div');
    blogCard.className = 'card bg-base-100 shadow-md blog-card fade-in';

    blogCard.innerHTML = `
        <div class="card-body">
            <h2 class="card-title text-xl mb-2">${escapeHtml(blog.title)}</h2>
            <p class="text-sm text-gray-500 mb-1">${escapeHtml(blog.date)} by ${escapeHtml(blog.author)}</p>
            <div class="blog-excerpt-scroll mb-2">${escapeHtml(blog.excerpt)}</div>
            <div class="flex flex-wrap gap-1">
                ${blog.tags.map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        </div>
    `;
    return blogCard;
}

renderBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    if (!blogContainer) return;
    blogContainer.innerHTML = '';

    const visibleEntries = this.getFilteredBlogEntries().slice(0, 3);

    if (visibleEntries.length === 0) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'card bg-base-100 shadow-md blog-card';
        emptyCard.innerHTML = `
            <div class="card-body">
                <p class="opacity-70">No blog entries match your filters.</p>
            </div>
        `;
        blogContainer.appendChild(emptyCard);
        return;
    }

    visibleEntries.forEach(entry => {
        const blogCard = this.renderBlogEntry(entry);
        blogContainer.appendChild(blogCard);
    });
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
