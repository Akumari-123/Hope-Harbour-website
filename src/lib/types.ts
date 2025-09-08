
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
