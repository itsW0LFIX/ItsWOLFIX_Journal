// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ_WWNirelpqQTDNSvxCVtb2HVf8FBKhs",
  authDomain: "itswolfix-journal-edab0.firebaseapp.com",
  databaseURL: "https://itswolfix-journal-edab0-default-rtdb.firebaseio.com",
  projectId: "itswolfix-journal-edab0",
  storageBucket: "itswolfix-journal-edab0.firebasestorage.app",
  messagingSenderId: "489900047560",
  appId: "1:489900047560:web:bbab08a8ce13867981f9fd"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Global variables
const auth = firebase.auth();
const db = firebase.database();
let currentUser = null;
let isSidebarCollapsed = false;
let commentsList = [];
let selectedComments = [];

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.querySelector('.sidebar');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const lightThemeBtn = document.getElementById('light-theme');
const darkThemeBtn = document.getElementById('dark-theme');
const userNameDisplay = document.getElementById('user-name');
const clearAnalyticsBtn = document.getElementById('clear-analytics-btn');
const enableAnalyticsBtn = document.getElementById('enable-analytics-btn');
const selectAllCheckbox = document.getElementById('select-all-comments');
const bulkApproveBtn = document.getElementById('bulk-approve');
const bulkDeleteBtn = document.getElementById('bulk-delete');
const commentSearch = document.getElementById('comment-search');
const commentFilter = document.getElementById('comment-filter');
const commentsListEl = document.getElementById('comments-list');
const pendingCommentsCounter = document.getElementById('pending-comments-badge');
const accountSettingsForm = document.getElementById('account-settings-form');
const securityForm = document.getElementById('security-form');
const confirmModal = document.getElementById('confirm-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalConfirmBtn = document.getElementById('modal-confirm');
const modalCancelBtn = document.getElementById('modal-cancel');
const closeModalBtn = document.querySelector('.close-modal');
const notificationToast = document.getElementById('notification-toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');
const closeToastBtn = document.querySelector('.close-toast');

// Check database connection
db.ref('.info/connected').on('value', function (snap) {
  if (snap.val() === true) {
    console.log('Connected to Firebase database');
  } else {
    console.error('Disconnected from Firebase database');
    showNotification('Database connection lost. Please check your internet connection.', 'error');
  }
});

// Auth state observer
auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    currentUser = user;
    console.log("User signed in:", user.email);

    // Set user display name
    userNameDisplay.textContent = user.displayName || user.email.split('@')[0];

    // Show dashboard section, hide login section
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');

    // Init dashboard components
    loadDashboardData();
    loadCommentsData();
    loadAnalyticsData();

    // Wait for dashboard to be fully loaded
    setTimeout(initializeExtraFeatures, 2000);
  } else {
    // User is signed out
    currentUser = null;

    // Show login section, hide dashboard section
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
});

// Login form submission
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Disable form
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    loginError.textContent = '';

    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        // Login successful
        console.log("Login successful:", userCredential.user.email);
      })
      .catch(function (error) {
        // Login failed
        console.error("Login failed:", error.message);
        loginError.textContent = error.message;

        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In';
      });
  });
}

// Logout button
if (logoutButton) {
  logoutButton.addEventListener('click', function (e) {
    e.preventDefault();

    showConfirmModal(
      'Logout Confirmation',
      'Are you sure you want to log out?',
      function () {
        auth.signOut()
          .then(function () {
            console.log('User signed out');
          })
          .catch(function (error) {
            console.error('Sign out error:', error);
            showNotification('Failed to sign out: ' + error.message, 'error');
          });
      }
    );
  });
}

// Toggle sidebar
if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener('click', function () {
    isSidebarCollapsed = !isSidebarCollapsed;

    if (isSidebarCollapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
  });
}

// Navigation items click
navItems.forEach(function (item) {
  item.addEventListener('click', function () {
    const targetId = this.getAttribute('data-target');

    // Update active nav item
    navItems.forEach(function (navItem) {
      navItem.classList.remove('active');
    });
    this.classList.add('active');

    // Show target content section, hide others
    contentSections.forEach(function (section) {
      if (section.id === targetId + '-content') {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });

    // On mobile, collapse sidebar after navigation
    if (window.innerWidth < 768) {
      sidebar.classList.remove('mobile-visible');
    }
  });
});

// View all links
document.querySelectorAll('.view-all').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetSection = this.getAttribute('data-target');

    // Find and click the corresponding nav item
    document.querySelector(`.nav-item[data-target="${targetSection}"]`).click();
  });
});

// Theme toggle
if (lightThemeBtn && darkThemeBtn) {
  // Check if theme preference is saved
  const savedTheme = localStorage.getItem('wolfix-admin-theme');
  if (savedTheme === 'dark') {
    setDarkTheme();
  } else {
    setLightTheme();
  }

  lightThemeBtn.addEventListener('click', setLightTheme);
  darkThemeBtn.addEventListener('click', setDarkTheme);
}

function setLightTheme() {
  document.body.classList.remove('dark-theme');
  lightThemeBtn.classList.add('active');
  darkThemeBtn.classList.remove('active');
  localStorage.setItem('wolfix-admin-theme', 'light');
}

function setDarkTheme() {
  document.body.classList.add('dark-theme');
  darkThemeBtn.classList.add('active');
  lightThemeBtn.classList.remove('active');
  localStorage.setItem('wolfix-admin-theme', 'dark');
}

// Load dashboard data
function loadDashboardData() {
  console.log('Loading dashboard data...');

  // Get recent comments
  db.ref('comments').limitToLast(5).once('value')
    .then(snapshot => {
      const comments = snapshot.val() || {};
      const recentCommentsList = document.getElementById('recent-comments-list');

      // If there are no comments
      if (!snapshot.exists()) {
        recentCommentsList.innerHTML = '<p class="empty-message">No recent comments</p>';
        updateDashboardCommentCount(0);
        return;
      }

      // Process comments data
      let allComments = [];

      Object.entries(comments).forEach(([pageKey, pageComments]) => {
        Object.entries(pageComments).forEach(([commentId, comment]) => {
          allComments.push({
            id: commentId,
            pageKey: pageKey,
            pageName: pageKey.replace(/_/g, '/').replace(/\/html$/, '.html'),
            ...comment
          });
        });
      });

      // Sort by timestamp (newest first)
      allComments.sort((a, b) => b.timestamp - a.timestamp);

      // Limit to 5 most recent
      allComments = allComments.slice(0, 5);

      // Update dashboard comment count
      updateDashboardCommentCount(allComments.length);

      // Generate HTML
      if (allComments.length > 0) {
        let html = '';

        allComments.forEach(comment => {
          const date = new Date(comment.timestamp);
          const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

          html += `
            <div class="recent-comment-item">
              <div class="comment-meta">
                <div class="comment-author">${comment.name || 'Anonymous'}</div>
                <div class="comment-date">${formattedDate}</div>
              </div>
              <div class="comment-text">${comment.content || 'No content'}</div>
            </div>
          `;
        });

        recentCommentsList.innerHTML = html;
      } else {
        recentCommentsList.innerHTML = '<p class="empty-message">No recent comments</p>';
      }
    })
    .catch(error => {
      console.error('Error loading recent comments:', error);
      document.getElementById('recent-comments-list').innerHTML =
        '<p class="empty-message">Error loading comments</p>';
    });

  // Get popular pages
  db.ref('analytics/pageViews').once('value')
    .then(snapshot => {
      const pageViews = snapshot.val() || {};
      const popularPagesList = document.getElementById('popular-pages-list');

      // If there are no page views
      if (!snapshot.exists()) {
        popularPagesList.innerHTML = '<p class="empty-message">No page data available</p>';
        updateDashboardStats({
          pageViews: 0,
          visitors: 0,
          avgTime: '0m 0s'
        });
        return;
      }

      // Process page views data
      let pages = [];

      Object.entries(pageViews).forEach(([pageKey, views]) => {
        if (typeof views === 'number') {
          pages.push({
            key: pageKey,
            title: pageKey.replace(/_/g, '/').replace(/\/html$/, '.html'),
            views: views
          });
        }
      });

      // Sort by views (highest first)
      pages.sort((a, b) => b.views - a.views);

      // Limit to 5 most popular
      pages = pages.slice(0, 5);

      // Generate HTML
      if (pages.length > 0) {
        let html = '';

        pages.forEach(page => {
          html += `
            <div class="popular-page-item">
              <div class="page-title">${page.title}</div>
              <div class="page-views">${page.views} views</div>
            </div>
          `;
        });

        popularPagesList.innerHTML = html;

        // Update dashboard stats
        db.ref('analytics/visitors').once('value')
          .then(snapshot => {
            const visitors = snapshot.val() || {};
            const visitorCount = Object.keys(visitors).length;

            db.ref('analytics/timeSpent').once('value')
              .then(snapshot => {
                const timeData = snapshot.val() || {};
                let totalSeconds = 0;
                let totalVisits = 0;

                Object.values(timeData).forEach(function (data) {
                  if (data && typeof data === 'object') {
                    if ('totalSeconds' in data && 'visits' in data) {
                      totalSeconds += Number(data.totalSeconds) || 0;
                      totalVisits += Number(data.visits) || 0;
                    }
                  }
                });

                // Calculate average time
                let avgTimeText = '0m 0s';
                if (totalVisits > 0) {
                  const avgSeconds = Math.round(totalSeconds / totalVisits);
                  const minutes = Math.floor(avgSeconds / 60);
                  const seconds = avgSeconds % 60;
                  avgTimeText = `${minutes}m ${seconds}s`;
                }

                // Update dashboard stats
                updateDashboardStats({
                  pageViews: pages.reduce((total, page) => total + page.views, 0),
                  visitors: visitorCount,
                  avgTime: avgTimeText
                });
              });
          });
      } else {
        popularPagesList.innerHTML = '<p class="empty-message">No page data available</p>';
      }
    })
    .catch(error => {
      console.error('Error loading popular pages:', error);
      document.getElementById('popular-pages-list').innerHTML =
        '<p class="empty-message">Error loading page data</p>';
    });
}

