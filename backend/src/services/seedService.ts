import { Admin } from '../models/Admin.js';
import { AdSlot } from '../models/AdSlot.js';
import { Category } from '../models/Category.js';
import { Game } from '../models/Game.js';
import { Review } from '../models/Review.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { env } from '../config/env.js';

export const seedData = async () => {
  const [adminCount, categoryCount, settingsCount] = await Promise.all([
    Admin.countDocuments(),
    Category.countDocuments(),
    SiteSetting.countDocuments()
  ]);

  if (!adminCount) {
    await Admin.create({
      name: 'Platform Owner',
      email: env.adminEmail,
      password: env.adminPassword,
      role: 'SUPER_ADMIN',
      permissions: ['games.manage', 'categories.manage', 'reviews.manage', 'ads.manage', 'settings.manage']
    });
  }

  let categories = await Category.find();
  if (!categoryCount) {
    categories = await Category.insertMany([
      { name: 'Action', slug: 'action', icon: '⚡', displayOrder: 1 },
      { name: 'Puzzle', slug: 'puzzle', icon: '🧩', displayOrder: 2 },
      { name: 'Arcade', slug: 'arcade', icon: '🕹️', displayOrder: 3 },
      { name: 'Casual', slug: 'casual', icon: '🎯', displayOrder: 4 },
      { name: 'Sports', slug: 'sports', icon: '🏀', displayOrder: 5 },
      { name: 'Strategy', slug: 'strategy', icon: '♟️', displayOrder: 6 },
      { name: '2 Player', slug: '2-player', icon: '👥', displayOrder: 7 }
    ]);
  }

  if (!settingsCount) {
    await SiteSetting.create({});
  }

  const gameCount = await Game.countDocuments();
  if (!gameCount && categories.length) {
    const gameSeed = await Game.insertMany([
      {
        name: 'Sky Sprint',
        slug: 'sky-sprint',
        coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
        description: 'Fast-paced runner with vibrant neon levels and touch-friendly controls.',
        categories: [categories[0]._id, categories[2]._id],
        categoryLabels: ['Action', 'Arcade'],
        embedUrl: 'https://html5games.com/Game/Om-Nom-Run/8f3b8bb8-6695-4c02-b24a-ecb68f0c042e',
        developerName: 'Open Arcade Studio',
        githubRepo: 'https://github.com/topics/html5-game',
        licenseName: 'MIT',
        licenseUrl: 'https://opensource.org/licenses/MIT',
        releaseDate: new Date(),
        published: true,
        featured: true,
        playCount: 5310,
        avgPlayTime: 8.7,
        ratingAverage: 4.7,
        ratingCount: 128
      },
      {
        name: 'Hexa Logic',
        slug: 'hexa-logic',
        coverImage: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=900&q=80',
        description: 'Relaxing puzzle game with clean visuals, adaptive difficulty, and quick rounds.',
        categories: [categories[1]._id, categories[3]._id],
        categoryLabels: ['Puzzle', 'Casual'],
        embedUrl: 'https://html5games.com/Game/Jewel-Shuffle/88927cfd-b971-4880-bb65-859fb803d1ed',
        developerName: 'Brainwave Works',
        githubRepo: 'https://github.com/topics/puzzle-game',
        licenseName: 'Apache-2.0',
        licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
        releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
        published: true,
        playCount: 3291,
        avgPlayTime: 12.4,
        ratingAverage: 4.5,
        ratingCount: 96
      },
      {
        name: 'Court Clash',
        slug: 'court-clash',
        coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
        description: 'One-tap sports duel designed for quick mobile sessions and local competition.',
        categories: [categories[4]._id, categories[6]._id],
        categoryLabels: ['Sports', '2 Player'],
        embedUrl: 'https://html5games.com/Game/Basketball-Master-2/53b54144-3fd4-4954-af7a-cff5760fdbcc',
        developerName: 'Pixel Court Lab',
        githubRepo: 'https://github.com/topics/sports-game',
        licenseName: 'MIT',
        licenseUrl: 'https://opensource.org/licenses/MIT',
        releaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 33),
        published: true,
        playCount: 2780,
        avgPlayTime: 6.9,
        ratingAverage: 4.2,
        ratingCount: 64
      }
    ]);

    await Review.insertMany([
      { gameId: gameSeed[0]._id, authorName: 'Ava', rating: 5, comment: 'Instant action and very smooth on my phone.', pinned: true },
      { gameId: gameSeed[0]._id, authorName: 'Liam', rating: 4, comment: 'Great speed, but I want more maps.' },
      { gameId: gameSeed[1]._id, authorName: 'Noah', rating: 5, comment: 'Perfect short puzzle sessions during breaks.' },
      { gameId: gameSeed[2]._id, authorName: 'Mia', rating: 4, comment: 'Fun with a friend on tablet mode.' }
    ]);
  }

  const adCount = await AdSlot.countDocuments();
  if (!adCount) {
    await AdSlot.insertMany([
      {
        name: 'Global Header Banner',
        placement: 'HEADER_BANNER',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        redirectUrl: 'https://example.com',
        pageScope: ['*'],
        impressions: 1820,
        clicks: 65
      },
      {
        name: 'Sidebar Vertical Ad',
        placement: 'SIDEBAR_VERTICAL',
        mediaUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=600&q=80',
        redirectUrl: 'https://example.com/sidebar',
        pageScope: ['*'],
        impressions: 1310,
        clicks: 32
      },
      {
        name: 'Pre-Roll Interstitial',
        placement: 'PRE_ROLL',
        mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        redirectUrl: 'https://example.com/preroll',
        pageScope: ['/game/:slug'],
        skipDuration: 5,
        impressions: 880,
        clicks: 49
      },
      {
        name: 'Grid Position 4',
        placement: 'GRID_INLINE_4',
        mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
        redirectUrl: 'https://example.com/grid',
        pageScope: ['/'],
        impressions: 940,
        clicks: 19
      },
      {
        name: 'Grid Position 8',
        placement: 'GRID_INLINE_8',
        mediaUrl: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?auto=format&fit=crop&w=900&q=80',
        redirectUrl: 'https://example.com/grid-two',
        pageScope: ['/'],
        impressions: 760,
        clicks: 15
      },
      {
        name: 'In Game Top Banner',
        placement: 'IN_GAME_TOP',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        redirectUrl: 'https://example.com/top',
        pageScope: ['/game/:slug'],
        impressions: 620,
        clicks: 17
      },
      {
        name: 'In Game Bottom Banner',
        placement: 'IN_GAME_BOTTOM',
        mediaUrl: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80',
        redirectUrl: 'https://example.com/bottom',
        pageScope: ['/game/:slug'],
        impressions: 601,
        clicks: 13
      }
    ]);
  }
};
