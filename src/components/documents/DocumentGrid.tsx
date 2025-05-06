
import { useState } from "react";
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
import { Search, Plus, LayoutGrid, List, Upload } from "lucide-react";

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

// Sample data
const documents: Document[] = [
  {
    id: "1",
    title: "Purchase Agreement - 123 Main St",
    type: "pdf",
    status: "pending",
    updatedAt: "3 hours ago",
    owner: { name: "Sarah Johnson", initials: "SJ" },
    favorited: true,
  },
  {
    id: "2",
    title: "Lease Agreement - Dunder Office Space",
    type: "doc",
    status: "approved",
    updatedAt: "Yesterday",
    owner: { name: "Michael Scott", initials: "MS" },
  },
  {
    id: "3",
    title: "Property Evaluation - 742 Evergreen Terrace",
    type: "pdf",
    status: "rejected",
    updatedAt: "2 days ago",
    owner: { name: "David Wallace", initials: "DW" },
  },
  {
    id: "4",
    title: "Title Insurance - 789 Pine Street",
    type: "pdf",
    status: "approved",
    updatedAt: "1 week ago",
    owner: { name: "Jim Halpert", initials: "JH" },
  },
  {
    id: "5",
    title: "Inspection Report - 1313 Mockingbird Lane",
    type: "doc",
    status: "approved",
    updatedAt: "2 weeks ago",
    owner: { name: "Pam Beesly", initials: "PB" },
  },
  {
    id: "6",
    title: "Financial Statement - Q1 2025",
    type: "xls",
    status: "draft",
    updatedAt: "3 weeks ago",
    owner: { name: "Oscar Martinez", initials: "OM" },
    favorited: true,
  },
  {
    id: "7",
    title: "Property Photos - 221B Baker St",
    type: "img",
    status: "approved",
    updatedAt: "1 month ago",
    owner: { name: "Angela Martin", initials: "AM" },
  },
  {
    id: "8",
    title: "Market Analysis - Downtown Area",
    type: "pdf",
    status: "draft",
    updatedAt: "1 month ago",
    owner: { name: "Dwight Schrute", initials: "DS" },
  },
];

const DocumentGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFavorite = (id: string, favorited: boolean) => {
    console.log(`Document ${id} ${favorited ? 'favorited' : 'unfavorited'}`);
    // In a real app, update the document in the state/database
  };

  const filteredDocuments = documents.filter((doc) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "favorites") return doc.favorited;
    return doc.status === activeFilter;
  }).filter((doc) => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          
          <Button className="gap-1">
            <Upload size={16} className="mr-1" />
            Upload
          </Button>
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
      
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
        {filteredDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
      
      {filteredDocuments.length === 0 && (
        <div className="p-12 text-center border border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">No documents found</p>
          <Button>
            <Plus size={16} className="mr-1" />
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentGrid;
