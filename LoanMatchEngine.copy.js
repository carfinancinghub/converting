// File: LoanMatchEngine.js
// Path: backend/utils/LoanMatchEngine.js
// 👑 Cod1 Crown Certified — Smart Matching Engine for Lender Compatibility

const matchLendersToLoan = (loanRequest, lenders) => {
  const { amount, tags = [], creditScore } = loanRequest;

  return lenders.map(lender => {
    const interestRange = lender.interestRateRange?.split('-').map(Number);
    const maxAmount = Number(lender.maxLoanAmount) || 0;

    const tagScore = tags.length && lender.tags
      ? tags.filter(t => lender.tags.includes(t)).length / tags.length
      : 0;

    const autoMatchBonus = lender.autoMatch ? 0.1 : 0;

    let baseScore = 0;

    if (maxAmount >= amount) baseScore += 0.4;
    if (interestRange?.length === 2) baseScore += 0.3;
    baseScore += tagScore * 0.2;

    const totalScore = Math.min(baseScore + autoMatchBonus, 1);

    return {
      lenderId: lender._id,
      companyName: lender.companyName,
      totalScore,
      tagScore,
      autoMatch: lender.autoMatch,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
};

module.exports = { matchLendersToLoan };
