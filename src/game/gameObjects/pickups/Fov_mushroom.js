import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"
import Player from "../player/player"

export default class FovMushroom extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "Fov_mushroom", properties)

    this.setOrigin(0, 0)
    this.setSize(16, 16)
    this.setOffset(8, 8)

    this.name = "Fov_mushroom"
  }

  onCollide(player) {
    //super.onCollide(player)
    player.damage(this.props.damageAmount || 5)

    // Wenn die Blume einen Schlüssel hat, geben wir ihn dem Spieler
    if (this.props.keyName) {
      player.addKey(this.props.keyName)
    }

    if (this.scene.cameraManager) {
      this.scene.cameraManager.cameraMaskRadius -= 100
      this.scene.cameraManager.setCameraMask()
    }
    this.destroy()
  }v
}

// Registriere das Mushroom-Objekt automatisch beim Import
registerGameObject("Fov_mushroom", FovMushroom)
