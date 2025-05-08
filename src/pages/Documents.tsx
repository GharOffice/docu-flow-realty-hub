
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import DocumentGrid from "@/components/documents/DocumentGrid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDocumentTypes } from "@/lib/supabase";

const Documents = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentType, setDocumentType] = useState("");

  const { data: documentTypes = [], isLoading: isLoadingDocTypes } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: getDocumentTypes,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadDocument = async () => {
    if (!file || !title || !documentType || !user) {
      toast({
        title: "Missing information",
        description: "Please provide all required information",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload the file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // Get file URL
      const { data: fileData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // 2. Create document record in database
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert([
          {
            title,
            description,
            document_type_id: documentType,
            created_by: user.id,
            file_path: fileName,
            file_type: fileExt,
            file_size: file.size,
            status: 'draft',
          },
        ])
        .select();

      if (documentError) throw documentError;

      // 3. Create initial approval workflow based on document type
      const selectedDocType = documentTypes.find(dt => dt.id === documentType);
      
      if (selectedDocType?.required_approvals && documentData) {
        const documentId = documentData[0].id;
        
        // Create basic approval workflow with the required number of approvals
        for (let i = 0; i < selectedDocType.required_approvals; i++) {
          await supabase.from('document_approvals').insert([
            {
              document_id: documentId,
              order_sequence: i + 1,
              status: 'pending',
            },
          ]);
        }
      }

      // 4. Add an activity log entry for document creation
      await supabase.from('activity_logs').insert([
        {
          action: 'upload',
          document_id: documentData?.[0]?.id,
          user_id: user.id,
          details: { fileName: file.name },
        },
      ]);

      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and saved.",
      });

      // Reset form and close dialog
      setFile(null);
      setTitle("");
      setDescription("");
      setDocumentType("");
      setUploadDialogOpen(false);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Manage and organize your documents
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      
      <DocumentGrid />

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Add a new document to the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select
                value={documentType}
                onValueChange={setDocumentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingDocTypes ? (
                    <div className="flex justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : documentTypes.length === 0 ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      No document types available
                    </div>
                  ) : (
                    documentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadDocument}
              disabled={isUploading || !file || !title || !documentType}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
