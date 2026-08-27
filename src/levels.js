// ============================================================
//  ANGRY BIRDS – Level Definitions
// ============================================================

import { createBird, createPig, createBlock } from './entities.js';

/**
 * Level definitions
 * Each level returns: { birds: [], pigs: [], blocks: [], slingX, slingY }
 * Coordinates are relative to a 1200x600 virtual canvas
 */
export const LEVELS = [
  // ===== LEVEL 1: Introduction =====
  {
    name: 'First Flight',
    birds: ['red', 'red', 'red'],
    build(groundY) {
      const pigs = [
        createPig(850, groundY - 18, 'medium'),
      ];

      const blocks = [
        // Simple tower
        createBlock('wood', 800, groundY - 20, 20, 80),
        createBlock('wood', 900, groundY - 20, 20, 80),
        createBlock('wood', 850, groundY - 70, 120, 15),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 2: Double Trouble =====
  {
    name: 'Double Trouble',
    birds: ['red', 'red', 'yellow'],
    build(groundY) {
      const pigs = [
        createPig(780, groundY - 18, 'small'),
        createPig(920, groundY - 18, 'small'),
      ];

      const blocks = [
        // Left shelter
        createBlock('wood', 740, groundY - 25, 15, 70),
        createBlock('wood', 820, groundY - 25, 15, 70),
        createBlock('wood', 780, groundY - 65, 100, 12),
        createBlock('ice', 780, groundY - 78, 60, 20),

        // Right shelter
        createBlock('wood', 880, groundY - 25, 15, 70),
        createBlock('wood', 960, groundY - 25, 15, 70),
        createBlock('wood', 920, groundY - 65, 100, 12),
        createBlock('ice', 920, groundY - 78, 60, 20),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 3: Stone Fortress =====
  {
    name: 'Stone Fortress',
    birds: ['red', 'yellow', 'black'],
    build(groundY) {
      const pigs = [
        createPig(850, groundY - 55, 'medium'),
        createPig(850, groundY - 18, 'small'),
      ];

      const blocks = [
        // Stone walls
        createBlock('stone', 800, groundY - 30, 20, 100),
        createBlock('stone', 900, groundY - 30, 20, 100),
        // Stone roof
        createBlock('stone', 850, groundY - 85, 130, 15),
        // Inner wood
        createBlock('wood', 830, groundY - 18, 15, 50),
        createBlock('wood', 870, groundY - 18, 15, 50),
        createBlock('wood', 850, groundY - 48, 60, 10),
        // Top decoration
        createBlock('ice', 850, groundY - 100, 40, 20),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 4: The Pyramid =====
  {
    name: 'The Pyramid',
    birds: ['red', 'red', 'blue', 'yellow'],
    build(groundY) {
      const pigs = [
        createPig(870, groundY - 18, 'medium'),
        createPig(830, groundY - 18, 'small'),
        createPig(850, groundY - 100, 'small'),
      ];

      const blocks = [
        // Bottom row
        createBlock('wood', 790, groundY - 20, 20, 60),
        createBlock('wood', 910, groundY - 20, 20, 60),
        createBlock('wood', 850, groundY - 55, 140, 12),

        // Middle row
        createBlock('wood', 820, groundY - 72, 20, 50),
        createBlock('wood', 880, groundY - 72, 20, 50),
        createBlock('wood', 850, groundY - 102, 80, 12),

        // Top
        createBlock('wood', 850, groundY - 118, 20, 40),
        createBlock('ice', 850, groundY - 142, 30, 10),

        // Ground fillers
        createBlock('ice', 830, groundY - 8, 30, 20),
        createBlock('ice', 870, groundY - 8, 30, 20),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 5: Ice Palace =====
  {
    name: 'Ice Palace',
    birds: ['blue', 'blue', 'red'],
    build(groundY) {
      const pigs = [
        createPig(820, groundY - 18, 'medium'),
        createPig(880, groundY - 18, 'medium'),
        createPig(850, groundY - 75, 'small'),
      ];

      const blocks = [
        // Ice walls
        createBlock('ice', 780, groundY - 30, 15, 80),
        createBlock('ice', 850, groundY - 30, 15, 80),
        createBlock('ice', 920, groundY - 30, 15, 80),

        // Ice roofs
        createBlock('ice', 815, groundY - 75, 85, 12),
        createBlock('ice', 885, groundY - 75, 85, 12),

        // Second floor
        createBlock('ice', 810, groundY - 95, 15, 50),
        createBlock('ice', 890, groundY - 95, 15, 50),
        createBlock('ice', 850, groundY - 125, 100, 12),

        // Decorations
        createBlock('ice', 850, groundY - 140, 20, 25),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 6: Mixed Materials =====
  {
    name: 'Mixed Materials',
    birds: ['yellow', 'black', 'red', 'red'],
    build(groundY) {
      const pigs = [
        createPig(800, groundY - 18, 'medium'),
        createPig(900, groundY - 18, 'large'),
        createPig(850, groundY - 110, 'small'),
      ];

      const blocks = [
        // Stone base
        createBlock('stone', 760, groundY - 20, 20, 60),
        createBlock('stone', 940, groundY - 20, 20, 60),
        createBlock('stone', 850, groundY - 55, 200, 12),

        // Wood middle
        createBlock('wood', 800, groundY - 75, 20, 50),
        createBlock('wood', 900, groundY - 75, 20, 50),
        createBlock('wood', 850, groundY - 105, 120, 12),

        // Ice top
        createBlock('ice', 830, groundY - 118, 15, 30),
        createBlock('ice', 870, groundY - 118, 15, 30),
        createBlock('ice', 850, groundY - 138, 60, 10),
        createBlock('ice', 850, groundY - 150, 20, 15),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 7: The Castle =====
  {
    name: 'The Castle',
    birds: ['black', 'red', 'red', 'yellow'],
    build(groundY) {
      const pigs = [
        createPig(850, groundY - 18, 'king'),
        createPig(780, groundY - 18, 'small'),
        createPig(920, groundY - 18, 'small'),
      ];

      const blocks = [
        // Thick stone walls
        createBlock('stone', 740, groundY - 35, 25, 90),
        createBlock('stone', 960, groundY - 35, 25, 90),

        // Inner wood
        createBlock('wood', 800, groundY - 25, 15, 70),
        createBlock('wood', 900, groundY - 25, 15, 70),

        // Floor
        createBlock('stone', 850, groundY - 65, 250, 15),

        // Upper structure
        createBlock('wood', 780, groundY - 85, 15, 50),
        createBlock('wood', 920, groundY - 85, 15, 50),
        createBlock('stone', 850, groundY - 115, 170, 12),

        // Towers
        createBlock('stone', 770, groundY - 130, 15, 40),
        createBlock('stone', 930, groundY - 130, 15, 40),
        createBlock('ice', 770, groundY - 155, 25, 10),
        createBlock('ice', 930, groundY - 155, 25, 10),

        // Center roof
        createBlock('wood', 850, groundY - 128, 12, 30),
        createBlock('ice', 850, groundY - 148, 30, 10),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 8: Labyrinth =====
  {
    name: 'The Labyrinth',
    birds: ['red', 'yellow', 'blue', 'black'],
    build(groundY) {
      const pigs = [
        createPig(880, groundY - 18, 'medium'),
        createPig(820, groundY - 55, 'medium'),
        createPig(880, groundY - 95, 'small'),
      ];

      const blocks = [
        // Bottom level
        createBlock('stone', 770, groundY - 20, 15, 60),
        createBlock('wood', 830, groundY - 20, 15, 60),
        createBlock('stone', 940, groundY - 20, 15, 60),
        createBlock('wood', 855, groundY - 55, 190, 12),

        // Middle level
        createBlock('wood', 790, groundY - 72, 15, 50),
        createBlock('stone', 900, groundY - 72, 15, 50),
        createBlock('wood', 850, groundY - 100, 140, 12),

        // Top level
        createBlock('ice', 830, groundY - 113, 15, 30),
        createBlock('ice', 870, groundY - 113, 15, 30),
        createBlock('ice', 850, groundY - 133, 60, 10),

        // Decorative filler
        createBlock('ice', 810, groundY - 8, 20, 20),
        createBlock('ice', 910, groundY - 8, 20, 20),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 9: Towers =====
  {
    name: 'Twin Towers',
    birds: ['red', 'red', 'yellow', 'black', 'blue'],
    build(groundY) {
      const pigs = [
        createPig(760, groundY - 18, 'medium'),
        createPig(940, groundY - 18, 'medium'),
        createPig(760, groundY - 100, 'small'),
        createPig(940, groundY - 100, 'small'),
      ];

      const blocks = [
        // Left tower
        createBlock('wood', 730, groundY - 30, 15, 80),
        createBlock('wood', 790, groundY - 30, 15, 80),
        createBlock('stone', 760, groundY - 75, 80, 12),
        createBlock('wood', 740, groundY - 95, 15, 50),
        createBlock('wood', 780, groundY - 95, 15, 50),
        createBlock('wood', 760, groundY - 125, 60, 12),
        createBlock('ice', 760, groundY - 138, 20, 20),

        // Right tower
        createBlock('wood', 910, groundY - 30, 15, 80),
        createBlock('wood', 970, groundY - 30, 15, 80),
        createBlock('stone', 940, groundY - 75, 80, 12),
        createBlock('wood', 920, groundY - 95, 15, 50),
        createBlock('wood', 960, groundY - 95, 15, 50),
        createBlock('wood', 940, groundY - 125, 60, 12),
        createBlock('ice', 940, groundY - 138, 20, 20),
      ];

      return { pigs, blocks };
    },
  },

  // ===== LEVEL 10: Final Stand =====
  {
    name: 'Final Stand',
    birds: ['black', 'yellow', 'blue', 'red', 'black'],
    build(groundY) {
      const pigs = [
        createPig(850, groundY - 18, 'king'),
        createPig(780, groundY - 18, 'large'),
        createPig(920, groundY - 18, 'large'),
        createPig(850, groundY - 115, 'medium'),
        createPig(780, groundY - 80, 'small'),
        createPig(920, groundY - 80, 'small'),
      ];

      const blocks = [
        // Massive stone base
        createBlock('stone', 730, groundY - 35, 25, 90),
        createBlock('stone', 970, groundY - 35, 25, 90),
        createBlock('stone', 850, groundY - 85, 270, 15),

        // Inner chambers
        createBlock('wood', 790, groundY - 25, 15, 70),
        createBlock('wood', 910, groundY - 25, 15, 70),
        createBlock('wood', 850, groundY - 25, 15, 70),

        // Upper structure
        createBlock('stone', 780, groundY - 105, 15, 50),
        createBlock('stone', 920, groundY - 105, 15, 50),
        createBlock('wood', 850, groundY - 105, 15, 50),
        createBlock('stone', 850, groundY - 135, 170, 12),

        // Crown
        createBlock('wood', 810, groundY - 150, 12, 30),
        createBlock('wood', 850, groundY - 150, 12, 30),
        createBlock('wood', 890, groundY - 150, 12, 30),
        createBlock('ice', 850, groundY - 170, 100, 10),
        createBlock('ice', 850, groundY - 180, 40, 15),
      ];

      return { pigs, blocks };
    },
  },
];

/**
 * Build a level and return all entities
 */
export function buildLevel(levelIndex, groundY, slingX, slingY) {
  const level = LEVELS[levelIndex];
  if (!level) return null;

  const { pigs, blocks } = level.build(groundY);

  // Create bird queue
  const birds = level.birds.map(type => createBird(type, 0, 0));

  return {
    name: level.name,
    birds,
    pigs,
    blocks,
    totalBirds: birds.length,
  };
}
