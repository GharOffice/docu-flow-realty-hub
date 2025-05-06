
import {
  FileText,
  Download,
  Share,
  History,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface DocumentViewerProps {
  document: {
    id: string;
    title: string;
    type: string;
    status: string;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    comments: number;
    versions: number;
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
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-1" /> Download
          </Button>
          <Button variant="outline" size="sm">
            <Share size={16} className="mr-1" /> Share
          </Button>
          <Button size="sm">
            <MessageSquare size={16} className="mr-1" /> Comment
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="document" className="flex-1 flex flex-col">
        <div className="px-4 border-b">
          <TabsList>
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({document.comments})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({document.versions})
            </TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="document" className="flex-1 p-0 m-0">
          <div className="h-full flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl aspect-[3/4] flex items-center justify-center border">
              <div className="text-center p-8">
                <FileText size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">Document Preview</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  PDF previewing would be implemented here with a PDF viewer component
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="p-4">
          <div className="flex flex-col gap-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  MS
                </div>
                <div>
                  <p className="font-medium">Michael Scott</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm">
                Please review section 3.2 of the contract. I think we need to adjust the terms.
              </p>
            </div>
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  DW
                </div>
                <div>
                  <p className="font-medium">David Wallace</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <p className="text-sm">
                Looks good overall, but we should double check the payment schedule with the client.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                <History size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Version 3 (Current)</p>
                  <Badge>Latest</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Updated by Sarah Johnson • Today at 10:30 AM</p>
                <p className="text-sm mt-1">Fixed terms in section 5 and updated payment schedule</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 border-t pt-4">
              <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                <History size={16} />
              </div>
              <div>
                <p className="font-medium">Version 2</p>
                <p className="text-sm text-muted-foreground">Updated by Michael Scott • Yesterday at 2:15 PM</p>
                <p className="text-sm mt-1">Added additional clauses requested by legal</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 border-t pt-4">
              <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                <History size={16} />
              </div>
              <div>
                <p className="font-medium">Version 1</p>
                <p className="text-sm text-muted-foreground">Created by Jim Halpert • May 1, 2025</p>
                <p className="text-sm mt-1">Initial draft</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="approvals" className="p-4">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Current Approval Flow</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Department Manager</p>
                    <p className="text-xs text-muted-foreground">
                      Michael Scott • Approved on May 3, 2025
                    </p>
                  </div>
                  <Badge className="bg-green-500">Approved</Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Legal Review</p>
                    <p className="text-xs text-muted-foreground">
                      Pending approval from David Wallace
                    </p>
                  </div>
                  <Badge variant="outline" className="border-yellow-300 text-yellow-600">In Progress</Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Executive Approval</p>
                    <p className="text-xs text-muted-foreground">
                      Waiting for previous steps
                    </p>
                  </div>
                  <Badge variant="outline" className="border-gray-300 text-gray-500">Pending</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Reassign Current Step
                </Button>
                <Button variant="outline" size="sm">
                  Skip Current Step
                </Button>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
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
