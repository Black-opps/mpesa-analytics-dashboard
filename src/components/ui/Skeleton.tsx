import React from "react";

interface SkeletonProps {
  height?: number;
  width?: string;
  radius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = 20,
  width = "100%",
  radius = 12,
}) => {
  return (
    <div
      className="skeleton"
      style={{
        height,
        width,
        borderRadius: radius,
      }}
    />
  );
};
