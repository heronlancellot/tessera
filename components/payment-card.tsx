import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentCardProps {
  tier: string;
  price: string;
  description: string;
  features?: string[];
  onPayClick: () => void;
  isPaying: boolean;
}

export function PaymentCard({ tier, price, description, features, onPayClick, isPaying }: PaymentCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{tier}</CardTitle>
          <Badge variant={tier === "Premium" ? "default" : "secondary"}>
            {tier === "Premium" ? "Hot" : "Popular"}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-4">{price} <span className="text-sm text-muted-foreground">USDC</span></div>
        {features && features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onPayClick}
          disabled={isPaying}
        >
          {isPaying ? "Processing..." : "Pay Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
