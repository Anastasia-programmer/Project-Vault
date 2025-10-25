// Project Vault - JavaScript functionality (Django Integration)

let techStack = [];
let editMode = false;
let currentProjectId = null;

// DOM elements
const newProjectBtn = document.getElementById('new-project-btn');
const formModal = document.getElementById('form-modal');
const projectForm = document.getElementById('project-form');
const cancelFormBtn = document.getElementById('cancel-form');
const projectsGrid = document.getElementById('projects-grid');
const statusFilter = document.getElementById('status-filter');
const difficultyFilter = document.getElementById('difficulty-filter');
const techFilter = document.getElementById('tech-filter');
const searchInput = document.getElementById('search');
const deleteModal = document.getElementById('delete-modal');
const deleteForm = document.getElementById('delete-form');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Stats elements
const totalProjectsEl = document.getElementById('total-projects');
const inProgressCountEl = document.getElementById('in-progress-count');
const completedCountEl = document.getElementById('completed-count');
const highPriorityCountEl = document.getElementById('high-priority-count');

// Form elements
const techInput = document.getElementById('tech');
const addTechBtn = document.getElementById('add-tech-btn');
const techStackContainer = document.getElementById('tech-stack');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const projectIdInput = document.getElementById('project-id');

// Show authentication prompt for demo users
function showAuthPrompt() {
  const authModal = document.getElementById('auth-prompt-modal');
  if (authModal) {
    authModal.classList.remove('hidden');
  }
}

// Hide authentication prompt
function hideAuthPrompt() {
  const authModal = document.getElementById('auth-prompt-modal');
  if (authModal) {
    authModal.classList.add('hidden');
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  updateTechFilter();
  updateStats();
}

function setupEventListeners() {
  // New project button
  if (newProjectBtn) {
    newProjectBtn.addEventListener('click', () => {
      // Check if user is authenticated
      const isAuthenticated = document.body.getAttribute('data-user-authenticated') === 'true';
      
      if (!isAuthenticated) {
        // Demo user - check if they already have a project
        const existingProjects = document.querySelectorAll('.project-card');
        if (existingProjects.length >= 1) {
          // Demo user already has a project - show auth prompt
          showAuthPrompt();
          return;
        }
      }
      
      // Show form for authenticated users or demo users with no projects
      editMode = false;
      currentProjectId = null;
      formTitle.textContent = 'Create New Project';
      submitBtn.textContent = 'Create Project';
      projectIdInput.value = '';
      formModal.classList.remove('hidden');
    });
  }

  // Empty state new project button
  const emptyStateBtn = document.getElementById('new-project-btn-empty');
  if (emptyStateBtn) {
    emptyStateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Check if user is authenticated
      const isAuthenticated = document.body.getAttribute('data-user-authenticated') === 'true';
      
      if (!isAuthenticated) {
        // Demo user - check if they already have a project
        const existingProjects = document.querySelectorAll('.project-card');
        if (existingProjects.length >= 1) {
          // Demo user already has a project - show auth prompt
          showAuthPrompt();
          return;
        }
      }
      
      // Show form for authenticated users or demo users with no projects
      editMode = false;
      currentProjectId = null;
      formTitle.textContent = 'Create New Project';
      submitBtn.textContent = 'Create Project';
      projectIdInput.value = '';
      formModal.classList.remove('hidden');
    });
  }

  // Cancel form
  if (cancelFormBtn) {
    cancelFormBtn.addEventListener('click', hideForm);
  }

  // Form submission
  if (projectForm) {
    projectForm.addEventListener('submit', handleFormSubmit);
  }

  // Add tech button
  if (addTechBtn) {
    addTechBtn.addEventListener('click', addTech);
  }
  
  if (techInput) {
    techInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTech();
      }
    });
  }

  // Filters
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (difficultyFilter) difficultyFilter.addEventListener('change', applyFilters);
  if (techFilter) techFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  // Close modal on overlay click
  if (formModal) {
    formModal.addEventListener('click', (e) => {
      if (e.target === formModal || e.target.classList.contains('modal-overlay')) {
        hideForm();
      }
    });
  }

  // Auth prompt modal events
  const authModal = document.getElementById('auth-prompt-modal');
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal || e.target.classList.contains('modal-overlay')) {
        hideAuthPrompt();
      }
    });
  }

  const cancelAuthBtn = document.getElementById('cancel-auth');
  if (cancelAuthBtn) {
    cancelAuthBtn.addEventListener('click', hideAuthPrompt);
  }

  // Delete modal events
  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal || e.target.classList.contains('modal-overlay')) {
        hideDeleteModal();
      }
    });
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
      });
    }
  });
}

function addTech() {
  const tech = techInput.value.trim();
  if (tech && !techStack.includes(tech)) {
    techStack.push(tech);
    renderTechStack();
    techInput.value = '';
  }
}

function removeTech(tech) {
  techStack = techStack.filter(t => t !== tech);
  renderTechStack();
}

