import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const DailyReview: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [recap, setRecap] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const recapParam = searchParams.get("recap");
    if (recapParam) {
      setRecap(decodeURIComponent(recapParam));
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("dailyReview")}</h1>

      {recap && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t("todaysRecap")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{recap}</p>
          </CardContent>
        </Card>
      )}

      {/* Add more content for the daily review page here */}
    </div>
  );
};
