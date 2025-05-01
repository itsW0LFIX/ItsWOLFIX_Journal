const firebaseConfig = {
  apiKey: "AIzaSyAJ_WWNirelpqQTDNSvxCVtb2HVf8FBKhs",
  authDomain: "itswolfix-journal-edab0.firebaseapp.com",
  databaseURL: "https://itswolfix-journal-edab0-default-rtdb.firebaseio.com",
  projectId: "itswolfix-journal-edab0",
  storageBucket: "itswolfix-journal-edab0.firebasestorage.app",
  messagingSenderId: "489900047560",
  appId: "1:489900047560:web:bbab08a8ce13867981f9fd"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Create database reference
const db = firebase.database();

// Utility functions
function getPageKey() {
  return window.location.pathname.replace(/\//g, '_').replace(/\./g, '_');
}

// Once DOM is loaded, initialize all functionality
document.addEventListener('DOMContentLoaded', function () {

  // Detect if we're on the admin page
  const isAdminPage = window.location.pathname.includes('admin');

  // Only run analytics on non-admin pages
  if (!isAdminPage) {
    initAnalytics();
  }

  // Initialize comments if we have a comment form on this page
  if (document.getElementById('comment-form')) {
    initComments();
  }

  // Initialize admin dashboard if we're on the admin page
  if (isAdminPage) {
    initAdminDashboard();
  }
});



// ===== ANALYTICS FUNCTIONALITY =====
// Track page view - Improved to ensure proper data recording
function initAnalytics() {
  // Get page information
  const pagePath = window.location.pathname;
  const pageTitle = document.title;
  const pageKey = getPageKey();

  // Generate or retrieve visitor ID
  let visitorId = localStorage.getItem('wolfix_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('wolfix_visitor_id', visitorId);
  }

  // Track page view - Fixed increment method
  const pageViewRef = db.ref('analytics/pageViews/' + pageKey);
  pageViewRef.once('value', function (snapshot) {
    const currentViews = snapshot.val() || 0;
    pageViewRef.set(currentViews + 1);
    console.log("Page view incremented for", pageKey, "to", currentViews + 1);
  });

  // Store page metadata
  db.ref('analytics/pageMeta/' + pageKey).set({
    title: pageTitle,
    path: pagePath
  });

  // Track visitor
  db.ref('analytics/visitors/' + visitorId + '/pages/' + pageKey).set({
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });

  // Track time on page
  const startTime = Date.now();
  let timeLogged = false;

  function logTimeSpent() {
    if (timeLogged) return;
    timeLogged = true;

    const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000)); // at least 1 second

    // Store time spent - Fixed update method
    const timeRef = db.ref('analytics/timeSpent/' + pageKey);
    timeRef.once('value', function (snapshot) {
      const current = snapshot.val() || { totalSeconds: 0, visits: 0 };

      timeRef.set({
        totalSeconds: current.totalSeconds + timeSpent,
        visits: current.visits + 1
      });

      console.log("Time spent updated for", pageKey, "added", timeSpent, "seconds");
    });

    // Store visitor's time
    db.ref('analytics/visitors/' + visitorId + '/timeSpent/' + pageKey).set(timeSpent);
  }

  // Log time when user leaves page
  window.addEventListener('beforeunload', logTimeSpent);
  window.addEventListener('pagehide', logTimeSpent);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      logTimeSpent();
    }
  });
}

