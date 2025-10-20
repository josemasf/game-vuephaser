import { EventBus } from '../EventBus';
import { Sfx } from '../audio/Sfx';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    
    // Elementos del juego
    player!: Phaser.Physics.Arcade.Sprite;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    enemies!: Phaser.Physics.Arcade.Group;
    coins!: Phaser.Physics.Arcade.Group;
    powerUps!: Phaser.Physics.Arcade.Group;
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

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x87CEEB); // Azul cielo

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
        
        // Plataformas del nivel
        this.platforms.create(200, 650, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(500, 550, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(800, 450, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(200, 350, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(600, 250, 'platform').setScale(2, 1).refreshBody();
        this.platforms.create(100, 150, 'platform').setScale(1.5, 1).refreshBody();
        this.platforms.create(900, 150, 'platform').setScale(1.5, 1).refreshBody();
    }

    createPlayer()
    {
        this.player = this.physics.add.sprite(100, 700, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);
    }

    createEnemies()
    {
        this.enemies = this.physics.add.group();
        
        // Crear algunos enemigos en diferentes plataformas
        const enemyPositions = [
            { x: 500, y: 500 },
            { x: 800, y: 400 },
            { x: 200, y: 300 },
            { x: 600, y: 200 }
        ];
        
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
        
        // Colocar monedas en diferentes lugares
        const coinPositions = [
            { x: 250, y: 600 },
            { x: 550, y: 500 },
            { x: 850, y: 400 },
            { x: 250, y: 300 },
            { x: 650, y: 200 },
            { x: 150, y: 100 },
            { x: 950, y: 100 },
            { x: 512, y: 50 } // Moneda final en la cima
        ];
        
        coinPositions.forEach(pos => {
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
        
        this.livesText = this.add.text(16, 60, 'Vidas: 3', {
            fontSize: '32px',
            color: '#000'
        });
        
        this.coinsText = this.add.text(16, 104, 'Monedas: 8/8', {
            fontSize: '32px',
            color: '#000'
        });
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
    }

    update()
    {
        // Controles del jugador
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-this.speedX);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(this.speedX);
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
        
        // Reiniciar si el jugador cae
        if (this.player.y > 800)
        {
            this.resetPlayerPosition();
        }
        
        // Verificar victoria
        if (this.coins.countActive(true) === 0 && !this.gameWon)
        {
            this.gameWon = true;
            
            // Bonus por completar el nivel
            this.score += 100;
            this.scoreText.setText('Puntuación: ' + this.score);
            
            // Guardar puntuación final
            this.registry.set('finalScore', this.score);
            
            this.add.text(512, 384, '¡GANASTE!', {
                fontSize: '64px',
                color: '#00ff00',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            
            Sfx.win(this);
            this.time.delayedCall(3000, () => {
                this.scene.start('GameOver');
            });
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
}