// Update dashboard comment count
function updateDashboardCommentCount(count) {
  const totalComments = document.getElementById('total-comments');
  if (totalComments) {
    totalComments.textContent = count;
  }
}

// Update dashboard stats
function updateDashboardStats(stats) {
  const dashTotalPageviews = document.getElementById('dash-total-pageviews');
  const dashUniqueVisitors = document.getElementById('dash-unique-visitors');
  const dashAvgTime = document.getElementById('dash-avg-time');

  if (dashTotalPageviews) dashTotalPageviews.textContent = stats.pageViews;
  if (dashUniqueVisitors) dashUniqueVisitors.textContent = stats.visitors;
  if (dashAvgTime) dashAvgTime.textContent = stats.avgTime;
}

// Load comments data
function loadCommentsData() {
  console.log('Loading comments data...');

  if (!commentsListEl) return;

  commentsListEl.innerHTML = '<p class="loading-message">Loading comments...</p>';

  db.ref('comments').on('value', snapshot => {
    const comments = snapshot.val() || {};

    // If there are no comments
    if (!snapshot.exists()) {
      commentsListEl.innerHTML = '<p class="empty-message">No comments found</p>';
      updatePendingCommentsCount(0);
      resetCommentBulkActions();
      return;
    }

    // Process comments data
    commentsList = [];

    Object.entries(comments).forEach(([pageKey, pageComments]) => {
      Object.entries(pageComments).forEach(([commentId, comment]) => {
        commentsList.push({
          id: commentId,
          pageKey: pageKey,
          pageName: pageKey.replace(/_/g, '/').replace(/\/html$/, '.html'),
          ...comment
        });
      });
    });

    // Sort by timestamp (newest first)
    commentsList.sort((a, b) => b.timestamp - a.timestamp);

    // Update pending comments count
    const pendingCount = commentsList.filter(comment => !comment.approved).length;
    updatePendingCommentsCount(pendingCount);

    // Apply current filter and search
    filterComments();
  }, error => {
    console.error('Error loading comments:', error);
    commentsListEl.innerHTML = '<p class="empty-message">Error loading comments</p>';
    showNotification('Failed to load comments: ' + error.message, 'error');
  });
}

// Generate comment item HTML
function generateCommentItemHTML(comment) {
  const date = new Date(comment.timestamp);
  const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

  return `
    <div class="comment-item" data-id="${comment.id}" data-page="${comment.pageKey}">
      <div class="checkbox-col">
        <input type="checkbox" class="comment-checkbox">
      </div>
      <div class="author-col">
        <div class="author-info">
          <div class="author-name">${comment.name || 'Anonymous'}</div>
          <div class="author-email">${comment.email || 'No email'}</div>
        </div>
      </div>
      <div class="content-col">
        <div class="comment-content">${comment.content || 'No content'}</div>
      </div>
      <div class="page-col">
        <div class="page-name">${comment.pageName}</div>
      </div>
      <div class="date-col">
        <div class="comment-date">${formattedDate}</div>
      </div>
      <div class="status-col">
        <div class="comment-status ${comment.approved ? 'status-approved' : 'status-pending'}">
          ${comment.approved ? 'Approved' : 'Pending'}
        </div>
      </div>
      <div class="actions-col">
        <div class="comment-actions">
          <!-- Toggle approval button - changes based on current status -->
          <button class="action-btn ${comment.approved ? 'unapprove-btn' : 'approve-btn'}" 
            title="${comment.approved ? 'Unapprove' : 'Approve'}">
            <i class="fas ${comment.approved ? 'fa-times' : 'fa-check'}"></i>
          </button>
          
          <!-- Edit button - always visible -->
          <button class="action-btn edit-btn" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          
          <!-- Delete button - always visible -->
          <button class="action-btn delete-btn" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}


// Filter comments
function filterComments() {
  if (!commentsList.length || !commentsListEl) return;

  const searchText = commentSearch ? commentSearch.value.toLowerCase() : '';
  const filterValue = commentFilter ? commentFilter.value : 'all';

  // Apply filters
  const filteredComments = commentsList.filter(comment => {
    // Filter by approval status
    if (filterValue === 'pending' && comment.approved) return false;
    if (filterValue === 'approved' && !comment.approved) return false;

    // Filter by search text
    if (searchText) {
      const name = (comment.name || '').toLowerCase();
      const email = (comment.email || '').toLowerCase();
      const content = (comment.content || '').toLowerCase();
      const page = (comment.pageName || '').toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        content.includes(searchText) ||
        page.includes(searchText)
      );
    }

    return true;
  });

  // Generate HTML
  if (filteredComments.length > 0) {
    let html = '';

    filteredComments.forEach(comment => {
      html += generateCommentItemHTML(comment);
    });

    commentsListEl.innerHTML = html;

    // Add event listeners to checkboxes
    const checkboxes = commentsListEl.querySelectorAll('.comment-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateSelectedComments);
    });

    // Add event listeners to action buttons
    commentsListEl.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', handleApproveComment);
    });

    commentsListEl.querySelectorAll('.unapprove-btn').forEach(btn => {
      btn.addEventListener('click', handleUnapproveComment);
    });

    commentsListEl.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', handleEditComment);
    });

    commentsListEl.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', handleDeleteComment);
    });
  } else {
    commentsListEl.innerHTML = '<p class="empty-message">No comments match your filter</p>';
    resetCommentBulkActions();
  }
}

// Update pending comments counter
function updatePendingCommentsCount(count) {
  if (pendingCommentsCounter) {
    pendingCommentsCounter.textContent = count;
    pendingCommentsCounter.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// Handle select all comments checkbox
if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', function () {
    const checkboxes = commentsListEl.querySelectorAll('.comment-checkbox');

    checkboxes.forEach(checkbox => {
      checkbox.checked = selectAllCheckbox.checked;
    });

    updateSelectedComments();
  });
}

// Update selected comments
function updateSelectedComments() {
  const checkboxes = commentsListEl.querySelectorAll('.comment-checkbox:checked');
  selectedComments = [];

  checkboxes.forEach(checkbox => {
    const commentItem = checkbox.closest('.comment-item');
    if (commentItem) {
      selectedComments.push({
        id: commentItem.getAttribute('data-id'),
        pageKey: commentItem.getAttribute('data-page')
      });
    }
  });

  updateBulkActionButtons();
}

// Update bulk action buttons state
function updateBulkActionButtons() {
  if (bulkApproveBtn && bulkDeleteBtn) {
    const hasSelection = selectedComments.length > 0;

    bulkApproveBtn.disabled = !hasSelection;
    bulkDeleteBtn.disabled = !hasSelection;
  }
}

// Reset comment bulk actions
function resetCommentBulkActions() {
  if (selectAllCheckbox) selectAllCheckbox.checked = false;
  selectedComments = [];
  updateBulkActionButtons();
}

// Handle approve comment button
function handleApproveComment(e) {
  const commentItem = e.currentTarget.closest('.comment-item');
  if (!commentItem) return;

  const commentId = commentItem.getAttribute('data-id');
  const pageKey = commentItem.getAttribute('data-page');

  // Update database
  db.ref(`comments/${pageKey}/${commentId}/approved`).set(true)
    .then(() => {
      showNotification('Comment approved successfully', 'success');
    })
    .catch(error => {
      console.error('Error approving comment:', error);
      showNotification('Failed to approve comment: ' + error.message, 'error');
    });
}

// Handle unapprove comment button
function handleUnapproveComment(e) {
  const commentItem = e.currentTarget.closest('.comment-item');
  if (!commentItem) return;

  const commentId = commentItem.getAttribute('data-id');
  const pageKey = commentItem.getAttribute('data-page');

  // Update database - set approved to false
  db.ref(`comments/${pageKey}/${commentId}/approved`).set(false)
    .then(() => {
      showNotification('Comment unapproved successfully', 'success');
    })
    .catch(error => {
      console.error('Error unapproving comment:', error);
      showNotification('Failed to unapprove comment: ' + error.message, 'error');
    });
}

// Handle edit comment button
function handleEditComment(e) {
  const commentItem = e.currentTarget.closest('.comment-item');
  if (!commentItem) return;

  const commentId = commentItem.getAttribute('data-id');
  const pageKey = commentItem.getAttribute('data-page');

  // Find the comment data
  const comment = commentsList.find(c => c.id === commentId && c.pageKey === pageKey);
  if (!comment) {
    showNotification('Comment not found', 'error');
    return;
  }

  // Create edit modal HTML
  const modalHTML = `
    <div id="edit-comment-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Comment</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="edit-comment-form">
            <div class="form-group">
              <label for="edit-name">Name</label>
              <input type="text" id="edit-name" value="${comment.name || ''}">
            </div>
            <div class="form-group">
              <label for="edit-email">Email</label>
              <input type="email" id="edit-email" value="${comment.email || ''}">
            </div>
            <div class="form-group">
              <label for="edit-content">Comment</label>
              <textarea id="edit-content" rows="5">${comment.content || ''}</textarea>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="edit-approved" ${comment.approved ? 'checked' : ''}>
                <span>Approved</span>
              </label>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button id="edit-cancel" class="btn btn-outline">Cancel</button>
          <button id="edit-save" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const editModal = document.getElementById('edit-comment-modal');
  const editForm = document.getElementById('edit-comment-form');
  const editNameInput = document.getElementById('edit-name');
  const editEmailInput = document.getElementById('edit-email');
  const editContentInput = document.getElementById('edit-content');
  const editApprovedCheckbox = document.getElementById('edit-approved');
  const editSaveBtn = document.getElementById('edit-save');
  const editCancelBtn = document.getElementById('edit-cancel');
  const closeModalBtn = editModal.querySelector('.close-modal');

  // Cancel and close handlers
  function closeEditModal() {
    document.body.removeChild(editModal);
  }

  editCancelBtn.addEventListener('click', closeEditModal);
  closeModalBtn.addEventListener('click', closeEditModal);

  // Save handler
  editSaveBtn.addEventListener('click', function () {
    // Get updated values
    const updatedComment = {
      name: editNameInput.value.trim(),
      email: editEmailInput.value.trim(),
      content: editContentInput.value.trim(),
      approved: editApprovedCheckbox.checked
    };

    // Validate
    if (!updatedComment.name) {
      showNotification('Name is required', 'error');
      return;
    }

    if (!updatedComment.email) {
      showNotification('Email is required', 'error');
      return;
    }

    if (!updatedComment.content) {
      showNotification('Comment content is required', 'error');
      return;
    }

    // Update in database
    db.ref(`comments/${pageKey}/${commentId}`).update(updatedComment)
      .then(() => {
        showNotification('Comment updated successfully', 'success');
        closeEditModal();
      })
      .catch(error => {
        console.error('Error updating comment:', error);
        showNotification('Failed to update comment: ' + error.message, 'error');
      });
  });
}

