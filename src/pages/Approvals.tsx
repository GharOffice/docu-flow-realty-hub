
import ApprovalList from "@/components/approvals/ApprovalList";

const Approvals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Approvals</h2>
        <p className="text-muted-foreground">
          Manage document approval workflows
        </p>
      </div>
      
      <ApprovalList />
    </div>
  );
};

export default Approvals;
