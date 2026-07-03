# FoodPlus Add-on 🍖

**FoodPlus** is a Minecraft Bedrock add-on that entirely overhauls the game's natural regeneration system. It introduces a custom, performance-friendly health regeneration mechanic tied directly to your hunger and saturation levels, complete with a clean, dynamic UI.

Developed by **LaraKnife**.

---

## 🌟 Features

- **Overhauled Regeneration System:** Disables vanilla natural regeneration. Health now strategically regenerates based on precise saturation and hunger thresholds.
- **Custom Saturation UI:** A brand new, non-intrusive UI element displays your exact saturation level in real-time right above your hotbar.
- **Performance Optimized:** Engineered with server performance in mind. The script utilizes spaced intervals (running every 10 ticks) instead of heavy per-tick jobs, ensuring perfect TPS (Ticks Per Second) even in multiplayer environments.
- **Multiplayer Compatible:** The system tracks and manages each player's stats independently using native `@minecraft/server` components.
- **Namespace Protected:** Custom UI elements are safely contained within their own namespace to prevent conflicts with other popular add-ons.

## ⚙️ How it Works

1. As long as your **Saturation is at 3 or higher**, or your **Hunger is above 18**, you will slowly regenerate health.
2. Regenerating health will naturally consume your saturation and hunger over time.
3. The custom UI will dynamically update to reflect your current saturation status, allowing you to manage your food consumption more effectively.

## 📦 Installation Guide

1. Download the `.mcaddon` file from the releases section.
2. Double-click the file to automatically import it into Minecraft Bedrock.
3. Apply the **FoodPlus BP** (Behavior Pack) and **FoodPlus RP** (Resource Pack) to your world.
4. **Important:** Ensure you enable the **Beta APIs** experimental toggle in your world settings for the scripts to function properly.

## 🛠️ Technical Details (For Developers)

- **Minimum Engine Version:** 1.21.0
- **API Version:** `@minecraft/server 2.1.0`
- Written purely in JavaScript with optimized memory management (no unhandled jobs or tick-spam).

---

_If you find any bugs or have suggestions, feel free to open an issue!_