// ===== COMMENTS FUNCTIONALITY =====
function initComments() {
  const commentForm = document.getElementById('comment-form');
  const commentsList = document.getElementById('comments-list');

  if (!commentForm) return;

  // Get current page path to use as key for comments
  const pageKey = getPageKey();

  // Handle comment submission
  commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const commentInput = document.getElementById('comment-input');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const comment = commentInput.value.trim();

    if (name && email && comment) {
      // Save comment to Firebase
      const commentsRef = db.ref('comments/' + pageKey);
      commentsRef.push({
        name: name,
        email: email,
        content: comment,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        approved: false
      }).then(() => {
        // Clear form
        nameInput.value = '';
        emailInput.value = '';
        commentInput.value = '';

        // Show confirmation
        const confirmation = document.createElement('div');
        confirmation.className = 'comment-confirmation';
        confirmation.textContent = 'Your comment has been submitted and is awaiting approval.';

        const formContainer = document.querySelector('.comment-form-container');
        formContainer.insertBefore(confirmation, commentForm);

        setTimeout(() => {
          confirmation.remove();
        }, 5000);
      });
    }
  });

  // Load approved comments
  if (commentsList) {
    const commentsRef = db.ref('comments/' + pageKey);
    commentsRef.on('value', snapshot => {
      const comments = snapshot.val();

      if (!comments) {
        commentsList.innerHTML = '<p class="no-comments">Be the first to comment!</p>';
        return;
      }

      let commentsHTML = '';
      let hasApprovedComments = false;

      // Convert to array and sort by timestamp
      const commentsArray = Object.entries(comments)
        .map(([id, comment]) => ({ id, ...comment }))
        .sort((a, b) => a.timestamp - b.timestamp);

      commentsArray.forEach(comment => {
        if (comment.approved) {
          hasApprovedComments = true;
          const date = new Date(comment.timestamp);
          const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

          commentsHTML += `
              <div class="comment">
                <div class="comment-author">${comment.name}</div>
                <div class="comment-date">${formattedDate}</div>
                <div class="comment-content">${comment.content.replace(/\n/g, '<br>')}</div>
              </div>
            `;
        }
      });

      if (hasApprovedComments) {
        commentsList.innerHTML = commentsHTML;
      } else {
        commentsList.innerHTML = '<p class="no-comments">Be the first to comment!</p>';
      }
    });
  }
}

