// Main application code

// Global state
let currentUser = null;
let currentRoute = ROUTES.HOME;
let currentClass = null;
let currentSection = null;

// Navigation function
function navigateTo(route, params = {}) {
    currentRoute = route;
    
    // Update URL (if using history API)
    // history.pushState(null, '', route);
    
    // Show loading state
    loading.classList.remove('hidden');
    app.innerHTML = '';
    
    // Route to the correct page
    switch (route) {
        case ROUTES.HOME:
            renderHomePage();
            break;
        case ROUTES.LOGIN:
            renderLoginForm();
            break;
        case ROUTES.SIGNUP:
            renderSignupForm();
            break;
        case ROUTES.DASHBOARD:
            renderDashboard();
            break;
        case ROUTES.SECTION:
            if (params.class && params.section) {
                currentClass = params.class;
                currentSection = params.section;
                renderSectionPage(params.class, params.section);
            } else {
                navigateTo(ROUTES.DASHBOARD);
            }
            break;
        case ROUTES.UPLOAD:
            renderUploadPage();
            break;
        case ROUTES.COMMUNITY:
            renderCommunityPage();
            break;
        default:
            renderHomePage();
    }
    
    // Hide loading state
    loading.classList.add('hidden');
}

// Render the home page (landing page)
function renderHomePage() {
    checkAuth().then(user => {
        if (user) {
            navigateTo(ROUTES.DASHBOARD);
            return;
        }
        
        const homeHTML = `
            <div class="navbar">
                <div class="logo"><i class="fas fa-book-open"></i> urSchoolNotez</div>
                <ul class="nav-links">
                    <li><a href="#" id="login-link"><i class="fas fa-sign-in-alt"></i> <span class="nav-text">Login</span></a></li>
                    <li><a href="#" id="signup-link"><i class="fas fa-user-plus"></i> <span class="nav-text">Sign Up</span></a></li>
                </ul>
            </div>
            <div class="container">
                <div class="hero-section">
                    <div class="hero-content">
                        <h1>The Leading<br><span>Enterprise Notes Platform</span></h1>
                        <p>Built on the language of learning</p>
                        <p>Share notes, find resources, and collaborate with classmates in a secure, enterprise-grade platform.</p>
                        <div class="hero-buttons">
                            <button class="btn" id="get-started"><i class="fas fa-rocket"></i> Get Started</button>
                            <button class="btn btn-outline" id="learn-more"><i class="fas fa-info-circle"></i> Learn More</button>
                        </div>
                    </div>
                    <div class="hero-image"></div>
                </div>
                
                <div class="trusted-by">
                    <p>Trusted by top schools</p>
                    <div class="trusted-logos">
                        <div><i class="fas fa-school"></i> City High School</div>
                        <div><i class="fas fa-university"></i> Central Academy</div>
                        <div><i class="fas fa-graduation-cap"></i> Westside College</div>
                        <div><i class="fas fa-book"></i> Northern Institute</div>
                        <div><i class="fas fa-landmark"></i> Tech Education Center</div>
                    </div>
                </div>
                
                <h2 class="section-header">Why Choose Our Platform?</h2>
                <div class="section-grid">
                    <div class="section-card">
                        <i class="fas fa-upload"></i>
                        <h3 class="section-title">Easy Sharing</h3>
                        <p>Share your notes with classmates in PDF, JPEG, or PNG formats</p>
                    </div>
                    <div class="section-card">
                        <i class="fas fa-search"></i>
                        <h3 class="section-title">Smart Search</h3>
                        <p>Find notes by title or date with our powerful search functionality</p>
                    </div>
                    <div class="section-card">
                        <i class="fas fa-users"></i>
                        <h3 class="section-title">Community</h3>
                        <p>Connect with your classmates through the community section</p>
                    </div>
                </div>
            </div>
        `;
        
        app.innerHTML = homeHTML;
        
        // Add event listeners
        document.getElementById('login-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.LOGIN);
        });
        
        document.getElementById('signup-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.SIGNUP);
        });
        
        document.getElementById('get-started').addEventListener('click', () => {
            navigateTo(ROUTES.SIGNUP);
        });
        
        document.getElementById('learn-more').addEventListener('click', () => {
            // Scroll to features section
            document.querySelector('.section-header').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Render the dashboard with class sections
function renderDashboard() {
    checkAuth().then(async user => {
        if (!user) {
            navigateTo(ROUTES.LOGIN);
            return;
        }
        
        currentUser = user;
        const userClass = user.user_metadata.class;
        
        const dashboardHTML = `
            <div class="navbar">
                <div class="logo"><i class="fas fa-book-open"></i> urSchoolNotez</div>
                <ul class="nav-links">
                    <li><a href="#" id="dashboard-link" class="active"><i class="fas fa-home"></i> <span class="nav-text">Dashboard</span></a></li>
                    <li><a href="#" id="community-link"><i class="fas fa-users"></i> <span class="nav-text">Community</span></a></li>
                    <li><a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> <span class="nav-text">Logout</span></a></li>
                </ul>
            </div>
            <div class="container dashboard">
                <div class="welcome-header">
                    <h1>Welcome, ${user.user_metadata.name}</h1>
                    <p><i class="fas fa-school"></i> School: ${user.user_metadata.school} | <i class="fas fa-graduation-cap"></i> Class: ${userClass}</p>
                </div>
                
                <h2 class="section-header">Select Your Section</h2>
                <div class="section-grid">
                    <div class="section-card" data-section="A">
                        <i class="fas fa-door-open"></i>
                        <h3 class="section-title">Section A</h3>
                        <p>Class ${userClass} Section A</p>
                    </div>
                    <div class="section-card" data-section="B">
                        <i class="fas fa-door-open"></i>
                        <h3 class="section-title">Section B</h3>
                        <p>Class ${userClass} Section B</p>
                    </div>
                    <div class="section-card" data-section="C">
                        <i class="fas fa-door-open"></i>
                        <h3 class="section-title">Section C</h3>
                        <p>Class ${userClass} Section C</p>
                    </div>
                    <div class="section-card" data-section="D">
                        <i class="fas fa-door-open"></i>
                        <h3 class="section-title">Section D</h3>
                        <p>Class ${userClass} Section D</p>
                    </div>
                    <div class="section-card" data-section="E">
                        <i class="fas fa-door-open"></i>
                        <h3 class="section-title">Section E</h3>
                        <p>Class ${userClass} Section E</p>
                    </div>
                    <div class="section-card" data-section="F">
                        <i class="fas fa-door-open"></i>
                        <h3 class="section-title">Section F</h3>
                        <p>Class ${userClass} Section F</p>
                    </div>
                </div>
            </div>
        `;
        
        app.innerHTML = dashboardHTML;
        
        // Add event listeners
        document.getElementById('dashboard-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.DASHBOARD);
        });
        
        document.getElementById('community-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.COMMUNITY);
        });
        
        document.getElementById('logout-link').addEventListener('click', async (e) => {
            e.preventDefault();
            await signOut();
            navigateTo(ROUTES.HOME);
        });
        
        // Add section card event listeners
        const sectionCards = document.querySelectorAll('.section-card');
        sectionCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                navigateTo(ROUTES.SECTION, { class: userClass, section: section });
            });
        });
    });
}

