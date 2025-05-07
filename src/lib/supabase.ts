
import { createClient } from "@supabase/supabase-js";

// Get environment variables from import.meta.env (Vite) or process.env (Node)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  
  return data;
};

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });

  if (error) throw error;
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
};

// User functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  
  return data;
};

export const createUser = async (user: any) => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const updateUser = async (id: string, user: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Role functions
export const getRoles = async () => {
  const { data, error } = await supabase
    .from('roles')
    .select('*');
  
  if (error) throw error;
  
  return data;
};

export const createRole = async (role: any) => {
  const { data, error } = await supabase
    .from('roles')
    .insert([role])
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const updateRole = async (id: string, role: any) => {
  const { data, error } = await supabase
    .from('roles')
    .update(role)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const deleteRole = async (id: string) => {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Document Type functions
export const getDocumentTypes = async () => {
  const { data, error } = await supabase
    .from('document_types')
    .select('*');
  
  if (error) throw error;
  
  return data;
};

export const createDocumentType = async (documentType: any) => {
  const { data, error } = await supabase
    .from('document_types')
    .insert([documentType])
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const updateDocumentType = async (id: string, documentType: any) => {
  const { data, error } = await supabase
    .from('document_types')
    .update(documentType)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const deleteDocumentType = async (id: string) => {
  const { error } = await supabase
    .from('document_types')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
