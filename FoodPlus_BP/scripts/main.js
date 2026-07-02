import { world, system } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  try {
    player.setProperty("foodplus:nutrition", 0);
    player.setProperty("foodplus:saturation", 0.0);
    player.setProperty("foodplus:has_nutrition", false);
  } catch (e) {}
});

system.runInterval(() => {
  const players = world.getAllPlayers();
  for (const player of players) {
    try {
      const inventory = player.getComponent("minecraft:inventory");
      if (!inventory || !inventory.container) continue;

      const container = inventory.container;
      const item = container.getItem(player.selectedSlotIndex);

      let nutritionValue = 0;
      let saturationValue = 0.0;
      let hasNutrition = false;

      if (item && item.getComponent("minecraft:food")) {
        const foodComp = item.getComponent("minecraft:food");
        nutritionValue = foodComp.nutrition;
        saturationValue = nutritionValue * foodComp.saturationModifier * 2;
        hasNutrition = nutritionValue > 0;
      }

      player.setProperty("foodplus:nutrition", nutritionValue);
      player.setProperty("foodplus:saturation", saturationValue);
      player.setProperty("foodplus:has_nutrition", hasNutrition);
    } catch (error) {}
  }
}, 4);
