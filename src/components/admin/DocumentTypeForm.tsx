
import { useState } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const documentTypeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  requiredApprovals: z.string(),
  sla: z.coerce.number().min(1, { message: "SLA must be at least 1 day." }),
});

type DocumentTypeFormData = z.infer<typeof documentTypeFormSchema>;

interface DocumentTypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentTypeFormData) => void;
  documentType?: {
    id: string;
    name: string;
    description: string;
    requiredApprovals: string;
    sla: number;
  };
}

const DocumentTypeForm = ({ isOpen, onClose, onSubmit, documentType }: DocumentTypeFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DocumentTypeFormData>({
    resolver: zodResolver(documentTypeFormSchema),
    defaultValues: {
      name: documentType?.name || "",
      description: documentType?.description || "",
      requiredApprovals: documentType?.requiredApprovals || "",
      sla: documentType?.sla || 3,
    },
  });

  const handleSubmit = async (data: DocumentTypeFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      toast({
        title: documentType ? "Document type updated" : "Document type created",
        description: documentType ? "Document type has been updated successfully." : "New document type has been created.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${documentType ? "update" : "create"} document type. Please try again.`,
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
          <SheetTitle>
            {documentType ? "Edit Document Type" : "Create Document Type"}
          </SheetTitle>
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Purchase Agreement" {...field} />
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
                        placeholder="Document type description" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requiredApprovals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Approvals</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select required approvals" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Manager, Legal">Manager, Legal</SelectItem>
                        <SelectItem value="Manager, Legal, Executive">Manager, Legal, Executive</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Manager, Executive">Manager, Executive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SLA (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : documentType ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DocumentTypeForm;
