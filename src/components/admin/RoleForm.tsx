
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X } from "lucide-react";

const roleFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  permissions: z.array(z.string()),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

const availablePermissions = [
  { id: "view_documents", name: "View Documents" },
  { id: "create_documents", name: "Create Documents" },
  { id: "edit_documents", name: "Edit Documents" },
  { id: "delete_documents", name: "Delete Documents" },
  { id: "approve_documents", name: "Approve Documents" },
  { id: "manage_users", name: "Manage Users" },
  { id: "manage_roles", name: "Manage Roles" },
  { id: "view_reports", name: "View Reports" },
];

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
  role?: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
  };
}

const RoleForm = ({ isOpen, onClose, onSubmit, role }: RoleFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      permissions: role?.permissions || [],
    },
  });

  // Update form when role changes
  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name || "",
        description: role.description || "",
        permissions: Array.isArray(role.permissions) ? role.permissions : [],
      });
    } else {
      form.reset({
        name: "",
        description: "",
        permissions: [],
      });
    }
  }, [role, form]);

  const handleSubmit = async (data: RoleFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast({
        title: role ? "Role updated" : "Role created",
        description: role ? "Role has been updated successfully." : "New role has been created.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${role ? "update" : "create"} role. Please try again.`,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{role ? "Edit Role" : "Create New Role"}</SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <div className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Administrator" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Role description and responsibilities" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Permissions</FormLabel>
                      <FormDescription>
                        Select the permissions for this role
                      </FormDescription>
                    </div>
                    {availablePermissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={permission.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, permission.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== permission.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {permission.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : role ? "Update Role" : "Create Role"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RoleForm;
