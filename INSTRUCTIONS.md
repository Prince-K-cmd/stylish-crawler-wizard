# Crawler Application Setup Instructions

## Prerequisites

Before setting up the application, ensure you have the following installed:
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

## Backend Setup

1. First, create a new directory for the backend server:
```bash
mkdir crawler-backend
cd crawler-backend
```

2. Create a Python virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install the required Python packages:
```bash
pip install flask flask-cors crawl4ai python-dotenv
```

4. Create a new file `server.py`:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
import asyncio

app = Flask(__name__)
CORS(app)

@app.route('/api/crawl', methods=['POST'])
def crawl():
    data = request.json
    url = data.get('url')
    instructions = data.get('instructions')
    
    # Initialize crawler configurations
    browser_config = BrowserConfig(
        headless=True,
        viewport_width=1280,
        viewport_height=720,
        text_mode=True
    )
    
    run_config = CrawlerRunConfig(
        word_count_threshold=200,
        cache_mode='enabled',
        enable_rate_limiting=True,
        verbose=True,
        stream=False
    )
    
    try:
        # Create crawler instance
        crawler = AsyncWebCrawler(config=browser_config)
        
        # Run the crawl
        result = asyncio.run(crawler.arun(url, run_config))
        
        return jsonify({
            'success': True,
            'markdown': result.markdown,
            'html': result.html,
            'extracted_content': result.extracted_content
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error_message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

5. Create a `.env` file in the backend directory:
```
FLASK_APP=server.py
FLASK_ENV=development
```

## Frontend Setup

1. Update the API endpoint in `src/services/crawlerService.ts`:
```typescript
private static API_URL = 'http://localhost:5000/api';  // Update this line
```

## Running the Application

1. Start the backend server:
```bash
cd crawler-backend
source venv/bin/activate  # On Windows use: venv\Scripts\activate
flask run
```

2. Start the frontend development server (in a new terminal):
```bash
npm run dev
```

## Configuration Notes

- The backend server runs on port 5000 by default
- The frontend development server typically runs on port 8080
- CORS is enabled on the backend to allow requests from the frontend
- Make sure both servers are running simultaneously for the application to work

## Troubleshooting

1. If you get CORS errors:
   - Ensure the backend server is running
   - Check that the API_URL in crawlerService.ts matches your backend server address
   - Verify that CORS is properly configured in the Flask server

2. If crawling fails:
   - Check the Python console for backend errors
   - Verify that the URL being crawled is accessible
   - Ensure all Python dependencies are properly installed

3. If the frontend can't connect to the backend:
   - Verify both servers are running
   - Check the API_URL configuration
   - Look for any error messages in the browser console

## Security Considerations

- This setup is for development purposes. For production:
  - Add proper authentication
  - Use HTTPS
  - Implement rate limiting
  - Add input validation
  - Configure proper CORS settings
  - Use environment variables for sensitive configurations

## Additional Resources

- Flask Documentation: https://flask.palletsprojects.com/
- Crawl4AI Documentation: https://crawl4ai.com/docs/
- React Documentation: https://reactjs.org/