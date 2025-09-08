import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceForm } from "@/components/resource-form";
import type { Resource } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { MapPlaceholder } from "@/components/map-placeholder";

const resources: Resource[] = [
  {
    id: "1",
    type: "Offer",
    resourceType: "Canned Goods",
    details: "Offering 5 boxes of assorted canned vegetables and soups.",
    userName: "Jane D.",
    timestamp: "3 hours ago",
  },
  {
    id: "2",
    type: "Request",
    resourceType: "Baby Formula",
    details: "In urgent need of formula for a 6-month-old infant.",
    userName: "Mike R.",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "Offer",
    resourceType: "Blankets",
    details: "Have 20 new warm blankets available for pickup.",
    userName: "Community Center",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "Request",
    resourceType: "Pet Food",
    details: "Need dog food for two medium-sized dogs displaced by the flood.",
    userName: "Sarah L.",
    timestamp: "2 days ago",
  },
];

function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{resource.resourceType}</CardTitle>
          <Badge variant={resource.type === "Offer" ? "default" : "destructive"} className={resource.type === 'Offer' ? 'bg-green-600' : ''}>
            {resource.type}
          </Badge>
        </div>
        <CardDescription>{resource.details}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{resource.userName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{resource.timestamp}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResourcesPage() {
  return (
    <div className="bg-background">
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Community Resource Hub
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Connect with your community to give and receive help. Share
            resources, find what you need, and support one another.
          p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold font-headline mb-6 text-center lg:text-left">
              Share or Request a Resource
            </h2>
            <Tabs defaultValue="offer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="offer">I Want to Offer Help</TabsTrigger>
                <TabsTrigger value="request">I Need Help</TabsTrigger>
              </TabsList>
              <TabsContent value="offer">
                <Card>
                  <CardHeader>
                    <CardTitle>Offer a Resource</CardTitle>
                    <CardDescription>
                      Let the community know what you can provide. Your
                      generosity is invaluable.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResourceForm listingType="offer" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="request">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Assistance</CardTitle>
                    <CardDescription>
                      Don't hesitate to ask for help. Post your needs, and the
                      community will respond.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResourceForm listingType="request" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-headline mb-6 text-center lg:text-left">
              Community Board
            </h2>
            <div className="space-y-4">
              {resources.map((resource) => (
                <ResourceItem key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-24">
            <div className="mx-auto max-w-4xl text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                    Aid Center Locations
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                    Find shelters, food banks, and medical aid centers near you.
                </p>
            </div>
            <MapPlaceholder />
        </div>
      </div>
    </div>
  );
}
