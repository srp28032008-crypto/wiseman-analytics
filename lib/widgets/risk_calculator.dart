import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/colors.dart';
import '../models/market_data.dart';
import '../state/market_provider.dart';
import '../services/risk_engine.dart';

class RiskCalculator extends ConsumerStatefulWidget {
  const RiskCalculator({super.key});

  @override
  ConsumerState<RiskCalculator> createState() => _RiskCalculatorState();
}

class _RiskCalculatorState extends ConsumerState<RiskCalculator> {
  final TextEditingController _priceController = TextEditingController();
  bool _isLong = true;
  TradeSetup? _setupResult;

  @override
  void initState() {
    super.initState();
    // Schedule controller update after build completes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final currentPrice = ref.read(liveTickProvider).price;
      _priceController.text = currentPrice.toString();
      _recalculate();
    });
  }

  @override
  void dispose() {
    _priceController.dispose();
    super.dispose();
  }

  void _recalculate() {
    final marketType = ref.read(marketTypeProvider);
    final entry = double.tryParse(_priceController.text);
    if (entry == null || entry <= 0) return;

    setState(() {
      _setupResult = RiskEngine.calculateTradeSetup(
        entryPrice: entry,
        marketType: marketType,
        isLong: _isLong,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final tick = ref.watch(liveTickProvider);
    final marketType = ref.watch(marketTypeProvider);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Title
            Row(
              children: [
                const Icon(Icons.calculate_outlined, color: WisemanColors.gold, size: 18),
                const SizedBox(width: 8),
                Text(
                  'SMART RISK ENGINE',
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
            const SizedBox(height: 20),

            // Mode Selector (Long vs Short)
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() => _isLong = true);
                      _recalculate();
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: _isLong ? WisemanColors.greenNeon.withOpacity(0.1) : Colors.transparent,
                        borderRadius: const BorderRadius.all(Radius.circular(8)),
                        border: Border.all(
                          color: _isLong ? WisemanColors.greenNeon : WisemanColors.border,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'BUY / LONG',
                          style: GoogleFonts.orbitron(
                            textStyle: TextStyle(
                              color: _isLong ? WisemanColors.greenNeon : WisemanColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() => _isLong = false);
                      _recalculate();
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        color: !_isLong ? WisemanColors.redNeon.withOpacity(0.1) : Colors.transparent,
                        borderRadius: const BorderRadius.all(Radius.circular(8)),
                        border: Border.all(
                          color: !_isLong ? WisemanColors.redNeon : WisemanColors.border,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'SELL / SHORT',
                          style: GoogleFonts.orbitron(
                            textStyle: TextStyle(
                              color: !_isLong ? WisemanColors.redNeon : WisemanColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Entry Price input field
            Text(
              'ENTRY PRICE',
              style: GoogleFonts.inter(
                textStyle: const TextStyle(
                  color: WisemanColors.textSecondary,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _priceController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: GoogleFonts.orbitron(
                textStyle: const TextStyle(
                  color: WisemanColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              onChanged: (_) => _recalculate(),
              decoration: InputDecoration(
                fillColor: WisemanColors.surfaceLight,
                filled: true,
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                enabledBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: WisemanColors.border),
                  borderRadius: BorderRadius.all(Radius.circular(8)),
                ),
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: WisemanColors.cyan),
                  borderRadius: BorderRadius.all(Radius.circular(8)),
                ),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.flash_on_rounded, color: WisemanColors.gold, size: 18),
                  tooltip: 'Sync current price',
                  onPressed: () {
                    _priceController.text = tick.price.toString();
                    _recalculate();
                  },
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Outputs Panel
            if (_setupResult != null) ...[
              const Divider(color: WisemanColors.border, height: 1),
              const SizedBox(height: 16),
              
              _buildPriceMetric(
                label: 'VOLATILITY BUFFER',
                value: '${_setupResult!.volatilityPercentage}%',
                subtitle: 'Dynamic Stop Margin',
                color: WisemanColors.cyan,
              ),
              const SizedBox(height: 12),

              _buildPriceMetric(
                label: 'STOP LOSS',
                value: _setupResult!.stopLoss.toStringAsFixed(marketType == MarketType.forex ? 5 : 2),
                subtitle: 'Risk Amount: ${_setupResult!.riskAmount.toStringAsFixed(marketType == MarketType.forex ? 5 : 2)}',
                color: WisemanColors.redNeon,
              ),
              const SizedBox(height: 12),

              _buildPriceMetric(
                label: 'TARGET 1 (1:2 R:R)',
                value: _setupResult!.target1to2.toStringAsFixed(marketType == MarketType.forex ? 5 : 2),
                subtitle: 'Est. Return: ${_setupResult!.reward1to2.toStringAsFixed(marketType == MarketType.forex ? 5 : 2)}',
                color: WisemanColors.greenNeon,
              ),
              const SizedBox(height: 12),

              _buildPriceMetric(
                label: 'TARGET 2 (1:3 R:R)',
                value: _setupResult!.target1to3.toStringAsFixed(marketType == MarketType.forex ? 5 : 2),
                subtitle: 'Est. Return: ${_setupResult!.reward1to3.toStringAsFixed(marketType == MarketType.forex ? 5 : 2)}',
                color: WisemanColors.gold,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPriceMetric({
    required String label,
    required String value,
    required String subtitle,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: WisemanColors.surfaceLight,
        borderRadius: const BorderRadius.all(Radius.circular(8)),
        border: Border.all(color: WisemanColors.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: GoogleFonts.inter(
                  textStyle: TextStyle(
                    color: color,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                  ),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: GoogleFonts.inter(
                  textStyle: const TextStyle(
                    color: WisemanColors.textMuted,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          Text(
            value,
            style: GoogleFonts.orbitron(
              textStyle: const TextStyle(
                color: WisemanColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
