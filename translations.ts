import { Language } from './types';

export const translations = {
  ja: {
    hero: {
      title: 'NostrSlide',
      subtitle: 'Nostrの投稿スレッドを\n美しいスライドショーへ。',
      cta: 'スライドを作成する',
      tagline: '自由な世界のためのオープンプロトコル',
    },
    modal: {
      title: 'スライドを作成',
      label: '投稿のID (nevent1...) またはURL',
      placeholder: 'nevent1...',
      submit: 'スライドを表示する',
      loading: '読み込み中...',
      guide: 'スライドの作り方',
      clients: 'おすすめアプリ',
      close: '閉じる',
    },
    steps: [
      {
        title: 'スレッドを作る',
        desc: 'Nostrで画像付きの投稿をツリー形式で投稿します。',
      },
      {
        title: '画像を載せる',
        desc: '各投稿に画像を1枚載せます。本文は説明文になります。',
      },
      {
        title: 'IDを貼り付ける',
        desc: '最初の投稿のnevent1...をコピーして貼り付けます。',
      },
    ],
    deck: {
      back: 'スライドを終了して戻る',
      share: 'このプレゼンを共有',
      fullscreen: 'フルスクリーン表示',
      exitFullscreen: 'フルスクリーン解除',
      grid: 'スライド一覧を表示',
      notes: '説明文を表示/非表示',
      export: '書き出し / エクスポート',
      prev: '前のスライドへ',
      next: '次のスライドへ',
      progress: 'スライドの進行状況',
      presentation: 'プレゼンテーション',
      copiedUrl: 'URL をコピーしました',
      copiedId: 'Nostr ID をコピーしました',
      gridTitle: 'スライド一覧',
      play: '再生',
      exportOptions: {
        pdf: 'PDFとして保存 (印刷)',
        markdown: 'Markdownをダウンロード',
        json: 'JSONデータをダウンロード',
      },
    },
    errors: {
      noImages: 'このスレッドには画像が見つかりませんでした。',
      fetchFailed: '読み込みに失敗しました。IDを確認してください。',
    },
  },
  en: {
    hero: {
      title: 'NostrSlide',
      subtitle: 'Turn Nostr threads into\nbeautiful slideshows.',
      cta: 'Create Slides',
      tagline: 'Open protocol for a free world.',
    },
    modal: {
      title: 'Create Presentation',
      label: 'Event ID (nevent1...) or URL',
      placeholder: 'nevent1...',
      submit: 'Launch Slideshow',
      loading: 'Loading...',
      guide: 'How to Create',
      clients: 'Recommended Apps',
      close: 'Close',
    },
    steps: [
      {
        title: 'Create Thread',
        desc: 'Post a series of images as a reply thread on Nostr.',
      },
      {
        title: 'Attach Images',
        desc: 'Attach one image per reply. The text becomes the caption.',
      },
      {
        title: 'Paste ID',
        desc: 'Copy the ID (nevent1...) of the first post and paste it here.',
      },
    ],
    deck: {
      back: 'Exit presentation',
      share: 'Share this presentation',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      grid: 'Show all slides',
      notes: 'Toggle captions',
      export: 'Export / Download',
      prev: 'Previous slide',
      next: 'Next slide',
      progress: 'Progress',
      presentation: 'Presentation',
      copiedUrl: 'URL copied to clipboard',
      copiedId: 'Nostr ID copied to clipboard',
      gridTitle: 'Slide List',
      play: 'Play',
      exportOptions: {
        pdf: 'Save as PDF (Print)',
        markdown: 'Download Markdown',
        json: 'Download JSON Data',
      },
    },
    errors: {
      noImages: 'No images found in this thread.',
      fetchFailed: 'Failed to fetch thread. Please check the ID.',
    },
  },
};
