"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Radio,
  Skeleton,
} from "@mui/material";
import { PLAN_FEATURES, PLAN_LABELS, PlanTier } from "@/constants/directory";
import { getPublicPricing } from "@/utils/requesters/DirectoryRequester";

interface PlanSelectorProps {
  value: PlanTier;
  onChange: (plan: PlanTier) => void;
}

interface PricingInfo {
  basePrice: number;
  finalPrice: number;
  discountApplied: boolean;
  campaignName: string | null;
  tag: string | null;
}

export default function PlanSelector({ value, onChange }: PlanSelectorProps) {
  const [pricing, setPricing] = useState<
    Record<"verified" | "featured", PricingInfo | null>
  >({
    verified: null,
    featured: null,
  });

  useEffect(() => {
    ["verified", "featured"].forEach(async (plan) => {
      const data = await getPublicPricing(plan as "verified" | "featured");
      if (data) {
        setPricing((prev) => ({ ...prev, [plan]: data }));
      }
    });
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Elegí tu plan
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        {(["free", "verified", "featured"] as PlanTier[]).map((plan) => (
          <PlanCard
            key={plan}
            plan={plan}
            selected={value === plan}
            pricing={plan === "free" ? null : pricing[plan]}
            onSelect={() => onChange(plan)}
          />
        ))}
      </Box>
    </Box>
  );
}

function PlanCard({
  plan,
  selected,
  pricing,
  onSelect,
}: {
  plan: PlanTier;
  selected: boolean;
  pricing: PricingInfo | null;
  onSelect: () => void;
}) {
  return (
    <Card
      onClick={onSelect}
      sx={{
        flex: 1,
        cursor: "pointer",
        border: (theme) =>
          selected
            ? `2px solid ${theme.palette.secondary.main}`
            : "2px solid transparent",
        position: "relative",
      }}
    >
      {pricing?.tag && (
        <Chip
          size="small"
          label={pricing.tag}
          color="secondary"
          sx={{ position: "absolute", top: 8, right: 8 }}
        />
      )}
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Radio checked={selected} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {PLAN_LABELS[plan]}
          </Typography>
        </Box>

        {plan === "free" ? (
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            Gratis
          </Typography>
        ) : pricing ? (
          <Box sx={{ mb: 2 }}>
            {pricing.discountApplied && (
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                Bs {pricing.basePrice}
              </Typography>
            )}
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              Bs {pricing.finalPrice}
            </Typography>
            {pricing.discountApplied && pricing.campaignName && (
              <Chip
                size="small"
                label={pricing.campaignName}
                color="success"
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
        ) : (
          <Skeleton height={40} />
        )}

        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          {PLAN_FEATURES[plan].map((feat) => (
            <Typography component="li" variant="body2" key={feat}>
              {feat}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
