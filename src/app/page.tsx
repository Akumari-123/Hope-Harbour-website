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
    <section className="relative bg-background">
      <div className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter mb-6">
            Hope in Times of Hardship
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
            Your centralized hub for disaster relief. Connect with your
            community, offer support, or find the help you need, all in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/donate">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/volunteer">
                <Users className="mr-2 h-5 w-5" />
                Become a Volunteer
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative w-full h-80 lg:h-full rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="https://picsum.photos/800/600"
            alt="Volunteers helping in a disaster area"
            data-ai-hint="volunteers disaster relief"
            fill
            className="object-cover"
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
      : `${campaign.current} volunteers`;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{campaign.title}</CardTitle>
        <CardDescription>{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-2 flex justify-between text-sm font-medium">
          <span>{unitLabel}</span>
          <span>
            Goal:{" "}
            {campaign.unit === "dollars"
              ? `$${campaign.goal.toLocaleString()}`
              : campaign.goal}
          </span>
        </div>
        <Progress value={progress} aria-label={`${progress.toFixed(0)}% complete`} />
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/donate">Contribute</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CampaignsSection() {
  return (
    <section className="bg-secondary py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Ongoing Campaigns
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
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
    High: "bg-destructive/20 text-destructive-foreground border-destructive",
    Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50",
    Low: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50",
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{update.location}</CardTitle>
          <Badge
            variant="outline"
            className={severityClasses[update.severity]}
          >
            {update.severity} Severity
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Megaphone className="h-4 w-4" /> {update.disasterType} -{" "}
          {update.timestamp}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{update.summary}</p>
        <div className="flex flex-wrap gap-2">
          <span className="font-semibold">Needs:</span>
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

function UpdatesSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Latest Updates
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
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
    <section className="bg-secondary py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            How You Can Help
          </h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Every act of kindness makes a difference. Find a way to contribute that suits you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {helpItems.map((item) => (
            <Card key={item.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
              <CardFooter>
                 <Button asChild variant="ghost" className="w-full text-primary hover:text-primary">
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
    <section className="py-20">
      <div className="container">
        <Card className="bg-primary text-primary-foreground overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold font-headline mb-4">
                Join the Resource Hub
              </h2>
              <p className="mb-6 opacity-80">
                Whether you have resources to share or are in need of assistance, our community hub is here to connect you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="secondary">
                  <Link href="/resources">Offer Help</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/resources">Request Aid</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
               <Image
                src="https://picsum.photos/600/400"
                alt="Community members sharing resources"
                data-ai-hint="community sharing"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Card>
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
