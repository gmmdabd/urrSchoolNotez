// Authentication related functions

// Signup function
async function signUp(email, password, name, school, classInfo) {
    try {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    school,
                    class: classInfo
                }
            }
        });

        if (authError) throw authError;

        // Return success
        return { success: true, user: authData.user };
    } catch (error) {
        console.error('Error signing up:', error.message);
        return { success: false, error: error.message };
    }
}

// Login function
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Return success
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Error signing in:', error.message);
        return { success: false, error: error.message };
    }
}

// Logout function
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error.message);
        return { success: false, error: error.message };
    }
}

// Get current user profile
async function getUserProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return { success: false, error: 'No user logged in' };
        
        return { 
            success: true, 
            user: {
                id: user.id,
                email: user.email,
                name: user.user_metadata.name,
                school: user.user_metadata.school,
                class: user.user_metadata.class
            } 
        };
    } catch (error) {
        console.error('Error getting user profile:', error.message);
        return { success: false, error: error.message };
    }
}

// Render login form
function renderLoginForm() {
    const loginHTML = `
        <div class="navbar">
            <div class="logo"><i class="fas fa-book-open"></i> urSchoolNotez</div>
            <ul class="nav-links">
                <li><a href="#" id="home-link"><i class="fas fa-home"></i> <span class="nav-text">Home</span></a></li>
            </ul>
        </div>
        <div class="container">
            <div class="auth-container">
                <h2 class="auth-title"><i class="fas fa-sign-in-alt"></i> Login to Your Account</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="password"><i class="fas fa-lock"></i> Password</label>
                        <input type="password" id="password" class="form-control" placeholder="Enter your password" required>
                    </div>
                    <div id="login-error" class="text-danger hidden"></div>
                    <button type="submit" class="btn btn-block"><i class="fas fa-sign-in-alt"></i> Login</button>
                </form>
                <div class="auth-footer">
                    Don't have an account? <a href="#" id="goto-signup">Sign Up</a>
                </div>
            </div>
        </div>
    `;
    
    app.innerHTML = loginHTML;
    
    // Add event listeners
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(ROUTES.HOME);
    });
    
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        const loginResult = await signIn(email, password);
        
        if (loginResult.success) {
            navigateTo(ROUTES.DASHBOARD);
        } else {
            const errorElem = document.getElementById('login-error');
            errorElem.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${loginResult.error}`;
            errorElem.classList.remove('hidden');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    });
    
    document.getElementById('goto-signup').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(ROUTES.SIGNUP);
    });
}

// Render signup form
function renderSignupForm() {
    const signupHTML = `
        <div class="navbar">
            <div class="logo"><i class="fas fa-book-open"></i> urSchoolNotez</div>
            <ul class="nav-links">
                <li><a href="#" id="home-link"><i class="fas fa-home"></i> <span class="nav-text">Home</span></a></li>
            </ul>
        </div>
        <div class="container">
            <div class="auth-container">
                <h2 class="auth-title"><i class="fas fa-user-plus"></i> Create Your Account</h2>
                <form id="signup-form">
                    <div class="form-group">
                        <label for="name"><i class="fas fa-user"></i> Full Name</label>
                        <input type="text" id="name" class="form-control" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="school"><i class="fas fa-school"></i> School Name</label>
                        <input type="text" id="school" class="form-control" placeholder="Enter your school name" required>
                    </div>
                    <div class="form-group">
                        <label for="class"><i class="fas fa-graduation-cap"></i> Class (e.g., 10)</label>
                        <input type="text" id="class" class="form-control" placeholder="Enter your class number" required>
                    </div>
                    <div class="form-group">
                        <label for="email"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="password"><i class="fas fa-lock"></i> Password</label>
                        <input type="password" id="password" class="form-control" placeholder="Create a password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password"><i class="fas fa-lock"></i> Confirm Password</label>
                        <input type="password" id="confirm-password" class="form-control" placeholder="Confirm your password" required>
                    </div>
                    <div id="signup-error" class="text-danger hidden"></div>
                    <button type="submit" class="btn btn-block"><i class="fas fa-user-plus"></i> Sign Up</button>
                </form>
                <div class="auth-footer">
                    Already have an account? <a href="#" id="goto-login">Login</a>
                </div>
            </div>
        </div>
    `;
    
    app.innerHTML = signupHTML;
    
    // Add event listeners
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(ROUTES.HOME);
    });
    
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const school = document.getElementById('school').value;
        const classInfo = document.getElementById('class').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const submitBtn = document.querySelector('#signup-form button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        // Validate form
        if (password !== confirmPassword) {
            const errorElem = document.getElementById('signup-error');
            errorElem.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match';
            errorElem.classList.remove('hidden');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
            return;
        }
        
        const signupResult = await signUp(email, password, name, school, classInfo);
        
        if (signupResult.success) {
            navigateTo(ROUTES.DASHBOARD);
        } else {
            const errorElem = document.getElementById('signup-error');
            errorElem.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${signupResult.error}`;
            errorElem.classList.remove('hidden');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
        }
    });
    
    document.getElementById('goto-login').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(ROUTES.LOGIN);
    });
} 