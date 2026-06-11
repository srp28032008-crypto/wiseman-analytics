import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/colors.dart';
import '../state/market_provider.dart';
import '../widgets/market_switcher.dart';
import '../widgets/trading_chart.dart';
import '../widgets/risk_calculator.dart';
import '../widgets/ai_coach_card.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeSymbol = ref.watch(activeSymbolProvider);
    final tickData = ref.watch(liveTickProvider);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Segment
              _buildHeader(context, activeSymbol, tickData.price, tickData.changePercentage),
              const SizedBox(height: 16),
              
              // Main Dashboard Area
              Expanded(
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    if (constraints.maxWidth >= 1024) {
                      // Desktop Layout (Horizontal split)
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Left Section: Switcher + Chart + AI Coach
                          Expanded(
                            flex: 7,
                            child: SingleChildScrollView(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const MarketSwitcher(),
                                  const SizedBox(height: 16),
                                  const TradingChart(),
                                  const SizedBox(height: 16),
                                  const AICoachCard(),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          // Right Section: Risk Calculator & Portfolio details
                          const Expanded(
                            flex: 3,
                            child: SingleChildScrollView(
                              child: RiskCalculator(),
                            ),
                          ),
                        ],
                      );
                    } else if (constraints.maxWidth >= 640) {
                      // Tablet Layout
                      return SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const MarketSwitcher(),
                            const SizedBox(height: 16),
                            const TradingChart(),
                            const SizedBox(height: 16),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Expanded(
                                  child: AICoachCard(),
                                ),
                                const SizedBox(width: 16),
                                const Expanded(
                                  child: RiskCalculator(),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    } else {
                      // Mobile Layout (Single Column)
                      return SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const MarketSwitcher(),
                            const SizedBox(height: 16),
                            const TradingChart(),
                            const SizedBox(height: 16),
                            const AICoachCard(),
                            const SizedBox(height: 16),
                            const RiskCalculator(),
                          ],
                        ),
                      );
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, String symbol, double price, double changePercent) {
    final isPositive = changePercent >= 0;
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Title / Branding
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 8,
                  height: 24,
                  decoration: const BoxDecoration(
                    color: WisemanColors.gold,
                    borderRadius: BorderRadius.all(Radius.circular(4)),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  'WISEMAN ANALYTICS',
                  style: GoogleFonts.orbitron(
                    textStyle: const TextStyle(
                      color: WisemanColors.goldAccent,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'REAL-TIME QUANTITATIVE ENGINE',
              style: GoogleFonts.inter(
                textStyle: const TextStyle(
                  color: WisemanColors.cyan,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1.5,
                ),
              ),
            ),
          ],
        ),
        
        // Active Ticker Metrics
        Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  symbol.replaceAll('_', ' '),
                  style: GoogleFonts.inter(
                    textStyle: const TextStyle(
                      color: WisemanColors.textSecondary,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Text(
                      price.toString(),
                      style: GoogleFonts.orbitron(
                        textStyle: const TextStyle(
                          color: WisemanColors.textPrimary,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: isPositive 
                            ? WisemanColors.greenNeon.withOpacity(0.15) 
                            : WisemanColors.redNeon.withOpacity(0.15),
                        borderRadius: const BorderRadius.all(Radius.circular(4)),
                        border: Border.all(
                          color: isPositive ? WisemanColors.greenNeon : WisemanColors.redNeon,
                          width: 0.5,
                        ),
                      ),
                      child: Text(
                        '${isPositive ? '+' : ''}$changePercent%',
                        style: TextStyle(
                          color: isPositive ? WisemanColors.greenNeon : WisemanColors.redNeon,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }
}
