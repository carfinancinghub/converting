/**
 * File: MechanicAIRepairRecommender.js
 * Path: backend/utils/MechanicAIRepairRecommender.js
 * Purpose: Generate AI-driven repair recommendations based on inspection data for the mechanic role
 * Author: Cod1 (05060832)
 * Date: May 06, 2025
 * Cod2 Crown Certified
 */

// --- Dependencies ---
const logger = require('@utils/logger'); // Log events and debugging

/**
 * getRepairRecommendations
 * Purpose: Analyze inspection input data and return prioritized repair suggestions
 * Parameters:
 *   - inspectionData (object): Raw inspection data (fluids, tires, engine, brakes, etc.)
 * Returns:
 *   - Array of recommendations with fields: part, issue, urgency (1-10), recommendation
 */
function getRepairRecommendations(inspectionData) {
  try {
    const recommendations = [];

    if (inspectionData.tires === 'Worn') {
      recommendations.push({
        part: 'Tires',
        issue: 'Tread wear below safety threshold',
        urgency: 9,
        recommendation: 'Replace all tires immediately to meet safety compliance.'
      });
    }

    if (inspectionData.fluids === 'Low') {
      recommendations.push({
        part: 'Fluids',
        issue: 'Engine oil/coolant levels are low',
        urgency: 7,
        recommendation: 'Refill engine oil and coolant to recommended levels.'
      });
    }

    if (inspectionData.engineStatus === 'Check Engine Light') {
      recommendations.push({
        part: 'Engine',
        issue: 'Error code detected (Check Engine Light on)',
        urgency: 8,
        recommendation: 'Run diagnostic scan and address error codes.'
      });
    }

    if (inspectionData.brakes === 'Noisy') {
      recommendations.push({
        part: 'Brakes',
        issue: 'Brake pads may be worn or rotors damaged',
        urgency: 8,
        recommendation: 'Inspect brake pads and rotors; replace as needed.'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        part: 'System',
        issue: 'No issues detected',
        urgency: 1,
        recommendation: 'Vehicle is in optimal condition. No repairs needed.'
      });
    }

    logger.info('AI Repair Recommendations Generated');
    return recommendations;
  } catch (err) {
    logger.error(`Repair recommendation generation failed: ${err.message}`);
    return [{
      part: 'System',
      issue: 'AI error during evaluation',
      urgency: 10,
      recommendation: 'Manual inspection required due to system failure.'
    }];
  }
}

module.exports = { getRepairRecommendations };
