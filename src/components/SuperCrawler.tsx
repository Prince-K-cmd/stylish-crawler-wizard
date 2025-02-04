import { useState } from "react";
import { CrawlerService } from "@/services/crawlerService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function SuperCrawler() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setResult(null);

    try {
      const intervalId = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await CrawlerService.crawlWebsite(url, instructions);
      clearInterval(intervalId);
      setProgress(100);
      setResult(response);

      toast({
        title: "Success!",
        description: "Website crawled successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to crawl website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.data) {
      CrawlerService.downloadCSV(result.data, 'crawl-results.csv');
      toast({
        title: "Downloaded!",
        description: "Your results have been downloaded as CSV",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <Card className="glass-card p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Super Crawler
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Website URL
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="instructions" className="text-sm font-medium">
              Crawling Instructions
            </label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter specific instructions for crawling (e.g., 'Extract all product prices and names')"
              className="bg-background/50 min-h-[100px]"
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Crawling in progress...
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Crawling...
                </>
              ) : (
                "Start Crawling"
              )}
            </Button>
            
            {result && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDownload}
              >
                Download CSV
              </Button>
            )}
          </div>
        </form>
      </Card>

      {result && (
        <Card className="glass-card p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <pre className="bg-background/50 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}