// Handle delete comment button
function handleDeleteComment(e) {
  const commentItem = e.currentTarget.closest('.comment-item');
  if (!commentItem) return;

  const commentId = commentItem.getAttribute('data-id');
  const pageKey = commentItem.getAttribute('data-page');

  // Show confirmation modal
  showConfirmModal(
    'Delete Comment',
    'Are you sure you want to delete this comment? This action cannot be undone.',
    function () {
      // Delete from database
      db.ref(`comments/${pageKey}/${commentId}`).remove()
        .then(() => {
          showNotification('Comment deleted successfully', 'success');
        })
        .catch(error => {
          console.error('Error deleting comment:', error);
          showNotification('Failed to delete comment: ' + error.message, 'error');
        });
    }
  );
}

// Bulk approve selected comments
if (bulkApproveBtn) {
  bulkApproveBtn.addEventListener('click', function () {
    if (selectedComments.length === 0) return;

    showConfirmModal(
      'Approve Comments',
      `Are you sure you want to approve ${selectedComments.length} selected comments?`,
      function () {
        const updates = {};

        selectedComments.forEach(comment => {
          updates[`comments/${comment.pageKey}/${comment.id}/approved`] = true;
        });

        // Update database
        db.ref().update(updates)
          .then(() => {
            showNotification(`${selectedComments.length} comments approved successfully`, 'success');
            resetCommentBulkActions();
          })
          .catch(error => {
            console.error('Error approving comments:', error);
            showNotification('Failed to approve comments: ' + error.message, 'error');
          });
      }
    );
  });
}

// Bulk delete selected comments
if (bulkDeleteBtn) {
  bulkDeleteBtn.addEventListener('click', function () {
    if (selectedComments.length === 0) return;

    showConfirmModal(
      'Delete Comments',
      `Are you sure you want to delete ${selectedComments.length} selected comments? This action cannot be undone.`,
      function () {
        const updates = {};

        selectedComments.forEach(comment => {
          updates[`comments/${comment.pageKey}/${comment.id}`] = null;
        });

        // Update database
        db.ref().update(updates)
          .then(() => {
            showNotification(`${selectedComments.length} comments deleted successfully`, 'success');
            resetCommentBulkActions();
          })
          .catch(error => {
            console.error('Error deleting comments:', error);
            showNotification('Failed to delete comments: ' + error.message, 'error');
          });
      }
    );
  });
}

// Comment search and filter
if (commentSearch) {
  commentSearch.addEventListener('input', filterComments);
}

if (commentFilter) {
  commentFilter.addEventListener('change', filterComments);
}

// Load analytics data
function loadAnalyticsData() {
  console.log('Loading analytics data...');

  // Check if analytics is disabled
  db.ref('analyticsDisabled').once('value', function (snapshot) {
    const isDisabled = snapshot.exists() && snapshot.val() === true;

    if (enableAnalyticsBtn) {
      enableAnalyticsBtn.style.display = isDisabled ? 'inline-block' : 'none';
    }

    if (isDisabled) {
      showNotification('Analytics tracking is currently disabled', 'info');
      setAnalyticsValuesToZero();
      return;
    }

    // Get references
    const pageViewsRef = db.ref('analytics/pageViews');
    const visitorsRef = db.ref('analytics/visitors');
    const timeSpentRef = db.ref('analytics/timeSpent');
    const pageMetaRef = db.ref('analytics/pageMeta');

    // Total pageviews
    pageViewsRef.on('value', function (snapshot) {
      const pageViews = snapshot.val() || {};
      let total = 0;

      // Sum all page views
      Object.values(pageViews).forEach(function (views) {
        if (typeof views === 'number') {
          total += views;
        }
      });

      // Update display
      const totalPageviewsEl = document.getElementById('total-pageviews');
      if (totalPageviewsEl) totalPageviewsEl.textContent = total;
    });

    // Unique visitors
    visitorsRef.on('value', function (snapshot) {
      const visitors = snapshot.val() || {};
      const count = Object.keys(visitors).length;

      // Update display
      const uniqueVisitorsEl = document.getElementById('unique-visitors');
      if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = count;
    });

    // Average time on site
    timeSpentRef.on('value', function (snapshot) {
      const timeData = snapshot.val() || {};
      let totalSeconds = 0;
      let totalVisits = 0;

      // Calculate total time and visits
      Object.values(timeData).forEach(function (data) {
        if (data && typeof data === 'object') {
          if ('totalSeconds' in data && 'visits' in data) {
            totalSeconds += Number(data.totalSeconds) || 0;
            totalVisits += Number(data.visits) || 0;
          }
        }
      });

      // Calculate and format average time
      let avgTimeText = '0m 0s';
      if (totalVisits > 0) {
        const avgSeconds = Math.round(totalSeconds / totalVisits);
        const minutes = Math.floor(avgSeconds / 60);
        const seconds = avgSeconds % 60;
        avgTimeText = `${minutes}m ${seconds}s`;
      }

      // Format total time
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const displayMinutes = totalMinutes % 60;
      const displaySeconds = totalSeconds % 60;

      let totalTimeText = '';
      if (totalHours > 0) {
        totalTimeText = `${totalHours}h ${displayMinutes}m`;
      } else {
        totalTimeText = `${totalMinutes}m ${displaySeconds}s`;
      }

      // Update displays
      const avgTimeEl = document.getElementById('avg-time');
      const totalTimeEl = document.getElementById('total-time');

      if (avgTimeEl) avgTimeEl.textContent = avgTimeText;
      if (totalTimeEl) totalTimeEl.textContent = totalTimeText;
    });

    // Pages table
    const pagesTableBody = document.querySelector('#pages-table tbody');
    if (pagesTableBody) {
      // Get all data at once to ensure consistency
      Promise.all([
        new Promise(resolve => pageViewsRef.once('value', resolve)),
        new Promise(resolve => timeSpentRef.once('value', resolve)),
        new Promise(resolve => pageMetaRef.once('value', resolve))
      ])
        .then(function (results) {
          const pageViewsSnapshot = results[0];
          const timeSpentSnapshot = results[1];
          const pageMetaSnapshot = results[2];

          const pageViews = pageViewsSnapshot.val() || {};
          const timeSpent = timeSpentSnapshot.val() || {};
          const pageMeta = pageMetaSnapshot.val() || {};

          // Combine data
          const pagesData = [];

          Object.entries(pageViews).forEach(function ([pageKey, views]) {
            // Skip keys that aren't page data
            if (typeof views !== 'number') return;

            const meta = pageMeta[pageKey] || {
              title: pageKey.replace(/_/g, '/').replace(/\/html$/, '.html'),
              path: pageKey.replace(/_/g, '/').replace(/\/html$/, '.html')
            };

            const time = timeSpent[pageKey] || { totalSeconds: 0, visits: 0 };

            // Calculate average time
            let avgTimeText = '0m 0s';
            if (time.visits > 0) {
              const avgSeconds = Math.round(time.totalSeconds / time.visits);
              const minutes = Math.floor(avgSeconds / 60);
              const seconds = avgSeconds % 60;
              avgTimeText = `${minutes}m ${seconds}s`;
            }

            pagesData.push({
              title: meta.title || 'Unnamed Page',
              path: meta.path || pageKey.replace(/_/g, '/').replace(/\/html$/, '.html'),
              views: Number(views) || 0,
              avgTime: avgTimeText
            });
          });

          // Sort by views (descending)
          pagesData.sort((a, b) => b.views - a.views);

          // Build table
          if (pagesData.length === 0) {
            pagesTableBody.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
            return;
          }

          let tableHTML = '';

          pagesData.forEach(function (page) {
            tableHTML += `
            <tr>
              <td title="${page.path}">${page.title}</td>
              <td>${page.views}</td>
              <td>${page.avgTime}</td>
            </tr>
          `;
          });

          pagesTableBody.innerHTML = tableHTML;
        })
        .catch(error => {
          console.error('Error loading pages data:', error);
          pagesTableBody.innerHTML = '<tr><td colspan="3">Error loading data</td></tr>';
        });
    }

    // Realtime visitors
    const activeVisitorsEl = document.getElementById('active-visitors');
    const realtimePagesEl = document.getElementById('realtime-pages');

    if (activeVisitorsEl && realtimePagesEl) {
      // Consider visitors "active" if they've loaded a page in the last 5 minutes
      const activeTimeframe = 5 * 60 * 1000; // 5 minutes in milliseconds

      function updateActiveVisitors() {
        visitorsRef.once('value')
          .then(snapshot => {
            const visitors = snapshot.val() || {};
            const now = Date.now();
            const activeSessions = {};
            let totalActiveVisitors = 0;

            // Process all visitors
            Object.entries(visitors).forEach(function ([visitorId, data]) {
              if (!data.pages) return;

              let isVisitorActive = false;

              // Check each page the visitor has viewed
              Object.entries(data.pages).forEach(function ([pageKey, pageData]) {
                // Consider recent page loads as "active"
                if (pageData && pageData.timestamp && (now - pageData.timestamp < activeTimeframe)) {
                  isVisitorActive = true;

                  // Add to active count for this page
                  activeSessions[pageKey] = activeSessions[pageKey] || {
                    count: 0,
                    title: pageKey.replace(/_/g, '/').replace(/\/html$/, '.html')
                  };

                  activeSessions[pageKey].count++;
                }
              });

              if (isVisitorActive) {
                totalActiveVisitors++;
              }
            });

            // Update active visitors count
            activeVisitorsEl.textContent = totalActiveVisitors;

            // Update list of pages with active visitors
            if (Object.keys(activeSessions).length === 0) {
              realtimePagesEl.innerHTML = '<p class="empty-message">No active visitors</p>';
              return;
            }

            // Sort by count
            const sortedPages = Object.entries(activeSessions)
              .sort((a, b) => b[1].count - a[1].count);

            let pagesHTML = '';

            sortedPages.forEach(function ([pageKey, data]) {
              pagesHTML += `
                <div class="realtime-page-item">
                  <div class="page-title">${data.title}</div>
                  <div class="visitor-count">${data.count} visitor${data.count !== 1 ? 's' : ''}</div>
                </div>
              `;
            });

            realtimePagesEl.innerHTML = pagesHTML;
          })
          .catch(error => {
            console.error('Error updating active visitors:', error);
            activeVisitorsEl.textContent = '0';
            realtimePagesEl.innerHTML = '<p class="empty-message">Error loading data</p>';
          });
      }

      // Initial update
      updateActiveVisitors();

      // Set interval for updates
      const intervalId = setInterval(updateActiveVisitors, 10000); // Update every 10 seconds

      // Clear interval when analytics tab is no longer active
      document.querySelector('.nav-item[data-target="analytics"]').addEventListener('click', function () {
        clearInterval(intervalId);
      });
    }
  });
}

