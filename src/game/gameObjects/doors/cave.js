import NPC from "../player/npc"
import { savePlayerState } from "../player/player"
import StaticObject from "../staticObject"

export default class Cave extends StaticObject {
  constructor(scene, x, y, properties) {
    super(scene, x, y, "doors", "cave", properties)

    this.setOrigin(0, 0)
    this.setSize(32, 4)
  }

  onEnter(actor) {
    // Wenn der Spieler nicht vorhanden ist, mache nichts
    if (!actor) return

    // Lese die benötigten Eigenschaften der Türe aus
    const { goToWorld, needNpcsKilled, gameover } = this.props

    // Wenn kein Ziel gesetzt ist, mache nichts
    if (gameover) {
      for (let i = this.scene.player.inventory.length - 1; i>= 0; i--){
        this.scene.player.removeItemFromInventory(i);
      }
      this.scene.cameraManager.cameraMaskRadius = 120
      this.scene.cameraManager.setCameraMask()

      this.scene.scene.start("ending")

      return
    }

    // Wenn kein Schlüssel gebraucht wird, geh direkt zum Level
    if (needNpcsKilled == null || actor.npcsKilled >= needNpcsKilled) {
      // Vor dem Szenenwechsel Spielerstatus speichern
      savePlayerState(this.scene, this.scene.player)
      this.scene.scene.start("world", { map: goToWorld })
      return
    }
  }
}
