import OfferRuleBuilder from "@/components/ai/offer-rule-builder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OfferRulesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Offer Rule Builder
        </h1>
        <p className="text-muted-foreground">
          Use natural language to generate structured offer rules.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Natural Language Rule Generation</CardTitle>
          <CardDescription>
            Describe the rule you want to create. For example, "Give a 10%
            discount on all flights from LHR to JFK for business class, valid
            for the month of December."
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OfferRuleBuilder />
        </CardContent>
      </Card>
    </div>
  );
}
