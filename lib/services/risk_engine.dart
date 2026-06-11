import '../models/market_data.dart';

class TradeSetup {
  final double entryPrice;
  final double stopLoss;
  final double target1to2;
  final double target1to3;
  final double volatilityPercentage;
  final double riskAmount;
  final double reward1to2;
  final double reward1to3;

  TradeSetup({
    required this.entryPrice,
    required this.stopLoss,
    required this.target1to2,
    required this.target1to3,
    required this.volatilityPercentage,
    required this.riskAmount,
    required this.reward1to2,
    required this.reward1to3,
  });
}

class RiskEngine {
  /// Calculates trade setup based on market type volatility
  static TradeSetup calculateTradeSetup({
    required double entryPrice,
    required MarketType marketType,
    required bool isLong,
  }) {
    // Default volatility percentages based on market
    double volatilityPercent;
    switch (marketType) {
      case MarketType.indianStocks:
        volatilityPercent = 1.5; // 1.5% volatility stop
        break;
      case MarketType.crypto:
        volatilityPercent = 4.5; // 4.5% high volatility stop
        break;
      case MarketType.forex:
        volatilityPercent = 0.4; // 0.4% lower volatility stop
        break;
    }

    double riskMultiplier = volatilityPercent / 100.0;
    double riskAmount = entryPrice * riskMultiplier;

    double stopLoss;
    double target1to2;
    double target1to3;

    if (isLong) {
      stopLoss = entryPrice - riskAmount;
      target1to2 = entryPrice + (riskAmount * 2.0);
      target1to3 = entryPrice + (riskAmount * 3.0);
    } else {
      // Short trade
      stopLoss = entryPrice + riskAmount;
      target1to2 = entryPrice - (riskAmount * 2.0);
      target1to3 = entryPrice - (riskAmount * 3.0);
    }

    return TradeSetup(
      entryPrice: entryPrice,
      stopLoss: stopLoss,
      target1to2: target1to2,
      target1to3: target1to3,
      volatilityPercentage: volatilityPercent,
      riskAmount: riskAmount,
      reward1to2: riskAmount * 2.0,
      reward1to3: riskAmount * 3.0,
    );
  }
}
