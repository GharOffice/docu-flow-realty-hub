
import { useState, useEffect } from "react";
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
import UserForm from "@/components/admin/UserForm";
import RoleForm from "@/components/admin/RoleForm";
import DocumentTypeForm from "@/components/admin/DocumentTypeForm";
import { useToast } from "@/hooks/use-toast";
import * as supabaseService from "@/lib/supabase";

const Admin = () => {
  // State
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [isDocTypeFormOpen, setIsDocTypeFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedDocType, setSelectedDocType] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case "users":
            const userData = await supabaseService.getUsers();
            setUsers(userData);
            break;
          case "roles":
            const rolesData = await supabaseService.getRoles();
            setRoles(rolesData);
            break;
          case "document-types":
            const docTypesData = await supabaseService.getDocumentTypes();
            setDocumentTypes(docTypesData);
            break;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, toast]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // User form handlers
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await supabaseService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUserFormSubmit = async (data: any) => {
    try {
      if (selectedUser) {
        const updatedUser = await supabaseService.updateUser(selectedUser.id, data);
        setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user));
      } else {
        const newUser = await supabaseService.createUser(data);
        
        // If we're using Supabase Auth, we'd also need to create the auth user
        if (data.password) {
          await supabaseService.signUp(data.email, data.password, {
            name: data.name,
            role: data.role
          });
        }
        
        setUsers([...users, newUser]);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  // Role form handlers
  const handleAddRole = () => {
    setSelectedRole(null);
    setIsRoleFormOpen(true);
  };

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setIsRoleFormOpen(true);
  };

  const handleRoleFormSubmit = async (data: any) => {
    try {
      if (selectedRole) {
        const updatedRole = await supabaseService.updateRole(selectedRole.id, data);
        setRoles(roles.map(role => role.id === selectedRole.id ? updatedRole : role));
      } else {
        const newRole = await supabaseService.createRole(data);
        setRoles([...roles, newRole]);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      throw error;
    }
  };

  // Document type form handlers
  const handleAddDocType = () => {
    setSelectedDocType(null);
    setIsDocTypeFormOpen(true);
  };

  const handleEditDocType = (docType: any) => {
    setSelectedDocType(docType);
    setIsDocTypeFormOpen(true);
  };

  const handleDeleteDocType = async (id: string) => {
    try {
      await supabaseService.deleteDocumentType(id);
      setDocumentTypes(documentTypes.filter(docType => docType.id !== id));
      toast({
        title: "Document type deleted",
        description: "Document type has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting document type:", error);
      toast({
        title: "Error",
        description: "Failed to delete document type. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDocTypeFormSubmit = async (data: any) => {
    try {
      if (selectedDocType) {
        const updatedDocType = await supabaseService.updateDocumentType(selectedDocType.id, data);
        setDocumentTypes(documentTypes.map(docType => docType.id === selectedDocType.id ? updatedDocType : docType));
      } else {
        const newDocType = await supabaseService.createDocumentType(data);
        setDocumentTypes([...documentTypes, newDocType]);
      }
    } catch (error) {
      console.error("Error saving document type:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Administration</h2>
        <p className="text-muted-foreground">
          Manage users, roles, and system configuration
        </p>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
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
              <Button onClick={handleAddUser}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found. {searchQuery ? "Try a different search query." : "Create some users to get started."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {roles.find(role => role.id === user.roleId)?.name || user.role || "No role"}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Active</Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {!loading && filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found. {searchQuery ? "Try a different search query." : "Create some users to get started."}
                        </TableCell>
                      </TableRow>
                    )}
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
              <Button onClick={handleAddRole}>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Loading roles...
                        </TableCell>
                      </TableRow>
                    ) : roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No roles found. Create some roles to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">{role.name}</TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            {users.filter(user => user.roleId === role.id || user.role === role.name).length}
                          </TableCell>
                          <TableCell>
                            <Badge>
                              {role.permissions?.length > 3 ? "Advanced" : 
                               role.permissions?.length > 0 ? "Standard" : "Limited"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
              <Button onClick={handleAddDocType}>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Loading document types...
                        </TableCell>
                      </TableRow>
                    ) : documentTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No document types found. Create some document types to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      documentTypes.map((docType) => (
                        <TableRow key={docType.id}>
                          <TableCell className="font-medium">{docType.name}</TableCell>
                          <TableCell>{docType.description}</TableCell>
                          <TableCell>{docType.requiredApprovals}</TableCell>
                          <TableCell>{docType.sla}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditDocType(docType)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => handleDeleteDocType(docType.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Forms */}
      <UserForm 
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={handleUserFormSubmit}
        user={selectedUser}
        roles={roles}
      />
      
      <RoleForm
        isOpen={isRoleFormOpen}
        onClose={() => setIsRoleFormOpen(false)}
        onSubmit={handleRoleFormSubmit}
        role={selectedRole}
      />
      
      <DocumentTypeForm
        isOpen={isDocTypeFormOpen}
        onClose={() => setIsDocTypeFormOpen(false)}
        onSubmit={handleDocTypeFormSubmit}
        documentType={selectedDocType}
      />
    </div>
  );
};

export default Admin;
