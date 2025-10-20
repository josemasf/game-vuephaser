import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        
        // Crear sprites proceduralmente para el juego de plataformas
        this.createPlayerSprite();
        this.createPlatformSprite();
        this.createEnemySprite();
        this.createCoinSprite();
        this.createPowerUpSprites();
        this.createHeroSprites();
        this.createDoorAndBossSprites();
    }

    createPlayerSprite()
    {
        // Crear un sprite del jugador (cuadrado azul)
        const graphics = this.add.graphics();
        graphics.fillStyle(0x3498db);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('player', 32, 32);
        graphics.destroy();
    }

    createPlatformSprite()
    {
        // Crear sprite de plataforma (rectángulo marrón)
        const graphics = this.add.graphics();
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 100, 20);
        graphics.generateTexture('platform', 100, 20);
        graphics.destroy();
    }

    createEnemySprite()
    {
        // Crear sprite de enemigo (círculo rojo)
        const graphics = this.add.graphics();
        graphics.fillStyle(0xe74c3c);
        graphics.fillCircle(16, 16, 16);
        graphics.generateTexture('enemy', 32, 32);
        graphics.destroy();
    }

    createCoinSprite()
    {
        // Crear sprite de moneda (círculo dorado)
        const graphics = this.add.graphics();
        graphics.fillStyle(0xf1c40f);
        graphics.fillCircle(12, 12, 12);
        graphics.generateTexture('coin', 24, 24);
        graphics.destroy();
    }

    createPowerUpSprites()
    {
        // Power-up de vida (círculo verde)
        let g = this.add.graphics();
        g.fillStyle(0x2ecc71);
        g.fillCircle(12, 12, 12);
        g.lineStyle(3, 0xffffff);
        g.strokeCircle(12, 12, 12);
        g.generateTexture('pu_life', 24, 24);
        g.destroy();

        // Power-up de velocidad (círculo azul)
        g = this.add.graphics();
        g.fillStyle(0x3498db);
        g.fillCircle(12, 12, 12);
        g.lineStyle(3, 0xffffff);
        g.strokeCircle(12, 12, 12);
        g.generateTexture('pu_speed', 24, 24);
        g.destroy();

        // Power-up de invencibilidad (círculo amarillo)
        g = this.add.graphics();
        g.fillStyle(0xf1c40f);
        g.fillCircle(12, 12, 12);
        g.lineStyle(3, 0xffffff);
        g.strokeCircle(12, 12, 12);
        g.generateTexture('pu_inv', 24, 24);
        g.destroy();
    }

    createDoorAndBossSprites()
    {
        // Puerta (marrón con marco claro)
        let g = this.add.graphics();
        g.fillStyle(0x8B4513);
        g.fillRect(0, 0, 32, 48);
        g.lineStyle(3, 0xdeb887);
        g.strokeRect(0, 0, 32, 48);
        g.fillStyle(0x3e2723); g.fillRect(10, 20, 12, 12); // pomo
        g.generateTexture('door', 32, 48);
        g.destroy();

        // Proyectil (orbe morado)
        g = this.add.graphics();
        g.fillStyle(0x8e44ad); g.fillCircle(6, 6, 6);
        g.lineStyle(2, 0xffffff); g.strokeCircle(6, 6, 6);
        g.generateTexture('projectile', 12, 12);
        g.destroy();

        // Jefe (enemigo grande)
        g = this.add.graphics();
        g.fillStyle(0xc0392b);
        g.fillCircle(32, 32, 32);
        g.lineStyle(4, 0x000000); g.strokeCircle(32, 32, 32);
        g.generateTexture('boss', 64, 64);
        g.destroy();
    }

    createHeroSprites()
    {
        // Héroe: Velocidad (azul) - base
        let g = this.add.graphics();
        g.fillStyle(0x1e90ff);
        g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x145a86);
        g.fillRect(4, 20, 24, 8);
        g.fillStyle(0xffffff);
        g.fillRect(6, 10, 8, 4);
        g.generateTexture('hero_speed', 32, 32);
        g.destroy();

        // También generamos 2 frames para animación de caminar y 1 para salto
        // speed_1
        g = this.add.graphics();
        g.fillStyle(0x1e90ff); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x145a86); g.fillRect(4, 20, 24, 8);
        g.fillStyle(0xffffff); g.fillRect(6, 10, 8, 4);
        g.generateTexture('hero_speed_1', 32, 32); g.destroy();
        // speed_2 (pierna adelantada)
        g = this.add.graphics();
        g.fillStyle(0x1e90ff); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x145a86); g.fillRect(6, 20, 20, 8);
        g.fillStyle(0xffffff); g.fillRect(6, 10, 8, 4);
        g.generateTexture('hero_speed_2', 32, 32); g.destroy();
        // speed_jump
        g = this.add.graphics();
        g.fillStyle(0x1e90ff); g.fillRect(4, 6, 24, 20);
        g.fillStyle(0x145a86); g.fillRect(10, 24, 12, 6);
        g.fillStyle(0xffffff); g.fillRect(6, 10, 8, 4);
        g.generateTexture('hero_speed_jump', 32, 32); g.destroy();

        // Héroe: Salto (verde) - base
        g = this.add.graphics();
        g.fillStyle(0x2ecc71); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x1b8f4d); g.fillRect(2, 12, 4, 12);
        g.fillStyle(0xffffcc); g.fillRect(10, 10, 6, 4);
        g.generateTexture('hero_jump', 32, 32); g.destroy();
        // jump_1
        g = this.add.graphics();
        g.fillStyle(0x2ecc71); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x1b8f4d); g.fillRect(2, 12, 4, 12);
        g.fillStyle(0xffffcc); g.fillRect(10, 10, 6, 4);
        g.generateTexture('hero_jump_1', 32, 32); g.destroy();
        // jump_2 (paso alterno)
        g = this.add.graphics();
        g.fillStyle(0x2ecc71); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x1b8f4d); g.fillRect(3, 14, 4, 12);
        g.fillStyle(0xffffcc); g.fillRect(10, 10, 6, 4);
        g.generateTexture('hero_jump_2', 32, 32); g.destroy();
        // jump_jump
        g = this.add.graphics();
        g.fillStyle(0x2ecc71); g.fillRect(4, 6, 24, 20);
        g.fillStyle(0x1b8f4d); g.fillRect(2, 10, 4, 12);
        g.fillStyle(0xffffcc); g.fillRect(10, 10, 6, 4);
        g.generateTexture('hero_jump_jump', 32, 32); g.destroy();

        // Héroe: Tanque (rojo) - base
        g = this.add.graphics();
        g.fillStyle(0xe74c3c); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0xb03a2e); g.fillRect(4, 8, 24, 6);
        g.fillStyle(0xeeeeee); g.fillRect(12, 12, 8, 4);
        g.generateTexture('hero_tank', 32, 32); g.destroy();
        // tank_1
        g = this.add.graphics();
        g.fillStyle(0xe74c3c); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0xb03a2e); g.fillRect(4, 8, 24, 6);
        g.fillStyle(0xeeeeee); g.fillRect(12, 12, 8, 4);
        g.generateTexture('hero_tank_1', 32, 32); g.destroy();
        // tank_2 (paso alterno)
        g = this.add.graphics();
        g.fillStyle(0xe74c3c); g.fillRect(4, 8, 24, 20);
        g.fillStyle(0xb03a2e); g.fillRect(5, 8, 24, 6);
        g.fillStyle(0xeeeeee); g.fillRect(12, 12, 8, 4);
        g.generateTexture('hero_tank_2', 32, 32); g.destroy();
        // tank_jump
        g = this.add.graphics();
        g.fillStyle(0xe74c3c); g.fillRect(4, 6, 24, 20);
        g.fillStyle(0xb03a2e); g.fillRect(4, 6, 24, 6);
        g.fillStyle(0xeeeeee); g.fillRect(12, 12, 8, 4);
        g.generateTexture('hero_tank_jump', 32, 32); g.destroy();
    }

    create ()
    {
        // Definir animaciones globales de caminar para cada héroe
        this.anims.create({ key: 'walk_speed', frames: [
            { key: 'hero_speed_1' }, { key: 'hero_speed_2' }
        ], frameRate: 8, repeat: -1 });

        this.anims.create({ key: 'walk_jump', frames: [
            { key: 'hero_jump_1' }, { key: 'hero_jump_2' }
        ], frameRate: 8, repeat: -1 });

        this.anims.create({ key: 'walk_tank', frames: [
            { key: 'hero_tank_1' }, { key: 'hero_tank_2' }
        ], frameRate: 6, repeat: -1 });

        //  Mover al menú principal
        this.scene.start('MainMenu');
    }
}
