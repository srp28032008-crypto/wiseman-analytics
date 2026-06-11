import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/colors.dart';
import '../state/market_provider.dart';
import '../services/ai_coach.dart';

class AICoachCard extends ConsumerWidget {
  const AICoachCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tick = ref.watch(liveTickProvider);
    final marketType = ref.watch(marketTypeProvider);

    final analysis = AICoach.analyze(
      rsi: tick.rsi,
      macd: tick.macd,
      signalLine: tick.signalLine,
      volume: tick.volume,
      marketType: marketType,
    );

    final isApproved = analysis.status == "Trade Approved";
    final isDanger = analysis.status == "High Risk - Avoid";

    Color signalColor = WisemanColors.cyan;
    if (isApproved) {
      signalColor = analysis.direction == "BUY" ? WisemanColors.greenNeon : WisemanColors.redNeon;
    } else if (isDanger) {
      signalColor = WisemanColors.redNeon;
    }

    return Card(
      child: Container(
        decoration: BoxDecoration(
          borderRadius: const BorderRadius.all(Radius.circular(16)),
          gradient: LinearGradient(
            colors: [
              signalColor.withOpacity(0.03),
              Colors.transparent,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Head Section with Wiseman Avatar
            Row(
              children: [
                // Stylized Mascot Placeholder (Neon Avatar)
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: WisemanColors.surfaceLight,
                    shape: BoxShape.circle,
                    border: Border.all(color: WisemanColors.gold, width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: WisemanColors.gold.withOpacity(0.2),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.psychology_outlined,
                      color: WisemanColors.gold,
                      size: 24,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                
                // Name & Subtext
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'WISEMAN AI COACH',
                      style: GoogleFonts.orbitron(
                        textStyle: const TextStyle(
                          color: WisemanColors.goldAccent,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'REAL-TIME HEURISTICS',
                      style: GoogleFonts.inter(
                        textStyle: const TextStyle(
                          color: WisemanColors.textMuted,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ),
                  ],
                ),
                const Spacer(),

                // Status Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: signalColor.withOpacity(0.1),
                    borderRadius: const BorderRadius.all(Radius.circular(6)),
                    border: Border.all(color: signalColor, width: 0.8),
                  ),
                  child: Text(
                    analysis.status.toUpperCase(),
                    style: TextStyle(
                      color: signalColor,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Confidence Indicator Meter
            Row(
              children: [
                Text(
                  'CONFIDENCE',
                  style: GoogleFonts.inter(
                    textStyle: const TextStyle(
                      color: WisemanColors.textSecondary,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  '${analysis.confidence.toInt()}%',
                  style: GoogleFonts.orbitron(
                    textStyle: TextStyle(
                      color: signalColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            ClipRRect(
              borderRadius: const BorderRadius.all(Radius.circular(4)),
              child: LinearProgressIndicator(
                value: analysis.confidence / 100.0,
                backgroundColor: WisemanColors.surfaceLight,
                color: signalColor,
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 20),

            // Coach Quote Block
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: WisemanColors.background,
                borderRadius: const BorderRadius.all(Radius.circular(8)),
                border: Border.all(color: WisemanColors.border),
              ),
              child: Text(
                '"${analysis.coachMessage}"',
                style: GoogleFonts.inter(
                  textStyle: const TextStyle(
                    color: WisemanColors.textPrimary,
                    fontSize: 11,
                    fontStyle: FontStyle.italic,
                    height: 1.4,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Signals Checklist
            Text(
              'SIGNAL RATIONALE',
              style: GoogleFonts.inter(
                textStyle: const TextStyle(
                  color: WisemanColors.textMuted,
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.0,
                ),
              ),
            ),
            const SizedBox(height: 8),
            ...analysis.reasons.map((reason) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 4.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    isApproved ? Icons.check_circle_outline_rounded : Icons.info_outline_rounded,
                    size: 14,
                    color: isApproved ? WisemanColors.greenNeon : WisemanColors.textSecondary,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      reason,
                      style: GoogleFonts.inter(
                        textStyle: const TextStyle(
                          color: WisemanColors.textSecondary,
                          fontSize: 10.5,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}
