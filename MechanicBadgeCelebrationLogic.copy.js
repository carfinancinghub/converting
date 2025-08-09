/**
 * File: MechanicBadgeCelebrationLogic.js
 * Path: backend/utils/mechanic/MechanicBadgeCelebrationLogic.js
 * Purpose: Backend logic for triggering celebration and badge milestone tracking for mechanics
 * Author: Cod1 (05060915)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const logger = require('@utils/logger');

// Mock badge definitions
const badgeMilestones = [
  { id: 'first-inspection', label: 'First Inspection Completed', condition: (stats) => stats.inspections >= 1 },
  { id: 'ten-inspections', label: '10 Inspections Milestone', condition: (stats) => stats.inspections >= 10 },
  { id: 'five-repairs', label: '5 Repairs Logged', condition: (stats) => stats.repairs >= 5 },
  { id: 'all-clear', label: '5 Clean Inspections', condition: (stats) => stats.cleanInspections >= 5 }
];

/**
 * evaluateBadgeMilestones
 * Purpose: Evaluate mechanic stats and return unlocked badge events
 * Parameters:
 *   - stats: object containing mechanic's metrics (inspections, repairs, etc.)
 * Returns:
 *   - Array of unlocked badge metadata (id, label)
 */
function evaluateBadgeMilestones(stats) {
  try {
    const unlocked = badgeMilestones.filter((badge) => badge.condition(stats));
    logger.info(`Evaluated ${unlocked.length} badge(s) unlocked for mechanic.`);
    return unlocked.map(({ id, label }) => ({ id, label }));
  } catch (err) {
    logger.error(`Badge evaluation failed: ${err.message}`);
    return [];
  }
}

module.exports = { evaluateBadgeMilestones };
