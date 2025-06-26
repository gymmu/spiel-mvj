import StaticObject from "../staticObject"
import { registerGameObject } from "../registry"

export default class HealFlower extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "pickups", "Heal_flower", properties)

    this.setOrigin(0, 0)
    this.setSize(24, 32)
    this.setOffset(0, 0)

    this.name = "Heal_flower"
  }

  onCollide(player) {
    //super.onCollide(player)
    player.heal(this.props.healAmount || 20)

    // Wenn die Blume einen Schlüssel hat, geben wir ihn dem Spieler
    if (this.props.keyName) {
      player.addKey(this.props.keyName)
    }
    this.destroy()
  }
}

// Registriere das Flower-Objekt automatisch beim Import
registerGameObject("Heal_flower", HealFlower)
