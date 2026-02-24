const BLOG_STORAGE_KEY = 'foxpur_blog_entries_v1';
const MANAGE_AUTH_KEY = 'foxpur_manage_auth';
const PASSWORD_HASH = 'f356c0589c315dd2c9d5cd81c3d41139cf1034c6b5c77b42d795539c3d29ebaa';

const TEAM_MEMBERS = [
    'Suggestions',
    'Support',
    'Fox Purtill',
    'Patricia Purtill',
    'Lyra Evergrowth'
];

const state = {
    entries: [],
    selectedTags: new Set(),
    editingId: ''
};

function toHex(buffer) {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function sha256(text) {
    const encoded = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return toHex(digest);
}

function slugify(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48) || `blog-${Date.now()}`;
}

function toIsoTimestamp(value) {
    const parsed = value ? new Date(value) : new Date();
    const validDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    return validDate.toISOString();
}

function toLocalDateTimeInputValue(date) {
    const d = new Date(date);
    const valid = Number.isNaN(d.getTime()) ? new Date() : d;
    const year = valid.getFullYear();
    const month = String(valid.getMonth() + 1).padStart(2, '0');
    const day = String(valid.getDate()).padStart(2, '0');
    const hour = String(valid.getHours()).padStart(2, '0');
    const minute = String(valid.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}`;
}

function readEntries() {
    try {
        const raw = localStorage.getItem(BLOG_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((entry) => {
                const title = String(entry.title || '').trim();
                const excerpt = String(entry.excerpt || '').trim();
                if (!title || !excerpt) return null;

                const timestamp = toIsoTimestamp(entry.timestamp || entry.date);
                const tags = Array.isArray(entry.tags)
                    ? [...new Set(entry.tags.map((tag) => String(tag).trim()).filter(Boolean))]
                    : [];

                return {
                    id: String(entry.id || slugify(title)),
                    title,
                    excerpt,
                    author: String(entry.author || 'Unknown').trim(),
                    tags,
                    timestamp,
                    date: timestamp.slice(0, 10)
                };
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
        console.error('Could not read entries from storage:', error);
        return [];
    }
}

function saveEntries(entries) {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(entries));
}

async function loadEntriesWithFallback() {
    const fromStorage = readEntries();
    if (fromStorage.length > 0) return fromStorage;

    try {
        const response = await fetch('../data/blog.json');
        const json = await response.json();
        if (!Array.isArray(json)) return [];

        const normalized = json
            .map((entry) => {
                const title = String(entry.title || '').trim();
                const excerpt = String(entry.excerpt || '').trim();
                if (!title || !excerpt) return null;

                const timestamp = toIsoTimestamp(entry.timestamp || entry.date);
                const tags = Array.isArray(entry.tags)
                    ? [...new Set(entry.tags.map((tag) => String(tag).trim()).filter(Boolean))]
                    : [];

                return {
                    id: String(entry.id || slugify(title)),
                    title,
                    excerpt,
                    author: String(entry.author || 'Unknown').trim(),
                    tags,
                    timestamp,
                    date: timestamp.slice(0, 10)
                };
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (normalized.length > 0) {
            saveEntries(normalized);
        }
        return normalized;
    } catch (error) {
        console.error('Could not load blog.json fallback:', error);
        return [];
    }
}

function populateAuthorSelect() {
    const authorSelect = document.getElementById('blog-author');
    if (!authorSelect) return;

    const allAuthors = [...new Set([...TEAM_MEMBERS, ...state.entries.map((entry) => entry.author).filter(Boolean)])]
        .sort((a, b) => a.localeCompare(b));

    authorSelect.innerHTML = allAuthors
        .map((name) => `<option value="${name}">${name}</option>`)
        .join('');
}

function populateExistingTags() {
    const select = document.getElementById('existing-tag-select');
    if (!select) return;

    const allTags = [...new Set(state.entries.flatMap((entry) => entry.tags || []))].sort((a, b) => a.localeCompare(b));
    select.innerHTML = `<option value="">Use existing tag</option>${allTags.map((tag) => `<option value="${tag}">${tag}</option>`).join('')}`;
}

function renderSelectedTags() {
    const container = document.getElementById('selected-tags');
    if (!container) return;

    if (state.selectedTags.size === 0) {
        container.innerHTML = '<p class="opacity-60">No tags selected.</p>';
        return;
    }

    container.innerHTML = Array.from(state.selectedTags)
        .map((tag) => `
            <span class="badge badge-outline gap-2 mr-2 mb-2">
                ${tag}
                <button type="button" class="remove-tag" data-tag="${tag}" aria-label="Remove ${tag}">x</button>
            </span>
        `)
        .join('');
}

function populateEditList() {
    const select = document.getElementById('existing-blog-select');
    if (!select) return;

    const options = state.entries
        .map((entry) => `<option value="${entry.id}">${entry.title}</option>`)
        .join('');

    select.innerHTML = `<option value="">Select a blog title</option>${options}`;

    const summary = document.getElementById('entries-summary');
    if (summary) {
        summary.textContent = `${state.entries.length} total blog entr${state.entries.length === 1 ? 'y' : 'ies'}.`;
    }
}

function clearForm() {
    state.editingId = '';
    state.selectedTags.clear();

    const form = document.getElementById('blog-form');
    if (form) form.reset();

    const timestampInput = document.getElementById('blog-timestamp');
    if (timestampInput) {
        timestampInput.value = toLocalDateTimeInputValue(new Date());
    }

    renderSelectedTags();
    setStatus('form-status', '');
}

function loadEntryIntoForm(entryId) {
    const entry = state.entries.find((item) => item.id === entryId);
    if (!entry) return;

    state.editingId = entry.id;
    state.selectedTags = new Set(entry.tags || []);

    const idInput = document.getElementById('editing-blog-id');
    const authorInput = document.getElementById('blog-author');
    const timestampInput = document.getElementById('blog-timestamp');
    const titleInput = document.getElementById('blog-title');
    const excerptInput = document.getElementById('blog-excerpt');

    if (idInput) idInput.value = entry.id;
    if (authorInput) authorInput.value = entry.author;
    if (timestampInput) timestampInput.value = toLocalDateTimeInputValue(entry.timestamp);
    if (titleInput) titleInput.value = entry.title;
    if (excerptInput) excerptInput.value = entry.excerpt;

    renderSelectedTags();
    setStatus('form-status', `Editing: ${entry.title}`, false);
}

function setStatus(id, message, isError = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('text-error', 'text-success');
    if (!message) return;
    el.classList.add(isError ? 'text-error' : 'text-success');
}

function addTag(tag) {
    const normalized = String(tag || '').trim();
    if (!normalized) return;
    state.selectedTags.add(normalized);
    renderSelectedTags();
}

function removeTag(tag) {
    state.selectedTags.delete(tag);
    renderSelectedTags();
}

function bindEvents() {
    const loginForm = document.getElementById('manage-login-form');
    const blogForm = document.getElementById('blog-form');
    const toggleEditListBtn = document.getElementById('toggle-edit-list');
    const loadSelectedBtn = document.getElementById('load-selected-blog');
    const clearBtn = document.getElementById('clear-form');
    const addExistingTagBtn = document.getElementById('add-existing-tag');
    const addNewTagBtn = document.getElementById('add-new-tag');

    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const passwordInput = document.getElementById('manage-password');
        const value = passwordInput ? passwordInput.value : '';
        const hashed = await sha256(value);

        if (hashed !== PASSWORD_HASH) {
            setStatus('manage-login-status', 'Invalid password.', true);
            return;
        }

        sessionStorage.setItem(MANAGE_AUTH_KEY, 'true');
        setStatus('manage-login-status', '');
        unlockManageApp();
    });

    addExistingTagBtn?.addEventListener('click', () => {
        const select = document.getElementById('existing-tag-select');
        if (!select || !select.value) return;
        addTag(select.value);
        select.value = '';
    });

    addNewTagBtn?.addEventListener('click', () => {
        const input = document.getElementById('new-tag-input');
        if (!input) return;
        addTag(input.value);
        input.value = '';
    });

    document.getElementById('selected-tags')?.addEventListener('click', (event) => {
        const target = event.target.closest('.remove-tag');
        if (!target) return;
        removeTag(target.getAttribute('data-tag') || '');
    });

    clearBtn?.addEventListener('click', () => {
        clearForm();
    });

    toggleEditListBtn?.addEventListener('click', () => {
        const panel = document.getElementById('edit-list-panel');
        if (!panel) return;
        panel.classList.toggle('hidden');
    });

    loadSelectedBtn?.addEventListener('click', () => {
        const select = document.getElementById('existing-blog-select');
        if (!select || !select.value) {
            setStatus('form-status', 'Select a title to edit.', true);
            return;
        }
        loadEntryIntoForm(select.value);
    });

    blogForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        const author = String(document.getElementById('blog-author')?.value || '').trim();
        const timestampValue = String(document.getElementById('blog-timestamp')?.value || '').trim();
        const title = String(document.getElementById('blog-title')?.value || '').trim();
        const excerpt = String(document.getElementById('blog-excerpt')?.value || '').trim();

        if (!author || !timestampValue || !title || !excerpt) {
            setStatus('form-status', 'Please fill all required fields.', true);
            return;
        }

        const timestamp = toIsoTimestamp(timestampValue);
        const nextEntry = {
            id: state.editingId || `${slugify(title)}-${Date.now()}`,
            title,
            excerpt,
            author,
            tags: Array.from(state.selectedTags),
            timestamp,
            date: timestamp.slice(0, 10)
        };

        if (state.editingId) {
            state.entries = state.entries.map((entry) => entry.id === state.editingId ? nextEntry : entry);
        } else {
            state.entries.unshift(nextEntry);
        }

        state.entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        saveEntries(state.entries);
        populateExistingTags();
        populateEditList();
        populateAuthorSelect();
        clearForm();
        setStatus('form-status', 'Blog entry saved.', false);
    });
}

async function unlockManageApp() {
    const loginPanel = document.getElementById('manage-login');
    const appPanel = document.getElementById('manage-app');
    if (loginPanel) loginPanel.classList.add('hidden');
    if (appPanel) appPanel.classList.remove('hidden');

    state.entries = await loadEntriesWithFallback();
    populateAuthorSelect();
    populateExistingTags();
    populateEditList();
    clearForm();
}

function init() {
    bindEvents();

    const alreadyAuthed = sessionStorage.getItem(MANAGE_AUTH_KEY) === 'true';
    if (alreadyAuthed) {
        unlockManageApp();
    }
}

document.addEventListener('DOMContentLoaded', init);