// Set all analytics values to zero
function setAnalyticsValuesToZero() {
  const elements = [
    { id: 'total-pageviews', value: '0' },
    { id: 'unique-visitors', value: '0' },
    { id: 'avg-time', value: '0m 0s' },
    { id: 'total-time', value: '0m 0s' },
    { id: 'active-visitors', value: '0' }
  ];

  elements.forEach(element => {
    const el = document.getElementById(element.id);
    if (el) el.textContent = element.value;
  });

  // Reset pages table
  const pagesTableBody = document.querySelector('#pages-table tbody');
  if (pagesTableBody) {
    pagesTableBody.innerHTML = '<tr><td colspan="3">Analytics is disabled</td></tr>';
  }

  // Reset realtime pages
  const realtimePagesEl = document.getElementById('realtime-pages');
  if (realtimePagesEl) {
    realtimePagesEl.innerHTML = '<p class="empty-message">Analytics is disabled</p>';
  }
}

// Clear analytics data
if (clearAnalyticsBtn) {
  clearAnalyticsBtn.addEventListener('click', function () {
    showConfirmModal(
      'Clear Analytics Data',
      'Are you sure you want to delete ALL analytics data and disable tracking? This action cannot be undone.',
      function () {
        // Disable analytics tracking
        db.ref('analyticsDisabled').set(true)
          .then(() => {
            // Delete analytics data
            return db.ref('analytics').remove();
          })
          .then(() => {
            showNotification('Analytics data deleted and tracking disabled', 'success');
            setAnalyticsValuesToZero();

            // Show enable button
            if (enableAnalyticsBtn) {
              enableAnalyticsBtn.style.display = 'inline-block';
            }
          })
          .catch(error => {
            console.error('Error deleting analytics data:', error);
            showNotification('Failed to delete analytics data: ' + error.message, 'error');
          });
      }
    );
  });
}

// Enable analytics tracking
if (enableAnalyticsBtn) {
  enableAnalyticsBtn.addEventListener('click', function () {
    db.ref('analyticsDisabled').remove()
      .then(() => {
        showNotification('Analytics tracking enabled', 'success');

        // Reload analytics data
        loadAnalyticsData();

        // Hide enable button
        enableAnalyticsBtn.style.display = 'none';
      })
      .catch(error => {
        console.error('Error enabling analytics:', error);
        showNotification('Failed to enable analytics: ' + error.message, 'error');
      });
  });
}

// Account settings form
if (accountSettingsForm) {
  // Load user data
  accountSettingsForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const displayName = document.getElementById('display-name').value.trim();

    if (!displayName) {
      showNotification('Display name cannot be empty', 'error');
      return;
    }

    // Update user display name
    auth.currentUser.updateProfile({
      displayName: displayName
    })
      .then(() => {
        showNotification('Profile updated successfully', 'success');
        userNameDisplay.textContent = displayName;
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        showNotification('Failed to update profile: ' + error.message, 'error');
      });
  });

  // Load initial user data
  auth.onAuthStateChanged(function (user) {
    if (user) {
      const displayNameInput = document.getElementById('display-name');
      const emailAddressInput = document.getElementById('email-address');

      if (displayNameInput) {
        displayNameInput.value = user.displayName || '';
      }

      if (emailAddressInput) {
        emailAddressInput.value = user.email || '';
      }
    }
  });
}

// Security form
if (securityForm) {
  securityForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification('All fields are required', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showNotification('New password must be at least 6 characters', 'error');
      return;
    }

    // Reauthenticate user
    const credential = firebase.auth.EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    auth.currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        // Update password
        return auth.currentUser.updatePassword(newPassword);
      })
      .then(() => {
        showNotification('Password updated successfully', 'success');
        securityForm.reset();
      })
      .catch(error => {
        console.error('Error updating password:', error);
        showNotification('Failed to update password: ' + error.message, 'error');
      });
  });
}

// Show confirmation modal
function showConfirmModal(title, message, onConfirm) {
  if (!confirmModal || !modalTitle || !modalMessage || !modalConfirmBtn) return;

  // Set modal content
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Show modal
  confirmModal.classList.remove('hidden');

  // Set up confirm button
  const confirmHandler = function () {
    // Hide modal
    confirmModal.classList.add('hidden');

    // Execute callback
    if (typeof onConfirm === 'function') {
      onConfirm();
    }

    // Remove event listener
    modalConfirmBtn.removeEventListener('click', confirmHandler);
  };

  // Add event listener
  modalConfirmBtn.addEventListener('click', confirmHandler);

  // Set up cancel and close buttons
  const cancelHandler = function () {
    // Hide modal
    confirmModal.classList.add('hidden');

    // Remove event listeners
    modalCancelBtn.removeEventListener('click', cancelHandler);
    closeModalBtn.removeEventListener('click', cancelHandler);
    modalConfirmBtn.removeEventListener('click', confirmHandler);
  };

  // Add event listeners
  modalCancelBtn.addEventListener('click', cancelHandler);
  closeModalBtn.addEventListener('click', cancelHandler);
}

// Show notification toast
function showNotification(message, type = 'info') {
  if (!notificationToast || !toastMessage || !toastIcon || !closeToastBtn) return;

  // Set notification content
  toastMessage.textContent = message;

  // Set icon based on type
  switch (type) {
    case 'success':
      toastIcon.className = 'fas fa-check-circle';
      break;
    case 'error':
      toastIcon.className = 'fas fa-exclamation-circle';
      break;
    case 'info':
    default:
      toastIcon.className = 'fas fa-info-circle';
      break;
  }

  // Set notification class
  notificationToast.className = `toast ${type}`;

  // Show notification
  notificationToast.classList.remove('hidden');

  // Auto-hide after 5 seconds
  const timeoutId = setTimeout(function () {
    hideNotification();
  }, 5000);

  // Set up close button
  const closeHandler = function () {
    hideNotification();
    clearTimeout(timeoutId);
    closeToastBtn.removeEventListener('click', closeHandler);
  };

  // Add event listener
  closeToastBtn.addEventListener('click', closeHandler);
}

// Hide notification toast
function hideNotification() {
  if (!notificationToast) return;

  // Add animation class
  notificationToast.style.animation = 'slideOut 0.3s forwards';

  // Hide after animation completes
  setTimeout(function () {
    notificationToast.classList.add('hidden');
    notificationToast.style.animation = '';
  }, 300);
}

