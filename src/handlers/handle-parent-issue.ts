import { clearAllPriceLabelsOnIssue } from "../shared/label";
import { calculateLabelValue } from "../shared/pricing";
import { Label } from "../types/github";
import { ContextPlugin } from "../types/plugin-input";

export async function handleParentIssue(context: ContextPlugin, labels: Label[]) {
  const issuePrices = labels.filter((label) => label.name.toString().startsWith("Price:"));
  if (issuePrices.length) {
    await clearAllPriceLabelsOnIssue(context);
  }
  throw context.logger.error("Pricing is disabled on parent issues.");
}

export function sortLabelsByValue(labels: Label[]) {
  return labels.sort((a, b) => calculateLabelValue(a.name) - calculateLabelValue(b.name));
}

export function isParentIssue(body: string) {
  const parentPattern = /-\s+\[( |x)\]\s+#\d+/;
  return body.match(parentPattern);
}
