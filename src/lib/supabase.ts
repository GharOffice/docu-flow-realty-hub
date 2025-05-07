
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
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (user: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([user])
    .select();
  
  if (error) throw error;
  
  return data?.[0];
};

export const updateUser = async (id: string, user: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(user)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  
  return data?.[0];
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
  try {
    // First try to get roles directly
    const { data, error } = await supabase
      .from('roles')
      .select('*');
    
    if (error) {
      console.error("Error fetching roles:", error);
      // Fallback to a predefined list of basic roles if the query fails
      return [
        { id: "1", name: "Admin", description: "Administrator with all permissions" },
        { id: "2", name: "User", description: "Standard user with basic permissions" }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getRoles:", error);
    // Return fallback roles on any error
    return [
      { id: "1", name: "Admin", description: "Administrator with all permissions" },
      { id: "2", name: "User", description: "Standard user with basic permissions" }
    ];
  }
};

export const createRole = async (role: any) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .insert([role])
      .select();
    
    if (error) throw error;
    
    return data?.[0];
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

export const updateRole = async (id: string, role: any) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .update(role)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return data?.[0];
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

// Document Type functions
export const getDocumentTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('document_types')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching document types:", error);
    throw error;
  }
};

export const createDocumentType = async (documentType: any) => {
  const { data, error } = await supabase
    .from('document_types')
    .insert([documentType])
    .select();
  
  if (error) throw error;
  
  return data?.[0];
};

export const updateDocumentType = async (id: string, documentType: any) => {
  const { data, error } = await supabase
    .from('document_types')
    .update(documentType)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  
  return data?.[0];
};

export const deleteDocumentType = async (id: string) => {
  const { error } = await supabase
    .from('document_types')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
