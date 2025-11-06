import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function PlaceholderContent({ title, description, icon: Icon }: { title: string, description?: string, icon?: React.ElementType }) {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]">
      <div className="flex items-center gap-4">
        {Icon && <Icon className="w-8 h-8 text-muted-foreground" />}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      <Card className="flex-1 flex items-center justify-center border-dashed">
        <CardHeader className="text-center">
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This page is under construction.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
