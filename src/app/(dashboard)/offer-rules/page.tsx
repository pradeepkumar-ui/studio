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
            Describe the rule you want to create. For example, "Create a rule named 'Summer EU-US Promo' that gives a 15% discount on business class flights from any airport in Germany (FRA, MUC) to New York (JFK, EWR) for travel between June 1st and August 31st, 2024."
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OfferRuleBuilder />
        </CardContent>
      </Card>
    </div>
  );
}
