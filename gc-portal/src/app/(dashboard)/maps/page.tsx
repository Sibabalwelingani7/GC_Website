'use client';

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { cn } from '@/lib/utils';

const MEMBER_HUBS = [
  { region: 'Belhar Fellowship Hub', coords: [-33.9450, 18.6150] as [number, number], count: 85, lead: 'Pastor G. Jacobs' },
  { region: 'Delft Community Cell', coords: [-33.9760, 18.5940] as [number, number], count: 62, lead: 'Brother M. Ndlovu' },
  { region: 'Bellville Group Circle', coords: [-33.8940, 18.6290] as [number, number], count: 41, lead: 'Sister L. Botha' },
  { region: 'Mitchells Plain Outreach', coords: [-34.0480, 18.6040] as [number, number], count: 110, lead: 'Pastor D. Williams' },
  { region: 'Khayelitsha Fellowship', coords: [-34.0210, 18.6780] as [number, number], count: 94, lead: 'Evangelist J. Sithole' },
  { region: 'Cape Town Central Study', coords: [-33.9250, 18.4230] as [number, number], count: 35, lead: 'Sister A. Daniels' },
];

const SCHOOL_HUBS = [
  { region: 'Bellville High', coords: [-33.8890, 18.6340] as [number, number], count: 12, lead: 'Youth Campus' },
  { region: 'Delft Secondary', coords: [-33.9700, 18.5880] as [number, number], count: 8, lead: 'Youth Campus' },
  { region: 'Khayelitsha High', coords: [-34.0350, 18.6700] as [number, number], count: 15, lead: 'Youth Campus' },
];

type Tab = 'members' | 'schools';

export default function MapsPage() {
  const [tab, setTab] = useState<Tab>('members');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamic import for Leaflet (client-side only)
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      if (mapInstance.current) {
        (mapInstance.current as L.Map).remove();
      }

      const map = L.map(mapRef.current!).setView([-33.9249, 18.4241], 11);
      mapInstance.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);

      const hubs = tab === 'members' ? MEMBER_HUBS : SCHOOL_HUBS;
      hubs.forEach((hub) => {
        L.marker(hub.coords).addTo(map).bindPopup(
          `<div style="font-size:11px"><strong>${hub.region}</strong><br/>${hub.lead}<br/><em>${hub.count} ${tab === 'members' ? 'members' : 'students'}</em></div>`
        );
      });
    });

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [tab]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Maps" description="Geographic distribution of members and schools" />

      <div className="flex gap-1 mb-4 bg-slate-800 p-1 rounded-lg border border-slate-700/70 w-fit">
        {(['members', 'schools'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn('px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer capitalize', tab === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white')}>
            {t === 'members' ? 'Members Map' : 'Schools Map'}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/70 overflow-hidden">
        <div ref={mapRef} className="h-[500px] w-full" />
      </div>

      <p className="text-[10px] text-slate-500 mt-2">{(tab === 'members' ? MEMBER_HUBS : SCHOOL_HUBS).length} clusters charted</p>
    </div>
  );
}
