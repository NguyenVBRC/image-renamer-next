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

  useEffect(() => {
    if (user) {
      // Authenticated users have unlimited uses
      setRemainingUses(Infinity);
      setLoading(false);
      return;
    }

    // For non-authenticated users, check local storage
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

    setLoading(false);
  }, [user]);

  const useAnalysis = () => {
    if (user) {
      // Authenticated users have unlimited uses
      return true;
    }

    if (remainingUses <= 0) {
      return false;
    }

    // Update usage count
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

    currentUsage.count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsage));
    setRemainingUses(Math.max(0, MAX_FREE_USES - currentUsage.count));

    return true;
  };

  return {
    remainingUses,
    maxUses: MAX_FREE_USES,
    canUse: user ? true : remainingUses > 0,
    useAnalysis,
    loading,
    isUnlimited: !!user,
  };
}