// ===== ADMIN DASHBOARD FUNCTIONALITY =====
function initAdminDashboard() {
  const auth = firebase.auth();

  // DOM elements
  const loginSection = document.getElementById('login-section');
  const dashboard = document.getElementById('admin-dashboard');
  const adminNav = document.getElementById('admin-nav');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-button');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!loginSection || !dashboard) return;

  // Auth state change
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      loginSection.classList.add('hidden');
      dashboard.classList.remove('hidden');
      adminNav.classList.remove('hidden');

      // Load data
      loadComments();
      loadAnalytics();
    } else {
      // User is signed out
      loginSection.classList.remove('hidden');
      dashboard.classList.add('hidden');
      adminNav.classList.add('hidden');
    }
  });

  // Login form
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .catch(function (error) {
          alert('Login failed: ' + error.message);
        });
    });
  }

  // Logout
  if (logoutButton) {
    logoutButton.addEventListener('click', function (e) {
      e.preventDefault();
      auth.signOut();
    });
  }

  // Tab switching
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Show selected content
      const tabName = this.getAttribute('data-tab');
      tabContents.forEach(function (content) {
        if (content.id === tabName + '-tab') {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // Load comments for admin - Updated with toggle approve functionality
  function loadComments() {
    const commentsContainer = document.getElementById('admin-comments');
    if (!commentsContainer) return;

    const commentsRef = db.ref('comments');

    commentsRef.on('value', function (snapshot) {
      const comments = snapshot.val();

      if (!comments) {
        commentsContainer.innerHTML = '<p>No comments found.</p>';
        return;
      }

      let html = '';

      // Loop through pages
      Object.entries(comments).forEach(function ([pageKey, pageComments]) {
        const pagePath = pageKey.replace(/_/g, '/').replace(/\/html$/, '.html');

        html += `<div class="page-comments card">
                  <h3>Comments for: ${pagePath}</h3>`;

        // Loop through comments
        Object.entries(pageComments).forEach(function ([commentId, comment]) {
          const date = new Date(comment.timestamp);
          const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

          html += `
                    <div class="comment" data-id="${commentId}" data-page="${pageKey}">
                      <div class="comment-header">
                        <div>
                          <strong>${comment.name}</strong>
                          <span class="comment-meta">${comment.email}</span>
                        </div>
                        <div class="comment-meta">${formattedDate}</div>
                      </div>
                      <div class="comment-content">${comment.content.replace(/\n/g, '<br>')}</div>
                      <div class="comment-actions">
                        <button class="admin-button approve-button ${comment.approved ? 'approved' : ''}" data-approved="${comment.approved}">
                          ${comment.approved ? 'Unapprove' : 'Approve'}
                        </button>
                        <button class="admin-button delete-button">Delete</button>
                      </div>
                    </div>
                  `;
        });

        html += '</div>';
      });

      commentsContainer.innerHTML = html;

      // Set up approve and delete buttons
      setupCommentButtons();
      setupCommentFilters();
    });
  }

  // Set up approve and delete buttons - Updated with toggle functionality
  function setupCommentButtons() {
    // Approve/Unapprove buttons
    document.querySelectorAll('.approve-button').forEach(function (button) {
      button.addEventListener('click', function () {
        const comment = this.closest('.comment');
        const commentId = comment.getAttribute('data-id');
        const pageKey = comment.getAttribute('data-page');

        // Toggle approval status
        const isCurrentlyApproved = this.getAttribute('data-approved') === 'true';
        const newApprovalStatus = !isCurrentlyApproved;

        // Update approval status in database
        db.ref(`comments/${pageKey}/${commentId}/approved`).set(newApprovalStatus)
          .then(() => {
            // Update button
            this.setAttribute('data-approved', newApprovalStatus);

            if (newApprovalStatus) {
              this.textContent = 'Unapprove';
              this.classList.add('approved');
            } else {
              this.textContent = 'Approve';
              this.classList.remove('approved');
            }
          });
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-button').forEach(function (button) {
      button.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this comment?')) {
          const comment = this.closest('.comment');
          const commentId = comment.getAttribute('data-id');
          const pageKey = comment.getAttribute('data-page');

          // Delete the comment
          db.ref(`comments/${pageKey}/${commentId}`).remove()
            .then(() => {
              comment.remove();
            });
        }
      });
    });
  }

  // Load analytics data - Fixed to ensure all metrics work
  function loadAnalytics() {
    const totalPageviewsEl = document.getElementById('total-pageviews');
    const uniqueVisitorsEl = document.getElementById('unique-visitors');
    const avgTimeEl = document.getElementById('avg-time');
    const pagesTableBody = document.querySelector('#pages-table tbody');

    if (!totalPageviewsEl || !uniqueVisitorsEl || !avgTimeEl || !pagesTableBody) return;

    // Get analytics references
    const pageViewsRef = db.ref('analytics/pageViews');
    const visitorsRef = db.ref('analytics/visitors');
    const timeSpentRef = db.ref('analytics/timeSpent');
    const pageMetaRef = db.ref('analytics/pageMeta');

    // Total pageviews - fixed calculation
    pageViewsRef.on('value', function (snapshot) {
      const pageViews = snapshot.val() || {};
      let total = 0;

      // Sum all page views
      Object.values(pageViews).forEach(function (views) {
        total += Number(views) || 0;
      });

      // Update the display
      totalPageviewsEl.textContent = total;
      console.log("Total pageviews updated:", total);
    });

    // Unique visitors
    visitorsRef.on('value', function (snapshot) {
      const visitors = snapshot.val() || {};
      const count = Object.keys(visitors).length;

      uniqueVisitorsEl.textContent = count;
      console.log("Unique visitors updated:", count);
    });

    // Average time on site - fixed calculation
    timeSpentRef.on('value', function (snapshot) {
      const timeData = snapshot.val() || {};
      let totalSeconds = 0;
      let totalVisits = 0;

      // Calculate total time and visits
      Object.values(timeData).forEach(function (data) {
        if (data && typeof data === 'object') {
          totalSeconds += Number(data.totalSeconds) || 0;
          totalVisits += Number(data.visits) || 0;
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

      // Update the displays
      avgTimeEl.textContent = avgTimeText;

      // Update total time display if the element exists
      const totalTimeEl = document.getElementById('total-time');
      if (totalTimeEl) {
        totalTimeEl.textContent = totalTimeText;
      }

      console.log("Average time updated:", avgTimeText, "Total time:", totalTimeText, "Total seconds:", totalSeconds, "Total visits:", totalVisits);
    });

    // Pages table - fixed to ensure proper data loading
    function updatePagesTable() {
      // Get all data at once to ensure consistency
      Promise.all([
        new Promise(resolve => pageViewsRef.once('value', resolve)),
        new Promise(resolve => timeSpentRef.once('value', resolve)),
        new Promise(resolve => pageMetaRef.once('value', resolve))
      ]).then(function (results) {
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

          const meta = pageMeta[pageKey] || { title: pageKey.replace(/_/g, '/'), path: pageKey.replace(/_/g, '/') };
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
            path: meta.path || pageKey.replace(/_/g, '/'),
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
        console.log("Pages table updated with", pagesData.length, "pages");
      });
    }

    // Initial load
    updatePagesTable();

    // Set up event listeners for real-time updates
    pageViewsRef.on('child_changed', updatePagesTable);
    pageViewsRef.on('child_added', updatePagesTable);
    timeSpentRef.on('child_changed', updatePagesTable);
    timeSpentRef.on('child_added', updatePagesTable);
  }
}


// Add to initAdminDashboard function
function setupRealtimeMonitor() {
  const activeVisitorsEl = document.getElementById('active-visitors');
  const realtimePagesEl = document.getElementById('realtime-pages');

  if (!activeVisitorsEl || !realtimePagesEl) return;

  // Consider visitors "active" if they've loaded a page in the last 5 minutes
  const activeTimeframe = 5 * 60 * 1000; // 5 minutes in milliseconds

  setInterval(function () {
    db.ref('analytics/visitors').once('value', function (snapshot) {
      const visitors = snapshot.val() || {};
      const now = Date.now();
      const activeSessions = {};
      let totalActive = 0;

      // Process all visitors
      Object.entries(visitors).forEach(function ([visitorId, data]) {
        if (!data.pages) return;

        // Check each page the visitor has viewed
        Object.entries(data.pages).forEach(function ([pageKey, pageData]) {
          // Consider recent page loads as "active"
          if (now - pageData.timestamp < activeTimeframe) {
            // Add to active count for this page
            activeSessions[pageKey] = activeSessions[pageKey] || {
              count: 0,
              title: pageData.title || pageKey.replace(/_/g, '/')
            };

            activeSessions[pageKey].count++;
            totalActive = Object.keys(activeSessions).length > 0 ? 1 : 0;
          }
        });
      });

      // Update active visitors count
      activeVisitorsEl.textContent = totalActive;

      // Update list of pages with active visitors
      if (Object.keys(activeSessions).length === 0) {
        realtimePagesEl.innerHTML = '<p>No active visitors</p>';
        return;
      }

      // Sort by count
      const sortedPages = Object.entries(activeSessions)
        .sort((a, b) => b[1].count - a[1].count);

      let pagesHTML = '';

      sortedPages.forEach(function ([pageKey, data]) {
        pagesHTML += `
            <div class="realtime-page">
              <div class="page-title">${data.title}</div>
              <div class="page-visitors">${data.count} visitor${data.count !== 1 ? 's' : ''}</div>
            </div>
          `;
      });

      realtimePagesEl.innerHTML = pagesHTML;
    });
  }, 10000); // Update every 10 seconds
}

// Add to setupCommentButtons function
// Comment filtering functionality
function setupCommentFilters() {
  console.log("Setting up comment filters");
  const searchInput = document.getElementById('comment-search');
  const filterSelect = document.getElementById('comment-filter');

  if (!searchInput || !filterSelect) {
    console.log("Filter elements not found:", { searchInput, filterSelect });
    return;
  }

  function filterComments() {
    console.log("Filtering comments");
    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    console.log("Filter values:", { searchText, filterValue });

    // Find all comment containers
    const comments = document.querySelectorAll('.comment');
    console.log("Found", comments.length, "comments to filter");

    let visibleCount = 0;

    comments.forEach(function (comment) {
      // Get text content from comment
      const name = comment.querySelector('strong')?.textContent.toLowerCase() || '';
      const emailEl = comment.querySelector('.comment-meta');
      const email = emailEl ? emailEl.textContent.toLowerCase() : '';
      const contentEl = comment.querySelector('.comment-content');
      const content = contentEl ? contentEl.textContent.toLowerCase() : '';

      // Get approval status
      const approveButton = comment.querySelector('.approve-button');
      const isApproved = approveButton ?
        (approveButton.getAttribute('data-approved') === 'true' ||
          approveButton.classList.contains('approved')) : false;

      // Check if matches search
      const matchesSearch = !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        content.includes(searchText);

      // Check if matches approval filter
      let matchesFilter = true;
      if (filterValue === 'pending' && isApproved) matchesFilter = false;
      if (filterValue === 'approved' && !isApproved) matchesFilter = false;

      // Show or hide
      if (matchesSearch && matchesFilter) {
        comment.style.display = '';
        visibleCount++;
      } else {
        comment.style.display = 'none';
      }
    });

    console.log("After filtering:", visibleCount, "comments visible");
  }

  // Add event listeners
  searchInput.addEventListener('input', filterComments);
  filterSelect.addEventListener('change', filterComments);

  // Initial filtering
  filterComments();
}

