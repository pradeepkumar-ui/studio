'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AiOfferConfigForm, type AiOfferConfig } from '@/components/forms/ai-offer-config-form';
import { format } from 'date-fns';

const initialConfigs: AiOfferConfig[] = [
    {
        id: 'AICONF-001',
        name: 'Q4 Holiday Push',
        status: 'Active',
        validity: { from: new Date('2024-10-01'), to: new Date('2024-12-31') },
        selectedParameters: ["frequent_flyer_status", "travel_purpose", "origin_destination", "date_time", "inventory_availability", "seasonality_events"],
    },
    {
        id: 'AICONF-002',
        name: 'Summer 2025 Leisure Travellers',
        status: 'Draft',
        validity: { from: new Date('2025-06-01'), to: new Date('2025-08-31') },
        selectedParameters: ["travel_purpose", "origin_destination", "date_time", "previous_booking_history", "geo_location"],
    },
    {
        id: 'AICONF-003',
        name: 'Default Configuration',
        status: 'Inactive',
        validity: { from: new Date('2024-01-01'), to: new Date('2024-12-31') },
        selectedParameters: ["origin_destination", "date_time", "inventory_availability"],
    }
];


export default function AIConfigurationPage() {
  const [configs, setConfigs] = useState<AiOfferConfig[]>(initialConfigs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AiOfferConfig | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (config: AiOfferConfig | null = null) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingConfig(null);
  };

  const handleFormSubmit = (data: AiOfferConfig) => {
    if (editingConfig) {
      setConfigs(configs.map((c) => (c.id === editingConfig.id ? { ...c, ...data } : c)));
      toast({ title: 'Configuration Updated' });
    } else {
      const newConfig = { ...data, id: `AICONF-00${configs.length + 1}`};
      setConfigs([newConfig, ...configs]);
      toast({ title: 'Configuration Created' });
    }
    handleDialogClose();
  };

  const getStatusBadgeVariant = (status: AiOfferConfig['status']) => {
    switch(status) {
        case 'Active': return 'default';
        case 'Draft': return 'secondary';
        case 'Inactive': return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
            AI Offer Configuration
            </h1>
            <p className="text-muted-foreground">
            Manage parameter configurations for the automated offer generation AI.
            </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create AI Configuration
        </Button>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>AI Configurations</CardTitle>
                <CardDescription>
                    Manage different parameter sets for the AI offer generator, active for specific time windows.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Configuration Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Validity Period</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {configs.map((config) => (
                            <TableRow key={config.id}>
                                <TableCell className="font-medium">{config.name}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(config.status)}>{config.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {format(config.validity.from, 'dd MMM, yyyy')} - {format(config.validity.to, 'dd MMM, yyyy')}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleOpenDialog(config)}>Edit</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
       </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{editingConfig ? 'Edit AI Configuration' : 'Create New AI Configuration'}</DialogTitle>
                    <DialogDescription>
                        Define the parameters the AI should consider when generating offers for a specific time window.
                    </DialogDescription>
                </DialogHeader>
                <AiOfferConfigForm 
                    config={editingConfig}
                    onSubmit={handleFormSubmit}
                    onCancel={handleDialogClose}
                />
            </DialogContent>
        </Dialog>
    </div>
  );
}