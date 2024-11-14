import { LevelData } from "./types";
import levelData from "./level.json";

export class CollisionMap {
  private width: number;
  private height: number;
  private tileWidth: number;
  private tileHeight: number;
  private collisionMap: boolean[][];

  constructor() {
    this.width = levelData.width;
    this.height = levelData.height;
    this.tileWidth = levelData.tilewidth;
    this.tileHeight = levelData.tileheight;
    this.collisionMap = this.buildCollisionMap(levelData);
  }

  private buildCollisionMap(levelData: LevelData): boolean[][] {
    const collisionMap = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(false));

    // Get the collision properties from the tileset
    const tileset = levelData.tilesets[0];
    const collideableTiles = new Set<number>();

    // Check tiles with collideable property
    if (tileset.tiles) {
      tileset.tiles.forEach((tile) => {
        if (
          tile.properties &&
          tile.properties.some(
            (prop) => prop.name === "collideable" && prop.value === true
          )
        ) {
          collideableTiles.add(tile.id + 1); // +1 because Tiled uses 0-based index but the tilemap uses 1-based
        }
      });
    }

    // Check both layers for collideable tiles
    levelData.layers.forEach((layer) => {
      if (layer.type === "tilelayer") {
        layer.data.forEach((tileId, index) => {
          if (collideableTiles.has(tileId)) {
            const y = Math.floor(index / this.width);
            const x = index % this.width;
            collisionMap[y][x] = true;
          }
        });
      }
    });

    return collisionMap;
  }

  public isColliding(x: number, y: number): boolean {
    // Convert world coordinates to tile coordinates
    const tileX = Math.floor(x / this.tileWidth);
    const tileY = Math.floor((y + 24) / this.tileHeight);

    // Check bounds
    if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
      return true; // Collide with world boundaries
    }

    return this.collisionMap[tileY][tileX];
  }
}