import asyncHandler from 'express-async-handler';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

// Helper function to extract metadata from a single URL
const extractMetadata = async (url) => {
  try {
    // Validate URL format
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }

    // Fetch the webpage content
    const response = await axios.get(url, {
      timeout: 8000, // 8 second timeout
      maxRedirects: 3,
      validateStatus: (status) => status < 400,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      }
    });

    // Validate response content type
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new Error('URL does not point to an HTML page');
    }

    // Parse HTML content
    const $ = cheerio.load(response.data);
    
    // Extract metadata
    const metadata = {
      url: url,
      title: '',
      description: '',
      image: '',
      siteName: '',
      favicon: '',
      type: 'website',
      author: '',
      publishedTime: '',
      tags: []
    };

    // Extract title
    metadata.title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    // Extract description
    metadata.description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // Extract image
    let imageUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      '';

    // If image URL is relative, make it absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
        metadata.image = new URL(imageUrl, baseUrl).toString();
      } catch (error) {
        console.warn('Failed to resolve image URL:', error.message);
        metadata.image = '';
      }
    } else {
      metadata.image = imageUrl;
    }

    // Extract site name
    metadata.siteName = 
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      urlObj.hostname ||
      '';

    // Extract favicon
    let faviconUrl = 
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico';

    // Make favicon URL absolute if relative
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      try {
        const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
        metadata.favicon = new URL(faviconUrl, baseUrl).toString();
      } catch (error) {
        metadata.favicon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
      }
    } else {
      metadata.favicon = faviconUrl;
    }

    // Extract type
    metadata.type = 
      $('meta[property="og:type"]').attr('content') ||
      'website';

    // Extract author
    metadata.author = 
      $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') ||
      '';

    // Extract published time
    metadata.publishedTime = 
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="date"]').attr('content') ||
      '';

    // Extract tags/keywords
    const keywords = $('meta[name="keywords"]').attr('content');
    if (keywords) {
      metadata.tags = keywords.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    // Clean up text content
    metadata.title = metadata.title.trim().substring(0, 300);
    metadata.description = metadata.description.trim().substring(0, 500);
    metadata.author = metadata.author.trim().substring(0, 100);

    return metadata;
    
  } catch (error) {
    console.error('Metadata extraction error for', url, ':', error.message);
    throw error;
  }
};

// @desc    Get metadata from URL
// @route   POST /api/metadata
// @access  Private
const getUrlMetadata = asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400);
    throw new Error('URL is required');
  }

  try {
    const metadata = await extractMetadata(url);
    
    res.json({
      success: true,
      data: metadata
    });

  } catch (error) {
    console.error('Metadata extraction error:', error.message);
    
    // Handle specific error cases with fallback responses
    if (error.code === 'ENOTFOUND') {
      console.warn('Website not found (ENOTFOUND), returning fallback response');
      return res.json({
        success: true,
        data: {
          url: url,
          title: 'Website Not Found',
          description: 'This website could not be reached or does not exist.',
          image: '',
          siteName: 'Unreachable',
          favicon: '',
          type: 'website',
          author: '',
          publishedTime: '',
          tags: []
        }
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.warn('Connection refused (ECONNREFUSED), returning fallback response');
      return res.json({
        success: true,
        data: {
          url: url,
          title: 'Connection Refused',
          description: 'The server refused the connection.',
          image: '',
          siteName: 'Unavailable',
          favicon: '',
          type: 'website',
          author: '',
          publishedTime: '',
          tags: []
        }
      });
    }
    
    if (error.code === 'ETIMEDOUT') {
      console.warn('Request timeout (ETIMEDOUT), returning fallback response');
      return res.json({
        success: true,
        data: {
          url: url,
          title: 'Request Timeout',
          description: 'The website took too long to respond.',
          image: '',
          siteName: 'Timeout',
          favicon: '',
          type: 'website',
          author: '',
          publishedTime: '',
          tags: []
        }
      });
    }
    
    if (error.response) {
      // HTTP error from the target website
      if (error.response.status === 404) {
        console.warn('Page not found (404), returning fallback response');
        return res.json({
          success: true,
          data: {
            url: url,
            title: 'Page Not Found',
            description: 'This page could not be found on the website.',
            image: '',
            siteName: new URL(url).hostname || 'Unknown',
            favicon: '',
            type: 'website',
            author: '',
            publishedTime: '',
            tags: []
          }
        });
      }
      
      if (error.response.status === 403) {
        // Return fallback response for 403 instead of throwing error
        console.warn('Website blocked access (403), returning fallback response');
        return res.json({
          success: true,
          data: {
            url: url,
            title: new URL(url).hostname || 'Blocked Website',
            description: 'This website blocks automatic data collection. Please enter title and description manually.',
            image: '',
            siteName: new URL(url).hostname || 'Unknown',
            favicon: '',
            type: 'website',
            author: '',
            publishedTime: '',
            tags: []
          }
        });
      }
      
      if (error.response.status >= 500) {
        console.warn('Target website server error (500+), returning fallback response');
        return res.json({
          success: true,
          data: {
            url: url,
            title: 'Server Error',
            description: 'The target website is experiencing server issues.',
            image: '',
            siteName: new URL(url).hostname || 'Unknown',
            favicon: '',
            type: 'website',
            author: '',
            publishedTime: '',
            tags: []
          }
        });
      }
    }
    
    // Instead of throwing an error, return a basic fallback response
    console.warn('Returning basic fallback metadata response due to error:', error.message);
    res.json({
      success: true,
      data: {
        url: url,
        title: url,
        description: 'Unable to extract metadata from this URL',
        image: '',
        siteName: new URL(url).hostname || 'Unknown',
        favicon: '',
        type: 'website',
        author: '',
        publishedTime: '',
        tags: []
      }
    });
  }
});

// @desc    Get metadata from multiple URLs
// @route   POST /api/metadata/batch
// @access  Private
const getBatchUrlMetadata = asyncHandler(async (req, res) => {
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    res.status(400);
    throw new Error('URLs array is required');
  }

  if (urls.length > 10) {
    res.status(400);
    throw new Error('Maximum 10 URLs allowed per batch request');
  }

  try {
    const results = await Promise.allSettled(
      urls.map(async (url) => {
        try {
          const metadata = await extractMetadata(url);
          return {
            url,
            success: true,
            data: metadata
          };
        } catch (error) {
          return {
            url,
            success: false,
            error: error.message || 'Failed to extract metadata'
          };
        }
      })
    );

    const processedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          url: urls[index],
          success: false,
          error: result.reason?.message || 'Unknown error'
        };
      }
    });

    res.json({
      success: true,
      data: processedResults
    });

  } catch (error) {
    console.error('Batch metadata extraction error:', error);
    // Return fallback response instead of 500 error
    return res.json({
      success: true,
      data: [],
      message: 'Some URLs could not be processed, returning partial results'
    });
  }
});

export {
  getUrlMetadata,
  getBatchUrlMetadata
};
