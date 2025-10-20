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

    createHeroSprites()
    {
        // Héroe: Velocidad (azul)
        let g = this.add.graphics();
        g.fillStyle(0x1e90ff);
        g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x145a86);
        g.fillRect(4, 20, 24, 8);
        g.fillStyle(0xffffff);
        g.fillRect(6, 10, 8, 4);
        g.generateTexture('hero_speed', 32, 32);
        g.destroy();

        // Héroe: Salto (verde)
        g = this.add.graphics();
        g.fillStyle(0x2ecc71);
        g.fillRect(4, 8, 24, 20);
        g.fillStyle(0x1b8f4d);
        g.fillRect(2, 12, 4, 12);
        g.fillStyle(0xffffcc);
        g.fillRect(10, 10, 6, 4);
        g.generateTexture('hero_jump', 32, 32);
        g.destroy();

        // Héroe: Tanque (rojo)
        g = this.add.graphics();
        g.fillStyle(0xe74c3c);
        g.fillRect(4, 8, 24, 20);
        g.fillStyle(0xb03a2e);
        g.fillRect(4, 8, 24, 6);
        g.fillStyle(0xeeeeee);
        g.fillRect(12, 12, 8, 4);
        g.generateTexture('hero_tank', 32, 32);
        g.destroy();
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
