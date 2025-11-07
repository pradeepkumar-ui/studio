'use client';

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
import { PlusCircle, FileDown, UserX, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const kpiData = [
  { title: 'Total Users', value: '612' },
  { title: 'Active Users', value: '580' },
  { title: 'Suspended Users', value: '32' },
  { title: 'Pending Approvals', value: '5' },
];

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Finance Admin' | 'Revenue Accountant' | 'Billing Officer' | 'Auditor' | 'System Admin' | 'Agent';
  status: 'Active' | 'Suspended';
  lastLogin: string;
};

const mockUsers: User[] = [
  { id: 'USR_101', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Finance Admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: 'USR_102', name: 'Bob Williams', email: 'bob.w@example.com', role: 'Revenue Accountant', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'USR_103', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Billing Officer', status: 'Active', lastLogin: '25 mins ago' },
  { id: 'USR_104', name: 'Diana Miller', email: 'diana.m@example.com', role: 'Auditor', status: 'Active', lastLogin: '5 hours ago' },
  { id: 'USR_105', name: 'Ethan Davis', email: 'ethan.d@example.com', role: 'System Admin', status: 'Suspended', lastLogin: '3 days ago' },
  { id: 'USR_106', name: 'Fiona Green', email: 'fiona.g@example.com', role: 'Agent', status: 'Active', lastLogin: '15 mins ago' },
  { id: 'USR_107', name: 'George Harris', email: 'george.h@example.com', role: 'Revenue Accountant', status: 'Active', lastLogin: '8 hours ago' },
  { id: 'USR_108', name: 'Hannah Ives', email: 'hannah.i@example.com', role: 'Billing Officer', status: 'Suspended', lastLogin: '1 week ago' },
  { id: 'USR_109', name: 'Ian Jenkins', email: 'ian.j@example.com', role: 'Auditor', status: 'Active', lastLogin: '2 days ago' },
  { id: 'USR_110', name: 'Jessica King', email: 'jessica.k@example.com', role: 'Finance Admin', status: 'Active', lastLogin: '5 mins ago' },
];

const getStatusBadgeVariant = (status: User['status']) => {
  switch (status) {
    case 'Active': return 'default';
    case 'Suspended': return 'destructive';
    default: return 'outline';
  }
};

const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
        case 'Finance Admin':
        case 'System Admin': 
            return 'secondary';
        case 'Auditor':
            return 'outline';
        default: return 'outline';
    }
}


export default function UserManagementPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    User Management Console
                </h1>
                <p className="text-muted-foreground">
                    Manage users, roles, and permissions for the Order Accounting System.
                </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><UserX className="mr-2 h-4 w-4" /> Revoke Access</Button>
                    <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export Audit</Button>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add User</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi) => (
                <Card key={kpi.title}>
                    <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        {kpi.title}
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    </CardContent>
                </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Directory</CardTitle>
                    <CardDescription>
                        A list of all users with access to the accounting system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Login</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell>{user.lastLogin}</TableCell>
                                     <TableCell>
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                            >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
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
    )
}
