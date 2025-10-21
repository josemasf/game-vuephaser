Genial. Vamos a subir de nivel **monedas** y **power-ups** con arte animado y un par de efectos de UX sin tocar tu gameplay.

## 🎨 Assets nuevos (spritesheets)

* Moneda girando (24×24, 16 frames): [coin_sheet.png](sandbox:/mnt/data/coin_sheet.png)
* Vida (pulso verde, 24×24, 16 frames): [pu_life_sheet.png](sandbox:/mnt/data/pu_life_sheet.png)
* Velocidad (pulso azul, 24×24, 16 frames): [pu_speed_sheet.png](sandbox:/mnt/data/pu_speed_sheet.png)
* Invencibilidad (pulso dorado, 24×24, 16 frames): [pu_inv_sheet.png](sandbox:/mnt/data/pu_inv_sheet.png)

**Layout** en todas: 8×2 celdas, frames 0–15. Están pensadas para reemplazar tus círculos actuales creados con `Graphics` en el `Preloader`. 

---

# Integración (minimalista y compatible)

## 1) Copia los PNG

A `public/assets/`. Tu loader ya hace `this.load.setPath('assets')`. 

## 2) `Preloader.ts`

### a) Deja de generar las monedas/power-ups procedurales

Comenta el contenido de `createCoinSprite()` y `createPowerUpSprites()` para que no creen texturas con `generateTexture`. (Mantén el resto del preload). 

### b) Carga las hojas nuevas en `preload()`

```ts
this.load.spritesheet('coin_sheet',    'assets/coin_sheet.png',    { frameWidth: 24, frameHeight: 24 });
this.load.spritesheet('pu_life_sheet', 'assets/pu_life_sheet.png', { frameWidth: 24, frameHeight: 24 });
this.load.spritesheet('pu_speed_sheet','assets/pu_speed_sheet.png',{ frameWidth: 24, frameHeight: 24 });
this.load.spritesheet('pu_inv_sheet',  'assets/pu_inv_sheet.png',  { frameWidth: 24, frameHeight: 24 });
```

### c) Define animaciones en `create()`

```ts
// Moneda: giro continuo
this.anims.create({
  key: 'coin_spin',
  frames: this.anims.generateFrameNumbers('coin_sheet', { start: 0, end: 15 }),
  frameRate: 12,
  repeat: -1
});

// Power-ups: pulso suave
const puAnims = [
  ['pu_life_idle',  'pu_life_sheet'],
  ['pu_speed_idle', 'pu_speed_sheet'],
  ['pu_inv_idle',   'pu_inv_sheet'],
] as const;

for (const [key, sheet] of puAnims) {
  this.anims.create({
    key,
    frames: this.anims.generateFrameNumbers(sheet, { start: 0, end: 15 }),
    frameRate: 10,
    repeat: -1
  });
}
```

> Dejamos intactas tus cargas de `projectile`, `door`, etc. y las otras animaciones que ya definiste. 

---

## 3) `Game.ts` — Monedas

Tu `createCoins()` ahora crea `this.coins.create(..., 'coin')` y ya tiene partículas + score + HUD en `collectCoin()`. Cambiamos a hoja + anim: 

```ts
createCoins() {
  this.coins = this.physics.add.group();
  const choice = this.getPathChoice();
  // ... tu matriz de posiciones se queda igual

  coins.forEach(pos => {
    const coin = this.coins.create(pos.x, pos.y, 'coin_sheet', 0) as Phaser.Physics.Arcade.Sprite;
    coin.setBounce(0.4);
    coin.setCollideWorldBounds(true);
    coin.play('coin_spin');

    // hitbox compacta
    coin.body.setSize(16, 16).setOffset(4, 4);

    // bob vertical sutil
    this.tweens.add({
      targets: coin, y: coin.y - 4, yoyo: true, repeat: -1, duration: 800, ease: 'Sine.inOut'
    });
  });
}
```

Tu `collectCoin()` ya hace partículas y SFX; lo dejamos, pero con sprites animados se ve más “jugoso” sin tocar tu lógica: suma +10, HUD y victoria cuando quedan 0. 

---

## 4) `Game.ts` — Power-ups

Hoy creas `pu_life`, `pu_speed`, `pu_inv` como texturas planas y guardas un `ptype` para el efecto (vidas/velocidad/inv). Vamos a instanciarlos desde las hojas y animar el idle, con bob y glow ADD. 

