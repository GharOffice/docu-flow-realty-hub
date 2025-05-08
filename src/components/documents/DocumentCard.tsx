
import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, FileSpreadsheet, FileImage, File, MoreVertical, Download, Trash, Share, Star, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    type: "pdf" | "doc" | "xls" | "img" | "other";
    status: "draft" | "pending" | "approved" | "rejected";
    updatedAt: string;
    owner: {
      name: string;
      initials: string;
    };
    favorited?: boolean;
  };
  onFavorite?: (id: string, favorited: boolean) => void;
  onDelete?: (id: string) => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-6 w-6" />;
    case "doc":
      return <FileText className="h-6 w-6" />;
    case "xls":
      return <FileSpreadsheet className="h-6 w-6" />;
    case "img":
      return <FileImage className="h-6 w-6" />;
    default:
      return <File className="h-6 w-6" />;
  }
};

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

const DocumentCard = ({ document, onFavorite, onDelete }: DocumentCardProps) => {
  const [favorited, setFavorited] = useState(document.favorited || false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleFavorite = () => {
    const newValue = !favorited;
    setFavorited(newValue);
    if (onFavorite) {
      onFavorite(document.id, newValue);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // First get the file path
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('file_path, title')
        .eq('id', document.id)
        .single();
      
      if (docError || !docData?.file_path) {
        throw new Error("Could not find document file");
      }
      
      // Download the file
      const { data, error } = await supabase.storage
        .from('documents')
        .download(docData.file_path);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${docData.title || 'document'}.${docData.file_path.split('.').pop()}`;
      window.document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
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
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      // Create a shareable link
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', document.id)
        .single();
      
      if (docError || !docData?.file_path) {
        throw new Error("Could not find document file");
      }
      
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(docData.file_path);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(data.publicUrl);
      
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/documents/${document.id}`}>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("file-icon", `file-icon-${document.type}`)}>
                {getFileIcon(document.type)}
              </div>
              <div>
                <h3 className="font-medium line-clamp-1">{document.title}</h3>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>Last updated {document.updatedAt}</span>
                  <span className="mx-1.5">•</span>
                  {getStatusBadge(document.status)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-border px-4 py-2 bg-muted/30">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{document.owner.initials}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{document.owner.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFavorite}
            className={cn(
              "h-8 w-8 p-0 flex items-center justify-center rounded-md transition-colors",
              favorited 
                ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Star className="h-4 w-4" fill={favorited ? "currentColor" : "none"} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/documents/${document.id}`;
              }}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownload();
              }}>
                <Download className="h-4 w-4 mr-2" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare();
              }}>
                <Share className="h-4 w-4 mr-2" /> Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onDelete) onDelete(document.id);
              }}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;
