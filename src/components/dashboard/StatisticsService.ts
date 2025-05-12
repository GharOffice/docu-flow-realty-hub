
import { supabase } from "@/lib/supabase";

export interface DashboardStats {
  totalDocumentsCount: number;
  pendingDocumentsCount: number;
  activeUsersCount: number;
  overdueItemsCount: number;
}

export const fetchDashboardStatistics = async (): Promise<DashboardStats> => {
  try {
    // Get total documents count
    const { count: totalCount, error: totalError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) throw totalError;
    
    // Get pending documents count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    if (pendingError) throw pendingError;
    
    // Get active users count
    const { count: activeUsersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) throw usersError;
    
    // Get overdue items count (assuming there's a due_date column)
    const { count: overdueCount, error: overdueError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .lt('metadata->due_date', new Date().toISOString())
      .neq('status', 'approved');
    
    if (overdueError) throw overdueError;
    
    return {
      totalDocumentsCount: totalCount || 0,
      pendingDocumentsCount: pendingCount || 0,
      activeUsersCount: activeUsersCount || 0,
      overdueItemsCount: overdueCount || 0
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    // Return default values in case of error
    return {
      totalDocumentsCount: 0,
      pendingDocumentsCount: 0,
      activeUsersCount: 0,
      overdueItemsCount: 0
    };
  }
};

export const fetchPendingApprovals = async (userId: string) => {
  try {
    // Get documents where the current user is in the approvers list and status is pending
    const { data, error } = await supabase
      .from('document_approvals')
      .select(`
        *,
        documents:document_id(
          id,
          title,
          status,
          created_at,
          updated_at,
          profiles:created_by(name)
        )
      `)
      .eq('approver_id', userId)
      .eq('status', 'pending');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    return [];
  }
};

export const approveDocument = async (documentId: string, approvalId: string, userId: string) => {
  try {
    // Update the document approval status
    const { error } = await supabase.rpc(
      'update_document_approval_status',
      { 
        doc_id: documentId, 
        approval_id: approvalId,
        new_status: 'approved',
        comment_text: 'Document approved'
      }
    );
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error approving document:", error);
    throw error;
  }
};

export const rejectDocument = async (documentId: string, approvalId: string, rejectionComment: string, userId: string) => {
  try {
    // Update the document approval status with rejection reason
    const { error } = await supabase.rpc(
      'update_document_approval_status',
      { 
        doc_id: documentId, 
        approval_id: approvalId,
        new_status: 'rejected',
        comment_text: rejectionComment
      }
    );
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error rejecting document:", error);
    throw error;
  }
};