// Render the section page with notes and search functionality
async function renderSectionPage(classNum, section) {
    checkAuth().then(async user => {
        if (!user) {
            navigateTo(ROUTES.LOGIN);
            return;
        }
        
        // Fetch notes for this section from Supabase
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('class', classNum)
            .eq('section', section)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching notes:', error);
        }
        
        const isMobile = isMobileDevice();
        
        const sectionHTML = `
            <div class="navbar">
                <div class="logo"><i class="fas fa-book-open"></i> urSchoolNotez</div>
                <ul class="nav-links">
                    <li><a href="#" id="dashboard-link"><i class="fas fa-home"></i> <span class="nav-text">Dashboard</span></a></li>
                    <li><a href="#" id="community-link"><i class="fas fa-users"></i> <span class="nav-text">Community</span></a></li>
                    <li><a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> <span class="nav-text">Logout</span></a></li>
                </ul>
            </div>
            <div class="container">
                <div class="notes-header">
                    <h1><i class="fas fa-book"></i> Class ${classNum} - Section ${section} Notes</h1>
                    <button class="btn" id="upload-note"><i class="fas fa-upload"></i> <span class="nav-text">Upload New Note</span></button>
                </div>
                
                <div class="search-bar">
                    <input type="text" id="search-input" placeholder="Search notes by title...">
                    <input type="date" id="date-filter">
                    <div class="search-buttons" style="display: flex; gap: 10px; ${isMobile ? 'width: 100%;' : ''}">
                        <button class="btn" id="search-btn" style="${isMobile ? 'flex: 1;' : ''}"><i class="fas fa-search"></i> Search</button>
                        <button class="btn btn-outline" id="reset-search" style="${isMobile ? 'flex: 1;' : ''}"><i class="fas fa-redo"></i> Reset</button>
                    </div>
                </div>
                
                <div class="notes-grid" id="notes-container">
                    ${notes && notes.length > 0 ? notes.map(note => `
                        <div class="note-card">
                            <div class="note-header">
                                <h3><i class="fas fa-file-alt"></i> ${note.title}</h3>
                            </div>
                            <div class="note-body">
                                <p><i class="fas fa-user"></i> Uploaded by: ${note.author_name}</p>
                                <a href="${note.file_url}" target="_blank" class="btn"><i class="fas fa-eye"></i> View Note</a>
                            </div>
                            <div class="note-footer">
                                <span><i class="far fa-calendar-alt"></i> ${new Date(note.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `).join('') : '<div class="empty-state"><i class="fas fa-info-circle"></i><p>No notes found for this section. Be the first to upload!</p></div>'}
                </div>
            </div>
        `;
        
        app.innerHTML = sectionHTML;
        
        // Add event listeners
        document.getElementById('dashboard-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.DASHBOARD);
        });
        
        document.getElementById('community-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.COMMUNITY);
        });
        
        document.getElementById('logout-link').addEventListener('click', async (e) => {
            e.preventDefault();
            await signOut();
            navigateTo(ROUTES.HOME);
        });
        
        document.getElementById('upload-note').addEventListener('click', () => {
            navigateTo(ROUTES.UPLOAD);
        });
        
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const dateFilter = document.getElementById('date-filter');
        const searchBtn = document.getElementById('search-btn');
        const resetBtn = document.getElementById('reset-search');
        
        if (searchBtn && resetBtn && notes) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const dateValue = dateFilter.value;
                
                const notesContainer = document.getElementById('notes-container');
                
                // Filter notes
                const filteredNotes = notes.filter(note => {
                    const matchesSearch = note.title.toLowerCase().includes(searchTerm);
                    const matchesDate = !dateValue || new Date(note.created_at).toISOString().split('T')[0] === dateValue;
                    return matchesSearch && matchesDate;
                });
                
                // Update notes display
                notesContainer.innerHTML = filteredNotes.length > 0 
                    ? filteredNotes.map(note => `
                        <div class="note-card">
                            <div class="note-header">
                                <h3><i class="fas fa-file-alt"></i> ${note.title}</h3>
                            </div>
                            <div class="note-body">
                                <p><i class="fas fa-user"></i> Uploaded by: ${note.author_name}</p>
                                <a href="${note.file_url}" target="_blank" class="btn"><i class="fas fa-eye"></i> View Note</a>
                            </div>
                            <div class="note-footer">
                                <span><i class="far fa-calendar-alt"></i> ${new Date(note.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `).join('') 
                    : '<div class="empty-state"><i class="fas fa-search"></i><p>No notes found matching your search criteria.</p></div>';
                
                // Scroll to results on mobile
                if (isMobile) {
                    notesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            resetBtn.addEventListener('click', () => {
                searchInput.value = '';
                dateFilter.value = '';
                
                const notesContainer = document.getElementById('notes-container');
                notesContainer.innerHTML = notes.length > 0 
                    ? notes.map(note => `
                        <div class="note-card">
                            <div class="note-header">
                                <h3><i class="fas fa-file-alt"></i> ${note.title}</h3>
                            </div>
                            <div class="note-body">
                                <p><i class="fas fa-user"></i> Uploaded by: ${note.author_name}</p>
                                <a href="${note.file_url}" target="_blank" class="btn"><i class="fas fa-eye"></i> View Note</a>
                            </div>
                            <div class="note-footer">
                                <span><i class="far fa-calendar-alt"></i> ${new Date(note.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `).join('') 
                    : '<div class="empty-state"><i class="fas fa-info-circle"></i><p>No notes found for this section. Be the first to upload!</p></div>';
            });
        }
        
        // Add touch-friendly event listeners for mobile
        if (isMobile) {
            // Prevent double-tap zoom on buttons
            document.querySelectorAll('button, .btn, a').forEach(element => {
                element.addEventListener('touchend', (e) => {
                    if (element.tagName === 'A' && element.getAttribute('href') !== '#') {
                        return; // Allow normal behavior for links with real URLs
                    }
                    e.preventDefault();
                });
            });
            
            // Make date input easier to use on mobile
            const dateInput = document.getElementById('date-filter');
            if (dateInput) {
                dateInput.addEventListener('focus', function() {
                    this.blur(); // Prevent keyboard from showing
                    setTimeout(() => this.click(), 100); // Show date picker
                });
            }
        }
    });
}

