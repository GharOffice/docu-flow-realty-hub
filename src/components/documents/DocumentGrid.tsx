import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DocumentCard from "./DocumentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, LayoutGrid, List, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Document {
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
}

const DocumentGrid = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Fix the type error in formatDocumentData function
  const formatDocumentData = (doc: any, favoritesMap: Record<string, boolean>): Document => {
    // Determine file type
    let type: "pdf" | "doc" | "xls" | "img" | "other" = "other";
    if (doc.file_type) {
      const fileType = doc.file_type.toLowerCase();
      if (fileType === 'pdf') type = "pdf";
      else if (fileType === 'docx' || fileType === 'doc') type = "doc";
      else if (fileType === 'xlsx' || fileType === 'xls') type = "xls";
      else if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') type = "img";
    }
    
    // Format the timestamp
    const updatedAt = new Date(doc.updated_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updatedAt.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let timeDisplay;
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        timeDisplay = `${diffMinutes} minutes ago`;
      } else {
        timeDisplay = `${diffHours} hours ago`;
      }
    } else if (diffDays === 1) {
      timeDisplay = "Yesterday";
    } else if (diffDays < 7) {
      timeDisplay = `${diffDays} days ago`;
    } else if (diffDays < 30) {
      timeDisplay = `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      timeDisplay = updatedAt.toLocaleDateString();
    }

    // Create owner display
    const ownerName = doc.profiles?.name || 'Unknown User';
    const initials = ownerName
      .split(' ')
      .map((name: string) => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    // Ensure status is one of the allowed types
    let status: "draft" | "pending" | "approved" | "rejected" = "draft";
    if (doc.status === "pending") status = "pending";
    else if (doc.status === "approved") status = "approved";
    else if (doc.status === "rejected") status = "rejected";

    return {
      id: doc.id,
      title: doc.title,
      type,
      status,
      updatedAt: timeDisplay,
      owner: {
        name: ownerName,
        initials,
      },
      favorited: !!favoritesMap[doc.id],
    };
  };

  // Fetch documents
  const { data: documents = [], isLoading, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      try {
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select(`
            *,
            profiles:created_by(name, email),
            document_types:document_type_id(name)
          `)
          .order('updated_at', { ascending: false });

        if (documentsError) throw documentsError;

        // Fetch favorites for the current user
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('activity_logs')
          .select('document_id, details')
          .eq('user_id', user?.id)
          .eq('action', 'favorite');

        if (favoritesError) throw favoritesError;

        // Create a map of favorited document IDs
        const favoritesMap: Record<string, boolean> = {};
        favoritesData?.forEach(item => {
          favoritesMap[item.document_id] = true;
        });

        setFavorites(favoritesMap);

        // Map documents to the expected format
        return documentsData?.map(doc => formatDocumentData(doc, favoritesMap)) || [];
      } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
      }
    },
  });

  const handleFavorite = async (id: string, favorited: boolean) => {
    try {
      if (favorited) {
        // Add to favorites
        await supabase.from('activity_logs').insert([
          {
            action: 'favorite',
            document_id: id,
            user_id: user?.id,
            details: { favorited: true }
          }
        ]);
      } else {
        // Remove from favorites
        await supabase
          .from('activity_logs')
          .delete()
          .eq('document_id', id)
          .eq('user_id', user?.id)
          .eq('action', 'favorite');
      }
      
      // Update local state
      setFavorites(prev => ({
        ...prev,
        [id]: favorited,
      }));
    } catch (error) {
      console.error(`Error ${favorited ? 'adding to' : 'removing from'} favorites:`, error);
      toast({
        title: "Error",
        description: `Could not ${favorited ? 'add to' : 'remove from'} favorites. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    try {
      // Get document to find file path
      const { data: document } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', id)
        .single();
      
      // Delete document record
      const { error: deleteDocError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (deleteDocError) throw deleteDocError;
      
      // Delete file from storage if file_path exists
      if (document?.file_path) {
        const { error: deleteFileError } = await supabase.storage
          .from('documents')
          .remove([document.file_path]);
        
        if (deleteFileError) console.error("Error deleting file:", deleteFileError);
      }
      
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
      
      // Refresh the document list
      refetch();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents
    .filter((doc) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "favorites") return doc.favorited;
      return doc.status === activeFilter;
    })
    .filter((doc) => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
  if (error) {
    return (
      <div className="p-12 text-center border border-dashed rounded-md">
        <p className="text-muted-foreground mb-4">Error loading documents</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-auto flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex overflow-x-auto pb-2 gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "favorites" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("favorites")}
        >
          Favorites
        </Button>
        <Button
          variant={activeFilter === "draft" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("draft")}
        >
          Drafts
        </Button>
        <Button
          variant={activeFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={activeFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("approved")}
        >
          Approved
        </Button>
        <Button
          variant={activeFilter === "rejected" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("rejected")}
        >
          Rejected
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onFavorite={handleFavorite}
              onDelete={() => handleDeleteDocument(doc.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">No documents found</p>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;
