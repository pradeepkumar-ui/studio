import FareChangeForecast from "@/components/ai/fare-change-forecast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics & Simulation
        </h1>
        <p className="text-muted-foreground">
          Forecast the impact of fare changes using AI-powered analysis.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fare Change Impact Forecast</CardTitle>
          <CardDescription>
            Enter a potential fare change scenario to receive AI-generated
            recommendations and a revenue forecast. For example, "What if we increase economy fares by 5% on the NYC-LAX route during summer?"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FareChangeForecast />
        </CardContent>
      </Card>
    </div>
  );
}
