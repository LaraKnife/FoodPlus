import { system, world } from "@minecraft/server";
import { PLAYERS_LIST } from "./getPlayers";

const regenValues = new Map();
const REGEN_COOLDOWN = 1;

// Inhabilitamos la regeneración base del juego
system.run(() => {
  world.gameRules.naturalRegeneration = false;
});

// Sistema propio de regeneración, ejecutado cada 10 ticks (0.5 segundos)
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
    let regen = regenValues.get(player.id) || 0;
    const regenBySaturation =
      HEALTH.currentValue < HEALTH.effectiveMax && saturationValue >= 3;
    const regenByHunger =
      HEALTH.currentValue < HEALTH.effectiveMax && HUNGER.currentValue > 18;

    if (regenBySaturation || regenByHunger) {
      regen += 10 / 12;

      if (regen >= REGEN_COOLDOWN) {
        if (
          regenBySaturation &&
          HEALTH.currentValue < HEALTH.effectiveMax &&
          HUNGER.currentValue >= 18
        ) {
          if (world.getDifficulty() !== "Peaceful") {
            const nextSaturationValue = Math.max(0, saturationValue - 1.2);
            SATURATION.setCurrentValue(nextSaturationValue);
            saturationValue = nextSaturationValue;
          }
          HEALTH.setCurrentValue(
            Math.min(HEALTH.currentValue + 1, HEALTH.effectiveMax),
          );
        } else if (regenByHunger) {
          if (world.getDifficulty() !== "Peaceful") {
            const nextHungerValue = Math.max(0, HUNGER.currentValue - 1);
            HUNGER.setCurrentValue(nextHungerValue);
          }
          HEALTH.setCurrentValue(
            Math.min(HEALTH.currentValue + 1, HEALTH.effectiveMax),
          );
        }
        regen -= 1;
      }
    } else {
      if (HEALTH.currentValue >= HEALTH.effectiveMax) {
        regen = 0;
      }
    }
    regenValues.set(player.id, regen);

    player.onScreenDisplay.setActionBar(`!fp.${saturationValue.toFixed(1)}`);
  }
}, 10);
