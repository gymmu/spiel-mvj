
import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"

export default class PoisonFlower extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "Poison_flower", properties)

    this.setOrigin(0, 0)
    this.setSize(24, 32)
    this.setOffset(8, 0)

    this.name = "Poison_flower"
  }

  onCollide(player) {
    //super.onCollide(player)
    player.heal(this.props.healAmount || -2.5)
    player.decreaseSpeed(70)
          this.scene.time.delayedCall(5000, () => {
           player.resetSpeed()
          })
  }
}

// Registriere das Flower-Objekt automatisch beim Import
registerGameObject("Poison_flower", PoisonFlower)
