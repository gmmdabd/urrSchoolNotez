// Supabase configuration
const SUPABASE_URL = 'https://lyiviofffopemsolinwz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aXZpb2ZmZm9wZW1zb2xpbnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTE5NTYsImV4cCI6MjA1NjY4Nzk1Nn0.jx_x7qo19wsuIbZB4HWkrJ_k35g7bfG7-0LTnB3gBgY';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Check if user is authenticated
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Page routes
const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    SECTION: '/section',
    UPLOAD: '/upload',
    COMMUNITY: '/community'
};

// Common DOM elements
const app = document.getElementById('app');
const loading = document.getElementById('loading'); 