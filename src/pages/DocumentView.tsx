
import { useParams } from "react-router-dom";
import DocumentViewer from "@/components/documents/DocumentViewer";

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real application, you would fetch the document data based on the id
  const document = {
    id: id || "1",
    title: "Purchase Agreement - 123 Main Street",
    type: "PDF Document",
    status: "pending",
    uploadedBy: "Sarah Johnson",
    createdAt: "May 1, 2025",
    updatedAt: "May 4, 2025",
    comments: 2,
    versions: 3,
  };

  return (
    <div className="h-[calc(100vh-160px)]">
      <DocumentViewer document={document} />
    </div>
  );
};

export default DocumentView;