// Mobile sidebar handling
function handleMobileSidebar() {
  if (window.innerWidth < 768) {
    // Add click event to toggle sidebar button
    toggleSidebarBtn.addEventListener('click', function () {
      sidebar.classList.toggle('mobile-visible');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function (e) {
      if (
        sidebar.classList.contains('mobile-visible') &&
        !sidebar.contains(e.target) &&
        e.target !== toggleSidebarBtn
      ) {
        sidebar.classList.remove('mobile-visible');
      }
    });
  }
}

// Handle window resize
window.addEventListener('resize', function () {
  if (window.innerWidth >= 768) {
    sidebar.classList.remove('mobile-visible');
  }
});

// Initialize mobile sidebar handling
handleMobileSidebar();

// Data Export Feature
function setupDataExport() {
  // Add HTML for export section to Settings content area
  const settingsContent = document.getElementById('settings-content');
  if (!settingsContent) return;

  const exportSection = document.createElement('div');
  exportSection.className = 'export-section';
  exportSection.innerHTML = `
    <div class="panel-header">
      <h3>Export Data</h3>
    </div>
    <div class="panel-content">
      <p>Export your website data in different formats for backup or analysis.</p>
      <div class="export-options">
        <div class="export-type">
          <h4>Comments</h4>
          <p>Export all your site comments including pending and approved.</p>
          <button id="export-comments-json" class="btn btn-outline">
            <i class="fas fa-download"></i> Export as JSON
          </button>
        </div>
        <div class="export-type">
          <h4>Analytics</h4>
          <p>Export your site analytics data for further analysis.</p>
          <button id="export-analytics-json" class="btn btn-outline">
            <i class="fas fa-download"></i> Export as JSON
          </button>
        </div>
        <div class="export-type">
          <h4>CSV Format</h4>
          <p>Export your data in CSV format for spreadsheet applications.</p>
          <button id="export-comments-csv" class="btn btn-outline">
            <i class="fas fa-file-csv"></i> Comments CSV
          </button>
        </div>
      </div>
    </div>
  `;

  // Add the new section before the existing panels
  const firstChild = settingsContent.querySelector('.settings-panels');
  settingsContent.insertBefore(exportSection, firstChild);

  // Add event listeners to export buttons
  document.getElementById('export-comments-json').addEventListener('click', exportCommentsAsJSON);
  document.getElementById('export-analytics-json').addEventListener('click', exportAnalyticsAsJSON);
  document.getElementById('export-comments-csv').addEventListener('click', exportCommentsAsCSV);
}

// Export comments as JSON
function exportCommentsAsJSON() {
  db.ref('comments').once('value')
    .then(snapshot => {
      const comments = snapshot.val() || {};
      const jsonData = JSON.stringify(comments, null, 2);
      downloadFile(jsonData, 'wolfix-comments.json', 'application/json');
      showNotification('Comments exported successfully', 'success');
    })
    .catch(error => {
      console.error('Error exporting comments:', error);
      showNotification('Failed to export comments: ' + error.message, 'error');
    });
}

// Export analytics as JSON
function exportAnalyticsAsJSON() {
  db.ref('analytics').once('value')
    .then(snapshot => {
      const analytics = snapshot.val() || {};
      const jsonData = JSON.stringify(analytics, null, 2);
      downloadFile(jsonData, 'wolfix-analytics.json', 'application/json');
      showNotification('Analytics exported successfully', 'success');
    })
    .catch(error => {
      console.error('Error exporting analytics:', error);
      showNotification('Failed to export analytics: ' + error.message, 'error');
    });
}

// Export comments as CSV
function exportCommentsAsCSV() {
  db.ref('comments').once('value')
    .then(snapshot => {
      const comments = snapshot.val() || {};
      let csvData = 'Page,Comment ID,Name,Email,Content,Timestamp,Approved\n';

      // Process all comments
      Object.entries(comments).forEach(([pageKey, pageComments]) => {
        Object.entries(pageComments).forEach(([commentId, comment]) => {
          const page = pageKey.replace(/_/g, '/').replace(/\/html$/, '.html');
          const name = escapeCsvValue(comment.name || '');
          const email = escapeCsvValue(comment.email || '');
          const content = escapeCsvValue(comment.content || '');
          const timestamp = comment.timestamp || '';
          const approved = comment.approved ? 'Yes' : 'No';

          csvData += `${escapeCsvValue(page)},${commentId},${name},${email},${content},${timestamp},${approved}\n`;
        });
      });

      downloadFile(csvData, 'wolfix-comments.csv', 'text/csv');
      showNotification('Comments exported as CSV successfully', 'success');
    })
    .catch(error => {
      console.error('Error exporting comments as CSV:', error);
      showNotification('Failed to export comments as CSV: ' + error.message, 'error');
    });
}

// Helper function to escape CSV values
function escapeCsvValue(value) {
  if (typeof value !== 'string') {
    return value;
  }

  // If the value contains commas, newlines, or double quotes, enclose it in double quotes
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    // Replace double quotes with two double quotes
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

// Helper function to download file
function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

// Theme Customization Feature
function setupThemeCustomization() {
  // Add HTML for customization section to Settings content area
  const settingsContent = document.getElementById('settings-content');
  if (!settingsContent) return;

  const customizationSection = document.createElement('div');
  customizationSection.className = 'customization-section';
  customizationSection.innerHTML = `
    <div class="panel-header">
      <h3>Theme Customization</h3>
    </div>
    <div class="panel-content">
      <p>Customize the appearance of your admin dashboard.</p>
      <div class="color-pickers">
        <div class="color-picker">
          <label for="primary-color">Primary Color</label>
          <input type="color" id="primary-color" value="#5f4b8b">
          <div class="color-preview" id="primary-preview" style="background-color: #5f4b8b;"></div>
        </div>
        <div class="color-picker">
          <label for="accent-color">Accent Color</label>
          <input type="color" id="accent-color" value="#ff6b6b">
          <div class="color-preview" id="accent-preview" style="background-color: #ff6b6b;"></div>
        </div>
        <div class="color-picker">
          <label for="success-color">Success Color</label>
          <input type="color" id="success-color" value="#28a745">
          <div class="color-preview" id="success-preview" style="background-color: #28a745;"></div>
        </div>
        <div class="color-picker">
          <label for="danger-color">Danger Color</label>
          <input type="color" id="danger-color" value="#dc3545">
          <div class="color-preview" id="danger-preview" style="background-color: #dc3545;"></div>
        </div>
      </div>
      <div class="form-actions">
        <button id="apply-theme" class="btn btn-primary">Apply Theme</button>
        <button id="reset-theme" class="btn btn-outline">Reset to Default</button>
      </div>
    </div>
  `;

  // Add the new section before the existing panels
  const firstChild = settingsContent.querySelector('.settings-panels');
  settingsContent.insertBefore(customizationSection, firstChild);

  // Load saved theme colors
  loadThemeColors();

  // Add event listeners to color inputs
  document.getElementById('primary-color').addEventListener('input', updateColorPreview);
  document.getElementById('accent-color').addEventListener('input', updateColorPreview);
  document.getElementById('success-color').addEventListener('input', updateColorPreview);
  document.getElementById('danger-color').addEventListener('input', updateColorPreview);

  // Add event listeners to buttons
  document.getElementById('apply-theme').addEventListener('click', applyThemeColors);
  document.getElementById('reset-theme').addEventListener('click', resetThemeColors);
}

// Update color preview
function updateColorPreview(e) {
  const colorId = e.target.id;
  const previewId = colorId.replace('color', 'preview');
  const preview = document.getElementById(previewId);

  if (preview) {
    preview.style.backgroundColor = e.target.value;
  }
}

// Load saved theme colors
function loadThemeColors() {
  const savedTheme = localStorage.getItem('wolfix-admin-theme-colors');

  if (savedTheme) {
    try {
      const themeColors = JSON.parse(savedTheme);

      // Set input values
      if (themeColors.primaryColor) {
        document.getElementById('primary-color').value = themeColors.primaryColor;
        document.getElementById('primary-preview').style.backgroundColor = themeColors.primaryColor;
      }

      if (themeColors.accentColor) {
        document.getElementById('accent-color').value = themeColors.accentColor;
        document.getElementById('accent-preview').style.backgroundColor = themeColors.accentColor;
      }

      if (themeColors.successColor) {
        document.getElementById('success-color').value = themeColors.successColor;
        document.getElementById('success-preview').style.backgroundColor = themeColors.successColor;
      }

      if (themeColors.dangerColor) {
        document.getElementById('danger-color').value = themeColors.dangerColor;
        document.getElementById('danger-preview').style.backgroundColor = themeColors.dangerColor;
      }

      // Apply theme colors to CSS variables
      applyThemeColorsToCSS(themeColors);
    } catch (error) {
      console.error('Error loading theme colors:', error);
    }
  }
}

// Apply theme colors
function applyThemeColors() {
  const primaryColor = document.getElementById('primary-color').value;
  const accentColor = document.getElementById('accent-color').value;
  const successColor = document.getElementById('success-color').value;
  const dangerColor = document.getElementById('danger-color').value;

  const themeColors = {
    primaryColor,
    accentColor,
    successColor,
    dangerColor
  };

  // Save to local storage
  localStorage.setItem('wolfix-admin-theme-colors', JSON.stringify(themeColors));

  // Apply to CSS variables
  applyThemeColorsToCSS(themeColors);

  showNotification('Theme colors applied successfully', 'success');
}

// Apply theme colors to CSS variables
function applyThemeColorsToCSS(themeColors) {
  document.documentElement.style.setProperty('--primary-color', themeColors.primaryColor);
  document.documentElement.style.setProperty('--primary-light', adjustColor(themeColors.primaryColor, 20));
  document.documentElement.style.setProperty('--primary-dark', adjustColor(themeColors.primaryColor, -20));
  document.documentElement.style.setProperty('--accent-color', themeColors.accentColor);
  document.documentElement.style.setProperty('--success-color', themeColors.successColor);
  document.documentElement.style.setProperty('--danger-color', themeColors.dangerColor);
}

// Reset theme colors
function resetThemeColors() {
  // Default colors
  const defaultColors = {
    primaryColor: '#5f4b8b',
    accentColor: '#ff6b6b',
    successColor: '#28a745',
    dangerColor: '#dc3545'
  };

  // Set input values
  document.getElementById('primary-color').value = defaultColors.primaryColor;
  document.getElementById('primary-preview').style.backgroundColor = defaultColors.primaryColor;

  document.getElementById('accent-color').value = defaultColors.accentColor;
  document.getElementById('accent-preview').style.backgroundColor = defaultColors.accentColor;

  document.getElementById('success-color').value = defaultColors.successColor;
  document.getElementById('success-preview').style.backgroundColor = defaultColors.successColor;

  document.getElementById('danger-color').value = defaultColors.dangerColor;
  document.getElementById('danger-preview').style.backgroundColor = defaultColors.dangerColor;

  // Apply to CSS variables
  applyThemeColorsToCSS(defaultColors);

  // Save to local storage
  localStorage.setItem('wolfix-admin-theme-colors', JSON.stringify(defaultColors));

  showNotification('Theme colors reset to default', 'success');
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Enhanced Statistics with Charts
function setupEnhancedStatistics() {
  // Add HTML for statistics charts to Analytics content area
  const analyticsContent = document.getElementById('analytics-content');
  if (!analyticsContent) return;

  const statsChartsSection = document.createElement('div');
  statsChartsSection.className = 'stats-charts';
  statsChartsSection.innerHTML = `
    <div class="chart-container">
      <h3 class="chart-title">Pageviews Over Time</h3>
      <canvas id="pageviews-chart"></canvas>
      <div class="chart-placeholder">Chart will display when data is available</div>
    </div>
    <div class="chart-container">
      <h3 class="chart-title">Top 5 Popular Pages</h3>
      <canvas id="popular-pages-chart"></canvas>
      <div class="chart-placeholder">Chart will display when data is available</div>
    </div>
  `;

  // Add the new section after the analytics panels
  const analyticsPanel = analyticsContent.querySelector('.analytics-panels');
  analyticsContent.insertBefore(statsChartsSection, analyticsPanel.nextSibling);

  // Load and initialize charts when data is available
  loadChartData();
}

// Load chart data
function loadChartData() {
  // This function would normally fetch and process data for charts
  // For this example, we'll simulate chart data

  // Check if we have Chart.js loaded
  if (typeof Chart === 'undefined') {
    // Load Chart.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = initializeCharts;
    document.head.appendChild(script);
  } else {
    initializeCharts();
  }
}

// Initialize charts
function initializeCharts() {
  // Get page views data from Firebase
  db.ref('analytics/pageViews').once('value')
    .then(snapshot => {
      const pageViews = snapshot.val() || {};

      // Process data for popular pages chart
      const pagesData = [];

      Object.entries(pageViews).forEach(([pageKey, views]) => {
        if (typeof views === 'number') {
          pagesData.push({
            title: pageKey.replace(/_/g, '/').replace(/\/html$/, '.html'),
            views: views
          });
        }
      });

      // Sort by views (highest first) and take top 5
      pagesData.sort((a, b) => b.views - a.views);
      const top5Pages = pagesData.slice(0, 5);

      // Create popular pages chart
      if (top5Pages.length > 0) {
        createPopularPagesChart(top5Pages);
      }

      // Simulate pageviews over time (normally would come from your analytics data)
      const timeData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Pageviews',
          data: [
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100,
            Math.floor(Math.random() * 500) + 100
          ],
          backgroundColor: 'rgba(95, 75, 139, 0.2)',
          borderColor: 'rgba(95, 75, 139, 1)',
          borderWidth: 2,
          tension: 0.3
        }]
      };

      createPageviewsChart(timeData);
    })
    .catch(error => {
      console.error('Error loading chart data:', error);
    });
}

