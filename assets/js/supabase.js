// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = "https://rakskzfzmxloqiziwetu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJha3NremZ6bXhsb3Fpeml3ZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDA4OTQsImV4cCI6MjA5NDUxNjg5NH0.jEzeEnRxTIjcUq6RFXaAjhXVfbB8bhd6lvPHojhGeRw";

// Initialize real Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== AUTH FUNCTIONS =====
async function register(email, password, name) {
  console.log('[Reativa] Tentando registrar:', email);
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });

  console.log('[Reativa] Resposta cadastro:', { data, error });
  if (error) throw error;

  // Try to create profile manually if trigger fails
  if (data.user) {
    try {
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          full_name: name
        });
      console.log('[Reativa] Profile creation:', { profileError });
    } catch (e) {
      console.warn('[Reativa] Profile might already exist from trigger');
    }
  }

  return data;
}

async function login(email, password) {
  console.log('[Reativa] Tentando logar:', email);
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  console.log('[Reativa] Resposta login:', { data, error });
  if (error) throw error;
  return data;
}

async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
}

async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
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
