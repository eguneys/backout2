export const WorldSize = [1600, 900];

let [wX, wY] = WorldSize;

export const nbTilesY = 30;
export const TileSize = wY / nbTilesY;
export const nbTilesX = wX / TileSize;

export const PlayerSize = [TileSize * 1.2, TileSize * 1.2];
