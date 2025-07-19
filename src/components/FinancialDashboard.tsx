import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Brain, Zap } from 'lucide-react';
import { FearGreedIndex } from './FearGreedIndex';
import { VixDisplay } from './VixDisplay';
import { MarketMomentum } from './MarketMomentum';
import { NewsDigest } from './NewsDigest';
import { useToast } from '@/hooks/use-toast';

interface MarketData {
  fearGreedIndex: number;
  vix: number;
  spyPrice: number;
  spyChange: number;
  lastUpdated: string;
}

export const FinancialDashboard = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      // Simulated data - in real app you would fetch from APIs
      const simulatedData: MarketData = {
        fearGreedIndex: Math.floor(Math.random() * 100),
        vix: 15 + Math.random() * 25, // VIX typically ranges 10-40
        spyPrice: 450 + Math.random() * 50,
        spyChange: (Math.random() - 0.5) * 4,
        lastUpdated: new Date().toISOString(),
      };
      
      setMarketData(simulatedData);
      toast({
        title: "Daten aktualisiert",
        description: "Marktdaten erfolgreich geladen",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Marktdaten",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getMarketSentiment = () => {
    if (!marketData) return { text: "Laden...", color: "muted" };
    
    const { fearGreedIndex, vix } = marketData;
    
    if (fearGreedIndex >= 75 && vix < 20) {
      return { text: "Extrem Gierig", color: "extreme-greed" };
    } else if (fearGreedIndex >= 55 && vix < 25) {
      return { text: "Gierig", color: "greed" };
    } else if (fearGreedIndex <= 25 && vix > 30) {
      return { text: "Extrem Ängstlich", color: "extreme-fear" };
    } else if (fearGreedIndex <= 45 && vix > 25) {
      return { text: "Ängstlich", color: "fear" };
    } else {
      return { text: "Neutral", color: "neutral-sentiment" };
    }
  };

  const sentiment = getMarketSentiment();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Market Intelligence Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Echtzeitanalyse der wichtigsten Marktindikatoren
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`bg-${sentiment.color}/10 border-${sentiment.color} text-${sentiment.color}`}
            >
              <Brain className="w-3 h-3 mr-1" />
              {sentiment.text}
            </Badge>
            
            <Button 
              onClick={fetchMarketData} 
              disabled={isLoading}
              size="sm"
              className="shadow-primary"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* S&P 500 Quick View */}
          <Card className="shadow-card-custom border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                S&P 500
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${marketData?.spyPrice.toFixed(2) || "---"}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                (marketData?.spyChange || 0) >= 0 ? 'text-bull' : 'text-bear'
              }`}>
                {(marketData?.spyChange || 0) >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {marketData?.spyChange.toFixed(2) || "0.00"}%
              </div>
            </CardContent>
          </Card>

          {/* VIX Quick View */}
          <Card className="shadow-card-custom border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                VIX
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketData?.vix.toFixed(1) || "---"}
              </div>
              <div className="text-sm text-muted-foreground">
                Volatilitätsindex
              </div>
            </CardContent>
          </Card>

          {/* Fear & Greed Quick View */}
          <Card className="shadow-card-custom border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Fear & Greed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketData?.fearGreedIndex || "---"}
              </div>
              <div className="text-sm text-muted-foreground">
                Sentiment Index
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card className="shadow-card-custom border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Letztes Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {marketData?.lastUpdated 
                  ? new Date(marketData.lastUpdated).toLocaleTimeString('de-DE')
                  : "---"
                }
              </div>
              <div className="text-xs text-muted-foreground">
                Automatisch alle 5 Min.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Fear & Greed Index */}
          <div className="lg:col-span-1">
            <FearGreedIndex value={marketData?.fearGreedIndex || 50} />
          </div>

          {/* VIX Display */}
          <div className="lg:col-span-1">
            <VixDisplay value={marketData?.vix || 20} />
          </div>

          {/* Market Momentum */}
          <div className="lg:col-span-1 xl:col-span-1">
            <MarketMomentum 
              spyPrice={marketData?.spyPrice || 450}
              spyChange={marketData?.spyChange || 0}
            />
          </div>
        </div>

        {/* News Digest */}
        <div className="mt-8">
          <NewsDigest />
        </div>
      </div>
    </div>
  );
};