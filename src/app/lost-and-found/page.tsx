
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Search, UserPlus, FileText, Clock, MapPin, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { PersonListing } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { submitLostAndFoundReport } from '../actions';

const mockListings: PersonListing[] = [
  {
    id: "1",
    status: "Missing",
    name: "John Doe",
    age: 34,
    location: "North Valley",
    imageUrl: "https://picsum.photos/seed/person1/400/400",
    details: "Last seen near the town hall wearing a red jacket and blue jeans.",
    contactInfo: "Contact local police at (555) 111-2222",
    timestamp: "2 days ago"
  },
  {
    id: "2",
    status: "Found",
    name: "Jane Smith (unconfirmed)",
    age: 28,
    location: "Coastal City Shelter",
    imageUrl: "https://picsum.photos/seed/person2/400/400",
    details: "Found disoriented. Has a small scar on her left cheek. Seems to respond to 'Jane'.",
    contactInfo: "Contact Coastal City Shelter at (555) 333-4444",
    timestamp: "8 hours ago"
  },
    {
    id: "3",
    status: "Missing",
    name: "Michael Chen",
    age: 7,
    location: "Rivertown",
    imageUrl: "https://picsum.photos/seed/person3/400/400",
    details: "Separated from family during evacuation. Was holding a small teddy bear.",
    contactInfo: "Contact parents at (555) 555-6666",
    timestamp: "1 day ago"
  },
  {
    id: "4",
    status: "Found",
    name: "Unknown Elderly Man",
    age: 75,
    location: "Mountain Region Clinic",
    imageUrl: "https://picsum.photos/seed/person4/400/400",
    details: "Unable to speak, appears to have memory loss. Found with no identification.",
    contactInfo: "Contact Mountain Region Clinic at (555) 777-8888",
    timestamp: "3 days ago"
  },
];


const reportSchema = z.object({
  status: z.enum(['Missing', 'Found']),
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().positive("Age must be a positive number"),
  location: z.string().min(3, "Location is required"),
  details: z.string().min(20, "Please provide at least 20 characters of detail."),
  contactInfo: z.string().min(10, "Contact information is required."),
  photo: z.any().optional(),
});

function PersonCard({ listing }: { listing: PersonListing }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={listing.imageUrl}
            alt={listing.name}
            fill
            className="object-cover"
          />
          <Badge
            className="absolute top-2 right-2"
            variant={listing.status === 'Missing' ? 'destructive' : 'default'}
          >
            {listing.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{listing.name}</CardTitle>
        <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 shrink-0" />
                <p>Age: {listing.age}</p>
            </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>Last known location: {listing.location}</span>
          </div>
          <p>{listing.details}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 p-4 pt-0">
         <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Reported {listing.timestamp}</span>
        </div>
        <Button variant="outline" className="w-full mt-2">
          <Phone className="mr-2 h-4 w-4" />
          {listing.contactInfo}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ReportForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      status: 'Missing',
      name: '',
      age: undefined,
      location: '',
      details: '',
      contactInfo: '',
    },
  });

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    setIsSubmitting(true);
    // The photo field is a FileList, which is not serializable for a server action.
    // We'll omit it for now. A real implementation would handle file uploads separately.
    const { photo, ...submittableValues } = values;
    console.log("Submitting values: ", submittableValues);

    const result = await submitLostAndFoundReport(submittableValues);
    if (result.success) {
      toast({
        title: "Report Submitted",
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.message,
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File a Report</CardTitle>
        <CardDescription>
          Provide as much information as possible to help us.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Missing">Missing Person</SelectItem>
                      <SelectItem value="Found">Found Person</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe or 'Unknown'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approximate Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 35" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Known Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., North Valley Town Hall" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description & Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Clothing, distinguishing features, circumstances..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="contactInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Contact Info (for verification)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number or email" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Photo</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function LostAndFoundPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredListings = mockListings
    .filter(listing =>
      filter === 'all' || listing.status.toLowerCase() === filter
    )
    .filter(listing =>
      listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.details.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <div className="bg-secondary/50">
      <div className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Lost & Found
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A community-powered hub to help reconnect families and loved ones.
            Report a missing person or post if you've found someone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
                <ReportForm />
            </div>

            <div className="lg:col-span-2">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold font-headline mb-4">Community Reports</h2>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name, location, or keyword..." 
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reports</SelectItem>
                                <SelectItem value="missing">Missing</SelectItem>
                                <SelectItem value="found">Found</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredListings.map(listing => (
                            <PersonCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-12 col-span-full">
                        <CardContent>
                            <h3 className="text-xl font-semibold">No Reports Found</h3>
                            <p className="text-muted-foreground mt-2">
                            Your search returned no results. Try adjusting your filters or search term.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
