// File: BadgeHub.js
// Path: frontend/src/components/BadgeHub.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const BADGE_INFO = {
  FIRST_DEAL: { emoji: '🏁', label: 'First Deal', description: 'Awarded for completing your first transaction as buyer or seller.' },
  TRUSTED_SELLER: { emoji: '✅', label: 'Trusted Seller', description: 'Awarded to sellers after 5 successful deals.' },
  MECHANIC_INSPECTOR: { emoji: '🛠', label: 'Certified Inspector', description: 'Awarded to mechanics who submit verified inspections.' },
  STORAGE_PROVIDER: { emoji: '📦', label: 'Storage Partner', description: 'Awarded to users providing vehicle storage.' },
  DISPUTE_JUDGE: { emoji: '⚖️', label: 'Dispute Judge', description: 'Awarded to verified users who vote on arbitration cases.' }
};

const BadgeHub = () => {
  const [badgeStats, setBadgeStats] = useState({});

  useEffect(() => {
    fetchBadgeStats();
  }, []);

  const fetchBadgeStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/badge-stats`);
      setBadgeStats(res.data);
    } catch (err) {
      console.error('Failed to fetch badge stats:', err);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">🏅 Community Badge Guide</h2>
      <p className="text-muted-foreground mb-6">Explore how users earn trust and reputation across the Car Financing Hub.</p>
      <Separator className="mb-6" />

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(BADGE_INFO).map(([key, { emoji, label, description }]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="text-2xl mb-1">{emoji} <span className="font-semibold">{label}</span></div>
              <p className="text-sm text-muted-foreground mb-2">{description}</p>
              {badgeStats[key] && (
                <Badge variant="outline">{badgeStats[key]} awarded</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />
      <div className="text-center text-muted-foreground">
        Want to earn a badge? Participate in the system with honesty and integrity — your actions build your reputation.
      </div>
    </div>
  );
};

export default BadgeHub;