// Render the upload page
function renderUploadPage() {
    checkAuth().then(async user => {
        if (!user) {
            navigateTo(ROUTES.LOGIN);
            return;
        }
        
        const isMobile = isMobileDevice();
        
        const uploadHTML = `
            <div class="navbar">
                <div class="logo"><i class="fas fa-book-open"></i> urSchoolNotez</div>
                <ul class="nav-links">
                    <li><a href="#" id="dashboard-link"><i class="fas fa-home"></i> <span class="nav-text">Dashboard</span></a></li>
                    <li><a href="#" id="community-link"><i class="fas fa-users"></i> <span class="nav-text">Community</span></a></li>
                    <li><a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> <span class="nav-text">Logout</span></a></li>
                </ul>
            </div>
            <div class="container">
                <div class="upload-container">
                    <h2 class="upload-title"><i class="fas fa-cloud-upload-alt"></i> Upload New Note</h2>
                    <form id="upload-form">
                        <div class="form-group">
                            <label for="note-title"><i class="fas fa-heading"></i> Note Title</label>
                            <input type="text" id="note-title" class="form-control" placeholder="Enter a descriptive title" required>
                        </div>
                        <div class="form-group">
                            <label for="author-name"><i class="fas fa-user"></i> Your Name</label>
                            <input type="text" id="author-name" class="form-control" value="${user.user_metadata.name}" required>
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-file-upload"></i> File</label>
                            <div class="file-drop-area" id="drop-area">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>${isMobile ? 'Tap to select a file' : 'Drag & drop file or click to browse'}</p>
                                <p>Supported formats: PDF, JPEG, PNG</p>
                                <input type="file" id="file-input" class="file-input" accept=".pdf,.jpg,.jpeg,.png" required>
                            </div>
                            <div id="file-name"></div>
                        </div>
                        <div id="upload-error" class="text-danger hidden"></div>
                        <div id="upload-success" class="text-success hidden"></div>
                        <button type="submit" class="btn btn-block"><i class="fas fa-upload"></i> Upload Note</button>
                    </form>
                </div>
            </div>
        `;
        
        app.innerHTML = uploadHTML;
        
        // Add event listeners
        document.getElementById('dashboard-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.DASHBOARD);
        });
        
        document.getElementById('community-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.COMMUNITY);
        });
        
        document.getElementById('logout-link').addEventListener('click', async (e) => {
            e.preventDefault();
            await signOut();
            navigateTo(ROUTES.HOME);
        });
        
        // File upload functionality
        const dropArea = document.getElementById('drop-area');
        const fileInput = document.getElementById('file-input');
        const fileName = document.getElementById('file-name');
        
        if (dropArea && fileInput) {
            // Show file name when selected
            fileInput.addEventListener('change', (e) => {
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    // Truncate filename if too long (for mobile)
                    const displayName = isMobile && file.name.length > 25 
                        ? file.name.substring(0, 22) + '...' 
                        : file.name;
                    
                    fileName.textContent = displayName;
                    dropArea.innerHTML = `<i class="fas fa-file-alt"></i><p>${displayName}</p>`;
                } else {
                    fileName.textContent = '';
                    dropArea.innerHTML = `
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>${isMobile ? 'Tap to select a file' : 'Drag & drop file or click to browse'}</p>
                        <p>Supported formats: PDF, JPEG, PNG</p>
                    `;
                }
            });
            
            // Click to select file
            dropArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // Only set up drag and drop for non-mobile
            if (!isMobile) {
                // Drag and drop
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }, false);
                });
                
                ['dragenter', 'dragover'].forEach(eventName => {
                    dropArea.addEventListener(eventName, () => {
                        dropArea.classList.add('highlight');
                    }, false);
                });
                
                ['dragleave', 'drop'].forEach(eventName => {
                    dropArea.addEventListener(eventName, () => {
                        dropArea.classList.remove('highlight');
                    }, false);
                });
                
                dropArea.addEventListener('drop', (e) => {
                    const dt = e.dataTransfer;
                    const files = dt.files;
                    
                    if (files.length > 0) {
                        fileInput.files = files;
                        const file = files[0];
                        fileName.textContent = file.name;
                        dropArea.innerHTML = `<i class="fas fa-file-alt"></i><p>${file.name}</p>`;
                    }
                }, false);
            }
        }
        
        // Form submission
        const uploadForm = document.getElementById('upload-form');
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const noteTitle = document.getElementById('note-title').value;
            const authorName = document.getElementById('author-name').value;
            const file = fileInput.files[0];
            const errorElem = document.getElementById('upload-error');
            const successElem = document.getElementById('upload-success');
            
            // Validate
            if (!file) {
                errorElem.textContent = 'Please select a file to upload';
                errorElem.classList.remove('hidden');
                successElem.classList.add('hidden');
                return;
            }
            
            // Check file size for mobile (limit to 10MB)
            if (isMobile && file.size > 10 * 1024 * 1024) {
                errorElem.innerHTML = '<i class="fas fa-exclamation-circle"></i> File size exceeds 10MB limit for mobile uploads';
                errorElem.classList.remove('hidden');
                successElem.classList.add('hidden');
                return;
            }
            
            // Clear previous messages
            errorElem.classList.add('hidden');
            successElem.classList.add('hidden');
            
            // Show loading state
            const submitBtn = uploadForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            
            try {
                // Upload file to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('notes')
                    .upload(filePath, file);
                
                if (uploadError) throw uploadError;
                
                // Get public URL for the file
                const { data: publicUrlData } = supabase.storage
                    .from('notes')
                    .getPublicUrl(filePath);
                
                const fileUrl = publicUrlData.publicUrl;
                
                // Save note metadata to database
                const { error: insertError } = await supabase
                    .from('notes')
                    .insert([
                        {
                            title: noteTitle,
                            author_id: user.id,
                            author_name: authorName,
                            class: user.user_metadata.class,
                            section: currentSection,
                            file_path: filePath,
                            file_url: fileUrl
                        }
                    ]);
                
                if (insertError) throw insertError;
                
                // Show success message
                successElem.innerHTML = '<i class="fas fa-check-circle"></i> Note uploaded successfully!';
                successElem.classList.remove('hidden');
                
                // Reset form
                uploadForm.reset();
                fileName.textContent = '';
                dropArea.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>${isMobile ? 'Tap to select a file' : 'Drag & drop file or click to browse'}</p>
                    <p>Supported formats: PDF, JPEG, PNG</p>
                `;
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Note';
                
                // Scroll to success message on mobile
                if (isMobile) {
                    successElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Redirect back to section page after a delay
                setTimeout(() => {
                    navigateTo(ROUTES.SECTION, { 
                        class: user.user_metadata.class, 
                        section: currentSection 
                    });
                }, 2000);
                
            } catch (error) {
                console.error('Error uploading note:', error);
                errorElem.innerHTML = `<i class="fas fa-exclamation-circle"></i> Error: ${error.message}`;
                errorElem.classList.remove('hidden');
                
                // Scroll to error message on mobile
                if (isMobile) {
                    errorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Note';
            }
        });
        
        // Add touch-friendly event listeners for mobile
        if (isMobile) {
            // Prevent double-tap zoom on buttons
            document.querySelectorAll('button, .btn, a').forEach(element => {
                element.addEventListener('touchend', (e) => {
                    if (element.tagName === 'A' && element.getAttribute('href') !== '#') {
                        return; // Allow normal behavior for links with real URLs
                    }
                    e.preventDefault();
                });
            });
        }
    });
}

// Add this function to detect mobile devices
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
}

// Modify the renderCommunityPage function to improve mobile interaction
function renderCommunityPage() {
    checkAuth().then(async user => {
        if (!user) {
            navigateTo(ROUTES.LOGIN);
            return;
        }
        
        // Fetch community posts from Supabase
        const { data: posts, error } = await supabase
            .from('community_posts')
            .select('*')
            .eq('class', user.user_metadata.class)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching community posts:', error);
        }
        
        // Fetch all replies for the posts
        const { data: allReplies, error: repliesError } = await supabase
            .from('post_replies')
            .select('*')
            .order('created_at', { ascending: true });
            
        if (repliesError) {
            console.error('Error fetching replies:', repliesError);
        }
        
        // Group replies by post_id
        const repliesByPost = {};
        if (allReplies) {
            allReplies.forEach(reply => {
                if (!repliesByPost[reply.post_id]) {
                    repliesByPost[reply.post_id] = [];
                }
                repliesByPost[reply.post_id].push(reply);
            });
        }
        
        const isMobile = isMobileDevice();
        
        const communityHTML = `
            <div class="navbar">
                <div class="logo"><i class="fas fa-book-open"></i> urSchoolNotez</div>
                <ul class="nav-links">
                    <li><a href="#" id="dashboard-link"><i class="fas fa-home"></i> <span class="nav-text">Dashboard</span></a></li>
                    <li><a href="#" id="community-link" class="active"><i class="fas fa-users"></i> <span class="nav-text">Community</span></a></li>
                    <li><a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> <span class="nav-text">Logout</span></a></li>
                </ul>
            </div>
            <div class="container">
                <div class="community-container">
                    <div class="welcome-header">
                        <h1><i class="fas fa-users"></i> Class ${user.user_metadata.class} Community</h1>
                        <p>Connect with your classmates and share information</p>
                    </div>
                    
                    <div class="post-form">
                        <h3><i class="fas fa-pen"></i> Create a New Post</h3>
                        <form id="post-form">
                            <div class="form-group">
                                <label for="post-content"><i class="fas fa-comment-alt"></i> Message</label>
                                <textarea id="post-content" class="form-control" rows="${isMobile ? '3' : '4'}" placeholder="Share something with your class..." required></textarea>
                            </div>
                            <button type="submit" class="btn"><i class="fas fa-paper-plane"></i> Post</button>
                        </form>
                    </div>
                    
                    <h3 class="section-header">Recent Posts</h3>
                    <div class="posts-container">
                        ${posts && posts.length > 0 ? posts.map(post => {
                            const postReplies = repliesByPost[post.id] || [];
                            return `
                                <div class="post" data-post-id="${post.id}">
                                    <div class="post-header">
                                        <strong><i class="fas fa-user-circle"></i> ${post.author_name}</strong>
                                        <span class="post-date"><i class="far fa-clock"></i> ${new Date(post.created_at).toLocaleString()}</span>
                                    </div>
                                    <div class="post-content">
                                        <p>${post.content}</p>
                                    </div>
                                    <button class="reply-toggle" data-post-id="${post.id}">
                                        <i class="fas fa-reply"></i> 
                                        ${postReplies.length > 0 ? 
                                            `Replies <span class="reply-count">${postReplies.length}</span>` : 
                                            'Reply'}
                                    </button>
                                    <div class="post-replies" id="replies-${post.id}" style="display: none;">
                                        ${postReplies.length > 0 ? 
                                            postReplies.map(reply => `
                                                <div class="reply">
                                                    <div class="reply-header">
                                                        <span class="reply-author"><i class="fas fa-user-circle"></i> ${reply.author_name}</span>
                                                        <span class="reply-date"><i class="far fa-clock"></i> ${new Date(reply.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <div class="reply-content">
                                                        <p>${reply.content}</p>
                                                    </div>
                                                </div>
                                            `).join('') : 
                                            '<p>No replies yet. Be the first to reply!</p>'
                                        }
                                        <div class="reply-form" id="reply-form-${post.id}">
                                            <form class="post-reply-form" data-post-id="${post.id}">
                                                <div class="form-group">
                                                    <textarea class="form-control reply-text" rows="${isMobile ? '2' : '3'}" placeholder="Write your reply..." required></textarea>
                                                </div>
                                                <button type="submit" class="btn"><i class="fas fa-paper-plane"></i> Submit Reply</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('') : '<div class="empty-state"><i class="fas fa-comments"></i><p>No community posts yet. Be the first to post!</p></div>'}
                    </div>
                </div>
            </div>
        `;
        
        app.innerHTML = communityHTML;
        
        // Add event listeners
        document.getElementById('dashboard-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.DASHBOARD);
        });
        
        document.getElementById('community-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(ROUTES.COMMUNITY);
        });
        
        document.getElementById('logout-link').addEventListener('click', async (e) => {
            e.preventDefault();
            await signOut();
            navigateTo(ROUTES.HOME);
        });
        
        // Post submission
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const content = document.getElementById('post-content').value;
                const submitBtn = postForm.querySelector('button[type="submit"]');
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
                
                try {
                    // Save post to database
                    const { error } = await supabase
                        .from('community_posts')
                        .insert([
                            {
                                author_id: user.id,
                                author_name: user.user_metadata.name,
                                class: user.user_metadata.class,
                                content
                            }
                        ]);
                    
                    if (error) throw error;
                    
                    // Refresh the page to show the new post
                    navigateTo(ROUTES.COMMUNITY);
                    
                } catch (error) {
                    console.error('Error creating post:', error);
                    alert(`Error: ${error.message}`);
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Post';
                }
            });
        }
        
        // Reply toggle buttons
        const replyToggleButtons = document.querySelectorAll('.reply-toggle');
        replyToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const postId = button.getAttribute('data-post-id');
                const repliesSection = document.getElementById(`replies-${postId}`);
                const replyForm = document.getElementById(`reply-form-${postId}`);
                
                // Toggle replies section
                if (repliesSection.style.display === 'none') {
                    // Close any other open reply sections first (mobile-friendly)
                    if (isMobile) {
                        document.querySelectorAll('.post-replies').forEach(section => {
                            if (section.id !== `replies-${postId}` && section.style.display !== 'none') {
                                section.style.display = 'none';
                                const otherPostId = section.id.replace('replies-', '');
                                const otherButton = document.querySelector(`.reply-toggle[data-post-id="${otherPostId}"]`);
                                const otherReplies = repliesByPost[otherPostId] || [];
                                if (otherButton) {
                                    otherButton.innerHTML = `<i class="fas fa-reply"></i> ${otherReplies.length > 0 ? 
                                        `Replies <span class="reply-count">${otherReplies.length}</span>` : 
                                        'Reply'}`;
                                }
                            }
                        });
                    }
                    
                    repliesSection.style.display = 'block';
                    replyForm.classList.add('active');
                    button.innerHTML = `<i class="fas fa-times"></i> Hide Replies`;
                    
                    // Scroll to the replies section (mobile-friendly)
                    if (isMobile) {
                        setTimeout(() => {
                            repliesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                } else {
                    repliesSection.style.display = 'none';
                    replyForm.classList.remove('active');
                    const postReplies = repliesByPost[postId] || [];
                    button.innerHTML = `<i class="fas fa-reply"></i> ${postReplies.length > 0 ? 
                        `Replies <span class="reply-count">${postReplies.length}</span>` : 
                        'Reply'}`;
                }
            });
        });
        
        // Reply form submission
        const replyForms = document.querySelectorAll('.post-reply-form');
        replyForms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const postId = form.getAttribute('data-post-id');
                const replyText = form.querySelector('.reply-text').value;
                const submitBtn = form.querySelector('button[type="submit"]');
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                try {
                    // Save reply to database
                    const { error } = await supabase
                        .from('post_replies')
                        .insert([
                            {
                                post_id: postId,
                                author_id: user.id,
                                author_name: user.user_metadata.name,
                                content: replyText
                            }
                        ]);
                    
                    if (error) throw error;
                    
                    // Refresh the page to show the new reply
                    navigateTo(ROUTES.COMMUNITY);
                    
                } catch (error) {
                    console.error('Error creating reply:', error);
                    alert(`Error: ${error.message}`);
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Reply';
                }
            });
        });
        
        // Add touch-friendly event listeners for mobile
        if (isMobile) {
            // Prevent double-tap zoom on buttons
            document.querySelectorAll('button, .btn, a').forEach(element => {
                element.addEventListener('touchend', (e) => {
                    e.preventDefault();
                });
            });
        }
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start the app with the home page
    navigateTo(ROUTES.HOME);
}); 