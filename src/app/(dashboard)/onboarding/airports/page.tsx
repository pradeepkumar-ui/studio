
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, MonitorDot, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockAirports = [
    { id: '1', name: 'Heathrow Airport', code: 'LHR', city: 'London', status: 'Active', sitaEnabled: true },
    { id: '2', name: 'John F. Kennedy', code: 'JFK', city: 'New York', status: 'Active', sitaEnabled: true },
    { id: '3', name: 'Changi Airport', code: 'SIN', city: 'Singapore', status: 'Onboarding', sitaEnabled: true },
    { id: '4', name: 'Dubai International', code: 'DXB', city: 'Dubai', status: 'Active', sitaEnabled: true },
];

export default function AirportOnboardingPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Airport Onboarding</h1>
                    <p className="text-muted-foreground">Manage participating airports and SITA terminal integration status.</p>
                </div>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Onboard Airport</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Participating Airports</CardTitle>
                    <CardDescription>View and manage airports enabled for Offersense retailing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by name or IATA code..." className="pl-9" />
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Airport Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>SITA Enabled</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAirports.map((airport) => (
                                <TableRow key={airport.id}>
                                    <TableCell className="font-medium">{airport.name}</TableCell>
                                    <TableCell className="font-mono">{airport.code}</TableCell>
                                    <TableCell>{airport.city}</TableCell>
                                    <TableCell>
                                        {airport.sitaEnabled ? (
                                            <Badge variant="default" className="bg-blue-500"><MonitorDot className="mr-1 h-3 w-3" /> CUSS/CUTE</Badge>
                                        ) : (
                                            <Badge variant="outline">Web Only</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={airport.status === 'Active' ? 'default' : 'secondary'}>{airport.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