// Create popular pages chart
function createPopularPagesChart(pagesData) {
  const canvas = document.getElementById('popular-pages-chart');
  if (!canvas) return;

  const placeholder = canvas.closest('.chart-container').querySelector('.chart-placeholder');
  if (placeholder) {
    placeholder.style.display = 'none';
  }

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: pagesData.map(page => {
        // Shorten long page titles
        const title = page.title;
        return title.length > 20 ? title.substr(0, 17) + '...' : title;
      }),
      datasets: [{
        label: 'Page Views',
        data: pagesData.map(page => page.views),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Create pageviews chart
function createPageviewsChart(timeData) {
  const canvas = document.getElementById('pageviews-chart');
  if (!canvas) return;

  const placeholder = canvas.closest('.chart-container').querySelector('.chart-placeholder');
  if (placeholder) {
    placeholder.style.display = 'none';
  }

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: timeData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Initialize all new features when dashboard is loaded
function initializeExtraFeatures() {
  setupDataExport();
  setupThemeCustomization();
  setupEnhancedStatistics();
}

// Additional features: Backup & Restore functionality
function setupBackupRestore() {
  // Add HTML for backup & restore section to Settings content area
  const settingsContent = document.getElementById('settings-content');
  if (!settingsContent) return;

  const backupSection = document.createElement('div');
  backupSection.className = 'export-section';
  backupSection.innerHTML = `
    <div class="panel-header">
      <h3>Backup & Restore</h3>
    </div>
    <div class="panel-content">
      <p>Create complete database backups or restore from previous backups.</p>
      <div class="export-options">
        <div class="export-type">
          <h4>Full Backup</h4>
          <p>Create a complete backup of your entire database.</p>
          <button id="create-backup" class="btn btn-outline">
            <i class="fas fa-download"></i> Create Backup
          </button>
        </div>
        <div class="export-type">
          <h4>Restore</h4>
          <p>Restore your database from a previous backup file.</p>
          <label for="restore-file" class="btn btn-outline">
            <i class="fas fa-upload"></i> Select Backup File
          </label>
          <input type="file" id="restore-file" accept=".json" style="display: none;">
        </div>
      </div>
    </div>
  `;

  // Add the new section after the export section
  const exportSection = settingsContent.querySelector('.export-section');
  if (exportSection) {
    settingsContent.insertBefore(backupSection, exportSection.nextSibling);
  } else {
    const firstChild = settingsContent.querySelector('.settings-panels');
    settingsContent.insertBefore(backupSection, firstChild);
  }

  // Add event listeners
  document.getElementById('create-backup').addEventListener('click', createFullBackup);
  document.getElementById('restore-file').addEventListener('change', handleRestoreFile);
}

// Create full backup
function createFullBackup() {
  showNotification('Creating backup... Please wait', 'info');

  // Get all data from Firebase
  db.ref().once('value')
    .then(snapshot => {
      const data = snapshot.val() || {};

      // Add backup metadata
      const backup = {
        metadata: {
          timestamp: Date.now(),
          version: '1.0',
          creator: currentUser ? currentUser.email : 'unknown'
        },
        data: data
      };

      // Convert to JSON
      const jsonData = JSON.stringify(backup, null, 2);

      // Generate filename with date
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `wolfix-backup-${dateStr}.json`;

      // Download file
      downloadFile(jsonData, filename, 'application/json');
      showNotification('Backup created successfully', 'success');
    })
    .catch(error => {
      console.error('Error creating backup:', error);
      showNotification('Failed to create backup: ' + error.message, 'error');
    });
}

// Handle restore file selection
function handleRestoreFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const backup = JSON.parse(event.target.result);

      // Validate backup format
      if (!backup.metadata || !backup.data) {
        throw new Error('Invalid backup file format');
      }

      // Show confirmation
      showConfirmModal(
        'Restore Database',
        'Are you sure you want to restore the database from this backup? This will overwrite all current data and cannot be undone.',
        function () {
          restoreDatabase(backup.data);
        }
      );
    } catch (error) {
      console.error('Error parsing backup file:', error);
      showNotification('Invalid backup file: ' + error.message, 'error');
    }

    // Reset file input
    e.target.value = '';
  };

  reader.onerror = function () {
    showNotification('Error reading backup file', 'error');
    // Reset file input
    e.target.value = '';
  };

  reader.readAsText(file);
}

// Restore database
function restoreDatabase(data) {
  showNotification('Restoring database... Please wait', 'info');

  // Delete all existing data
  db.ref().remove()
    .then(() => {
      // Restore data from backup
      return db.ref().set(data);
    })
    .then(() => {
      showNotification('Database restored successfully. Reloading...', 'success');

      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    })
    .catch(error => {
      console.error('Error restoring database:', error);
      showNotification('Failed to restore database: ' + error.message, 'error');
    });
}

// Add User Management functionality
function setupUserManagement() {
  // Only allow for admin users
  if (!currentUser || !currentUser.email) return;

  // Check if user is admin
  db.ref('admins').child(currentUser.uid).once('value')
    .then(snapshot => {
      const isAdmin = snapshot.exists() && snapshot.val() === true;

      if (!isAdmin) return;

      // Add user management section to sidebar
      const sidebar = document.querySelector('.sidebar-nav ul');

      if (sidebar) {
        const userManagementItem = document.createElement('li');
        userManagementItem.className = 'nav-item';
        userManagementItem.setAttribute('data-target', 'users');
        userManagementItem.innerHTML = `
          <i class="fas fa-users-cog"></i>
          <span>User Management</span>
        `;

        sidebar.appendChild(userManagementItem);

        // Add event listener
        userManagementItem.addEventListener('click', function () {
          const targetId = this.getAttribute('data-target');

          // Update active nav item
          document.querySelectorAll('.nav-item').forEach(function (navItem) {
            navItem.classList.remove('active');
          });
          this.classList.add('active');

          // Show user management content, hide others
          document.querySelectorAll('.content-section').forEach(function (section) {
            if (section.id === targetId + '-content') {
              section.classList.remove('hidden');
            } else {
              section.classList.add('hidden');
            }
          });

          // On mobile, collapse sidebar after navigation
          if (window.innerWidth < 768) {
            document.querySelector('.sidebar').classList.remove('mobile-visible');
          }

          // Initialize user management if first time
          if (!document.getElementById('users-content')) {
            initUserManagement();
          } else {
            // Reload users list
            loadUsersList();
          }
        });
      }
    })
    .catch(error => {
      console.error('Error checking admin status:', error);
    });
}

// Initialize user management
function initUserManagement() {
  // Create user management content section
  const mainContent = document.querySelector('.main-content');

  if (!mainContent) return;

  const usersContent = document.createElement('div');
  usersContent.id = 'users-content';
  usersContent.className = 'content-section hidden';
  usersContent.innerHTML = `
    <div class="content-header">
      <h1>User Management</h1>
      <div class="actions-container">
        <button id="add-user-btn" class="btn btn-primary">
          <i class="fas fa-user-plus"></i> Add User
        </button>
      </div>
    </div>
    
    <div class="panel">
      <div class="panel-header">
        <h3>Users</h3>
      </div>
      <div class="panel-content">
        <table class="data-table enhanced">
          <thead>
            <tr>
              <th>Email</th>
              <th>Display Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="users-list">
            <tr>
              <td colspan="4" class="loading-cell">Loading users...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  mainContent.appendChild(usersContent);

  // Add event listener to add user button
  document.getElementById('add-user-btn').addEventListener('click', showAddUserModal);

  // Load users list
  loadUsersList();
}

// Load users list
function loadUsersList() {
  const usersList = document.getElementById('users-list');

  if (!usersList) return;

  usersList.innerHTML = '<tr><td colspan="4" class="loading-cell">Loading users...</td></tr>';

  // Get admins list
  db.ref('admins').once('value')
    .then(snapshot => {
      const admins = snapshot.val() || {};

      // Get users from Authentication
      // Note: In a real application, this would typically be done through a Cloud Function
      // or a backend API, as client-side code cannot list all users
      // For this example, we'll simulate with a small set of users

      const users = [
        {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || 'Admin User',
          role: 'Admin'
        }
      ];

      // Optional: Add some dummy users for demo purposes
      if (users.length === 1) {
        users.push(
          {
            uid: 'user1',
            email: 'editor@example.com',
            displayName: 'Editor User',
            role: admins['user1'] ? 'Admin' : 'Editor'
          },
          {
            uid: 'user2',
            email: 'viewer@example.com',
            displayName: 'Viewer User',
            role: admins['user2'] ? 'Admin' : 'Viewer'
          }
        );
      }

      // Generate HTML
      if (users.length > 0) {
        let html = '';

        users.forEach(user => {
          html += `
            <tr data-uid="${user.uid}">
              <td>${user.email}</td>
              <td>${user.displayName || '-'}</td>
              <td>
                <select class="role-select" ${user.uid === currentUser.uid ? 'disabled' : ''}>
                  <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                  <option value="Editor" ${user.role === 'Editor' ? 'selected' : ''}>Editor</option>
                  <option value="Viewer" ${user.role === 'Viewer' ? 'selected' : ''}>Viewer</option>
                </select>
              </td>
              <td>
                <div class="comment-actions">
                  <button class="action-btn edit-user-btn" title="Edit User">
                    <i class="fas fa-edit"></i>
                  </button>
                  ${user.uid !== currentUser.uid ? `
                  <button class="action-btn delete-user-btn" title="Delete User">
                    <i class="fas fa-trash"></i>
                  </button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `;
        });

        usersList.innerHTML = html;

        // Add event listeners
        document.querySelectorAll('.role-select').forEach(select => {
          select.addEventListener('change', function () {
            const uid = this.closest('tr').getAttribute('data-uid');
            const role = this.value;

            updateUserRole(uid, role);
          });
        });

        document.querySelectorAll('.edit-user-btn').forEach(btn => {
          btn.addEventListener('click', function () {
            const uid = this.closest('tr').getAttribute('data-uid');
            const user = users.find(u => u.uid === uid);

            if (user) {
              editUser(user);
            }
          });
        });

        document.querySelectorAll('.delete-user-btn').forEach(btn => {
          btn.addEventListener('click', function () {
            const uid = this.closest('tr').getAttribute('data-uid');
            const user = users.find(u => u.uid === uid);

            if (user) {
              deleteUser(user);
            }
          });
        });
      } else {
        usersList.innerHTML = '<tr><td colspan="4" class="empty-message">No users found</td></tr>';
      }
    })
    .catch(error => {
      console.error('Error loading users:', error);
      usersList.innerHTML = `<tr><td colspan="4" class="empty-message">Error loading users: ${error.message}</td></tr>`;
    });
}

