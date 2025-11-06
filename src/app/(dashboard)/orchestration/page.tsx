import { PlaceholderContent } from "@/components/layout/placeholder-content";
import { Workflow } from "lucide-react";

export default function OrchestrationPage() {
    return <PlaceholderContent 
        title="Offer-Order Orchestration" 
        description="A module to coordinate the end-to-end journey from Offer creation to Order fulfilment, ensuring data integrity, idempotency, and observability." 
        icon={Workflow} 
    />
}