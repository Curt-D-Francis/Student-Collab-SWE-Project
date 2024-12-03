import supabase from '../config/supabaseClient';

// Check if user is logged in
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching current user:', error.message);
    return null;
  }
  return data;
}
