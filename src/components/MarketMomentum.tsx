import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface MarketMomentumProps {
  spyPrice: number;
  spyChange: number;
}

export const MarketMomentum = ({ spyPrice, spyChange }: MarketMomentumProps) => {
  const isPositive = spyChange >= 0;
  const absChange = Math.abs(spyChange);
  
  const getMomentumStrength = (change: number) => {
    const abs = Math.abs(change);
    if (abs >= 2) return "Stark";
    if (abs >= 1) return "Moderat"; 
    if (abs >= 0.5) return "Schwach";
    return "Minimal";
  };

  const getMomentumData = (change: number) => {
    const strength = getMomentumStrength(change);
    const isUp = change >= 0;
    
    return {
      direction: isUp ? "Aufwärts" : "Abwärts",
      strength,
      color: isUp ? "bull" : "bear",
      bgColor: isUp ? "bg-bull/10" : "bg-bear/10",
      textColor: isUp ? "text-bull" : "text-bear",
      icon: isUp ? TrendingUp : TrendingDown,
      momentum: Math.abs(change) >= 1 ? "Hoch" : Math.abs(change) >= 0.5 ? "Mittel" : "Niedrig"
    };
  };

  const momentum = getMomentumData(spyChange);
  const IconComponent = momentum.icon;

  // Generate some technical indicators (simplified simulation)
  const rsi = 45 + Math.random() * 20; // 45-65 range
  const macd = (Math.random() - 0.5) * 2; // -1 to 1 range
  const volume = "1.2M"; // Simplified volume

  return (
    <Card className="shadow-card-custom border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5 text-primary" />
          Market Momentum
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Price & Change */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            ${spyPrice.toFixed(2)}
          </div>
          <div className={`flex items-center justify-center gap-1 text-lg font-medium ${momentum.textColor}`}>
            <IconComponent className="w-4 h-4" />
            {isPositive ? '+' : ''}{spyChange.toFixed(2)}%
          </div>
        </div>

        {/* Momentum Analysis */}
        <div className={`rounded-lg p-4 ${momentum.bgColor} border border-${momentum.color}/20`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconComponent className={`w-5 h-5 ${momentum.textColor}`} />
              <span className={`font-medium ${momentum.textColor}`}>
                {momentum.direction} Momentum
              </span>
            </div>
            <Badge variant="outline" className={`${momentum.textColor} border-${momentum.color}`}>
              {momentum.strength}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Das aktuelle Momentum zeigt eine {momentum.strength.toLowerCase()}e {momentum.direction.toLowerCase()}e Bewegung.
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Technische Indikatoren
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {/* RSI */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <div>
                <div className="font-medium text-sm">RSI (14)</div>
                <div className="text-xs text-muted-foreground">Relative Strength Index</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{rsi.toFixed(1)}</div>
                <div className={`text-xs ${
                  rsi > 70 ? 'text-bear' : 
                  rsi < 30 ? 'text-bull' : 
                  'text-neutral-sentiment'
                }`}>
                  {rsi > 70 ? 'Überkauft' : rsi < 30 ? 'Überverkauft' : 'Neutral'}
                </div>
              </div>
            </div>

            {/* MACD */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <div>
                <div className="font-medium text-sm">MACD</div>
                <div className="text-xs text-muted-foreground">Moving Average Convergence</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{macd.toFixed(3)}</div>
                <div className={`text-xs ${macd > 0 ? 'text-bull' : 'text-bear'}`}>
                  {macd > 0 ? 'Bullish' : 'Bearish'}
                </div>
              </div>
            </div>

            {/* Volume */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
              <div>
                <div className="font-medium text-sm">Volumen</div>
                <div className="text-xs text-muted-foreground">Handelsvolumen</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{volume}</div>
                <div className="text-xs text-neutral-sentiment">Normal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Momentum Strength Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Momentum Stärke</span>
            <span className="font-medium">{momentum.momentum}</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isPositive ? 'bg-bull' : 'bg-bear'
              }`}
              style={{ 
                width: `${Math.min((absChange / 3) * 100, 100)}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Schwach</span>
            <span>Stark</span>
          </div>
        </div>

        {/* Quick Interpretation */}
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/20 p-3 rounded-lg">
          <div className="font-medium mb-2">Schnelle Einschätzung:</div>
          <div>
            • Trend: {momentum.direction} ({momentum.strength})
          </div>
          <div>
            • RSI: {rsi > 70 ? 'Überkauft - Korrektur möglich' : rsi < 30 ? 'Überverkauft - Erholung möglich' : 'Neutral - Fortsetzung wahrscheinlich'}
          </div>
          <div>
            • MACD: {macd > 0 ? 'Positive Dynamik' : 'Negative Dynamik'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};