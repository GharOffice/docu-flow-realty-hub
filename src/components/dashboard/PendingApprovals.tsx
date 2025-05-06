
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckSquare, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApprovalItem {
  id: string;
  title: string;
  documentType: string;
  priority: "low" | "medium" | "high";
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  status: "pending" | "overdue";
}

const approvals: ApprovalItem[] = [
  {
    id: "1",
    title: "Purchase Agreement - 123 Main St",
    documentType: "Contract",
    priority: "high",
    submittedBy: "Sarah Johnson",
    submittedDate: "May 4, 2025",
    dueDate: "May 6, 2025",
    status: "pending",
  },
  {
    id: "2",
    title: "Lease Agreement - Dunder Office Space",
    documentType: "Agreement",
    priority: "medium",
    submittedBy: "Michael Scott",
    submittedDate: "May 3, 2025",
    dueDate: "May 5, 2025",
    status: "overdue",
  },
  {
    id: "3",
    title: "Property Evaluation - 742 Evergreen Terrace",
    documentType: "Report",
    priority: "low",
    submittedBy: "David Wallace",
    submittedDate: "May 2, 2025",
    dueDate: "May 8, 2025",
    status: "pending",
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

const PendingApprovals = () => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Documents awaiting your approval</CardDescription>
        </div>
        <Link to="/approvals">
          <Button variant="outline">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              className="flex flex-col space-y-3 p-4 border border-border rounded-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="file-icon file-icon-pdf">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">{approval.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {approval.documentType} • Submitted by {approval.submittedBy} on {approval.submittedDate}
                    </p>
                  </div>
                </div>
                {getPriorityBadge(approval.priority)}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {approval.status === "overdue" ? (
                    <div className="flex items-center text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>Due {approval.dueDate} (Overdue)</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Due {approval.dueDate}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    size="sm"
                    className="h-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
