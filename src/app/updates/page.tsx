
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DisasterUpdate } from "@/lib/types";
import { Megaphone } from "lucide-react";

const allUpdates: DisasterUpdate[] = [
  {
    id: "1",
    disasterType: "Wildfire",
    location: "North Valley",
    severity: "High",
    urgentNeeds: ["Water", "Medical Kits", "Blankets"],
    timestamp: "2 hours ago",
    summary:
      "A fast-moving wildfire is threatening homes in North Valley. Evacuations are underway. Urgent need for non-perishable food and water.",
  },
  {
    id: "2",
    disasterType: "Flood",
    location: "Coastal City",
    severity: "Medium",
    urgentNeeds: ["Shelter", "Dry Clothes", "Baby Formula"],
    timestamp: "1 day ago",
    summary:
      "Coastal City is experiencing major flooding. Several districts are submerged. Temporary shelters are being set up at community centers.",
  },
  {
    id: "3",
    disasterType: "Earthquake",
    location: "Mountain Region",
    severity: "High",
    urgentNeeds: ["Search & Rescue Teams", "Medical Aid", "Tents"],
    timestamp: "2 days ago",
    summary:
      "A 6.8 magnitude earthquake struck the Mountain Region, causing widespread damage. Aftershocks are ongoing. Communication lines are down.",
  },
  {
    id: "4",
    disasterType: "Hurricane",
    location: "Island Nation",
    severity: "Medium",
    urgentNeeds: ["Clean Water", "Batteries", "First Aid"],
    timestamp: "4 days ago",
    summary:
      "Hurricane Lena made landfall, bringing strong winds and heavy rain. Power outages are widespread. Coastal erosion is severe.",
  },
  {
    id: "5",
    disasterType: "Flood",
    location: "Rivertown",
    severity: "Low",
    urgentNeeds: ["Sandbags", "Pumps", "Volunteer Support"],
    timestamp: "5 days ago",
    summary:
      "Minor flooding reported in Rivertown due to heavy rainfall. River levels are high but stable. Residents advised to monitor the situation.",
  },
];

function UpdateCard({ update }: { update: DisasterUpdate }) {
  const severityClasses = {
    High: "bg-destructive/20 text-destructive dark:text-destructive-foreground border-destructive/50",
    Medium:
      "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50",
    Low: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50",
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-start gap-4">
          <CardTitle className="text-2xl">{update.location}</CardTitle>
          <Badge
            variant="outline"
            className={`self-start sm:self-auto ${severityClasses[update.severity]}`}
          >
            {update.severity} Severity
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-2">
          <Megaphone className="h-4 w-4" /> {update.disasterType} -{" "}
          {update.timestamp}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">{update.summary}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">Urgent Needs:</span>
          {update.urgentNeeds.map((need) => (
            <Badge key={need} variant="secondary">
              {need}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function UpdatesPage({
  searchParams,
}: {
  searchParams: { type?: string; severity?: string };
}) {
  const filteredUpdates = allUpdates.filter((update) => {
    const typeMatch = searchParams.type
      ? update.disasterType.toLowerCase() === searchParams.type
      : true;
    const severityMatch = searchParams.severity
      ? update.severity.toLowerCase() === searchParams.severity
      : true;
    return typeMatch && severityMatch;
  });

  return (
    <div className="bg-secondary/50">
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Live Updates
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            The latest information on active situations, urgent needs, and
            relief efforts.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wildfire">Wildfire</SelectItem>
              <SelectItem value="flood">Flood</SelectItem>
              <SelectItem value="earthquake">Earthquake</SelectItem>
              <SelectItem value="hurricane">Hurricane</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 max-w-4xl mx-auto space-y-8">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold">No Updates Found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or check back later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
