
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItem {
  id: string;
  action: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  document: {
    name: string;
    path: string;
  };
  timestamp: string;
  type: "upload" | "approval" | "rejection" | "comment";
}

const getActivityBadge = (type: ActivityItem["type"]) => {
  switch (type) {
    case "upload":
      return <Badge className="bg-blue-500">Uploaded</Badge>;
    case "approval":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejection":
      return <Badge className="bg-red-500">Rejected</Badge>;
    case "comment":
      return <Badge className="bg-yellow-500">Commented</Badge>;
    default:
      return null;
  }
};

const activityItems: ActivityItem[] = [
  {
    id: "1",
    action: "uploaded",
    user: {
      name: "Sarah Johnson",
      initials: "SJ",
    },
    document: {
      name: "Purchase Agreement - 123 Main St",
      path: "/documents/1",
    },
    timestamp: "10 minutes ago",
    type: "upload",
  },
  {
    id: "2",
    action: "approved",
    user: {
      name: "Michael Scott",
      initials: "MS",
    },
    document: {
      name: "Lease Agreement - Dunder Office Space",
      path: "/documents/2",
    },
    timestamp: "1 hour ago",
    type: "approval",
  },
  {
    id: "3",
    action: "rejected",
    user: {
      name: "David Wallace",
      initials: "DW",
    },
    document: {
      name: "Property Evaluation - 742 Evergreen Terrace",
      path: "/documents/3",
    },
    timestamp: "3 hours ago",
    type: "rejection",
  },
  {
    id: "4",
    action: "commented on",
    user: {
      name: "Pam Beesly",
      initials: "PB",
    },
    document: {
      name: "Closing Documents - 456 Oak Avenue",
      path: "/documents/4",
    },
    timestamp: "Yesterday",
    type: "comment",
  },
  {
    id: "5",
    action: "uploaded",
    user: {
      name: "Jim Halpert",
      initials: "JH",
    },
    document: {
      name: "Title Insurance - 789 Pine Street",
      path: "/documents/5",
    },
    timestamp: "Yesterday",
    type: "upload",
  },
];

const RecentActivity = () => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest document activities across your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activityItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <Avatar>
                <AvatarImage src={item.user.avatar} />
                <AvatarFallback>{item.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {item.user.name}{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    <a
                      href={item.document.path}
                      className="font-medium text-primary hover:underline"
                    >
                      {item.document.name}
                    </a>
                  </p>
                  {getActivityBadge(item.type)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
