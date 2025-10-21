import { EventBus } from '../EventBus';
import { Sfx } from '../audio/Sfx';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    heroKey: string = 'hero_jump';
    levelIndex: number = 1;
    path: string = '';
    
    // Elementos del juego
    player!: Phaser.Physics.Arcade.Sprite;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    enemies!: Phaser.Physics.Arcade.Group;
    coins!: Phaser.Physics.Arcade.Group;
    powerUps!: Phaser.Physics.Arcade.Group;
    doors!: Phaser.Physics.Arcade.StaticGroup;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceKey!: Phaser.Input.Keyboard.Key;
    
    // UI
    scoreText!: Phaser.GameObjects.Text;
    livesText!: Phaser.GameObjects.Text;
    coinsText!: Phaser.GameObjects.Text;
    
    // Variables del juego
    score: number = 0;
    lives: number = 3;
    gameWon: boolean = false;
    speedX: number = 300;
    jumpV: number = -600;
    invincible: boolean = false;
    levelComplete: boolean = false;
    boss?: Phaser.Physics.Arcade.Image;
    projectiles?: Phaser.Physics.Arcade.Group;
    shootTimer?: Phaser.Time.TimerEvent;
    teleportTimer?: Phaser.Time.TimerEvent;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x87CEEB); // Azul cielo

        // Reset de estado de nivel al (re)entrar
        this.gameWon = false;
        this.levelComplete = false;
        this.invincible = false;
        if (this.doors) { try { this.doors.destroy(true); } catch {} this.doors = undefined as any; }
        if (this.shootTimer) { this.shootTimer.remove(false); this.shootTimer = undefined; }
        if (this.teleportTimer) { this.teleportTimer.remove(false); this.teleportTimer = undefined; }
        if (this.projectiles) { try { this.projectiles.destroy(true); } catch {} this.projectiles = undefined; }
        if (this.boss) { try { this.boss.destroy(); } catch {} this.boss = undefined; }

        // Selección de héroe
        const sel = this.registry.get('selectedHero');
        if (sel && typeof sel === 'string') {
            this.heroKey = sel;
        }

        // Estado de nivel y camino
        const idx = this.registry.get('levelIndex');
        this.levelIndex = typeof idx === 'number' ? idx : 1;
        const p = this.registry.get('path');
        this.path = typeof p === 'string' ? p : '';

        this.applyHeroStats();

        // Continuidad de puntuación/vidas después de aplicar stats base
        const carryScore = this.registry.get('carryScore');
        if (typeof carryScore === 'number') this.score = carryScore;
        const carryLives = this.registry.get('carryLives');
        if (typeof carryLives === 'number') this.lives = carryLives;

        // Crear plataformas
        this.createPlatforms();
        
        // Crear jugador
        this.createPlayer();
        
        // Crear enemigos
        this.createEnemies();
        
        // Crear monedas
        this.createCoins();

        // Crear power-ups
        this.createPowerUps();

        // Jefe en nivel 3
        if (this.levelIndex >= 3) {
            this.spawnBoss();
        }
        
        // Configurar controles
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Crear UI
        this.createUI();
        
        // Configurar física
        this.setupPhysics();

        EventBus.emit('current-scene-ready', this);
    }

    createPlatforms()
    {
        this.platforms = this.physics.add.staticGroup();
        
        // Plataforma base
        this.platforms.create(512, 768, 'platform').setScale(10, 1).refreshBody();

        const choice = this.getPathChoice();
        if (this.levelIndex === 1) {
            this.levelLayoutA();
        } else if (this.levelIndex === 2) {
            choice === 'A' ? this.levelLayoutA2() : this.levelLayoutB2();
        } else {
            choice === 'A' ? this.levelLayoutA3() : this.levelLayoutB3();
        }
    }

    createPlayer()
    {
        const base = this.baseFrameFromHero(this.heroKey);
        this.player = this.physics.add.sprite(100, 700, base);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);
    }

    private baseFrameFromHero(key: string): string
    {
        if (key === 'hero_speed') return 'hero_speed_1';
        if (key === 'hero_tank') return 'hero_tank_1';
        return 'hero_jump_1';
    }

    private jumpFrameFromHero(key: string): string
    {
        if (key === 'hero_speed') return 'hero_speed_jump';
        if (key === 'hero_tank') return 'hero_tank_jump';
        return 'hero_jump_jump';
    }

    applyHeroStats()
    {
        // Defaults
        this.speedX = 300;
        this.jumpV = -600;
        this.lives = 3;

        switch (this.heroKey) {
            case 'hero_speed':
                this.speedX = 420;
                this.jumpV = -600;
                this.lives = 2;
                break;
            case 'hero_jump':
                this.speedX = 300;
                this.jumpV = -750;
                this.lives = 3;
                break;
            case 'hero_tank':
                this.speedX = 250;
                this.jumpV = -600;
                this.lives = 4;
                break;
        }
    }

    createEnemies()
    {
        this.enemies = this.physics.add.group();
        const choice = this.getPathChoice();
        let enemyPositions: { x: number; y: number }[] = [];
        if (this.levelIndex === 1) {
            enemyPositions = [ { x: 500, y: 500 }, { x: 800, y: 400 }, { x: 200, y: 300 }, { x: 600, y: 200 } ];
        } else if (this.levelIndex === 2) {
            enemyPositions = choice === 'A'
                ? [ { x: 300, y: 520 }, { x: 700, y: 420 } ]
                : [ { x: 200, y: 480 }, { x: 850, y: 280 }, { x: 500, y: 360 } ];
        } else {
            enemyPositions = choice === 'A'
                ? [ { x: 250, y: 500 }, { x: 750, y: 300 } ]
                : [ { x: 400, y: 520 }, { x: 900, y: 380 } ];
        }

        enemyPositions.forEach(pos => {
            const enemy = this.enemies.create(pos.x, pos.y, 'enemy');
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-200, 200), 0);
        });
    }

    createCoins()
    {
        this.coins = this.physics.add.group();
        const choice = this.getPathChoice();
        let coins: { x: number; y: number }[] = [];
        if (this.levelIndex === 1) {
            coins = [ { x: 250, y: 600 }, { x: 550, y: 500 }, { x: 850, y: 400 }, { x: 250, y: 300 }, { x: 650, y: 200 }, { x: 150, y: 100 }, { x: 950, y: 100 }, { x: 512, y: 50 } ];
        } else if (this.levelIndex === 2) {
            coins = choice === 'A'
                ? [ { x: 200, y: 600 }, { x: 400, y: 520 }, { x: 680, y: 420 }, { x: 820, y: 320 }, { x: 512, y: 240 }, { x: 150, y: 180 }, { x: 900, y: 180 }, { x: 512, y: 80 } ]
                : [ { x: 300, y: 580 }, { x: 520, y: 520 }, { x: 740, y: 460 }, { x: 900, y: 360 }, { x: 620, y: 260 }, { x: 420, y: 200 }, { x: 200, y: 160 }, { x: 850, y: 120 } ];
        } else {
            coins = choice === 'A'
                ? [ { x: 250, y: 560 }, { x: 500, y: 460 }, { x: 750, y: 360 }, { x: 300, y: 260 }, { x: 600, y: 160 }, { x: 900, y: 160 }, { x: 150, y: 120 }, { x: 512, y: 80 } ]
                : [ { x: 200, y: 600 }, { x: 450, y: 520 }, { x: 700, y: 420 }, { x: 900, y: 300 }, { x: 550, y: 220 }, { x: 300, y: 180 }, { x: 150, y: 140 }, { x: 512, y: 100 } ];
        }
        coins.forEach(pos => {
            const coin = this.coins.create(pos.x, pos.y, 'coin');
            coin.setBounce(0.4);
            coin.setCollideWorldBounds(true);
        });
    }

    createUI()
    {
        this.scoreText = this.add.text(16, 16, 'Puntuación: 0', {
            fontSize: '32px',
            color: '#000'
        });
        if (this.score > 0) {
            this.scoreText.setText('Puntuación: ' + this.score);
        }
        
        this.livesText = this.add.text(16, 60, 'Vidas: ' + this.lives, {
            fontSize: '32px',
            color: '#000'
        });
        
        this.coinsText = this.add.text(16, 104, 'Monedas: 8/8', {
            fontSize: '32px',
            color: '#000'
        });

        // Texto de héroe y stats (arriba derecha)
        const heroLabel = this.heroKey === 'hero_speed' ? 'Velocidad' : this.heroKey === 'hero_tank' ? 'Tanque' : 'Salto';
        const stats = `VEL ${this.speedX} | SALTO ${Math.abs(this.jumpV)} | VIDAS ${this.lives}`;
        this.add.text(1024 - 16, 16, `Nivel: ${this.levelIndex}\nHéroe: ${heroLabel}\n${stats}`, {
            fontSize: '20px',
            color: '#000',
            align: 'right'
        }).setOrigin(1, 0);
    }

    setupPhysics()
    {
        // Colisiones del jugador con plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // Colisiones de enemigos con plataformas
        this.physics.add.collider(this.enemies, this.platforms);
        
        // Colisiones de monedas con plataformas
        this.physics.add.collider(this.coins, this.platforms);
        
        // Colisiones de power-ups con plataformas
        this.physics.add.collider(this.powerUps, this.platforms);
        
        // Colisión jugador con enemigos
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this);
        
        // Colisión jugador con monedas
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this);

        // Colisión jugador con power-ups
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, undefined, this);

        // Proyectiles del jefe
        if (this.projectiles) {
            this.physics.add.overlap(this.player, this.projectiles, this.hitEnemy, undefined, this);
            this.physics.add.collider(this.projectiles, this.platforms, (proj: any) => proj.destroy());
        }
    }

    update()
    {
        // Controles del jugador
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-this.speedX);
            this.player.setFlipX(true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(this.speedX);
            this.player.setFlipX(false);
        }
        else
        {
            this.player.setVelocityX(0);
        }

        if (this.player.body!.touching.down)
        {
            const upKey = this.cursors.up;
            const space = this.spaceKey;
            if ((upKey && Phaser.Input.Keyboard.JustDown(upKey)) || Phaser.Input.Keyboard.JustDown(space))
            {
                this.player.setVelocityY(this.jumpV);
                Sfx.jump(this);
            }
        }
        
        // Animaciones: caminar / salto / idle
        const onGround = this.player.body!.touching.down;
        const vx = this.player.body!.velocity.x;
        const vy = this.player.body!.velocity.y;
        const moving = Math.abs(vx) > 10 && onGround;

        if (!onGround)
        {
            this.player.anims.stop();
            this.player.setTexture(this.jumpFrameFromHero(this.heroKey));
        }
        else if (moving)
        {
            const ak = this.heroKey === 'hero_speed' ? 'walk_speed' : this.heroKey === 'hero_tank' ? 'walk_tank' : 'walk_jump';
            if (this.player.anims.currentAnim?.key !== ak)
            {
                this.player.anims.play(ak, true);
            }
        }
        else
        {
            this.player.anims.stop();
            this.player.setTexture(this.baseFrameFromHero(this.heroKey));
        }

        // Reiniciar si el jugador cae
        if (this.player.y > 800)
        {
            this.resetPlayerPosition();
        }
        
        // Verificar victoria (nunca más de una vez)
        if (this.coins.countActive(true) === 0 && !this.gameWon)
        {
            this.gameWon = true;

            // Bonus por completar el nivel
            this.score += 100;
            this.scoreText.setText('Puntuación: ' + this.score);

            if (this.levelIndex >= 3)
            {
                // Fin de la partida tras el jefe
                this.registry.set('finalScore', this.score);
                this.add.text(512, 384, '¡GANASTE!', {
                    fontSize: '64px', color: '#00ff00', stroke: '#000000', strokeThickness: 4
                }).setOrigin(0.5);
                Sfx.win(this);
                this.time.delayedCall(2500, () => { this.scene.start('GameOver'); });
            }
            else
            {
                this.levelComplete = true;
                this.invincible = true;
                Sfx.win(this);
                this.add.text(512, 120, 'Elige una puerta', { fontSize: '40px', color: '#ffff00', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
                // Retrasar un frame para asegurar que colisionadores/plataformas estén listos
                this.time.delayedCall(50, () => this.spawnDoors());
            }
        }
    }

    private floatText(x: number, y: number, msg: string, color = '#ffff00')
    {
        const t = this.add.text(x, y, msg, { fontSize: '20px', color, stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);
        this.tweens.add({ targets: t, y: y - 30, alpha: 0, duration: 700, onComplete: () => t.destroy() });
    }

    collectPowerUp(_player: any, pu: any)
    {
        const type = pu.getData('ptype');
        pu.disableBody(true, true);
        Sfx.powerUp(this);

        switch (type) {
            case 'life':
                this.lives += 1;
                this.livesText.setText('Vidas: ' + this.lives);
                this.floatText(pu.x, pu.y, '+1 Vida', '#2ecc71');
                break;
            case 'speed':
                this.floatText(pu.x, pu.y, 'Velocidad +', '#3498db');
                this.speedX = 450;
                this.jumpV = -700;
                this.player.setTint(0x3498db);
                this.time.delayedCall(5000, () => {
                    this.speedX = 300;
                    this.jumpV = -600;
                    this.player.clearTint();
                });
                break;
            case 'inv':
                this.floatText(pu.x, pu.y, 'Invencible', '#f1c40f');
                this.invincible = true;
                this.player.setTint(0xf1c40f);
                this.time.delayedCall(4000, () => {
                    this.invincible = false;
                    this.player.clearTint();
                });
                break;
        }
    }

    createPowerUps()
    {
        this.powerUps = this.physics.add.group();

        const items = [
            { x: 500, y: 520, key: 'pu_speed', type: 'speed' },
            { x: 850, y: 370, key: 'pu_inv', type: 'inv' },
            { x: 150, y: 120, key: 'pu_life', type: 'life' }
        ];

        items.forEach(i => {
            const pu = this.powerUps.create(i.x, i.y, i.key) as Phaser.Physics.Arcade.Sprite;
            pu.setBounce(0.2);
            pu.setCollideWorldBounds(true);
            pu.setData('ptype', i.type);
        });
    }

    collectCoin(_player: any, coin: any)
    {
        // Crear efecto de partículas en la posición de la moneda
        const particles = this.add.particles(coin.x, coin.y, 'coin', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            lifespan: 300,
            quantity: 5
        });
        
        // Eliminar el efecto después de un tiempo
        this.time.delayedCall(300, () => {
            particles.destroy();
        });
        
        coin.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Puntuación: ' + this.score);
        
        // Actualizar contador de monedas
        const coinsRemaining = this.coins.countActive(true);
        this.coinsText.setText(`Monedas: ${coinsRemaining}/8`);

        Sfx.coin(this);
    }

    hitEnemy(_player: any, _enemy: any)
    {
        if (this.invincible) {
            return;
        }
        Sfx.hit(this);
        // Efecto de vibración de la cámara
        this.cameras.main.shake(500, 0.02);
        
        // Efecto visual de daño (parpadeo del jugador)
        this.player.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            this.player.clearTint();
        });
        
        this.lives--;
        this.livesText.setText('Vidas: ' + this.lives);
        
        if (this.lives <= 0)
        {
            this.gameOver();
        }
        else
        {
            this.resetPlayerPosition();
        }
    }

    resetPlayerPosition()
    {
        this.player.setPosition(100, 700);
        this.player.setVelocity(0, 0);
    }

    gameOver()
    {
        // Guardar puntuación final
        this.registry.set('finalScore', this.score);

        Sfx.gameOver(this);

        this.add.text(512, 384, 'GAME OVER', {
            fontSize: '64px',
            color: '#ff0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.time.delayedCall(3000, () => {
            this.scene.start('GameOver');
        });
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }

    private getPathChoice(): 'A' | 'B'
    {
        if (this.levelIndex === 1) return 'A';
        const idx = this.levelIndex - 2;
        const c = this.path.charAt(idx);
        return c === 'B' ? 'B' : 'A';
    }

    private levelLayoutA() {
        this.platforms.create(200, 650, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(500, 550, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(800, 450, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(200, 350, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(600, 250, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(100, 150, 'platform').setScale(1.5, 1).refreshBody();
        this.platforms.create(900, 150, 'platform').setScale(1.5, 1).refreshBody();
    }
    private levelLayoutA2() {
        this.platforms.create(220, 620, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(420, 520, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(680, 420, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(820, 320, 'platform').setScale(1.5, 1).refreshBody();
        this.platforms.create(512, 240, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(150, 180, 'platform').setScale(1.5, 1).refreshBody();
        this.platforms.create(900, 180, 'platform').setScale(1.5, 1).refreshBody();
    }
    private levelLayoutB2() {
        this.platforms.create(300, 600, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(520, 540, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(740, 480, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(900, 360, 'platform').setScale(1.5, 1).refreshBody();
        this.platforms.create(620, 260, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(420, 200, 'platform').setScale(1.5, 1).refreshBody();
        this.platforms.create(200, 160, 'platform').setScale(1.5, 1).refreshBody();
    }
    private levelLayoutA3() {
        this.platforms.create(250, 560, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(500, 460, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(750, 360, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(300, 260, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(600, 160, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(900, 160, 'platform').setScale(1.5, 1).refreshBody();
    }
    private levelLayoutB3() {
        this.platforms.create(200, 600, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(450, 520, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(700, 420, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(900, 300, 'platform').setScale(1.5, 1).refreshBody();
        this.platforms.create(550, 220, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(300, 180, 'platform').setScale(1.5, 1).refreshBody();
    }

    private spawnDoors() {
        // Evitar duplicados si ya existen
        if (this.doors && this.doors.getChildren().length > 0) return;
        this.doors = this.physics.add.staticGroup();
        const xA = 300, xB = 740;
        // Posición fija y visible para evitar dependencias de layout
        const y = 420;
        const doorA = this.doors.create(xA, y, 'door') as Phaser.Physics.Arcade.Image;
        const doorB = this.doors.create(xB, y, 'door') as Phaser.Physics.Arcade.Image;
        doorA.setDepth(80);
        doorB.setDepth(80);
        // Pequeño brillo para destacarlas
        this.tweens.add({ targets: [doorA, doorB], alpha: 0.6, yoyo: true, repeat: -1, duration: 600 });
        this.physics.add.overlap(this.player, doorA, () => this.enterDoor('A'));
        this.physics.add.overlap(this.player, doorB, () => this.enterDoor('B'));
    }

    private getDoorYForX(x: number): number {
        let y = 600;
        this.platforms.children.iterate((obj: any) => {
            const plat = obj as Phaser.GameObjects.GameObject & { x: number; y: number; displayWidth: number; displayHeight: number };
            if (!plat) return;
            const halfW = plat.displayWidth / 2;
            if (x >= plat.x - halfW && x <= plat.x + halfW) {
                const top = plat.y - plat.displayHeight / 2;
                const candidate = top - 24;
                if (candidate < y) y = candidate;
            }
        });
        return y;
    }

    private enterDoor(choice: 'A' | 'B') {
        if (!this.levelComplete) return;
        const nextIndex = this.levelIndex + 1;
        const nextPath = this.path + choice;
        this.registry.set('levelIndex', nextIndex);
        this.registry.set('path', nextPath);
        this.registry.set('carryScore', this.score);
        this.registry.set('carryLives', this.lives);
        this.scene.restart();
    }

    private spawnBoss() {
        this.boss = this.physics.add.image(700, 300, 'boss');
        this.boss.setImmovable(true);
        this.boss.setCollideWorldBounds(true);
        this.physics.add.collider(this.boss, this.platforms);
        this.physics.add.overlap(this.player, this.boss, this.hitEnemy, undefined, this);

        this.projectiles = this.physics.add.group();
        this.shootTimer = this.time.addEvent({ delay: 1500, loop: true, callback: () => {
            if (!this.boss) return;
            const proj = this.projectiles!.create(this.boss.x, this.boss.y, 'projectile') as Phaser.Physics.Arcade.Image;
            const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
            const speed = 220;
            proj.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        }});

        this.teleportTimer = this.time.addEvent({ delay: 4000, loop: true, callback: () => {
            if (!this.boss) return;
            const spots = [ {x: 250, y: 300}, {x: 750, y: 260}, {x: 500, y: 200} ];
            const s = Phaser.Utils.Array.GetRandom(spots);
            this.boss!.setPosition(s.x, s.y);
            this.cameras.main.flash(150, 255, 255, 255);
        }});
    }
}
