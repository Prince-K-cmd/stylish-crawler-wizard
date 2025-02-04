import FirecrawlApp from '@mendable/firecrawl-js';

const API_KEY = import.meta.env.VITE_FIRECRAWL_API_KEY;

export class CrawlerService {
  private static instance: FirecrawlApp;

  private static getInstance(): FirecrawlApp {
    if (!this.instance) {
      this.instance = new FirecrawlApp({ apiKey: API_KEY });
    }
    return this.instance;
  }

  static async crawlWebsite(url: string, instructions: string) {
    try {
      const crawler = this.getInstance();
      const response = await crawler.crawlUrl(url, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html', 'json'],
          instructions // Using the standard 'instructions' property instead of 'customInstructions'
        }
      });

      return response;
    } catch (error) {
      console.error('Crawling error:', error);
      throw error;
    }
  }

  static downloadCSV(data: any[], filename: string) {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }
}