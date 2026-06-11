import 'package:flutter/material.dart';

class WisemanColors {
  // Deep Space Dark Theme Colors
  static const Color background = Color(0xFF050508);
  static const Color surface = Color(0xFF0D0E15);
  static const Color surfaceLight = Color(0xFF181926);
  static const Color border = Color(0xFF1E293B);

  // Accent Colors
  static const Color gold = Color(0xFFD4AF37); // #D4AF37 Metallic Gold
  static const Color goldAccent = Color(0xFFFFD700); // Bright Gold
  static const Color cyan = Color(0xFF00F0FF); // Neon Cyan
  static const Color cyanDim = Color(0x8000F0FF);

  // Semantic Colors
  static const Color greenNeon = Color(0xFF00E676); // Buy signals
  static const Color redNeon = Color(0xFFFF1744); // Sell signals

  // Text Colors
  static const Color textPrimary = Color(0xFFF1F5F9);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  // Gradient Colors
  static const LinearGradient premiumGradient = LinearGradient(
    colors: [gold, Color(0xFF8A7322)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cyanGradient = LinearGradient(
    colors: [cyan, Color(0xFF00B0FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkCardGradient = LinearGradient(
    colors: [surface, Color(0x000D0E15)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
