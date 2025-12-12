
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '../ui/separator';

const baggageSchema = z.object({
    type: z.enum(['standard', 'sports_equipment', 'extra_bag']),
    weight: z.coerce.number().optional()
});

const passengerDetailsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Passenger name is required.'),
  type: z.enum(['Adult', 'Child', 'Infant']),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format.'),
  gender: z.enum(['Male', 'Female', 'Other']),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  contactEmail: z.string().email('Invalid email address.').optional(),
  contactPhone: z.string().optional(),
  frequentFlyerNumber: z.string().optional(),
  knownTravelerNumber: z.string().optional(),
  specialAssistance: z.string().optional(),
  baggage: baggageSchema.optional(),
});

export type PassengerDetails = z.infer<typeof passengerDetailsSchema>;

interface PassengerDetailsFormProps {
  passenger: PassengerDetails | null;
  onSubmit: (data: PassengerDetails) => void;
  onCancel: () => void;
  isInternational: boolean;
}

export function PassengerDetailsForm({ passenger, onSubmit, onCancel, isInternational }: PassengerDetailsFormProps) {
  const form = useForm<PassengerDetails>({
    resolver: zodResolver(passengerDetailsSchema),
    defaultValues: passenger || {
      name: '',
      type: 'Adult',
      gender: 'Male',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        
        <h4 className="text-md font-semibold">Personal Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl><Input placeholder="e.g., John Smith" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth*</FormLabel>
                <FormControl><Input placeholder="YYYY-MM-DD" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Adult">Adult</SelectItem><SelectItem value="Child">Child</SelectItem><SelectItem value="Infant">Infant</SelectItem></SelectContent>
                    </Select>
                </FormItem>
            )} />
             <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                    </Select>
                </FormItem>
            )} />
        </div>
        
        <Separator />
        <h4 className="text-md font-semibold">Regulatory Information {isInternational && '(Required for International Travel)'}</h4>
         <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality {isInternational && '*'}</FormLabel>
                <FormControl><Input placeholder="e.g., USA" {...field} /></FormControl>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="knownTravelerNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Known Traveler Number</FormLabel>
                <FormControl><Input placeholder="KTN / Redress" {...field} /></FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Passport Number {isInternational && '*'}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="passportExpiry"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Passport Expiry {isInternational && '*'}</FormLabel>
                    <FormControl><Input placeholder="YYYY-MM-DD" {...field} /></FormControl>
                </FormItem>
                )}
            />
        </div>

        <Separator />
        <h4 className="text-md font-semibold">Contact & Loyalty</h4>
        <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl><Input placeholder="For contact tracing" {...field} /></FormControl>
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="frequentFlyerNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Frequent Flyer Number</FormLabel>
                <FormControl><Input placeholder="Airline loyalty number" {...field} /></FormControl>
                </FormItem>
            )}
        />
        
        <Separator />
        <h4 className="text-md font-semibold">Services & Baggage</h4>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="baggage.type" render={({ field }) => (
                <FormItem>
                    <FormLabel>Baggage Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="standard">Standard Allowance</SelectItem>
                            <SelectItem value="sports_equipment">Sports Equipment</SelectItem>
                            <SelectItem value="extra_bag">Extra Bag</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField control={form.control} name="baggage.weight" render={({ field }) => (
                <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                </FormItem>
            )} />
        </div>
         <FormField
            control={form.control}
            name="specialAssistance"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Special Assistance</FormLabel>
                <FormControl><Input placeholder="e.g., WCHR, VGML" {...field} /></FormControl>
                </FormItem>
            )}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{passenger ? 'Save Changes' : 'Add Passenger'}</Button>
        </div>
      </form>
    </Form>
  );
}
