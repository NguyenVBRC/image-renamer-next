import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

const MAX_FREE_USES = 3;
const STORAGE_KEY = "ai_renamer_usage";

interface UsageData {
  count: number;
  lastReset: string;
}

export function useUsageLimit(user: User | null) {
  const [remainingUses, setRemainingUses] = useState(MAX_FREE_USES);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-evaluation

  // Function to update remaining uses from localStorage
  const updateUsageFromStorage = () => {
    const storedUsage = localStorage.getItem(STORAGE_KEY);
    if (storedUsage) {
      try {
        const usage: UsageData = JSON.parse(storedUsage);
        const today = new Date().toDateString();

        if (usage.lastReset !== today) {
          // Reset daily usage
          const newUsage: UsageData = {
            count: 0,
            lastReset: today,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
          setRemainingUses(MAX_FREE_USES);
        } else {
          setRemainingUses(Math.max(0, MAX_FREE_USES - usage.count));
        }
        // eslint-disable-next-line
      } catch (error) {
        // Invalid stored data, reset
        localStorage.removeItem(STORAGE_KEY);
        setRemainingUses(MAX_FREE_USES);
      }
    } else {
      setRemainingUses(MAX_FREE_USES);
    }
  };

  useEffect(() => {
    if (user) {
      // Authenticated users have unlimited uses
      setRemainingUses(Infinity);
      setLoading(false);
      return;
    }

    // For non-authenticated users, check local storage
    updateUsageFromStorage();
    setLoading(false);
  }, [user, updateTrigger]);

  const consumeAnalysis = () => {
    if (user) {
      // Authenticated users have unlimited uses
      return true;
    }

    // Check current usage from localStorage before consuming
    const today = new Date().toDateString();
    const storedUsage = localStorage.getItem(STORAGE_KEY);
    let currentUsage: UsageData;

    if (storedUsage) {
      currentUsage = JSON.parse(storedUsage);
      if (currentUsage.lastReset !== today) {
        currentUsage = { count: 0, lastReset: today };
      }
    } else {
      currentUsage = { count: 0, lastReset: today };
    }

    // Check if we still have usage available
    if (currentUsage.count >= MAX_FREE_USES) {
      return false;
    }

    // Consume one usage
    currentUsage.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsage));
    
    // Update the state immediately
    const newRemainingUses = Math.max(0, MAX_FREE_USES - currentUsage.count);
    setRemainingUses(newRemainingUses);
    
    // Trigger a re-render
    setUpdateTrigger(prev => prev + 1);

    return true;
  };

  const refundAnalysis = () => {
    if (user) {
      // Authenticated users don't need refunds
      return;
    }

    const today = new Date().toDateString();
    const storedUsage = localStorage.getItem(STORAGE_KEY);
    let currentUsage: UsageData;

    if (storedUsage) {
      currentUsage = JSON.parse(storedUsage);
      if (currentUsage.lastReset !== today) {
        // If it's a new day, no need to refund
        return;
      }
    } else {
      // No usage recorded, nothing to refund
      return;
    }

    // Refund one usage (but don't go below 0)
    currentUsage.count = Math.max(0, currentUsage.count - 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsage));
    
    // Update the state immediately
    const newRemainingUses = Math.max(0, MAX_FREE_USES - currentUsage.count);
    setRemainingUses(newRemainingUses);
    
    // Trigger a re-render
    setUpdateTrigger(prev => prev + 1);
  };

  return {
    remainingUses,
    maxUses: MAX_FREE_USES,
    canUse: user ? true : remainingUses > 0,
    consumeAnalysis,
    refundAnalysis,
    loading,
    isUnlimited: !!user,
  };
}
