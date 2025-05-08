
import { useState } from "react";
import {
  FileText,
  Download,
  Share,
  History,
  MessageSquare,
  ArrowLeft,
  Loader2,
  Send,
  CheckSquare,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentComment {
  id: string;
  user: {
    id: string;
    name: string;
    initials: string;
  };
  text: string;
  timestamp: string;
  timeAgo: string;
}

interface VersionHistory {
  id: string;
  user: {
    id: string;
    name: string;
  };
  action: string;
  timestamp: string;
  timeAgo: string;
  details: any;
}

interface Approval {
  id: string;
  sequence: number;
  status: string;
  approver: {
    id: string;
    name: string;
  } | null;
  comments: string | null;
  approvedAt: string | null;
}

interface DocumentViewerProps {
  document: {
    id: string;
    title: string;
    type: string;
    fileType: string;
    fileUrl: string;
    status: string;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    comments: number;
    versions: number;
    commentsList: DocumentComment[];
    versionHistory: VersionHistory[];
    approvals: Approval[];
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "draft":
      return <Badge variant="outline" className="border-gray-300 text-gray-500">Draft</Badge>;
    case "pending":
      return <Badge variant="outline" className="border-yellow-300 text-yellow-600">Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="border-green-300 text-green-600">Approved</Badge>;
    case "rejected":
      return <Badge variant="outline" className="border-red-300 text-red-600">Rejected</Badge>;
    default:
      return null;
  }
};

const DocumentViewer = ({ document }: DocumentViewerProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("document");
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isProcessingApproval, setIsProcessingApproval] = useState<string | null>(null);
  
  const handleDownload = async () => {
    try {
      if (!document.fileUrl) {
        toast({
          title: "Download failed",
          description: "File not available for download",
          variant: "destructive",
        });
        return;
      }
      
      // Fetch the file and download it
      const response = await fetch(document.fileUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.title}.${document.fileType || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your document is being downloaded",
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download failed",
        description: "Unable to download the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (!document.fileUrl) {
        toast({
          title: "Share failed",
          description: "File not available for sharing",
          variant: "destructive",
        });
        return;
      }
      
      // Copy URL to clipboard
      await navigator.clipboard.writeText(document.fileUrl);
      
      toast({
        title: "Link copied",
        description: "Document link has been copied to clipboard",
      });
    } catch (error) {
      console.error("Error sharing document:", error);
      toast({
        title: "Share failed",
        description: "Unable to create a shareable link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setIsSubmittingComment(true);
      
      // Call the add_document_comment function
      const { data, error } = await supabase.rpc(
        'add_document_comment',
        { 
          doc_id: document.id, 
          comment_text: newComment.trim() 
        }
      );
      
      if (error) throw error;
      
      // Clear the comment field and refresh the document data
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['document', document.id] });
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
      
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Comment failed",
        description: "Unable to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const handleApprovalAction = async (approvalId: string, action: 'approved' | 'rejected') => {
    try {
      setIsProcessingApproval(approvalId);
      
      // Call the update_document_approval_status function
      const { data, error } = await supabase.rpc(
        'update_document_approval_status',
        { 
          doc_id: document.id, 
          approval_id: approvalId,
          new_status: action,
          comment_text: `Document ${action} by ${user?.email}`
        }
      );
      
      if (error) throw error;
      
      // Refresh the document data
      queryClient.invalidateQueries({ queryKey: ['document', document.id] });
      
      toast({
        title: `Document ${action}`,
        description: `You have successfully ${action} this document`,
        variant: action === 'approved' ? 'default' : 'destructive',
      });
      
    } catch (error) {
      console.error(`Error ${action} document:`, error);
      toast({
        title: "Action failed",
        description: `Unable to ${action} the document. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessingApproval(null);
    }
  };

  const renderDocumentPreview = () => {
    if (!document.fileUrl) {
      return (
        <div className="text-center p-8">
          <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">No Preview Available</h3>
          <p className="text-sm text-muted-foreground mt-2">
            This document doesn't have an associated file
          </p>
        </div>
      );
    }
    
    // Check if it's a PDF
    if (document.fileType?.toLowerCase() === 'pdf') {
      return (
        <iframe
          src={`${document.fileUrl}#toolbar=0`}
          className="w-full h-full"
          title={document.title}
        />
      );
    }
    
    // Check if it's an image
    if (['jpg', 'jpeg', 'png', 'gif'].includes(document.fileType?.toLowerCase() || '')) {
      return (
        <div className="flex items-center justify-center h-full">
          <img 
            src={document.fileUrl} 
            alt={document.title} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }
    
    // For other file types
    return (
      <div className="text-center p-8">
        <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Preview Not Available</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This file type ({document.fileType}) cannot be previewed
        </p>
        <Button onClick={handleDownload} className="mt-4">
          <Download size={16} className="mr-2" /> Download to View
        </Button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link to="/documents">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              {document.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{document.type}</span>
              <span>•</span>
              {getStatusBadge(document.status)}
              <span>•</span>
              <span>Updated {document.updatedAt}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download size={16} className="mr-1" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share size={16} className="mr-1" /> Share
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              setActiveTab("comments");
              setTimeout(() => document.getElementById("comment-input")?.focus(), 100);
            }}
          >
            <MessageSquare size={16} className="mr-1" /> Comment
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col"
      >
        <div className="px-4 border-b">
          <TabsList>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({document.commentsList.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({document.versionHistory.length})
            </TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="document" className="flex-1 p-0 m-0">
          <div className="h-full flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl aspect-[3/4] flex items-center justify-center border">
              {renderDocumentPreview()}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="p-4 flex flex-col h-full">
          <div className="flex flex-col gap-4 flex-1 overflow-auto">
            {document.commentsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-20" />
                <p>No comments yet</p>
              </div>
            ) : (
              document.commentsList.map((comment) => (
                <div key={comment.id} className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {comment.user.initials}
                    </div>
                    <div>
                      <p className="font-medium">{comment.user.name}</p>
                      <p className="text-xs text-muted-foreground">{comment.timeAgo}</p>
                    </div>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 border-t pt-4">
            <div className="flex gap-2">
              <Textarea
                id="comment-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <Button 
                className="self-end"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="p-4">
          <div className="flex flex-col gap-4">
            {document.versionHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="mx-auto h-12 w-12 mb-2 opacity-20" />
                <p>No version history available</p>
              </div>
            ) : (
              document.versionHistory.map((version, index) => (
                <div key={version.id} className={`flex items-start gap-4 ${index > 0 ? 'border-t pt-4' : ''}`}>
                  <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                    <History size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        Version {document.versionHistory.length - index}
                        {index === 0 && <span className="ml-2"><Badge>Latest</Badge></span>}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {version.action === 'upload' ? 'Created' : 'Updated'} by {version.user.name} • {version.timeAgo}
                    </p>
                    {version.details?.description && (
                      <p className="text-sm mt-1">{version.details.description}</p>
                    )}
                    <div className="mt-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setActiveTab("document");
                      }}>
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="approvals" className="p-4">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Current Approval Flow</h3>
              <div className="space-y-2">
                {document.approvals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border rounded-md">
                    <p>No approval workflow set for this document</p>
                  </div>
                ) : (
                  document.approvals.map((approval, index) => {
                    const isCurrentUser = user?.id === approval.approver?.id;
                    const isPendingAndCurrentUser = isCurrentUser && approval.status === 'pending';
                    const canApprove = document.status !== 'rejected' && isPendingAndCurrentUser;
                    
                    // Find the previous approval in the sequence
                    const previousApproval = document.approvals.find(a => a.sequence === approval.sequence - 1);
                    const isPreviousApproved = !previousApproval || previousApproval.status === 'approved';
                    const isAvailableForApproval = isPreviousApproved && approval.status === 'pending';
                    
                    return (
                      <div key={approval.id} className="flex items-center gap-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          approval.status === 'approved' ? 'bg-green-100 text-green-600' :
                          approval.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          isAvailableForApproval ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {approval.approver ? approval.approver.name : "Unassigned"}
                            {isCurrentUser && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {approval.status === 'approved' ? `Approved on ${approval.approvedAt}` :
                             approval.status === 'rejected' ? `Rejected on ${approval.approvedAt}` :
                             isAvailableForApproval ? 'Waiting for approval' :
                             'Waiting for previous steps'}
                          </p>
                          {approval.comments && (
                            <p className="text-xs italic mt-1">{approval.comments}</p>
                          )}
                        </div>
                        {approval.status === 'approved' ? (
                          <Badge className="bg-green-500">Approved</Badge>
                        ) : approval.status === 'rejected' ? (
                          <Badge className="bg-red-500">Rejected</Badge>
                        ) : isAvailableForApproval ? (
                          <Badge variant="outline" className="border-yellow-300 text-yellow-600">In Progress</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-300 text-gray-500">Pending</Badge>
                        )}
                        
                        {canApprove && isAvailableForApproval && (
                          <div className="flex gap-2 ml-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleApprovalAction(approval.id, 'rejected')}
                              disabled={!!isProcessingApproval}
                            >
                              {isProcessingApproval === approval.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </>
                              )}
                            </Button>
                            <Button 
                              size="sm"
                              className="h-8 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprovalAction(approval.id, 'approved')}
                              disabled={!!isProcessingApproval}
                            >
                              {isProcessingApproval === approval.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckSquare className="h-4 w-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" disabled={document.status === 'rejected'}>
                  Reassign Current Step
                </Button>
                <Button variant="outline" size="sm" disabled={document.status === 'rejected'}>
                  Skip Current Step
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                  disabled={document.status === 'rejected' || document.status === 'approved'}
                >
                  Cancel Workflow
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentViewer;
