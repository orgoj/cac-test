# Flutter Development Skill

## Description
Build beautiful cross-platform mobile apps with Flutter and Dart. Covers widgets, state management with Provider/BLoC, navigation, API integration, and material design.

## When to Use This Skill
- Creating iOS and Android applications with native performance
- Designing custom UIs through Flutter's widget system
- Building complex animations and visual effects
- Rapid development leveraging hot reload functionality
- Ensuring consistent user experiences across platforms

## Core Concepts

### Project Structure
```
my_app/
├── lib/
│   ├── main.dart
│   ├── screens/
│   ├── widgets/
│   ├── models/
│   ├── services/
│   └── providers/
├── pubspec.yaml
└── test/
```

### Basic Flutter App Template
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: const Center(
        child: Text('Hello, Flutter!'),
      ),
    );
  }
}
```

## Best Practices

### Do:
- Use const constructors for better performance
- Implement proper resource disposal (dispose() methods)
- Test across different device sizes
- Handle errors comprehensively
- Test on both iOS and Android platforms
- Use meaningful widget names
- Separate business logic from UI code

### Don't:
- Hardcode values (use constants or configuration)
- Use complex setState logic (prefer state management solutions)
- Make network calls in build methods
- Skip testing phases
- Ignore platform-specific differences

## Common Patterns

### State Management with Provider
```dart
// Model
class Counter extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// Usage in main.dart
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => Counter(),
      child: const MyApp(),
    ),
  );
}

// Access in widget
final counter = Provider.of<Counter>(context);
```

### Navigation
```dart
// Navigate to new screen
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => const SecondScreen()),
);

// Navigate back
Navigator.pop(context);
```

### HTTP Requests
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<dynamic>> fetchData() async {
  final response = await http.get(Uri.parse('https://api.example.com/data'));

  if (response.statusCode == 200) {
    return json.decode(response.body);
  } else {
    throw Exception('Failed to load data');
  }
}
```

## Common Commands

### Create New Project
```bash
flutter create my_app
cd my_app
```

### Run App
```bash
flutter run
# Or for specific device:
flutter run -d chrome  # Web
flutter run -d macos   # macOS
```

### Add Dependencies
```bash
flutter pub add provider
flutter pub add http
flutter pub add go_router
```

### Test
```bash
flutter test
```

### Build
```bash
flutter build apk      # Android
flutter build ios      # iOS
flutter build web      # Web
```

## Essential Widgets

- **Layout**: Container, Column, Row, Stack, Expanded, Padding
- **Input**: TextField, Form, Checkbox, Radio, Switch
- **Display**: Text, Image, Icon, Card
- **Interactive**: Button (ElevatedButton, TextButton, IconButton), GestureDetector
- **Navigation**: AppBar, Drawer, BottomNavigationBar, TabBar
- **Async**: FutureBuilder, StreamBuilder

## Instructions for AI Assistant

When working with Flutter projects:

1. Always check if Flutter SDK is installed first
2. Create proper project structure following Flutter conventions
3. Use Material Design 3 (Material 3) for modern UI
4. Implement responsive design principles
5. Add proper error handling and loading states
6. Use const constructors wherever possible
7. Follow Dart naming conventions (lowerCamelCase for variables, UpperCamelCase for classes)
8. Add comments for complex logic
9. Suggest appropriate state management based on app complexity
10. Test the app structure before suggesting advanced features
