
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  MoreHorizontal,
  PlusCircle,
  BarChart2,
  Play,
  Pause,
  Copy,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CampaignForm, type Campaign } from '@/components/forms/campaign-form';

const kpiData = [
  { title: 'Active Campaigns', value: '12' },
  { title: 'Total Reach', value: '1.4M' },
  { title: 'Conversions', value: '25,680' },
  { title: 'Conversion Rate', value: '1.83%' },
];

const mockCampaigns: Campaign[] = [
  {
    id: 'CAMP-001',
    name: 'Winter 2025 Early Bird',
    status: 'Active',
    channel: 'Email, Web',
    targetAudience: 'EU Leisure Travelers',
    schedule: '2025-09-01 to 2025-10-31',
    conversions: 1250,
  },
  {
    id: 'CAMP-002',
    name: 'Q4 Business Travel Promo',
    status: 'Active',
    channel: 'TMC, API',
    targetAudience: 'US Corporate',
    schedule: '2025-10-01 to 2025-12-15',
    conversions: 840,
  },
  {
    id: 'CAMP-003',
    name: 'Diwali Special - India',
    status: 'Scheduled',
    channel: 'Web, Mobile App',
    targetAudience: 'India POS',
    schedule: '2025-11-01 to 2025-11-10',
    conversions: 0,
  },
  {
    id: 'CAMP-004',
    name: 'Summer 2025 Flash Sale',
    status: 'Completed',
    channel: 'All',
    targetAudience: 'All Users',
    schedule: '2025-07-15 to 2025-07-16',
    conversions: 4231,
  },
  {
    id: 'CAMP-005',
    name: 'New Route: SIN-SEA',
    status: 'Paused',
    channel: 'Web, Email',
    targetAudience: 'APAC Frequent Flyers',
    schedule: '2025-08-01 to 2025-08-31',
    conversions: 212,
  },
];

const getStatusBadgeVariant = (status: Campaign['status']) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Scheduled':
      return 'secondary';
    case 'Paused':
    case 'Completed':
      return 'outline';
  }
};

export default function CampaignManagementPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  const handleOpenDialog = (campaign: Campaign | null = null) => {
    setEditingCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCampaign(null);
  };

  const handleFormSubmit = (data: Campaign) => {
    if (editingCampaign) {
      setCampaigns(
        campaigns.map((c) => (c.id === editingCampaign.id ? { ...c, ...data } : c))
      );
      toast({
        title: 'Campaign Updated',
        description: `Campaign "${data.name}" has been updated.`,
      });
    } else {
      const newCampaign: Campaign = {
        ...data,
        id: `CAMP-${String(campaigns.length + 1).padStart(3, '0')}`,
        conversions: 0,
      };
      setCampaigns([newCampaign, ...campaigns]);
      toast({
        title: 'Campaign Created',
        description: `Campaign "${data.name}" has been created.`,
      });
    }
    handleDialogClose();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Campaign Management
            </h1>
            <p className="text-muted-foreground">
              Create, schedule, and monitor marketing and promotional campaigns.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>
              A list of all active, scheduled, and past campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.channel}</TableCell>
                    <TableCell>{campaign.targetAudience}</TableCell>
                    <TableCell>{campaign.schedule}</TableCell>
                    <TableCell>{campaign.conversions.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(campaign)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Performance</DropdownMenuItem>
                          <DropdownMenuItem>
                            {campaign.status === 'Active' ? (
                              <><Pause className="mr-2 h-4 w-4" /> Pause</>
                            ) : (
                              <><Play className="mr-2 h-4 w-4" /> Activate</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
            <DialogDescription>
              Define the parameters for your campaign.
            </DialogDescription>
          </DialogHeader>
          <CampaignForm
            campaign={editingCampaign}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

