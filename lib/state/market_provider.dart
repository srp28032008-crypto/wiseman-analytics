import 'dart:async';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/market_data.dart';

// Current active market type
final marketTypeProvider = StateProvider<MarketType>((ref) => MarketType.indianStocks);

// Current active ticker/symbol
final activeSymbolProvider = StateProvider<String>((ref) {
  final market = ref.watch(marketTypeProvider);
  switch (market) {
    case MarketType.indianStocks:
      return "NIFTY_50";
    case MarketType.crypto:
      return "BTC_USDT";
    case MarketType.forex:
      return "EUR_USD";
  }
});

// Live tick provider for the active symbol
final liveTickProvider = StateNotifierProvider<MarketNotifier, MarketTick>((ref) {
  final symbol = ref.watch(activeSymbolProvider);
  final type = ref.watch(marketTypeProvider);
  return MarketNotifier(symbol, type);
});

class MarketNotifier extends StateNotifier<MarketTick> {
  final String symbol;
  final MarketType type;
  Timer? _timer;
  final _random = Random();

  MarketNotifier(this.symbol, this.type) : super(_getInitialTick(symbol, type)) {
    _startSimulation();
  }

  static MarketTick _getInitialTick(String symbol, MarketType type) {
    double basePrice;
    String name;
    switch (type) {
      case MarketType.indianStocks:
        basePrice = 22450.0;
        name = "Nifty 50 Index";
        break;
      case MarketType.crypto:
        basePrice = 67500.0;
        name = "Bitcoin / U.S. Dollar";
        break;
      case MarketType.forex:
        basePrice = 1.0850;
        name = "Euro / U.S. Dollar";
        break;
    }

    // Generate initial history
    List<double> history = List.generate(20, (i) {
      double pct = (i - 10) * 0.001;
      return basePrice * (1.0 + pct);
    });

    return MarketTick(
      symbol: symbol,
      name: name,
      price: basePrice,
      changePercentage: 0.25,
      volume: type == MarketType.crypto ? 120.5 : 25.4,
      rsi: 54.0,
      macd: 0.12,
      signalLine: 0.08,
      timestamp: DateTime.now(),
      priceHistory: history,
    );
  }

  void _startSimulation() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(milliseconds: 1000), (timer) {
      if (!mounted) return;

      double volatility;
      switch (type) {
        case MarketType.indianStocks:
          volatility = 0.0005; // 0.05% change per second
          break;
        case MarketType.crypto:
          volatility = 0.002;  // 0.2% change per second
          break;
        case MarketType.forex:
          volatility = 0.0001; // 0.01% change per second
          break;
      }

      // Random price walk
      double percentChange = (_random.nextDouble() - 0.48) * volatility;
      double newPrice = state.price * (1.0 + percentChange);
      
      // Keep forex decimal formatting
      if (type == MarketType.forex) {
        newPrice = double.parse(newPrice.toStringAsFixed(5));
      } else {
        newPrice = double.parse(newPrice.toStringAsFixed(2));
      }

      // Update history list (max 30 items)
      List<double> updatedHistory = List.from(state.priceHistory);
      updatedHistory.add(newPrice);
      if (updatedHistory.length > 30) {
        updatedHistory.removeAt(0);
      }

      // Live indicator fluctuation
      double newRsi = state.rsi + (_random.nextDouble() - 0.5) * 4.0;
      newRsi = newRsi.clamp(10.0, 90.0);

      double newMacd = state.macd + (_random.nextDouble() - 0.5) * 0.08;
      double newSignal = state.signalLine + (_random.nextDouble() - 0.5) * 0.04;

      double baseChange = (newPrice - updatedHistory.first) / updatedHistory.first * 100;
      double changePct = double.parse(baseChange.toStringAsFixed(2));

      double volumeFactor = _random.nextDouble() * (type == MarketType.crypto ? 40.0 : 8.0);
      double newVolume = type == MarketType.crypto 
          ? 80.0 + volumeFactor
          : 15.0 + volumeFactor;

      state = MarketTick(
        symbol: symbol,
        name: state.name,
        price: newPrice,
        changePercentage: changePct,
        volume: double.parse(newVolume.toStringAsFixed(1)),
        rsi: double.parse(newRsi.toStringAsFixed(1)),
        macd: double.parse(newMacd.toStringAsFixed(3)),
        signalLine: double.parse(newSignal.toStringAsFixed(3)),
        timestamp: DateTime.now(),
        priceHistory: updatedHistory,
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
