import { AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode } from 'crawl4ai';

export class CrawlerService {
  private static instance: AsyncWebCrawler;

  private static async getInstance(): Promise<AsyncWebCrawler> {
    if (!this.instance) {
      const browserConfig = new BrowserConfig({
        headless: true,
        viewport_width: 1280,
        viewport_height: 720,
        text_mode: true
      });
      
      this.instance = new AsyncWebCrawler({ config: browserConfig });
    }
    return this.instance;
  }

  static async crawlWebsite(url: string, instructions: string) {
    try {
      const crawler = await this.getInstance();
      
      const runConfig = new CrawlerRunConfig({
        word_count_threshold: 200,
        cache_mode: CacheMode.ENABLED,
        js_code: null,
        wait_for: null,
        screenshot: false,
        enable_rate_limiting: true,
        verbose: true,
        stream: false
      });

      const response = await crawler.arun(url, runConfig);

      if (!response.success) {
        throw new Error(response.error_message);
      }

      return {
        markdown: response.markdown,
        html: response.html,
        data: response.extracted_content
      };
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