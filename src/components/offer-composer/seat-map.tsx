'use client';

import { cn } from '@/lib/utils';
import { Armchair, X } from 'lucide-react';

interface SeatMapProps {
  selectedSeat: string | null;
  onSeatSelect: (seat: string | null) => void;
}

const seatRows = [
  ['1A', '1B', null, '1C', '1D'],
  ['2A', '2B', null, '2C', '2D'],
  ['3A', '3B', null, '3C', '3D'],
  ['4A', '4B', null, '4C', '4D'],
  ['5A', '5B', null, '5C', '5D'],
  ['6A', '6B', null, '6C', '6D'],
];

const occupiedSeats = ['2B', '3D', '5A'];

export function SeatMap({ selectedSeat, onSeatSelect }: SeatMapProps) {
  const handleSeatClick = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    if (selectedSeat === seat) {
      onSeatSelect(null);
    } else {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="space-y-4">
        <h4 className="font-semibold">Seat Selection (+$45)</h4>
        <div className="p-4 rounded-lg bg-secondary flex flex-col items-center gap-2">
            <div className="w-full text-center text-sm text-muted-foreground pb-2">Business Class</div>
            {seatRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                {row.map((seat, seatIndex) => {
                    if (!seat) return <div key={seatIndex} className="w-8"></div>;

                    const isOccupied = occupiedSeats.includes(seat);
                    const isSelected = selectedSeat === seat;

                    return (
                    <div
                        key={seat}
                        onClick={() => handleSeatClick(seat)}
                        className={cn(
                        'w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-colors',
                        isOccupied && 'cursor-not-allowed text-muted-foreground',
                        !isOccupied && !isSelected && 'hover:bg-primary/20',
                        isSelected && 'bg-primary text-primary-foreground',
                        !isOccupied && !isSelected && 'bg-background'
                        )}
                    >
                        {isOccupied ? (
                             <X className="w-4 h-4" />
                        ) : (
                            <Armchair className="w-5 h-5" />
                        )}
                       
                    </div>
                    );
                })}
                </div>
            ))}
        </div>
        <div className="text-xs text-muted-foreground text-center">Selected Seat: {selectedSeat || 'None'}</div>
    </div>
  );
}

    