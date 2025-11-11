'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { PlusCircle, Trash2 } from 'lucide-react';

const fareBrandMappingSchema = z.object({
  id: z.string().optional(),
  brandName: z.string().min(3, 'Brand Name is required.'),
  mappedClasses: z.array(z.object({ value: z.string().length(1, 'Class must be a single character.') })).min(1, 'At least one booking class is required.'),
  channel: z.string().min(3, 'Channel is required'),
});

export type FareBrandMap = z.infer<typeof fareBrandMappingSchema>;

interface FareBrandMappingFormProps {
  mapping: FareBrandMap | null;
  onSubmit: (data: FareBrandMap) => void;
  onCancel: () => void;
}

export function FareBrandMappingForm({ mapping, onSubmit, onCancel }: FareBrandMappingFormProps) {
  const form = useForm<FareBrandMap>({
    resolver: zodResolver(fareBrandMappingSchema),
    defaultValues: mapping ? {
        ...mapping,
        mappedClasses: mapping.mappedClasses.map(c => ({ value: c }))
    } : {
      brandName: '',
      mappedClasses: [{ value: 'Y' }],
      channel: 'All',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "mappedClasses"
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fare Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Economy Saver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>Mapped Booking Classes</FormLabel>
          <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`mappedClasses.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g., Y" {...field} maxLength={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Booking Class
          </Button>
        </div>

        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel</FormLabel>
              <FormControl>
                <Input placeholder="e.g., All, Website, GDS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
            </Button>
            <Button type="submit">{mapping ? 'Save Changes' : 'Create Mapping'}</Button>
        </div>
      </form>
    </Form>
  );
}
