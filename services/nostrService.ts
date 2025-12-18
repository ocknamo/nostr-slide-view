import { SimplePool } from 'nostr-tools';
import type { NostrEvent, SlideData } from '../types';

// Default highly available relays
const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.primal.net',
  'wss://yabu.me/',
];

// Regex to find image URLs
const IMAGE_REGEX = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?.*)?)/gi;

export const extractImagesFromContent = (content: string): string[] => {
  const splitted = content.split(/[\s]+/);
  const matches = []
  splitted.forEach(c => {
    const match = c.match(IMAGE_REGEX);
    if (match) {
      matches.push(...match);
    }
  });
  return matches ? Array.from(new Set(matches)) : []; // Remove duplicates
};

export const fetchThreadSlides = async (
  input: string,
  onProgress: (count: number) => void
): Promise<SlideData[]> => {
  const pool = new SimplePool();

  try {
    let rootId = '';

    // Step 1: Clean and Resolve Root ID
    let cleanId = input.trim();
    // Support nevent1 (preferred) and note1 (fallback)
    const urlMatch = cleanId.match(/(?:nevent1|note1)[a-z0-9]+/);
    if (urlMatch) cleanId = urlMatch[0];

    const { nip19 } = await import('nostr-tools');

    try {
      const decoded = nip19.decode(cleanId);
      if (decoded.type === 'note') {
        rootId = decoded.data;
      } else if (decoded.type === 'nevent') {
        rootId = decoded.data.id;
      } else {
        rootId = cleanId; // Try as hex
      }
    } catch (e) {
      console.warn('Could not decode with nip19, trying as hex', e);
      rootId = cleanId;
    }

    // Fetch the root event
    const rootEvent = await pool.get(RELAYS, { ids: [rootId] });

    if (!rootEvent) {
      throw new Error(
        'Could not find the initial event. Please check the ID or Relays.'
      );
    }

    const eventsToProcess: NostrEvent[] = [rootEvent];

    // Step 2: Fetch replies.
    // We want events that have an 'e' tag pointing to this rootId.
    const replies = await pool.querySync(RELAYS, {
      kinds: [1],
      '#e': [rootId],
    });

    eventsToProcess.push(...replies);

    // Filter: Sort by created_at to maintain thread order
    eventsToProcess.sort((a, b) => a.created_at - b.created_at);

    const slides: SlideData[] = [];
    const seenImageUrls = new Set<string>();

    eventsToProcess.forEach((event) => {
      const images = extractImagesFromContent(event.content);

      images.forEach((imgUrl) => {
        if (!seenImageUrls.has(imgUrl)) {
          seenImageUrls.add(imgUrl);

          // Clean content: Remove the image URL from the text so it doesn't duplicate visually
          const cleanContent = event.content.replace(imgUrl, '').trim();

          slides.push({
            id: `${event.id}-${imgUrl}`,
            imageUrl: imgUrl,
            content: cleanContent,
            authorPubkey: event.pubkey,
            createdAt: event.created_at,
            eventId: event.id,
          });
        }
      });
      onProgress(slides.length);
    });

    pool.close(RELAYS);
    return slides;
  } catch (error) {
    pool.close(RELAYS);
    console.error('Nostr fetch error:', error);
    throw error;
  }
};
