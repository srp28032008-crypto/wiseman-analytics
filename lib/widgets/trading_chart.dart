import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/colors.dart';
import '../state/market_provider.dart';

class TradingChart extends ConsumerWidget {
  const TradingChart({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tick = ref.watch(liveTickProvider);
    final history = tick.priceHistory;

    // Convert history list into FlSpot points
    List<FlSpot> spots = [];
    for (int i = 0; i < history.length; i++) {
      spots.add(FlSpot(i.toDouble(), history[i]));
    }

    // Determine min/max price for auto-scaling
    double minPrice = history.isEmpty ? 0 : history.reduce((a, b) => a < b ? a : b);
    double maxPrice = history.isEmpty ? 100 : history.reduce((a, b) => a > b ? a : b);
    double margin = (maxPrice - minPrice) * 0.1;
    if (margin == 0) margin = 1;
    minPrice -= margin;
    maxPrice += margin;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Chart Metrics Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.analytics_outlined, color: WisemanColors.gold, size: 18),
                    const SizedBox(width: 8),
                    Text(
                      'TICK STREAM (REAL-TIME)',
                      style: GoogleFonts.orbitron(
                        textStyle: const TextStyle(
                          color: WisemanColors.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  'VOLUME: ${tick.volume}M',
                  style: GoogleFonts.inter(
                    textStyle: const TextStyle(
                      color: WisemanColors.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            
            // The Actual Line Chart
            SizedBox(
              height: 240,
              child: spots.isEmpty
                  ? const Center(child: CircularProgressIndicator(color: WisemanColors.cyan))
                  : LineChart(
                      LineChartData(
                        gridData: FlGridData(
                          show: true,
                          drawVerticalLine: true,
                          horizontalInterval: (maxPrice - minPrice) / 4,
                          verticalInterval: 5,
                          getDrawingHorizontalLine: (value) => const FlLine(
                            color: WisemanColors.border,
                            strokeWidth: 0.8,
                          ),
                          getDrawingVerticalLine: (value) => const FlLine(
                            color: WisemanColors.border,
                            strokeWidth: 0.8,
                          ),
                        ),
                        titlesData: const FlTitlesData(show: false),
                        borderData: FlBorderData(
                          show: true,
                          border: Border.all(color: WisemanColors.border, width: 1),
                        ),
                        minX: 0,
                        maxX: (history.length - 1).toDouble(),
                        minY: minPrice,
                        maxY: maxPrice,
                        lineBarsData: [
                          LineChartBarData(
                            spots: spots,
                            isCurved: true,
                            gradient: const LinearGradient(
                              colors: [WisemanColors.cyan, Color(0xFF00A2FF)],
                            ),
                            barWidth: 2,
                            isStrokeCapRound: true,
                            dotData: const FlDotData(show: false),
                            belowBarData: BarAreaData(
                              show: true,
                              gradient: LinearGradient(
                                colors: [
                                  WisemanColors.cyan.withOpacity(0.2),
                                  WisemanColors.cyan.withOpacity(0.0),
                                ],
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
            const SizedBox(height: 16),

            // Live Indicators Subpanel
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildIndicatorBadge('RSI (14)', tick.rsi.toString(), 
                    tick.rsi > 70 ? WisemanColors.redNeon : (tick.rsi < 30 ? WisemanColors.greenNeon : WisemanColors.cyan)),
                _buildIndicatorBadge('MACD', tick.macd.toString(), 
                    tick.macd >= tick.signalLine ? WisemanColors.greenNeon : WisemanColors.redNeon),
                _buildIndicatorBadge('SIGNAL', tick.signalLine.toString(), WisemanColors.textSecondary),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIndicatorBadge(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: WisemanColors.surfaceLight,
        borderRadius: const BorderRadius.all(Radius.circular(8)),
        border: Border.all(color: WisemanColors.border),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              textStyle: const TextStyle(
                color: WisemanColors.textMuted,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.orbitron(
              textStyle: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