// Show add user modal
function showAddUserModal() {
  // Create modal HTML
  const modalHTML = `
    <div id="add-user-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add User</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="add-user-form">
            <div class="form-group">
              <label for="user-email">Email</label>
              <input type="email" id="user-email" required>
            </div>
            <div class="form-group">
              <label for="user-name">Display Name</label>
              <input type="text" id="user-name">
            </div>
            <div class="form-group">
              <label for="user-password">Password</label>
              <input type="password" id="user-password" required>
            </div>
            <div class="form-group">
              <label for="user-role">Role</label>
              <select id="user-role">
                <option value="Admin">Admin</option>
                <option value="Editor" selected>Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button id="add-user-cancel" class="btn btn-outline">Cancel</button>
          <button id="add-user-save" class="btn btn-primary">Add User</button>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const addUserModal = document.getElementById('add-user-modal');
  const addUserForm = document.getElementById('add-user-form');
  const userEmailInput = document.getElementById('user-email');
  const userNameInput = document.getElementById('user-name');
  const userPasswordInput = document.getElementById('user-password');
  const userRoleSelect = document.getElementById('user-role');
  const addUserSaveBtn = document.getElementById('add-user-save');
  const addUserCancelBtn = document.getElementById('add-user-cancel');
  const closeModalBtn = addUserModal.querySelector('.close-modal');

  // Cancel and close handlers
  function closeAddUserModal() {
    document.body.removeChild(addUserModal);
  }

  addUserCancelBtn.addEventListener('click', closeAddUserModal);
  closeModalBtn.addEventListener('click', closeAddUserModal);

  // Save handler
  addUserSaveBtn.addEventListener('click', function () {
    const email = userEmailInput.value.trim();
    const name = userNameInput.value.trim();
    const password = userPasswordInput.value;
    const role = userRoleSelect.value;

    // Validate
    if (!email) {
      showNotification('Email is required', 'error');
      return;
    }

    if (!password || password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    // In a real application, this would be done through a Cloud Function
    // For this example, we'll show a success message

    showNotification(`User "${email}" would be created with ${role} role`, 'success');
    closeAddUserModal();

    // Reload users list
    loadUsersList();
  });
}

// Edit user
function editUser(user) {
  // Create modal HTML
  const modalHTML = `
    <div id="edit-user-modal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit User</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="edit-user-form">
            <div class="form-group">
              <label for="edit-user-email">Email</label>
              <input type="email" id="edit-user-email" value="${user.email}" disabled>
            </div>
            <div class="form-group">
              <label for="edit-user-name">Display Name</label>
              <input type="text" id="edit-user-name" value="${user.displayName || ''}">
            </div>
            <div class="form-group">
              <label for="edit-user-role">Role</label>
              <select id="edit-user-role" ${user.uid === currentUser.uid ? 'disabled' : ''}>
                <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                <option value="Editor" ${user.role === 'Editor' ? 'selected' : ''}>Editor</option>
                <option value="Viewer" ${user.role === 'Viewer' ? 'selected' : ''}>Viewer</option>
              </select>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="edit-user-password-check">
                <span>Change Password</span>
              </label>
            </div>
            <div id="password-change-fields" style="display: none;">
              <div class="form-group">
                <label for="edit-user-password">New Password</label>
                <input type="password" id="edit-user-password">
              </div>
              <div class="form-group">
                <label for="edit-user-password-confirm">Confirm Password</label>
                <input type="password" id="edit-user-password-confirm">
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button id="edit-user-cancel" class="btn btn-outline">Cancel</button>
          <button id="edit-user-save" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const editUserModal = document.getElementById('edit-user-modal');
  const editUserForm = document.getElementById('edit-user-form');
  const userNameInput = document.getElementById('edit-user-name');
  const userRoleSelect = document.getElementById('edit-user-role');
  const passwordCheckbox = document.getElementById('edit-user-password-check');
  const passwordFields = document.getElementById('password-change-fields');
  const userPasswordInput = document.getElementById('edit-user-password');
  const userPasswordConfirmInput = document.getElementById('edit-user-password-confirm');
  const editUserSaveBtn = document.getElementById('edit-user-save');
  const editUserCancelBtn = document.getElementById('edit-user-cancel');
  const closeModalBtn = editUserModal.querySelector('.close-modal');

  // Toggle password fields
  passwordCheckbox.addEventListener('change', function () {
    passwordFields.style.display = this.checked ? 'block' : 'none';
  });

  // Cancel and close handlers
  function closeEditUserModal() {
    document.body.removeChild(editUserModal);
  }

  editUserCancelBtn.addEventListener('click', closeEditUserModal);
  closeModalBtn.addEventListener('click', closeEditUserModal);

  // Save handler
  editUserSaveBtn.addEventListener('click', function () {
    const name = userNameInput.value.trim();
    const role = userRoleSelect.value;
    const changePassword = passwordCheckbox.checked;

    // Validate password if changing
    if (changePassword) {
      const password = userPasswordInput.value;
      const confirmPassword = userPasswordConfirmInput.value;

      if (!password || password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
      }
    }

    // In a real application, this would be done through a Cloud Function
    // For this example, we'll show a success message

    showNotification(`User "${user.email}" updated successfully`, 'success');
    closeEditUserModal();

    // Update user role in local list
    updateUserRole(user.uid, role);

    // Reload users list
    loadUsersList();
  });
}

