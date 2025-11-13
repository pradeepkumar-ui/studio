'use client';

import { BookingClasses } from '@/components/inventory/booking-classes';
import { FareBrandMapping } from '@/components/inventory/fare-brand-mapping';
import { FlightAvailability } from '@/components/inventory/flight-availability';

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Flight & Inventory
          </h1>
          <p className="text-muted-foreground">
            Manage booking classes and view live flight availability.
          </p>
        </div>
      </div>
      
      <FlightAvailability />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <BookingClasses />
        <FareBrandMapping />
      </div>
    </div>
  );
}
