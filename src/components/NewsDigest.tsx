import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  timestamp: string;
  url: string;
  impact: 'high' | 'medium' | 'low';
}

export const NewsDigest = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSimulatedNews = (): NewsItem[] => {
    const newsTemplates = [
      {
        title: "Fed-Protokoll zeigt Diskussion über Zinssenkungen",
        summary: "Die Federal Reserve diskutiert weitere Zinssenkungen zur Unterstützung der Wirtschaft. Märkte reagieren positiv auf die dovish Signale.",
        sentiment: 'positive' as const,
        category: "Zentralbank",
        impact: 'high' as const
      },
      {
        title: "Quartalsergebnisse der Tech-Giganten übertreffen Erwartungen",
        summary: "Apple, Microsoft und Google melden starke Quartalszahlen. Besonders die KI-Sparte zeigt überdurchschnittliches Wachstum.",
        sentiment: 'positive' as const,
        category: "Technologie",
        impact: 'high' as const
      },
      {
        title: "Inflation zeigt erste Anzeichen einer Verlangsamung",
        summary: "Die neuesten Inflationsdaten deuten auf eine Entspannung hin. Core-CPI liegt unter den Erwartungen der Analysten.",
        sentiment: 'positive' as const,
        category: "Wirtschaftsdaten",
        impact: 'medium' as const
      },
      {
        title: "Geopolitische Spannungen belasten Rohstoffmärkte",
        summary: "Unruhen in wichtigen Rohstoffregionen führen zu Preissteigerungen bei Öl und Gas. Versorgungsengpässe befürchtet.",
        sentiment: 'negative' as const,
        category: "Geopolitik",
        impact: 'medium' as const
      },
      {
        title: "Chinas Wachstumsdaten enttäuschen Anleger",
        summary: "Das BIP-Wachstum liegt unter den Prognosen. Immobiliensektor weiterhin unter Druck, Stimulus-Maßnahmen erwartet.",
        sentiment: 'negative' as const,
        category: "International",
        impact: 'medium' as const
      },
      {
        title: "Arbeitsmarktdaten zeigen robuste Beschäftigung",
        summary: "Arbeitslosenquote sinkt weiter, Jobwachstum übertrifft Erwartungen. Fed könnte Zinspolitik überdenken.",
        sentiment: 'neutral' as const,
        category: "Arbeitsmarkt",
        impact: 'medium' as const
      }
    ];

    return newsTemplates.slice(0, 4).map((template, index) => ({
      id: `news-${index}`,
      ...template,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(), // Random time within last 6 hours
      url: "#"
    }));
  };

  const fetchNews = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNews(generateSimulatedNews());
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getSentimentData = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: 'text-bull',
          bgColor: 'bg-bull/10',
          borderColor: 'border-bull/20',
          icon: TrendingUp
        };
      case 'negative':
        return {
          color: 'text-bear',
          bgColor: 'bg-bear/10', 
          borderColor: 'border-bear/20',
          icon: TrendingDown
        };
      default:
        return {
          color: 'text-neutral-sentiment',
          bgColor: 'bg-neutral-sentiment/10',
          borderColor: 'border-neutral-sentiment/20',
          icon: Clock
        };
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-destructive text-destructive bg-destructive/10';
      case 'medium': return 'border-neutral-sentiment text-neutral-sentiment bg-neutral-sentiment/10';
      default: return 'border-muted-foreground text-muted-foreground bg-muted/10';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Gerade eben';
    if (diffInHours === 1) return 'Vor 1 Stunde';
    return `Vor ${diffInHours} Stunden`;
  };

  return (
    <Card className="shadow-card-custom border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Newspaper className="w-6 h-6 text-primary" />
            Markt-Nachrichten Digest
          </CardTitle>
          
          <Button 
            onClick={fetchNews} 
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Die wichtigsten Börsennachrichten und deren Marktauswirkungen
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => {
              const sentimentData = getSentimentData(item.sentiment);
              const SentimentIcon = sentimentData.icon;
              
              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-lg border ${sentimentData.borderColor} ${sentimentData.bgColor} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-sm leading-tight flex-1">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge 
                        variant="outline" 
                        className={getImpactColor(item.impact)}
                      >
                        {item.impact === 'high' ? 'Hoch' : item.impact === 'medium' ? 'Mittel' : 'Niedrig'}
                      </Badge>
                      
                      <SentimentIcon className={`w-4 h-4 ${sentimentData.color}`} />
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {item.summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-1 text-xs hover:bg-background/80"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Lesen
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* News Summary */}
        {!isLoading && news.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-muted">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Markt-Sentiment Analyse
            </h4>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-bull font-bold">
                  {news.filter(n => n.sentiment === 'positive').length}
                </div>
                <div className="text-muted-foreground">Positiv</div>
              </div>
              
              <div className="text-center">
                <div className="text-neutral-sentiment font-bold">
                  {news.filter(n => n.sentiment === 'neutral').length}
                </div>
                <div className="text-muted-foreground">Neutral</div>
              </div>
              
              <div className="text-center">
                <div className="text-bear font-bold">
                  {news.filter(n => n.sentiment === 'negative').length}
                </div>
                <div className="text-muted-foreground">Negativ</div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-muted-foreground">
              Gesamtstimmung: {
                news.filter(n => n.sentiment === 'positive').length > news.filter(n => n.sentiment === 'negative').length
                  ? "📈 Eher positiv"
                  : news.filter(n => n.sentiment === 'positive').length < news.filter(n => n.sentiment === 'negative').length
                  ? "📉 Eher negativ"
                  : "⚖️ Ausgewogen"
              }
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};