enum MarketType {
  indianStocks,
  crypto,
  forex,
}

class MarketTick {
  final String symbol;
  final String name;
  final double price;
  final double changePercentage;
  final double volume;
  final double rsi;
  final double macd;
  final double signalLine;
  final DateTime timestamp;
  final List<double> priceHistory;

  MarketTick({
    required this.symbol,
    required this.name,
    required this.price,
    required this.changePercentage,
    required this.volume,
    required this.rsi,
    required this.macd,
    required this.signalLine,
    required this.timestamp,
    required this.priceHistory,
  });

  MarketTick copyWith({
    String? symbol,
    String? name,
    double? price,
    double? changePercentage,
    double? volume,
    double? rsi,
    double? macd,
    double? signalLine,
    DateTime? timestamp,
    List<double>? priceHistory,
  }) {
    return MarketTick(
      symbol: symbol ?? this.symbol,
      name: name ?? this.name,
      price: price ?? this.price,
      changePercentage: changePercentage ?? this.changePercentage,
      volume: volume ?? this.volume,
      rsi: rsi ?? this.rsi,
      macd: macd ?? this.macd,
      signalLine: signalLine ?? this.signalLine,
      timestamp: timestamp ?? this.timestamp,
      priceHistory: priceHistory ?? this.priceHistory,
    );
  }
}
