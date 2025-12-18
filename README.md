# NostrSlide

NostrSlide is a web application that converts Nostr threads into beautiful, presentation-ready slideshows.

## Overview

NostrSlide analyzes reply threads on the decentralized social networking protocol "Nostr", extracts images and text, and instantly displays them as a slideshow. Transform technical explanations, portfolios, or photo shares into presentations without any special preparation.

## Features

- Thread Auto-Analysis: Simply enter an event ID (nevent1... or note1...) to gather images from the entire reply tree.
- Presentation Mode: Fullscreen support with intuitive keyboard shortcuts (Arrow keys, Space).
- Export Options:
  - PDF: Optimized for print layouts.
  - Markdown: Format suitable for blogs or documentation.
  - JSON: Keep raw data as an archive.
- Multi-language: Full support for English and Japanese.
- Responsive Design: Works across desktop browsers and mobile touch devices.

## Setup and Execution

This project uses modern web standards and ES modules, designed to run without complex build processes.

### Running in Development

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd nostr-slide
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Open in Browser
   Navigate to http://localhost:3000 (or the port specified by your tool).

### Quality Assurance

- **Formatting**: Run `npm run format` to format code using Biome.
- **Testing**: Run `npm test` to execute unit tests using Vitest.

## How to Use

1. Create a Thread on Nostr:
   - Use a client like Damus or Amethyst to make an initial post.
   - Reply to that post with images and descriptions in order.
2. Get the ID:
   - Copy the "Event ID (nevent1...)" of the first post.
3. Display the Slide:
   - Paste the ID into the NostrSlide input field and click "Launch Slideshow".
4. Controls:
   - Right Arrow / Space: Next slide
   - Left Arrow: Previous slide
   - f: Fullscreen
   - g: Grid view (All slides)
   - e: Export menu

## Author

- ocknamo

## License

This project is licensed under the [MIT License](LICENSE).