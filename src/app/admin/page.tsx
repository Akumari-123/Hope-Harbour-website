
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Package, HandHeart } from 'lucide-react';
import type { Donation, Resource } from '@/lib/types';
import { format } from 'date-fns';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function AdminDashboard() {
  const [totalDonations, setTotalDonations] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [resourceStats, setResourceStats] = useState<{ name: string; value: number }[]>([]);
  const [latestDonations, setLatestDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener for donations
    const donationsQuery = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
    const unsubscribeDonations = onSnapshot(donationsQuery, (snapshot) => {
      let total = 0;
      const donationsData = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<Donation, 'id'>;
        total += data.amount;
        return { id: doc.id, ...data } as Donation;
      });
      setTotalDonations(total);
      setLatestDonations(donationsData.slice(0, 5));
      setIsLoading(false);
    }, () => setIsLoading(false));

    // Listener for volunteers
    const volunteersQuery = query(collection(db, 'volunteers'));
     const unsubscribeVolunteers = onSnapshot(volunteersQuery, (snapshot) => {
        setVolunteerCount(snapshot.size);
    });
    
    // Listener for resources
    const resourcesQuery = query(collection(db, 'resources'));
    const unsubscribeResources = onSnapshot(resourcesQuery, (snapshot) => {
        let offers = 0;
        let requests = 0;
        snapshot.forEach(doc => {
            const resource = doc.data() as Omit<Resource, 'id'>;
            if (resource.type === 'Offer') {
                offers++;
            } else {
                requests++;
            }
        });
        setResourceStats([
            { name: 'Offers', value: offers },
            { name: 'Requests', value: requests }
        ]);
    });


    // Cleanup listeners on unmount
    return () => {
      unsubscribeDonations();
      unsubscribeVolunteers();
      unsubscribeResources();
    };
  }, []);

  const PIE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

  if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="text-center">
                <HandHeart className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <p className="mt-4 text-lg text-muted-foreground">Loading Dashboard Data...</p>
            </div>
        </div>
      )
  }

  return (
    <div className="bg-secondary/50">
      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
                 <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    Admin Dashboard
                </h1>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    Real-time overview of Hope Harbour's relief efforts.
                </p>
            </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalDonations.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  from all supporters
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volunteers Registered</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{volunteerCount}</div>
                <p className="text-xs text-muted-foreground">
                  ready to help
                </p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resources Status</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">{resourceStats.reduce((acc, cur) => acc + cur.value, 0)} Total</div>
                 <p className="text-xs text-muted-foreground">
                  {resourceStats.find(r=>r.name === "Offers")?.value || 0} offered, {resourceStats.find(r=>r.name === "Requests")?.value || 0} requested
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-8 md:grid-cols-5">
              <Card className="md:col-span-3">
                  <CardHeader>
                      <CardTitle>Latest Donations</CardTitle>
                      <CardDescription>A list of the 5 most recent donations.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                                  <TableHead className="text-right">Date</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {latestDonations.map(donation => (
                                  <TableRow key={donation.id}>
                                      <TableCell>{donation.name}</TableCell>
                                      <TableCell>
                                        <Badge variant={donation.donationType === 'one-time' ? 'secondary' : 'default'} className={donation.donationType === 'recurring' ? 'bg-primary' : ''}>
                                            {donation.donationType}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">${donation.amount.toLocaleString()}</TableCell>
                                      <TableCell className="text-right text-xs text-muted-foreground">
                                        {donation.createdAt?.seconds ? format(new Date(donation.createdAt.seconds * 1000), "PPpp") : 'Just now'}
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
              <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Resource Distribution</CardTitle>
                    <CardDescription>Offers vs. Requests</CardDescription>
                </CardHeader>
                 <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                       <PieChart>
                          <Pie
                            data={resourceStats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {resourceStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                 </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
