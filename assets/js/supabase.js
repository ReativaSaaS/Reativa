// ===== SUPABASE CONFIGURATION =====
// Replace with your Supabase credentials
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

// Supabase client placeholder
// In production, load from: https://unpkg.com/@supabase/supabase-js@2
const supabase = {
  auth: {
    signUp: async ({ email, password }) => {
      console.log('[Supabase] Sign up:', email);
      // TODO: Implement with real Supabase client
      // return await supabaseClient.auth.signUp({ email, password });
      return { data: null, error: { message: 'Supabase not configured' } };
    },
    signInWithPassword: async ({ email, password }) => {
      console.log('[Supabase] Sign in:', email);
      // TODO: Implement with real Supabase client
      // return await supabaseClient.auth.signInWithPassword({ email, password });
      return { data: null, error: { message: 'Supabase not configured' } };
    },
    signOut: async () => {
      console.log('[Supabase] Sign out');
      // TODO: Implement with real Supabase client
      // return await supabaseClient.auth.signOut();
      return { error: null };
    },
    getSession: async () => {
      console.log('[Supabase] Get session');
      // TODO: Implement with real Supabase client
      // return await supabaseClient.auth.getSession();
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback) => {
      console.log('[Supabase] Auth state listener registered');
      // TODO: Implement with real Supabase client
      // return supabaseClient.auth.onAuthStateChange(callback);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

// ===== AUTH FUNCTIONS =====
async function register(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });

  if (error) throw error;
  return data;
}

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  localStorage.removeItem('reativa_session');
  window.location.href = '/';
}

async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ===== SESSION GUARD =====
async function requireAuth() {
  const session = await checkSession();
  if (!session) {
    window.location.href = '/pages/login.html';
    return null;
  }
  return session;
}

// ===== EXPORTS =====
window.ReativaAuth = {
  register,
  login,
  logout,
  checkSession,
  requireAuth
};
