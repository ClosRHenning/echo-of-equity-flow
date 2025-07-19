import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface FearGreedIndexProps {
  value: number; // 0-100
}

export const FearGreedIndex = ({ value }: FearGreedIndexProps) => {
  const getSentimentData = (value: number) => {
    if (value >= 75) {
      return {
        label: "Extreme Greed",
        description: "Märkte könnten überkauft sein",
        color: "extreme-greed",
        bgColor: "bg-extreme-greed/10",
        textColor: "text-extreme-greed",
        icon: TrendingUp,
        advice: "Vorsicht vor Marktübertreibung"
      };
    } else if (value >= 55) {
      return {
        label: "Greed",
        description: "Optimistische Marktstimmung",
        color: "greed",
        bgColor: "bg-greed/10",
        textColor: "text-greed",
        icon: TrendingUp,
        advice: "Positive Stimmung dominiert"
      };
    } else if (value >= 45) {
      return {
        label: "Neutral",
        description: "Ausgewogene Marktstimmung",
        color: "neutral-sentiment",
        bgColor: "bg-neutral-sentiment/10",
        textColor: "text-neutral-sentiment",
        icon: Brain,
        advice: "Markt in Gleichgewicht"
      };
    } else if (value >= 25) {
      return {
        label: "Fear",
        description: "Pessimistische Marktstimmung",
        color: "fear",
        bgColor: "bg-fear/10",
        textColor: "text-fear",
        icon: TrendingDown,
        advice: "Vorsichtige Marktstimmung"
      };
    } else {
      return {
        label: "Extreme Fear",
        description: "Märkte könnten überverkauft sein",
        color: "extreme-fear",
        bgColor: "bg-extreme-fear/10",
        textColor: "text-extreme-fear",
        icon: TrendingDown,
        advice: "Potentielle Kaufgelegenheit"
      };
    }
  };

  const sentiment = getSentimentData(value);
  const IconComponent = sentiment.icon;

  // Calculate the position for the gauge needle
  const needleRotation = (value / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <Card className="shadow-card-custom border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary" />
          Fear & Greed Index
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Gauge Visualization */}
        <div className="relative">
          {/* Semi-circular progress background */}
          <div className="relative w-48 h-24 mx-auto">
            <svg 
              viewBox="0 0 200 100" 
              className="w-full h-full"
            >
              {/* Background arc */}
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                strokeLinecap="round"
              />
              
              {/* Color segments */}
              <defs>
                <linearGradient id="fearGreedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--extreme-fear))" />
                  <stop offset="25%" stopColor="hsl(var(--fear))" />
                  <stop offset="50%" stopColor="hsl(var(--neutral-sentiment))" />
                  <stop offset="75%" stopColor="hsl(var(--greed))" />
                  <stop offset="100%" stopColor="hsl(var(--extreme-greed))" />
                </linearGradient>
              </defs>
              
              {/* Colored progress arc */}
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="url(#fearGreedGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(value / 100) * 251.2} 251.2`}
                className="transition-all duration-1000 ease-out"
              />
              
              {/* Needle */}
              <g transform={`translate(100, 80) rotate(${needleRotation})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-60"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="4"
                  fill="hsl(var(--primary))"
                />
              </g>
            </svg>
          </div>
          
          {/* Center value display */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-3xl font-bold">{value}</div>
            <div className={`text-sm font-medium ${sentiment.textColor}`}>
              {sentiment.label}
            </div>
          </div>
        </div>

        {/* Progress bar alternative */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Extreme Fear</span>
            <span>Extreme Greed</span>
          </div>
          <Progress 
            value={value} 
            className="h-3 bg-muted"
          />
        </div>

        {/* Sentiment Details */}
        <div className={`rounded-lg p-4 ${sentiment.bgColor} border border-${sentiment.color}/20`}>
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className={`w-4 h-4 ${sentiment.textColor}`} />
            <span className={`font-medium ${sentiment.textColor}`}>
              {sentiment.label}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {sentiment.description}
          </p>
          
          <p className={`text-xs font-medium ${sentiment.textColor}`}>
            💡 {sentiment.advice}
          </p>
        </div>

        {/* Scale indicators */}
        <div className="grid grid-cols-5 gap-1 text-xs">
          <div className="text-center">
            <div className="w-full h-2 bg-extreme-fear/30 rounded mb-1"></div>
            <span className="text-extreme-fear font-medium">0-24</span>
            <div className="text-muted-foreground">Extreme Fear</div>
          </div>
          <div className="text-center">
            <div className="w-full h-2 bg-fear/30 rounded mb-1"></div>
            <span className="text-fear font-medium">25-44</span>
            <div className="text-muted-foreground">Fear</div>
          </div>
          <div className="text-center">
            <div className="w-full h-2 bg-neutral-sentiment/30 rounded mb-1"></div>
            <span className="text-neutral-sentiment font-medium">45-54</span>
            <div className="text-muted-foreground">Neutral</div>
          </div>
          <div className="text-center">
            <div className="w-full h-2 bg-greed/30 rounded mb-1"></div>
            <span className="text-greed font-medium">55-74</span>
            <div className="text-muted-foreground">Greed</div>
          </div>
          <div className="text-center">
            <div className="w-full h-2 bg-extreme-greed/30 rounded mb-1"></div>
            <span className="text-extreme-greed font-medium">75-100</span>
            <div className="text-muted-foreground">Extreme Greed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};