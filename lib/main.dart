import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'constants/colors.dart';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: WisemanApp(),
    ),
  );
}

class WisemanApp extends StatelessWidget {
  const WisemanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wiseman Analytics',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: WisemanColors.background,
        colorScheme: const ColorScheme.dark(
          primary: WisemanColors.gold,
          secondary: WisemanColors.cyan,
          surface: WisemanColors.surface,
          background: WisemanColors.background,
        ),
        textTheme: GoogleFonts.outfitTextTheme(
          ThemeData.dark().textTheme,
        ).apply(
          bodyColor: WisemanColors.textPrimary,
          displayColor: WisemanColors.textPrimary,
        ),
        cardTheme: const CardTheme(
          color: WisemanColors.surface,
          elevation: 8,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
            side: BorderSide(color: WisemanColors.border, width: 1),
          ),
        ),
      ),
      home: const DashboardScreen(),
    );
  }
}
