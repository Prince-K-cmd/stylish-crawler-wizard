interface CrawlResponse {
  success: boolean;
  markdown?: string;
  html?: string;
  extracted_content?: any;
  error_message?: string;
}

export class CrawlerService {
  private static API_URL = 'https://api.crawl4ai.com/v1'; // Replace with your actual API endpoint

  static async crawlWebsite(url: string, instructions: string) {
    try {
      const response = await fetch(`${this.API_URL}/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          instructions,
          config: {
            word_count_threshold: 200,
            cache_mode: 'enabled',
            enable_rate_limiting: true,
            verbose: true,
            stream: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CrawlResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error_message || 'Failed to crawl website');
      }

      return {
        markdown: result.markdown,
        html: result.html,
        data: result.extracted_content
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