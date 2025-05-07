
import { supabase as supabaseClient } from "@/integrations/supabase/client";

// Re-export the supabase client to maintain backward compatibility
export const supabase = supabaseClient;

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
    .from('profiles')
    .select('*');
  
  if (error) throw error;
  
  return data;
};

export const createUser = async (user: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([user])
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const updateUser = async (id: string, user: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(user)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  
  return data[0];
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('profiles')
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
