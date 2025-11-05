"use client";

import { useState, useEffect } from "react";
import { Gift, Star, Trophy } from "lucide-react";

interface LoyaltyPointsProps {
  userEmail?: string;
  onPointsUsed?: (points: number) => void;
}

interface LoyaltyData {
  points: number;
  total_earned: number;
  total_spent: number;
  tier: string;
}

export function LoyaltyPoints({ userEmail, onPointsUsed }: LoyaltyPointsProps) {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  useEffect(() => {
    if (userEmail) {
      fetchLoyaltyPoints();
    }
  }, [userEmail]);

  const fetchLoyaltyPoints = async () => {
    if (!userEmail) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/loyalty/points?user_email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();

      if (data.ok && data.loyalty) {
        setLoyaltyData(data.loyalty);
      }
    } catch (err) {
      console.error("Error fetching loyalty points:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsePoints = () => {
    if (!loyaltyData || pointsToUse <= 0 || pointsToUse > loyaltyData.points) {
      return;
    }

    if (onPointsUsed) {
      onPointsUsed(pointsToUse);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "text-purple-400";
      case "Gold":
        return "text-yellow-400";
      case "Silver":
        return "text-gray-300";
      default:
        return "text-gray-400";
    }
  };

  if (!userEmail || loading) {
    return null;
  }

  if (!loyaltyData || loyaltyData.points === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" size={20} />
          <h3 className="font-semibold text-white">נקודות נאמנות</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gold">{loyaltyData.points}</p>
          <p className={`text-xs ${getTierColor(loyaltyData.tier)}`}>
            {loyaltyData.tier}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max={loyaltyData.points}
          value={pointsToUse}
          onChange={(e) => setPointsToUse(Math.min(parseInt(e.target.value) || 0, loyaltyData.points))}
          placeholder="השתמש בנקודות"
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={handleUsePoints}
          disabled={pointsToUse <= 0 || pointsToUse > loyaltyData.points}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          השתמש
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        100 נקודות = ₪1 הנחה
      </p>
    </div>
  );
}

