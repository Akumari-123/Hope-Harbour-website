import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Users,
  Package,
  Megaphone,
  HandHeart,
  Home as HomeIcon,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Campaign, DisasterUpdate } from "@/lib/types";

const campaigns: Campaign[] = [
  {
    id: "1",
    title: "Flood Relief Fund",
    description: "Support families affected by the recent floods.",
    goal: 50000,
    current: 28500,
    unit: "dollars",
  },
  {
    id: "2",
    title: "Volunteer Drive: Shelter Support",
    description: "We need helping hands at our local shelters.",
    goal: 200,
    current: 125,
    unit: "volunteers",
  },
  {
    id: "3",
    title: "Winter Clothing Drive",
    description: "Help us collect warm clothes for the displaced.",
    goal: 10000,
    current: 7800,
    unit: "items",
  },
];

const latestUpdates: DisasterUpdate[] = [
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
];

function HeroSection() {
  return (
    <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0"></div>
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32 z-10">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Badge variant="secondary" className="mb-4 text-primary font-semibold border-primary/20">We Respond. We Rebuild. We Restore Hope.</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter mb-6 text-foreground/90">
                Hope in Times of Hardship
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
                Your centralized hub for disaster relief. Connect with your
                community, offer support, or find the help you need, all in one
                place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 shadow-md hover:shadow-lg transition-shadow">
                <Link href="/donate">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-background/50 backdrop-blur-sm">
                <Link href="/volunteer">
                    <Users className="mr-2 h-5 w-5" />
                    Become a Volunteer
                </Link>
                </Button>
            </div>
            </div>
            <div className="relative w-full h-80 lg:h-full rounded-2xl overflow-hidden shadow-2xl group">
                <Image
                    src="https://picsum.photos/800/600"
                    alt="Volunteers helping in a disaster area"
                    data-ai-hint="volunteers disaster relief"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>
        </div>
    </section>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = (campaign.current / campaign.goal) * 100;
  const unitLabel =
    campaign.unit === "dollars"
      ? `$${campaign.current.toLocaleString()}`
      : campaign.unit === "volunteers" ? `${campaign.current} Volunteers` : `${campaign.current} Items`;
  
  const goalLabel = campaign.unit === "dollars"
  ? `$${campaign.goal.toLocaleString()}`
  : campaign.goal;

  return (
    <Card className="flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle>{campaign.title}</CardTitle>
        <CardDescription>{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4 space-y-2">
            <Progress value={progress} aria-label={`${progress.toFixed(0)}% complete`} />
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>{unitLabel} Raised</span>
                <span>Goal: {goalLabel}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full bg-secondary/50 hover:bg-secondary">
          <Link href="/donate">Contribute Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CampaignsSection() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Ongoing Campaigns
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Join our efforts to bring relief and support where it's needed most.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UpdateCard({ update }: { update: DisasterUpdate }) {
  const severityClasses = {
    High: "bg-destructive/10 text-destructive border-destructive/20",
    Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  };
  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle>{update.location}</CardTitle>
          <Badge
            variant="outline"
            className={severityClasses[update.severity]}
          >
            {update.severity} Severity
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Megaphone className="h-4 w-4" /> {update.disasterType} &middot;{" "}
          {update.timestamp}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">{update.summary}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-semibold text-sm">Urgent Needs:</span>
          {update.urgentNeeds.map((need) => (
            <Badge key={need} variant="secondary" className="font-normal">
              {need}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpdatesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Latest Updates
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Stay informed about the latest developments and urgent needs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {latestUpdates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/updates">
              View All Updates <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

const helpItems = [
  {
    icon: HandHeart,
    title: "Offer Resources",
    description: "Share essential items like food, clothing, and supplies with those in need.",
    href: "/resources",
  },
  {
    icon: HomeIcon,
    title: "Provide Shelter",
    description: "Offer a safe place for individuals and families who have been displaced.",
    href: "/resources",
  },
  {
    icon: Users,
    title: "Volunteer Your Time",
    description: "Your skills and time are invaluable. Join our team on the ground.",
    href: "/volunteer",
  },
  {
    icon: Heart,
    title: "Donate Funds",
    description: "Financial contributions help us respond quickly and effectively to crises.",
    href: "/donate",
  },
];

function HowToHelpSection() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            How You Can Help
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every act of kindness makes a difference. Find a way to contribute that suits you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {helpItems.map((item) => (
            <Card key={item.title} className="text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-4 rounded-xl mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
              <CardFooter>
                 <Button asChild variant="ghost" className="w-full text-primary hover:text-primary font-semibold">
                  <Link href={item.href}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourceHubCta() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="relative bg-primary text-primary-foreground rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 z-0"></div>
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
            <div className="relative z-10 grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold font-headline mb-4">
                    Join the Resource Hub
                </h2>
                <p className="mb-6 opacity-90">
                    Whether you have resources to share or are in need of assistance, our community hub is here to connect you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    <Link href="/resources">Offer Help</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-transparent border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/80">
                    <Link href="/resources">Request Aid</Link>
                    </Button>
                </div>
                </div>
                <div className="relative h-64 md:h-full min-h-[250px] hidden md:block">
                <Image
                    src="https://picsum.photos/600/400"
                    alt="Community members sharing resources"
                    data-ai-hint="community sharing"
                    fill
                    className="object-cover"
                />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CampaignsSection />
      <UpdatesSection />
      <HowToHelpSection />
      <ResourceHubCta />
    </>
  );
}
