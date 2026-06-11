import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/colors.dart';
import '../models/market_data.dart';
import '../state/market_provider.dart';

class MarketSwitcher extends ConsumerWidget {
  const MarketSwitcher({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentMarket = ref.watch(marketTypeProvider);

    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: WisemanColors.surface,
        borderRadius: const BorderRadius.all(Radius.circular(12)),
        border: Border.all(color: WisemanColors.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildTab(
              context,
              ref,
              label: 'INDIAN STOCKS',
              icon: Icons.show_chart_rounded,
              type: MarketType.indianStocks,
              isActive: currentMarket == MarketType.indianStocks,
            ),
          ),
          Expanded(
            child: _buildTab(
              context,
              ref,
              label: 'CRYPTO 24/7',
              icon: Icons.currency_bitcoin_rounded,
              type: MarketType.crypto,
              isActive: currentMarket == MarketType.crypto,
            ),
          ),
          Expanded(
            child: _buildTab(
              context,
              ref,
              label: 'FOREX MARKET',
              icon: Icons.euro_symbol_rounded,
              type: MarketType.forex,
              isActive: currentMarket == MarketType.forex,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(
    BuildContext context,
    WidgetRef ref, {
    required String label,
    required IconData icon,
    required MarketType type,
    required bool isActive,
  }) {
    return GestureDetector(
      onTap: () {
        ref.read(marketTypeProvider.notifier).state = type;
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isActive ? WisemanColors.surfaceLight : Colors.transparent,
          borderRadius: const BorderRadius.all(Radius.circular(8)),
          border: isActive
              ? Border.all(color: WisemanColors.cyan.withOpacity(0.5), width: 1)
              : Border.all(color: Colors.transparent, width: 1),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: WisemanColors.cyan.withOpacity(0.1),
                    blurRadius: 10,
                    spreadRadius: -2,
                  ),
                ]
              : [],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 16,
              color: isActive ? WisemanColors.cyan : WisemanColors.textSecondary,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: GoogleFonts.orbitron(
                textStyle: TextStyle(
                  color: isActive ? WisemanColors.textPrimary : WisemanColors.textSecondary,
                  fontSize: 10,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                  letterSpacing: 1.0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
