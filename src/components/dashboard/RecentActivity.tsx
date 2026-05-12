// src/components/dashboard/RecentActivity.tsx

import React from "react";
import { Card } from "../ui/Card";
import { colors } from "../../design/colors";

const activities = [
  {
    title: "Sent KES 3,500",
    subtitle: "Jane Mwangi",
    type: "sent",
    time: "2 mins ago",
  },
  {
    title: "Received KES 25,000",
    subtitle: "Salary Payment",
    type: "received",
    time: "1 hour ago",
  },
  {
    title: "Paid KPLC Bill",
    subtitle: "Utilities",
    type: "bill",
    time: "Yesterday",
  },
  {
    title: "Bought Airtime",
    subtitle: "Safaricom",
    type: "airtime",
    time: "Yesterday",
  },
];

export const RecentActivity: React.FC = () => {
  return (
    <Card>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            color: colors.text.primary,
            fontSize: "18px",
            marginBottom: "6px",
          }}
        >
          Recent Activity
        </h3>

        <p
          style={{
            color: colors.text.muted,
            fontSize: "13px",
          }}
        >
          Real-time transaction activity
        </p>
      </div>

      <div>
        {activities.map((activity, index) => (
          <div
            key={index}
            className="hover-lift"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              borderBottom:
                index !== activities.length - 1
                  ? `1px solid ${colors.border}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background:
                    activity.type === "received"
                      ? "rgba(60,230,174,0.12)"
                      : colors.cardLight,
                  border: `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}
              >
                {activity.type === "received"
                  ? "↓"
                  : activity.type === "sent"
                  ? "↑"
                  : activity.type === "bill"
                  ? "◉"
                  : "◌"}
              </div>

              <div>
                <div
                  style={{
                    color: colors.text.primary,
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  {activity.title}
                </div>

                <div
                  style={{
                    color: colors.text.secondary,
                    fontSize: "13px",
                  }}
                >
                  {activity.subtitle}
                </div>
              </div>
            </div>

            <div
              style={{
                color: colors.text.muted,
                fontSize: "12px",
              }}
            >
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
