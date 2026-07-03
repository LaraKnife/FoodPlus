import { system, world } from "@minecraft/server";
import { PLAYERS_LIST } from "./getPlayers";

const regenValues = new Map();
const REGEN_COOLDOWN = 2;

// Inhabilitamos la regeneración base del juego
system.run(() => {
  world.gameRules.naturalRegeneration = false;
});

// Sistema propio de regeneración, ejecutado cada 10 ticks (aprox 0.5 segundos)
system.runInterval(() => {
  for (const player of PLAYERS_LIST) {
    if (!player.isValid) continue;

    if (player.getGameMode() !== "Survival") {
      player.onScreenDisplay.setActionBar("§e");
      continue;
    }

    const SATURATION = player.getComponent("minecraft:player.saturation");
    const HUNGER = player.getComponent("minecraft:player.hunger");
    const HEALTH = player.getComponent("health");

    if (!regenValues.has(player.id)) {
      regenValues.set(player.id, 0);
    }

    if (world.getDifficulty() === "Peaceful") {
      SATURATION.setCurrentValue(5);
      continue;
    }

    if (HEALTH.currentValue === 0) continue;

    let saturationValue = SATURATION.currentValue;
    let regen = regenValues.get(player.id);
    const regenBySaturation =
      HEALTH.currentValue < HEALTH.effectiveMax && saturationValue >= 3;
    const regenByHunger =
      HEALTH.currentValue < HEALTH.effectiveMax && HUNGER.currentValue > 18;

    if (regenBySaturation || regenByHunger) {
      regen++;

      if (regen >= REGEN_COOLDOWN) {
        if (
          regenBySaturation &&
          HEALTH.currentValue < HEALTH.effectiveMax &&
          HUNGER.currentValue >= 18
        ) {
          if (world.getDifficulty() !== "Peaceful") {
            SATURATION.setCurrentValue(saturationValue - 1.2);
            saturationValue = SATURATION.currentValue;
          }
          HEALTH.setCurrentValue(
            Math.min(HEALTH.currentValue + 1, HEALTH.effectiveMax),
          );
        } else if (regenByHunger) {
          if (world.getDifficulty() !== "Peaceful") {
            HUNGER.setCurrentValue(HUNGER.currentValue - 1);
          }
          HEALTH.setCurrentValue(
            Math.min(HEALTH.currentValue + 1, HEALTH.effectiveMax),
          );
        }
        regen = 0; // Reiniciamos el contador de regeneración
      }
    }
    regenValues.set(player.id, regen);

    player.onScreenDisplay.setActionBar(`!fp.${saturationValue}`);
  }
}, 10);
