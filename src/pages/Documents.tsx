
import DocumentGrid from "@/components/documents/DocumentGrid";

const Documents = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <p className="text-muted-foreground">
          Manage and organize your documents
        </p>
      </div>
      
      <DocumentGrid />
    </div>
  );
};

export default Documents;
