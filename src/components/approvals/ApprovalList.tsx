
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckSquare, X, ArrowRight, Search, AlertCircle, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Approval {
  id: string;
  documentName: string;
  documentId: string;
  documentType: string;
  submitter: string;
  receivedDate: string;
  dueDate: string;
  status: "pending" | "overdue";
  priority: "high" | "medium" | "low";
}

const approvals: Approval[] = [
  {
    id: "1",
    documentName: "Purchase Agreement - 123 Main St",
    documentId: "DOC-1234",
    documentType: "Contract",
    submitter: "Sarah Johnson",
    receivedDate: "May 4, 2025",
    dueDate: "May 6, 2025",
    status: "pending",
    priority: "high"
  },
  {
    id: "2",
    documentName: "Lease Agreement - Dunder Office Space",
    documentId: "DOC-5678",
    documentType: "Agreement",
    submitter: "Michael Scott",
    receivedDate: "May 3, 2025",
    dueDate: "May 5, 2025",
    status: "overdue",
    priority: "medium"
  },
  {
    id: "3",
    documentName: "Property Evaluation - 742 Evergreen Terrace",
    documentId: "DOC-9012",
    documentType: "Report",
    submitter: "David Wallace",
    receivedDate: "May 2, 2025",
    dueDate: "May 8, 2025",
    status: "pending",
    priority: "low"
  },
  {
    id: "4",
    documentName: "Title Insurance - 789 Pine Street",
    documentId: "DOC-3456",
    documentType: "Insurance",
    submitter: "Jim Halpert",
    receivedDate: "May 2, 2025",
    dueDate: "May 7, 2025",
    status: "pending",
    priority: "medium"
  },
  {
    id: "5",
    documentName: "Disclosure Statement - 456 Oak Avenue",
    documentId: "DOC-7890",
    documentType: "Disclosure",
    submitter: "Pam Beesly",
    receivedDate: "May 1, 2025",
    dueDate: "May 5, 2025",
    status: "overdue",
    priority: "high"
  },
  {
    id: "6",
    documentName: "Mortgage Application - 321 Willow Lane",
    documentId: "DOC-2345",
    documentType: "Application",
    submitter: "Stanley Hudson",
    receivedDate: "Apr 30, 2025",
    dueDate: "May 10, 2025",
    status: "pending",
    priority: "medium"
  },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-500">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-500">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-500">Low</Badge>;
    default:
      return null;
  }
};

const ApprovalList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "overdue">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  
  const filteredApprovals = approvals.filter((approval) => {
    // Filter by search query
    if (searchQuery && !approval.documentName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !approval.documentId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== "all" && approval.status !== statusFilter) {
      return false;
    }
    
    // Filter by priority
    if (priorityFilter !== "all" && approval.priority !== priorityFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-auto flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by document name or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as "all" | "pending" | "overdue")}
            >
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select
              value={priorityFilter}
              onValueChange={(value) => setPriorityFilter(value as "all" | "high" | "medium" | "low")}
            >
              <SelectTrigger className="w-[130px]">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Document</TableHead>
              <TableHead>Document ID</TableHead>
              <TableHead>Submitter</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApprovals.length > 0 ? (
              filteredApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      {approval.documentName}
                      <span className="text-xs text-muted-foreground">{approval.documentType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{approval.documentId}</TableCell>
                  <TableCell>{approval.submitter}</TableCell>
                  <TableCell>{approval.receivedDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {approval.status === "overdue" ? (
                        <div className="flex items-center text-red-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {approval.dueDate}
                        </div>
                      ) : (
                        approval.dueDate
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(approval.priority)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="bg-green-100 text-green-600 hover:bg-green-200"
                    >
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/documents/${approval.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No approval requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApprovalList;
