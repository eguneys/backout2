export const WorldSize = [320, 180];

let [wX, wY] = WorldSize;

export const nbTilesY = 18;
export const TileSize = wY / nbTilesY;
export const nbTilesX = wX / TileSize;

export const GroundSize = [TileSize,
                           TileSize];

export const ViewSize = [TileSize * nbTilesX,
                         TileSize * nbTilesY];
