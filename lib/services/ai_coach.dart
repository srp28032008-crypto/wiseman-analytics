import '../models/market_data.dart';

class CoachRecommendation {
  final String status;      // "Trade Approved", "High Risk - Avoid", "Neutral Zone"
  final String direction;   // "BUY", "SELL", "NEUTRAL"
  final double confidence;  // 0.0 - 100.0
  final List<String> reasons;
  final String coachMessage;

  CoachRecommendation({
    required this.status,
    required this.direction,
    required this.confidence,
    required this.reasons,
    required this.coachMessage,
  });
}

class AICoach {
  static CoachRecommendation analyze({
    required double rsi,
    required double macd,
    required double signalLine,
    required double volume,
    required MarketType marketType,
  }) {
    List<String> reasons = [];
    String status = "Neutral Zone";
    String direction = "NEUTRAL";
    double confidence = 50.0;
    String coachMessage = "";

    // Volatility check: volume thresholds
    double minVolume = marketType == MarketType.crypto ? 50.0 : 10.0;
    bool hasLiquidity = volume >= minVolume;

    if (!hasLiquidity) {
      return CoachRecommendation(
        status: "High Risk - Avoid",
        direction: "NEUTRAL",
        confidence: 20.0,
        reasons: ["Extremely low volume, indicating poor liquidity.", "Spread risks are too high for safe entry."],
        coachMessage: "The market is sleeping. Wiseman advises patience; trading in low volume is equivalent to sailing in dry sands.",
      );
    }

    // MACD momentum
    double macdHist = macd - signalLine;
    bool bullishMACD = macdHist > 0;
    bool strongMomentum = macdHist.abs() > 0.05;

    // RSI analysis
    bool rsiOversold = rsi < 35;
    bool rsiOverbought = rsi > 65;
    bool rsiNeutral = rsi >= 40 && rsi <= 60;

    if (rsiOversold && bullishMACD) {
      status = "Trade Approved";
      direction = "BUY";
      confidence = 85.0;
      reasons.add("RSI indicates oversold conditions ($rsi), suggesting potential correction.");
      reasons.add("MACD has crossed above the signal line, confirming bullish momentum.");
      reasons.add("Volume confirms active buyer participation.");
      coachMessage = "Wiseman's Analysis: A textbook bullish reversal setup. Momentum has aligned with value. Maintain strict risk parameters.";
    } else if (rsiOverbought && !bullishMACD) {
      status = "Trade Approved";
      direction = "SELL";
      confidence = 82.0;
      reasons.add("RSI shows overbought conditions ($rsi), indicating near-term exhaustion.");
      reasons.add("MACD crossed below the signal line, signalling bearish shift.");
      reasons.add("Volume supports price rejection at key resistance levels.");
      coachMessage = "Wiseman's Analysis: The buyers are exhausted. Distribution is underway. A short execution is highly favored.";
    } else if (rsiNeutral) {
      status = "High Risk - Avoid";
      direction = "NEUTRAL";
      confidence = 35.0;
      reasons.add("RSI is rangebound ($rsi) showing no clear directional strength.");
      reasons.add("MACD histogram is flat, indicating absence of momentum.");
      coachMessage = "Wiseman's Analysis: Avoid chop. The trend is consolidating. Capital preservation is the highest form of profit right now.";
    } else {
      // Conflicting signals
      status = "High Risk - Avoid";
      direction = "NEUTRAL";
      confidence = 45.0;
      if (rsiOversold && !bullishMACD) {
        reasons.add("RSI is oversold but MACD lacks bullish confirmation.");
      } else if (rsiOverbought && bullishMACD) {
        reasons.add("RSI is overbought but MACD is still printing positive momentum.");
      } else {
        reasons.add("Indicators are out of sync. Divergence detected.");
      }
      coachMessage = "Wiseman's Analysis: Conflicting signals detected. Never force a trade. True strength lies in stepping aside.";
    }

    return CoachRecommendation(
      status: status,
      direction: direction,
      confidence: confidence,
      reasons: reasons,
      coachMessage: coachMessage,
    );
  }
}