function renderTechStack() {
  techStackContainer.innerHTML = '';
  techStack.forEach(tech => {
    const badge = document.createElement('span');
    badge.className = 'badge badge-tech';
    badge.innerHTML = `${tech} <button type="button" onclick="removeTech('${tech}')" class="text-xs" style="cursor: pointer; margin-left: 0.5rem; padding: 0.125rem; border-radius: 0.25rem; background: rgba(0, 0, 0, 0.1); border: none; color: #475569;">×</button>`;
    techStackContainer.appendChild(badge);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  // Remove any existing hidden tech_stack inputs
  const existingInputs = projectForm.querySelectorAll('input[name="tech_stack"]');
  existingInputs.forEach(input => input.remove());
  
  // Add tech stack as hidden inputs for Django
  techStack.forEach(tech => {
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'tech_stack';
    hiddenInput.value = tech;
    projectForm.appendChild(hiddenInput);
  });
  
  if (editMode && currentProjectId) {
    // Update existing project via AJAX
    updateProject(currentProjectId);
  } else {
    // Create new project - submit form normally
    projectForm.submit();
  }
}

function hideForm() {
  formModal.classList.add('hidden');
  projectForm.reset();
  techStack = [];
  renderTechStack();
  editMode = false;
  currentProjectId = null;
}

function editProject(projectId) {
  // Hide dropdown
  toggleDropdown(projectId);
  
  // Find the project card
  const card = document.querySelector(`[data-project-id="${projectId}"]`);
  if (!card) return;
  
  // Set edit mode
  editMode = true;
  currentProjectId = projectId;
  
  // Update form title and button
  formTitle.textContent = 'Edit Project';
  submitBtn.textContent = 'Update Project';
  projectIdInput.value = projectId;
  
  // Populate form fields
  document.getElementById('title').value = card.dataset.projectTitle;
  document.getElementById('description').value = card.dataset.projectDescription;
  document.getElementById('difficulty').value = card.dataset.difficulty;
  document.getElementById('status').value = card.dataset.status;
  document.getElementById('priority').value = card.dataset.priority;
  document.getElementById('github').value = card.dataset.projectGithub;
  document.getElementById('deployment').value = card.dataset.projectDeployment;
  
  // Populate tech stack
  techStack = card.dataset.tech ? card.dataset.tech.split(',').filter(t => t.trim()) : [];
  renderTechStack();
  
  // Show modal
  formModal.classList.remove('hidden');
}

function confirmDelete(projectId, projectTitle) {
  // Hide dropdown
  toggleDropdown(projectId);
  
  // Delete project directly via AJAX
  deleteProject(projectId);
}

function hideDeleteModal() {
  deleteModal.classList.add('hidden');
}

function toggleDropdown(projectId) {
  const dropdown = document.getElementById(`dropdown-${projectId}`);
  if (!dropdown) return;
  
  // Close all other dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu.id !== `dropdown-${projectId}`) {
      menu.classList.add('hidden');
    }
  });
  
  // Toggle current dropdown
  dropdown.classList.toggle('hidden');
}

function applyFilters() {
  const statusValue = statusFilter ? statusFilter.value : 'all';
  const difficultyValue = difficultyFilter ? difficultyFilter.value : 'all';
  const techValue = techFilter ? techFilter.value : 'all';
  const searchValue = searchInput ? searchInput.value.toLowerCase() : '';

  // Get all project cards
  const projectCards = document.querySelectorAll('.project-card');
  let visibleCount = 0;

  projectCards.forEach(card => {
    const cardStatus = card.dataset.status;
    const cardDifficulty = card.dataset.difficulty;
    const cardTechs = card.dataset.tech ? card.dataset.tech.split(',') : [];
    const cardTitle = card.dataset.title || '';
    const cardDescription = card.dataset.description || '';

    const matchesStatus = statusValue === 'all' || cardStatus === statusValue;
    const matchesDifficulty = difficultyValue === 'all' || cardDifficulty === difficultyValue;
    const matchesTech = techValue === 'all' || cardTechs.includes(techValue);
    const matchesSearch = searchValue === '' || 
      cardTitle.includes(searchValue) ||
      cardDescription.includes(searchValue);

    if (matchesStatus && matchesDifficulty && matchesTech && matchesSearch) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show/hide empty state
  const emptyState = projectsGrid.querySelector('.col-span-full');
  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

function updateTechFilter() {
  if (!techFilter) return;
  
  // Get all unique technologies from project cards
  const projectCards = document.querySelectorAll('.project-card');
  const allTechs = new Set();
  
  projectCards.forEach(card => {
    const techs = card.dataset.tech ? card.dataset.tech.split(',') : [];
    techs.forEach(tech => {
      if (tech.trim()) allTechs.add(tech.trim());
    });
  });
  
  // Populate tech filter
  techFilter.innerHTML = '<option value="all">All Technologies</option>';
  [...allTechs].sort().forEach(tech => {
    const option = document.createElement('option');
    option.value = tech;
    option.textContent = tech;
    techFilter.appendChild(option);
  });
}

function updateStats() {
  if (!totalProjectsEl) return;
  
  const projectCards = document.querySelectorAll('.project-card');
  const total = projectCards.length;
  
  let inProgress = 0;
  let completed = 0;
  let highPriority = 0;
  
  projectCards.forEach(card => {
    if (card.dataset.status === 'in-progress') inProgress++;
    if (card.dataset.status === 'completed') completed++;
    if (card.dataset.priority === 'high') highPriority++;
  });

  totalProjectsEl.textContent = total;
  if (inProgressCountEl) inProgressCountEl.textContent = inProgress;
  if (completedCountEl) completedCountEl.textContent = completed;
  if (highPriorityCountEl) highPriorityCountEl.textContent = highPriority;
}

// AJAX functions for update and delete
function updateProject(projectId) {
  const formData = new FormData(projectForm);
  
  fetch(`/update-project/${projectId}/`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Hide the form modal
      hideForm();
      // Reload the page to show updated data
      window.location.reload();
    } else {
      alert('Error updating project: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error updating project. Please try again.');
  });
}

function deleteProject(projectId) {
  const formData = new FormData();
  
  fetch(`/delete-project/${projectId}/`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Remove the project card from the DOM
      const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
      if (projectCard) {
        projectCard.remove();
      }
      // Update stats
      updateStats();
      updateTechFilter();
    } else {
      alert('Error deleting project: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error deleting project. Please try again.');
  });
}

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}