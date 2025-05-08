
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DocumentViewer from "@/components/documents/DocumentViewer";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: document, isLoading, error, refetch } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!id) throw new Error("Document ID is required");
      
      // Fetch the document
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .select(`
          *,
          profiles:created_by(id, name, email),
          document_types:document_type_id(name, description, required_approvals)
        `)
        .eq('id', id)
        .single();
      
      if (documentError) throw documentError;
      if (!document) throw new Error("Document not found");
      
      // Fetch approvals for the document
      const { data: approvals, error: approvalsError } = await supabase
        .from('document_approvals')
        .select(`
          *,
          approver:approver_id(id, name, email)
        `)
        .eq('document_id', id)
        .order('order_sequence', { ascending: true });
      
      if (approvalsError) throw approvalsError;
      
      // Fetch comments/activity for the document
      const { data: activities, error: activitiesError } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:user_id(id, name, email)
        `)
        .eq('document_id', id)
        .eq('action', 'comment')
        .order('created_at', { ascending: false });
      
      if (activitiesError) throw activitiesError;
      
      // Fetch version history
      const { data: versions, error: versionsError } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:user_id(id, name, email)
        `)
        .eq('document_id', id)
        .or('action.eq.upload,action.eq.update')
        .order('created_at', { ascending: false });
      
      if (versionsError) throw versionsError;
      
      // Format the timestamps
      const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleString();
      };
      
      // Process comments
      const comments = activities?.map(activity => {
        let commentText = "";
        if (activity.details) {
          const details = typeof activity.details === 'string' 
            ? JSON.parse(activity.details) 
            : activity.details;
          commentText = details?.text || '';
        }
        
        return {
          id: activity.id,
          user: {
            id: activity.user?.id,
            name: activity.user?.name || 'Unknown User',
            initials: (activity.user?.name || 'Unknown User')
              .split(' ')
              .map(name => name[0])
              .join('')
              .toUpperCase()
              .substring(0, 2),
          },
          text: commentText,
          timestamp: formatTimestamp(activity.created_at),
          timeAgo: getTimeAgo(new Date(activity.created_at)),
        };
      }) || [];
      
      // Get file URL
      let fileUrl = '';
      if (document.file_path) {
        const { data } = supabase.storage
          .from('documents')
          .getPublicUrl(document.file_path);
        fileUrl = data.publicUrl;
      }
      
      return {
        id: document.id,
        title: document.title,
        type: document.document_types?.name || 'Unknown Type',
        fileType: document.file_type,
        fileUrl: fileUrl,
        status: document.status,
        uploadedBy: document.profiles?.name || 'Unknown User',
        createdAt: formatTimestamp(document.created_at),
        updatedAt: formatTimestamp(document.updated_at),
        description: document.description,
        metadata: document.metadata,
        comments: comments.length,
        versions: versions?.length || 0,
        commentsList: comments,
        versionHistory: versions?.map(version => ({
          id: version.id,
          user: {
            id: version.user?.id,
            name: version.user?.name || 'Unknown User',
          },
          action: version.action,
          timestamp: formatTimestamp(version.created_at),
          timeAgo: getTimeAgo(new Date(version.created_at)),
          details: version.details,
        })) || [],
        approvals: approvals?.map(approval => ({
          id: approval.id,
          sequence: approval.order_sequence,
          status: approval.status,
          approver: approval.approver ? {
            id: approval.approver.id,
            name: approval.approver.name,
          } : null,
          comments: approval.comments,
          approvedAt: approval.approved_at ? formatTimestamp(approval.approved_at) : null,
        })) || [],
      };
    },
  });
  
  // Helper function to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    
    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Error Loading Document</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "The document could not be loaded."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => refetch()}>Try Again</Button>
            <Button variant="outline" onClick={() => navigate('/documents')}>
              Back to Documents
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)]">
      <DocumentViewer document={document} />
    </div>
  );
};

export default DocumentView;
