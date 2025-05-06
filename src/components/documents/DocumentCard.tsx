
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

const DocumentCard = ({ document, onFavorite }: DocumentCardProps) => {
  const [favorited, setFavorited] = useState(document.favorited || false);
  
  const handleFavorite = () => {
    const newValue = !favorited;
    setFavorited(newValue);
    if (onFavorite) {
      onFavorite(document.id, newValue);
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
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Download className="h-4 w-4 mr-2" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Share className="h-4 w-4 mr-2" /> Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
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
