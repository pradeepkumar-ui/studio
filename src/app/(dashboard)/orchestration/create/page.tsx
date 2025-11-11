
'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChangeRequestForm, type ChangeRequest } from '@/components/forms/change-request-form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


export default function CreateChangeRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleFormSubmit = async (data: ChangeRequest) => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firestore is not available.",
        });
        return;
    }

    try {
        await addDoc(collection(firestore, 'changeRequests'), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        toast({
            title: 'Change Request Created',
            description: 'Your change request has been submitted for review.',
        });
        router.push('/orchestration');
    } catch(e: any) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "There was a problem with your request.",
        });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Change Request
        </h1>
        <p className="text-muted-foreground">
          Submit a new configuration change for review and approval.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Change Request Details</CardTitle>
            <CardDescription>Fill out the form below to create a new change request.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChangeRequestForm 
                onSubmit={handleFormSubmit}
                onCancel={() => router.back()}
            />
        </CardContent>
      </Card>
    </div>
  );
}
