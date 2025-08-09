// File: cod1HaulerReviewAI.js
// Path: backend/utils/ai/cod1HaulerReviewAI.js
// 👑 Cod1 Crown Certified — Smart Assistant for Hauler Job Review

const analyzeHaulerJob = (job) => {
  const insights = [];

  // Check for voice transcription red flags
  if (job.transcript?.toLowerCase().includes('damaged')) {
    insights.push('🚨 Voice memo mentions potential damage.');
  }
  if (job.transcript?.toLowerCase().includes('late')) {
    insights.push('⚠️ Voice memo references delivery delay.');
  }

  // Photo count check
  if (!job.photos || job.photos.length < 2) {
    insights.push('📷 Fewer than 2 photos uploaded. Consider requesting more visual proof.');
  }

  // Timestamp anomaly (simulated logic)
  const pickup = new Date(job.pickupTime || job.createdAt);
  const dropoff = new Date(job.updatedAt);
  const durationHours = (dropoff - pickup) / (1000 * 60 * 60);
  if (durationHours > 48) {
    insights.push(`⏱️ Delivery took over ${Math.round(durationHours)} hours. Unusually long duration.`);
  }

  // Geo validation (simulated logic)
  if (!job.geoPin || !job.geoPin.includes(',')) {
    insights.push('📍 Missing or malformed GeoPin data.');
  }

  return insights.length > 0
    ? { status: '⚠️ Review Recommended', insights }
    : { status: '✅ Looks Good', insights: ['No anomalies detected.'] };
};

module.exports = analyzeHaulerJob;
