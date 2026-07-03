import { system, world } from "@minecraft/server";

export let PLAYERS_LIST = [];

function updatePlayers() {
  system.run(() => (PLAYERS_LIST = world.getAllPlayers()));
}

updatePlayers();

world.afterEvents.playerJoin.subscribe(() => {
  updatePlayers();
});

world.afterEvents.entityRemove.subscribe(({ typeId }) => {
  if (typeId !== "minecraft:player") return;
  updatePlayers();
});

world.afterEvents.playerSpawn.subscribe(() => {
  updatePlayers();
});
