import { describe, it, expect } from 'vitest';
import { extractImagesFromContent } from './nostrService';

describe('nostrService', () => {
  describe('extractImagesFromContent', () => {
    it('should extract multiple image URLs from content', () => {
      const content =
        'Check this out: https://example.com/image1.jpg and another one https://foo.bar/photo.png?size=large';
      const images = extractImagesFromContent(content);
      expect(images).toEqual([
        'https://example.com/image1.jpg',
        'https://foo.bar/photo.png?size=large',
      ]);
    });

    it('should return an empty array if no images found', () => {
      const content =
        'Just some text with a link to https://google.com but no image.';
      const images = extractImagesFromContent(content);
      expect(images).toEqual([]);
    });

    it('should remove duplicate image URLs', () => {
      const content =
        'Same image twice: https://site.com/img.webp and https://site.com/img.webp';
      const images = extractImagesFromContent(content);
      expect(images).toHaveLength(1);
      expect(images[0]).toBe('https://site.com/img.webp');
    });

    it('should handle various image extensions', () => {
      const content = 'List: img.png, img.JPG, img.gif, img.svg, img.webp';
      // Note: the regex requires http(s)://
      const contentWithUrls =
        'https://a.com/i.png https://b.com/i.JPG https://c.com/i.gif https://d.com/i.svg https://e.com/i.webp';
      const images = extractImagesFromContent(contentWithUrls);
      expect(images).toHaveLength(5);
    });
  });
});
