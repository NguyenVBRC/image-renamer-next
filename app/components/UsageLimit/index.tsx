"use client";

import React, { useState } from "react";
import { AlertCircle, Crown } from "lucide-react";
import { useUsageLimit } from "@/helpers/hooks/useUsageLimit";
import { useAuth } from "@/helpers/hooks/useAuth";
import styles from "./UsageLimit.module.css";

export function UsageLimit() {
  const { user } = useAuth();
  const { remainingUses, maxUses, isUnlimited } = useUsageLimit(user);
  const usagePercentage = ((maxUses - remainingUses) / maxUses) * 100;
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const onUpgrade = () => {
    setShowAuthModal(true);
  };

  // Don't show the usage limit card for unlimited users
  if (isUnlimited) {
    return null;
  }

  return (
    <div className={styles.usageLimitCard}>
      <div className={styles.usageLimitHeader}>
        <AlertCircle className={styles.usageIcon} />
        <h3>Usage Limit</h3>
      </div>

      <div className={styles.usageInfo}>
        <p>
          <strong>{remainingUses}</strong> of <strong>{maxUses}</strong> free analyses remaining
        </p>

        <div className={styles.usageBar}>
          <div className={styles.usageTrack}>
            <div className={styles.usageFill} style={{ width: `${usagePercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className={styles.upgradeSection}>
        <p className={styles.upgradeText}>Get unlimited image analysis with a free account</p>
        <button onClick={onUpgrade} className={styles.upgradeButton}>
          <Crown className={styles.crownIcon} />
          Sign Up for Free
        </button>
      </div>
    </div>
  );
}
