
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface ApprovalAction {
  documentId: string;
  approvalId: string;
  comment?: string;
}

export const approveDocument = async ({ documentId, approvalId, comment = "Approved" }: ApprovalAction) => {
  try {
    const { data, error } = await supabase.rpc(
      'update_document_approval_status',
      { 
        doc_id: documentId, 
        approval_id: approvalId,
        new_status: 'approved',
        comment_text: comment
      }
    );
    
    if (error) throw error;
    
    toast({
      title: "Document approved",
      description: "The document has been successfully approved.",
    });
    
    return true;
  } catch (error) {
    console.error("Error approving document:", error);
    toast({
      title: "Approval failed",
      description: "There was a problem approving the document. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const rejectDocument = async ({ documentId, approvalId, comment }: ApprovalAction) => {
  if (!comment || comment.trim() === "") {
    toast({
      title: "Comment required",
      description: "Please provide a reason for rejecting the document.",
      variant: "destructive",
    });
    return false;
  }
  
  try {
    const { data, error } = await supabase.rpc(
      'update_document_approval_status',
      { 
        doc_id: documentId, 
        approval_id: approvalId,
        new_status: 'rejected',
        comment_text: comment
      }
    );
    
    if (error) throw error;
    
    toast({
      title: "Document rejected",
      description: "The document has been rejected.",
      variant: "destructive",
    });
    
    return true;
  } catch (error) {
    console.error("Error rejecting document:", error);
    toast({
      title: "Rejection failed",
      description: "There was a problem rejecting the document. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const toggleFavoriteDocument = async (documentId: string, favorited: boolean, userId: string) => {
  try {
    if (favorited) {
      // Add to favorites
      await supabase.from('activity_logs').insert([
        {
          action: 'favorite',
          document_id: documentId,
          user_id: userId,
          details: { favorited: true }
        }
      ]);
      
      toast({
        title: "Added to favorites",
        description: "Document has been added to your favorites.",
      });
    } else {
      // Remove from favorites
      await supabase
        .from('activity_logs')
        .delete()
        .eq('document_id', documentId)
        .eq('user_id', userId)
        .eq('action', 'favorite');
      
      toast({
        title: "Removed from favorites",
        description: "Document has been removed from your favorites.",
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Error ${favorited ? 'adding to' : 'removing from'} favorites:`, error);
    toast({
      title: "Operation failed",
      description: `Could not ${favorited ? 'add to' : 'remove from'} favorites. Please try again.`,
      variant: "destructive",
    });
    return false;
  }
};
