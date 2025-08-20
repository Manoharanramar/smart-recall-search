import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Brain, Clock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  response: string;
  knowledgeMatches: Array<{
    title: string;
    content: string;
    tags: string[];
    created_at: string;
  }>;
  processingTime: number;
  queryId: string;
}

export const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search query to get started.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the smart search feature.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('smart-search', {
        body: { query, userId: user.id }
      });

      if (error) throw error;

      setResult(data);
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
      setQuery('');
      
      toast({
        title: "Search Complete",
        description: `Found results in ${data.processingTime}ms`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to process your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Input */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Smart Recall Search
          </CardTitle>
          <p className="text-muted-foreground">
            Enter fragments like "blue icon, last week, something about AI" - I'll help find what you're looking for!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="e.g., 'blue folder, yesterday, presentation about marketing...' or 'something with charts, maybe from John, last month'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[80px] resize-none"
              disabled={isSearching}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !query.trim()}
              className="px-6"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyQuery, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => setQuery(historyQuery)}
                  >
                    {historyQuery.length > 30 ? `${historyQuery.slice(0, 30)}...` : historyQuery}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {result && (
        <div className="space-y-4">
          {/* AI Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Smart Search Result
                <Badge variant="outline" className="ml-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  {result.processingTime}ms
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {result.response}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Base Matches */}
          {result.knowledgeMatches && result.knowledgeMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Related Content Found ({result.knowledgeMatches.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.knowledgeMatches.map((match, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4 space-y-2">
                    <h4 className="font-medium text-foreground">{match.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {match.content}
                    </p>
                    {match.tags && match.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {match.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Example Queries */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Try these example searches:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "blue presentation, last week, marketing team",
              "PDF file, John sent it, budget numbers",
              "spreadsheet with charts, yesterday or today",  
              "document about AI, green folder, maybe July"
            ].map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start text-left h-auto p-3"
                onClick={() => setQuery(example)}
              >
                <span className="text-sm text-muted-foreground">{example}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};