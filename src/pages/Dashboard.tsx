
import { CheckSquare, FileText, Users, AlertCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PendingApprovals from "@/components/dashboard/PendingApprovals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your document approvals and activities
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Documents"
          value="256"
          description="Documents in system"
          icon={FileText}
          iconColor="text-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value="24"
          description="Awaiting review"
          icon={CheckSquare}
          iconColor="text-yellow-500"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Active Users"
          value="42"
          description="Using the platform"
          icon={Users}
          iconColor="text-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Overdue Items"
          value="7"
          description="Past due date"
          icon={AlertCircle}
          iconColor="text-red-500"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PendingApprovals />
        <RecentActivity />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-24 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span>Upload Document</span>
              </Button>
              <Button className="h-24 flex-col" variant="outline">
                <CheckSquare className="h-6 w-6 mb-2" />
                <span>Start Approval Flow</span>
              </Button>
              <Button className="h-24 flex-col" variant="outline">
                <Users className="h-6 w-6 mb-2" />
                <span>Invite Team Member</span>
              </Button>
              <Button className="h-24 flex-col" variant="outline">
                <AlertCircle className="h-6 w-6 mb-2" />
                <span>View Overdue Items</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="file-icon file-icon-pdf">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Purchase Agreement - 123 Main St</p>
                    <p className="text-xs text-muted-foreground">Updated 10 minutes ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="file-icon file-icon-doc">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lease Agreement - Dunder Office Space</p>
                    <p className="text-xs text-muted-foreground">Updated 1 hour ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="file-icon file-icon-pdf">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Property Evaluation - 742 Evergreen Terrace</p>
                    <p className="text-xs text-muted-foreground">Updated 3 hours ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="file-icon file-icon-xls">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Title Insurance - 789 Pine Street</p>
                    <p className="text-xs text-muted-foreground">Updated Yesterday</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
