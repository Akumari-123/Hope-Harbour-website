
export type DisasterUpdate = {
  id: string;
  disasterType: string;
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  urgentNeeds: string[];
  timestamp: string;
  summary: string;
};

export type Campaign = {
  id: string;
  title: string;
  goal: number;
  current: number;
  unit: 'dollars' | 'volunteers' | 'items';
  description: string;
};

export type Resource = {
  id: string;
  type: 'Offer' | 'Request';
  resourceType: string;
  details: string;
  userName: string;
  timestamp: string;
};

export type PersonListing = {
  id: string;
  status: 'Missing' | 'Found';
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  details: string;
  contactInfo: string;
  timestamp: string;
};

export type Donation = {
  id: string;
  amount: number;
  donationType: string;
  name: string;
  email: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export type Volunteer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    skills: string;
    availability: string[];
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}
