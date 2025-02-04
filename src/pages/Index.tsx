import { SuperCrawler } from "@/components/SuperCrawler";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeProvider } from "@/hooks/use-theme";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
        <div className="fixed top-4 right-4">
          <ThemeToggle />
        </div>
        <SuperCrawler />
      </div>
    </ThemeProvider>
  );
};

export default Index;