// Update user role
function updateUserRole(uid, role) {
  console.log(`Updating user ${uid} to role ${role}`);

  // In a real application, this would update the user's role in a database
  // For this example, we'll update the admins list

  if (role === 'Admin') {
    db.ref('admins').child(uid).set(true)
      .then(() => {
        showNotification('User role updated to Admin', 'success');
      })
      .catch(error => {
        console.error('Error updating user role:', error);
        showNotification('Failed to update user role: ' + error.message, 'error');
      });
  } else {
    db.ref('admins').child(uid).remove()
      .then(() => {
        showNotification(`User role updated to ${role}`, 'success');
      })
      .catch(error => {
        console.error('Error updating user role:', error);
        showNotification('Failed to update user role: ' + error.message, 'error');
      });
  }
}

// Delete user
function deleteUser(user) {
  showConfirmModal(
    'Delete User',
    `Are you sure you want to delete user "${user.email}"? This action cannot be undone.`,
    function () {
      // In a real application, this would be done through a Cloud Function
      // For this example, we'll show a success message

      showNotification(`User "${user.email}" would be deleted`, 'success');

      // Reload users list
      loadUsersList();
    }
  );
}

// Helper function to format page names
function formatPageName(pageName) {
  if (!pageName) return 'Unknown';
  
  // Remove file extension
  let formatted = pageName.replace(/\.html$/, '');
  
  // Remove path prefixes like /2/2Posts-
  formatted = formatted.replace(/^\/\d+\/\d+Posts-/, '');
  
  // Replace remaining hyphens and slashes with spaces
  formatted = formatted.replace(/-/g, ' ');
  
  // Clean up any double spaces
  formatted = formatted.replace(/\s\s+/g, ' ');
  
  return formatted;
}

// Add floating comment detail view
document.addEventListener('DOMContentLoaded', function () {
  // Listen for clicks on comments
  document.addEventListener('click', function (event) {
    // Check if the comments section is active
    const commentsContent = document.getElementById('comments-content');
    if (!commentsContent || commentsContent.classList.contains('hidden')) return;

    // Check if a comment item or content was clicked
    const commentItem = event.target.closest('.comment-item');
    const contentClicked = event.target.closest('.content-col') ||
      event.target.closest('.comment-content');

    // Only proceed if the content part of a comment was clicked
    if (commentItem && contentClicked) {
      // Prevent click on action buttons from triggering the popup
      if (event.target.closest('.comment-actions') ||
        event.target.closest('input[type="checkbox"]')) {
        return;
      }

      // Get comment data
      const commentId = commentItem.getAttribute('data-id');
      const pageKey = commentItem.getAttribute('data-page');

      // Find the corresponding comment in our data
      const comment = commentsList.find(c => c.id === commentId && c.pageKey === pageKey);
      if (!comment) return;

      // Format date
      const date = new Date(comment.timestamp);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

      // Create and show modal with comment details
      showCommentDetailModal(comment, formattedDate);
    }
  });

  // Function to show comment detail modal
  function showCommentDetailModal(comment, formattedDate) {
    // Create modal element if it doesn't exist
    let detailModal = document.getElementById('comment-detail-modal');
    if (!detailModal) {
      detailModal = document.createElement('div');
      detailModal.id = 'comment-detail-modal';
      detailModal.className = 'modal';
      document.body.appendChild(detailModal);

      // Add styles for the modal
      const modalStyle = document.createElement('style');
      modalStyle.textContent = `
        #comment-detail-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        #comment-detail-modal .modal-content {
          background-color: var(--card-bg);
          border-radius: var(--border-radius);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: auto;
          animation: fadeIn 0.3s;
        }
        
        #comment-detail-modal .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        
        #comment-detail-modal .modal-body {
          padding: 20px;
        }
        
        #comment-detail-modal h3 {
          margin: 0;
          color: var(--primary-color);
        }
        
        #comment-detail-modal .close-modal {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-secondary);
        }
        
        #comment-detail-modal table {
          width: 100%;
          border-collapse: collapse;
        }
        
        #comment-detail-modal th {
          background-color: var(--primary-color);
          color: white;
          text-align: left;
          padding: 10px;
        }
        
        #comment-detail-modal td {
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: top;
        }
        
        #comment-detail-modal .comment-full-content {
          white-space: pre-wrap;
          max-height: 300px;
          overflow-y: auto;
          background-color: var(--hover-bg);
          padding: 15px;
          border-radius: var(--border-radius);
          margin-top: 10px;
        }
        
        #comment-detail-modal .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        #comment-detail-modal .approved {
          background-color: rgba(40, 167, 69, 0.1);
          color: var(--success-color);
        }
        
        #comment-detail-modal .pending {
          background-color: rgba(255, 193, 7, 0.1);
          color: var(--warning-color);
        }
        
        #comment-detail-modal .action-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
          gap: 10px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(modalStyle);
    }

    // Populate modal content
    detailModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Comment Details</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <table>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
            <tr>
              <td><strong>Author</strong></td>
              <td>${comment.name || 'Anonymous'}</td>
            </tr>
            <tr>
              <td><strong>Email</strong></td>
              <td>${comment.email || 'No email'}</td>
            </tr>
<tr>
  <td><strong>Page</strong></td>
  <td>${formatPageName(comment.pageName)}</td>
</tr>
            <tr>
              <td><strong>Date</strong></td>
              <td>${formattedDate}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td>
                <span class="status-badge ${comment.approved ? 'approved' : 'pending'}">
                  ${comment.approved ? 'Approved' : 'Pending'}
                </span>
              </td>
            </tr>
          </table>
          
          <h4 style="margin-top: 20px;">Comment Content:</h4>
          <div class="comment-full-content">${comment.content || 'No content'}</div>
          
          <div class="action-buttons">
            <button class="btn ${comment.approved ? 'btn-outline' : 'btn-success'} toggle-approval-btn">
              <i class="fas ${comment.approved ? 'fa-times' : 'fa-check'}"></i>
              ${comment.approved ? 'Unapprove' : 'Approve'}
            </button>
            <button class="btn btn-primary edit-comment-btn">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger delete-comment-btn">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;

    // Show the modal
    detailModal.classList.remove('hidden');

    // Handle close modal
    const closeBtn = detailModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function () {
      detailModal.classList.add('hidden');
    });

    // Close when clicking outside
    detailModal.addEventListener('click', function (e) {
      if (e.target === detailModal) {
        detailModal.classList.add('hidden');
      }
    });

    // Handle actions
    const toggleApprovalBtn = detailModal.querySelector('.toggle-approval-btn');
    const editCommentBtn = detailModal.querySelector('.edit-comment-btn');
    const deleteCommentBtn = detailModal.querySelector('.delete-comment-btn');

    toggleApprovalBtn.addEventListener('click', function () {
      // Toggle approval status
      if (comment.approved) {
        // Unapprove
        db.ref(`comments/${comment.pageKey}/${comment.id}/approved`).set(false)
          .then(() => {
            showNotification('Comment unapproved successfully', 'success');
            detailModal.classList.add('hidden');
          })
          .catch(error => {
            showNotification('Failed to unapprove comment: ' + error.message, 'error');
          });
      } else {
        // Approve
        db.ref(`comments/${comment.pageKey}/${comment.id}/approved`).set(true)
          .then(() => {
            showNotification('Comment approved successfully', 'success');
            detailModal.classList.add('hidden');
          })
          .catch(error => {
            showNotification('Failed to approve comment: ' + error.message, 'error');
          });
      }
    });

    editCommentBtn.addEventListener('click', function () {
      // Close this modal first
      detailModal.classList.add('hidden');

      // Create a temporary event object to pass to the edit handler
      const tempEvent = {
        currentTarget: {
          closest: function () {
            return {
              getAttribute: function (attr) {
                if (attr === 'data-id') return comment.id;
                if (attr === 'data-page') return comment.pageKey;
                return null;
              }
            };
          }
        }
      };

      // Call the edit handler
      handleEditComment(tempEvent);
    });

    deleteCommentBtn.addEventListener('click', function () {
      // Close this modal first
      detailModal.classList.add('hidden');

      // Create a temporary event object to pass to the delete handler
      const tempEvent = {
        currentTarget: {
          closest: function () {
            return {
              getAttribute: function (attr) {
                if (attr === 'data-id') return comment.id;
                if (attr === 'data-page') return comment.pageKey;
                return null;
              }
            };
          }
        }
      };

      // Call the delete handler
      handleDeleteComment(tempEvent);
    });
  }
});

// Initialize all features
document.addEventListener('DOMContentLoaded', function () {
  // Initialize user management when page is loaded
  auth.onAuthStateChanged(function (user) {
    if (user) {
      setTimeout(setupUserManagement, 2500);
      setTimeout(setupBackupRestore, 3000);
    }
  });
});