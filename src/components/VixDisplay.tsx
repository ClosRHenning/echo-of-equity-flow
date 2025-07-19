import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Zap } from 'lucide-react';

interface VixDisplayProps {
  value: number; // VIX value (usually 10-50)
}

export const VixDisplay = ({ value }: VixDisplayProps) => {
  const getVolatilityData = (vix: number) => {
    if (vix >= 30) {
      return {
        level: "Hoch",
        description: "Erhöhte Marktvolatilität erwartet",
        color: "high-volatility",
        bgColor: "bg-high-volatility/10",
        textColor: "text-high-volatility",
        icon: AlertTriangle,
        interpretation: "Starke Marktunsicherheit",
        range: "30+"
      };
    } else if (vix >= 20) {
      return {
        level: "Mittel",
        description: "Moderate Marktvolatilität",
        color: "medium-volatility", 
        bgColor: "bg-medium-volatility/10",
        textColor: "text-medium-volatility",
        icon: Zap,
        interpretation: "Normale Marktschwankungen",
        range: "20-30"
      };
    } else {
      return {
        level: "Niedrig",
        description: "Geringe Marktvolatilität",
        color: "low-volatility",
        bgColor: "bg-low-volatility/10", 
        textColor: "text-low-volatility",
        icon: Shield,
        interpretation: "Ruhige Marktbedingungen",
        range: "10-20"
      };
    }
  };

  const volatility = getVolatilityData(value);
  const IconComponent = volatility.icon;
  
  // Normalize VIX for progress bar (0-50 range to 0-100%)
  const progressValue = Math.min((value / 50) * 100, 100);

  return (
    <Card className="shadow-card-custom border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-primary" />
          VIX Volatilitätsindex
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main VIX Value Display */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">
            {value.toFixed(1)}
          </div>
          <div className={`text-lg font-medium ${volatility.textColor}`}>
            {volatility.level} Volatilität
          </div>
        </div>

        {/* Visual Progress Indicator */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Niedrig (10)</span>
            <span>Hoch (50+)</span>
          </div>
          
          <div className="relative">
            <Progress 
              value={progressValue} 
              className="h-4 bg-muted"
            />
            {/* Current value marker */}
            <div 
              className="absolute top-0 h-4 w-1 bg-primary transform -translate-x-0.5"
              style={{ left: `${progressValue}%` }}
            />
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            Aktueller Wert: {value.toFixed(1)}
          </div>
        </div>

        {/* Volatility Assessment */}
        <div className={`rounded-lg p-4 ${volatility.bgColor} border border-${volatility.color}/20`}>
          <div className="flex items-center gap-2 mb-3">
            <IconComponent className={`w-5 h-5 ${volatility.textColor}`} />
            <span className={`font-medium ${volatility.textColor}`}>
              {volatility.level} Volatilität ({volatility.range})
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {volatility.description}
          </p>
          
          <p className={`text-sm font-medium ${volatility.textColor}`}>
            📊 {volatility.interpretation}
          </p>
        </div>

        {/* VIX Level Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded-lg bg-low-volatility/10 border border-low-volatility/20">
            <div className="font-medium text-low-volatility mb-1">10-20</div>
            <div className="text-muted-foreground">Niedrig</div>
            <div className="text-low-volatility">😌 Ruhig</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-medium-volatility/10 border border-medium-volatility/20">
            <div className="font-medium text-medium-volatility mb-1">20-30</div>
            <div className="text-muted-foreground">Mittel</div>
            <div className="text-medium-volatility">⚡ Normal</div>
          </div>
          
          <div className="text-center p-2 rounded-lg bg-high-volatility/10 border border-high-volatility/20">
            <div className="font-medium text-high-volatility mb-1">30+</div>
            <div className="text-muted-foreground">Hoch</div>
            <div className="text-high-volatility">🚨 Unruhig</div>
          </div>
        </div>

        {/* Historical Context */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-medium mb-2">Historischer Kontext:</div>
          <div>• Durchschnitt: ~19</div>
          <div>• 2008 Finanzkrise: 80+</div>
          <div>• 2020 Pandemic: 82</div>
          <div>• Ruhige Zeiten: 10-15</div>
        </div>
      </CardContent>
    </Card>
  );
};