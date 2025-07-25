import Phaser from "phaser"
import { getRandomDirection } from "./utils.js"
import Player from "./player.js"
import HpBar from "../hpbar"

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  hp = 100
  maxHp = 100
  #speed = 100
  stepsLeft = 60
  move = "left"
  attackPower = 5
  isInvulnerable = false
  skin = "npc"

  constructor(scene, x, y, properties) {
    // Extract skin property from properties array, fallback to "npc"
    let skin = "npc"
    if (Array.isArray(properties)) {
      const found = properties.find((prop) => prop.name === "skin")
      if (found && found.value) skin = found.value
    }
    super(scene, x, y, skin)
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this, false)
    this.body.collideWorldBounds = false
    this.setOrigin(0.5, 0.5)
    this.setSize(24, 24, false)
    this.setOffset(4, 8)

    this.skin = skin

    // HP bar component
    this.hpBar = new HpBar(this.scene, {
      width: 28,
      height: 5,
      offsetY: -20,
      depth: 10,
    })
    this.hpBar.setMaxHp(this.maxHp)
    this.hpBar.setHp(this.hp)
    this.hpBar.setPosition(this.x, this.y - this.height / 2)
  }

  /**
   * Setze die Geschwindigkeit des Spielers. Kann nicht grösser als 960 sein, da
   * der Spieler sonst durch die Spielobjekte geht. Kann auch nicht kleiner als
   * 0 sein.
   *
   * @param {integer} value Die Geschwindigkeit der Spielers.
   */
  set speed(value) {
    this.#speed = Math.min(value, 960)
    this.#speed = Math.max(0, this.#speed)
  }

  /** Geschwindigkeit des Spielers. */
  get speed() {
    return this.#speed
  }

  update() {
    const { body } = this
    let isIdle = true

    this.stepsLeft--
    if (this.stepsLeft <= 0) {
      this.move = getRandomDirection()
      this.stepsLeft = 60 + Math.floor(Math.random() * 60)
    }

    this.body.setVelocityX(0)
    this.body.setVelocityY(0)

    if (this.move === "left") {
      body.setVelocityX(-this.speed)
      if (isIdle) this.anims.play(`${this.skin}_left`, true)
        isIdle = false
    }
    if (this.move === "right") {
      this.body.setVelocityX(this.speed)
      if (isIdle) this.anims.play(`${this.skin}_right`, true)
        isIdle = false
    }

    if (this.move === "up") {
      body.setVelocityY(-this.speed)
      if (isIdle) this.anims.play(`${this.skin}_up`, true)
        isIdle = false
    }
    if (this.move === "down") {
      body.setVelocityY(this.speed)
      if (isIdle) this.anims.play(`${this.skin}_down`, true)
        isIdle = false
    }

    if (isIdle) {
      this.anims.play(`${this.skin}_idle`, true)
    }

    // Wenn der NPC getroffen wurde, lasse ihn blinken
    if (this.isInvulnerable) {
      // Setze die Farbe des Spielers auf rot
      this.tint = 0xff0000
    } else {
      // Setze die Farbe des Spielers auf normal
      this.tint = 0xffffff
    }

    // Update HP bar position and value
    if (this.hpBar) {
      this.hpBar.setHp(this.hp)
      this.hpBar.setMaxHp(this.maxHp)
      this.hpBar.setPosition(this.x, this.y - this.height / 2)
    }
  }

  heal(value) {
    if (value == null) value = 0
    this.hp = this.hp + value
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp
    }
    // Update HP bar
    if (this.hpBar) {
      this.hpBar.setHp(this.hp)
    }
  }

  damage(value) {
    if (this.isInvulnerable) return
    this.isInvulnerable = true
    this.scene.time.delayedCall(500 , () => {
      this.isInvulnerable = false
    })

    if (value == null) value = 0
    this.hp = this.hp - value
    if (this.hp <= 0) {
      if (this.hpBar) {
        this.hpBar.destroy()
      }
      const {player} = this.scene
      player.addBuff()
      player.npcsKilled+=1
      this.destroy()
    } else {
      // Update HP bar
      if (this.hpBar) {
        this.hpBar.setHp(this.hp)
      }
    }
  }

  onCollide(actor) {
    if (actor instanceof Player) {
      actor.damage(this.attackPower)
    }
  }

  destroy(fromScene) {
    if (this.hpBar) {
      this.hpBar.destroy()
      this.hpBar = null
    }
    super.destroy(fromScene)
  }
}
