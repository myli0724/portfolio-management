import { Button } from "./ui/button";
import { useI18n } from "./i18n-provider";

interface OperationsProps {
    onTrade: (action: "buy" | "sell") => void
    direction?: "row" | "column"
}

export default function Operation({ onTrade, direction = "row" }: OperationsProps) {
    const { t } = useI18n();
    
    return (
        <div className={`flex gap-2 mt-4 ${direction === "column" ? "flex-col" : "flex-row"}`}>
            <Button
                onClick={() => onTrade("buy")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1 text-white"
            >
                {t("portfolio.buy")}
            </Button>
            <Button
                onClick={() => onTrade("sell")}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600/10 flex-1"
            >
                {t("portfolio.sell")}
            </Button>
        </div>
    )
}