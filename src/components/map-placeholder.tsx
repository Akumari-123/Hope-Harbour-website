import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const aidCenters = [
  { name: 'Central Shelter', top: '30%', left: '40%', type: 'shelter' },
  { name: 'North Food Bank', top: '15%', left: '55%', type: 'food' },
  { name: 'West Medical Aid', top: '50%', left: '20%', type: 'medical' },
  { name: 'East Distribution', top: '65%', left: '75%', type: 'food' },
  { name: 'Southside Shelter', top: '80%', left: '45%', type: 'shelter'},
];

export function MapPlaceholder() {
  return (
    <Card className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
      <Image
        src="https://picsum.photos/1280/720"
        alt="Map of aid centers"
        data-ai-hint="world map"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      {aidCenters.map(center => (
        <div
          key={center.name}
          className="group absolute"
          style={{ top: center.top, left: center.left }}
        >
          <div className="relative">
            <MapPin className={cn(
                "h-8 w-8 drop-shadow-lg transition-transform group-hover:scale-125",
                center.type === 'shelter' && 'text-blue-400',
                center.type === 'food' && 'text-green-400',
                center.type === 'medical' && 'text-red-400',
              )} />
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-max rounded-md bg-background px-2 py-1 text-sm font-semibold text-foreground shadow-md group-hover:block whitespace-nowrap">
            {center.name}
          </div>
        </div>
      ))}
    </Card>
  );
}
