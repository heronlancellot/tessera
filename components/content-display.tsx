import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentDisplayProps {
  tier: string;
  data: string;
  features?: string[];
  timestamp: string;
}

export function ContentDisplay({ tier, data, features, timestamp }: ContentDisplayProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Successful</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </Badge>
        </div>
        <CardDescription>
          <span className="text-sm text-muted-foreground">
            Tier: <span className="font-medium text-foreground">{tier}</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg font-medium mb-2">{data}</p>
          {features && features.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Unlocked Features:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Timestamp: {new Date(timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
