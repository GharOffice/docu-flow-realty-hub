
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, UserPlus, Lock, FileText, Edit, Trash } from "lucide-react";

const Admin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
        <p className="text-muted-foreground">
          Manage users, roles, and system configuration
        </p>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="document-types" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Document Types
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Add, edit, and manage users in your organization
                </CardDescription>
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-8" />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">John Doe</TableCell>
                      <TableCell>john.doe@example.com</TableCell>
                      <TableCell>Administrator</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Sarah Johnson</TableCell>
                      <TableCell>sarah.johnson@example.com</TableCell>
                      <TableCell>Manager</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Michael Scott</TableCell>
                      <TableCell>michael.scott@example.com</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">David Wallace</TableCell>
                      <TableCell>david.wallace@example.com</TableCell>
                      <TableCell>Manager</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Pam Beesly</TableCell>
                      <TableCell>pam.beesly@example.com</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-yellow-300 text-yellow-600">Invited</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>
                  Configure roles and permissions
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Permission Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Administrator</TableCell>
                      <TableCell>Full system access and configuration</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        <Badge>System-wide</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Manager</TableCell>
                      <TableCell>Department oversight and approvals</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>
                        <Badge>Department</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Employee</TableCell>
                      <TableCell>Standard document access and submission</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>
                        <Badge>Limited</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Legal Reviewer</TableCell>
                      <TableCell>Legal document review and approval</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Badge>Specialized</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">External Collaborator</TableCell>
                      <TableCell>Limited access for external parties</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Badge>Restricted</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="document-types">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>
                  Configure document types and approval workflows
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Document Type
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Required Approvals</TableHead>
                      <TableHead>SLA (Days)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Purchase Agreement</TableCell>
                      <TableCell>Real estate purchase contracts</TableCell>
                      <TableCell>Manager, Legal, Executive</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Lease Agreement</TableCell>
                      <TableCell>Property rental documents</TableCell>
                      <TableCell>Manager, Legal</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Property Evaluation</TableCell>
                      <TableCell>Assessment and valuation reports</TableCell>
                      <TableCell>Manager</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Disclosure Statement</TableCell>
                      <TableCell>Property condition disclosures</TableCell>
                      <TableCell>Legal</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Financial Statement</TableCell>
                      <TableCell>Financial reports and projections</TableCell>
                      <TableCell>Manager, Executive</TableCell>
                      <TableCell>7</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
