import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"
import Player from "../player/player"

export default class FovMushroom extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "Fov_mushroom", properties)

    this.setOrigin(0, 0)
    this.setSize(16, 16)
    this.setOffset(8, 8)

    this.name = "Fov_m ushroom"
  }

  onCollide(player) {
    if (player instanceof Player) {
      player.decreaseSpeed(50)
      this.scene.time.delayedCall(1000, () => {
        player.resetSpeed()
      })
      this.destroy()
    }
  }
}

// Registriere das Mushroom-Objekt automatisch beim Import
registerGameObject("Fov_mushroom", FovMushroom)
