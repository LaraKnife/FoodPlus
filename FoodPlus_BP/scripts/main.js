import { world, system } from "@minecraft/server";

// system.beforeEvents.watchdogTerminate.subscribe((event) => {});

world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  try {
    if (player.getDynamicProperty("current_item_nutrition") === undefined) {
      player.setDynamicProperty("current_item_nutrition", 0);
      player.setDynamicProperty("current_item_saturation", 0);
    }
  } catch (e) {}
});

system.runInterval(() => {
  const players = world.getAllPlayers();
  if (!players) return;

  for (const player of players) {
    try {
      const inventory = player.getComponent("minecraft:inventory");
      if (!inventory || !inventory.container) continue;

      const container = inventory.container;
      const item = container.getItem(player.selectedSlotIndex);

      let nutritionValue = 0;
      let saturationValue = 0;

      if (item && item.hasComponent("minecraft:food")) {
        const foodComp = item.getComponent("minecraft:food");
        nutritionValue = foodComp.nutrition;
        saturationValue = nutritionValue * foodComp.saturationModifier * 2;
      }

      // Inyectar datos.
      player.setDynamicProperty("current_item_nutrition", nutritionValue);
      player.setDynamicProperty("current_item_saturation", saturationValue);
    } catch (error) {
      console.error("Error updating player nutrition properties:", error);
    }
  }
}, 4);