```ts
createPowerUps() {
  this.powerUps = this.physics.add.group();

  const items = [
    { x: 500, y: 520, key: 'pu_speed_sheet', anim: 'pu_speed_idle', type: 'speed' },
    { x: 850, y: 370, key: 'pu_inv_sheet',   anim: 'pu_inv_idle',   type: 'inv'   },
    { x: 150, y: 120, key: 'pu_life_sheet',  anim: 'pu_life_idle',  type: 'life'  }
  ];

  items.forEach(i => {
    const pu = this.powerUps.create(i.x, i.y, i.key, 0) as Phaser.Physics.Arcade.Sprite;
    pu.setBounce(0.2);
    pu.setCollideWorldBounds(true);
    pu.setData('ptype', i.type);
    pu.play(i.anim);
    pu.setBlendMode(Phaser.BlendModes.ADD);
    pu.body.setSize(16, 16).setOffset(4, 4);
    this.tweens.add({ targets: pu, y: pu.y - 4, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.inOut' });
  });
}
```

Tu `collectPowerUp()` ya implementa los efectos correctamente (vidas++, velocidad temporal, invencibilidad temporal con `tint`). Añadimos un toque visual sin cambiar la mecánica:

```ts
collectPowerUp(_player: any, pu: any) {
  const type = pu.getData('ptype');
  pu.disableBody(true, true);
  Sfx.powerUp(this);

  // mini destello donde estaba el power-up
  const flash = this.add.rectangle(pu.x, pu.y, 10, 10, 0xffffff, 0.9).setDepth(999);
  this.tweens.add({ targets: flash, scaleX: 6, scaleY: 6, alpha: 0, duration: 220, onComplete: () => flash.destroy() });

  switch (type) {
    case 'life':
      this.lives += 1;
      this.livesText.setText('Vidas: ' + this.lives);
      this.floatText(pu.x, pu.y, '+1 Vida', '#2ecc71'); // ya existía
      break;
    case 'speed':
      this.floatText(pu.x, pu.y, 'Velocidad +', '#3498db');
      this.speedX = 450;
      this.jumpV = -700;
      this.player.setTint(0x3498db);
      // pulso corto en el player
      this.tweens.add({ targets: this.player, scaleX: 1.06, scaleY: 1.06, yoyo: true, duration: 120 });
      this.time.delayedCall(5000, () => { this.speedX = 300; this.jumpV = -600; this.player.clearTint(); });
      break;
    case 'inv':
      this.floatText(pu.x, pu.y, 'Invencible', '#f1c40f');
      this.invincible = true;
      this.player.setTint(0xf1c40f);
      // aura rápida
      const aura = this.add.circle(this.player.x, this.player.y, 22, 0xffff66, 0.2).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
      const follow = this.time.addEvent({ delay: 16, loop: true, callback: () => aura.setPosition(this.player.x, this.player.y) });
      this.tweens.add({ targets: aura, alpha: 0.35, yoyo: true, repeat: -1, duration: 300 });
      this.time.delayedCall(4000, () => { this.invincible = false; this.player.clearTint(); aura.destroy(); follow.remove(false); });
      break;
  }
}
```

> Esto respeta tu flujo de HUD y sonido, sólo mejora el *juice*. 

---

# Plan de acción (para Codex)

1. **Copiar assets**: `coin_sheet.png`, `pu_life_sheet.png`, `pu_speed_sheet.png`, `pu_inv_sheet.png` → `public/assets/`.
2. **Preloader.ts**

   * Comentar cuerpo de `createCoinSprite()` y `createPowerUpSprites()`.
   * Añadir `load.spritesheet` y crear anims `coin_spin` y `pu_*_idle`.
3. **Game.ts**

   * En `createCoins()`, usar `coin_sheet` + anim `coin_spin`, hitbox 16×16 y bobbing tween.
   * En `createPowerUps()`, usar `pu_*_sheet` + anim `pu_*_idle`, blend ADD, hitbox 16×16 y bobbing tween.
   * En `collectPowerUp()`, añadir flash/aura/pulso (manteniendo tu lógica actual de vidas/velocidad/invencibilidad).
4. **Probar**: `pnpm dev` → revisar giro de monedas, pulso de power-ups, feedback visual al recoger.
5. **Afinar**: subir/bajar `frameRate` (12–16 para monedas, 8–12 para power-ups), o amplitud del bobbing (±2–5 px).
6. **Commit**: `feat(items): animated coin & power-up sheets + juicy FX`.

