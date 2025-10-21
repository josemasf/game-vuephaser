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
        
        // Cargar spritesheets de héroes
        this.load.spritesheet('hero_speed_sheet', 'hero_speed_sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('hero_jump_sheet', 'hero_jump_sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('hero_tank_sheet', 'hero_tank_sheet.png', { frameWidth: 32, frameHeight: 32 });

        // Cargar spritesheets de enemigos y jefe
        this.load.spritesheet('goblin_green_sheet', 'goblin_green_sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('goblin_red_sheet', 'goblin_red_sheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('boss_troll_sheet', 'boss_troll_sheet.png', { frameWidth: 64, frameHeight: 64 });

        // (Opcional) Cargar spritesheets si existen
        // this.load.spritesheet('coin_sheet', 'coin_sheet.png', { frameWidth: 24, frameHeight: 24 });
        // this.load.spritesheet('pu_life_sheet', 'pu_life_sheet.png', { frameWidth: 24, frameHeight: 24 });
        // this.load.spritesheet('pu_speed_sheet', 'pu_speed_sheet.png', { frameWidth: 24, frameHeight: 24 });
        // this.load.spritesheet('pu_inv_sheet', 'pu_inv_sheet.png', { frameWidth: 24, frameHeight: 24 });
        
        // Crear sprites proceduralmente para el juego de plataformas (crisp pixel-art)
        this.createPlayerSprite();
        this.createPlatformSprite();
        this.createEnemySprite();
        this.createCoinSprite();
        this.createPowerUpSprites();
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
        // Moneda pixel-art: círculo dorado con borde y brillo
        const g = this.add.graphics();
        g.fillStyle(0xF1C40F, 1); g.fillCircle(12, 12, 10);
        g.lineStyle(2, 0x8A6E00, 1); g.strokeCircle(12, 12, 10);
        g.fillStyle(0xFFF3A3, 0.9); g.fillCircle(9, 9, 3);
        g.generateTexture('coin', 24, 24);
        g.destroy();
    }

    createPowerUpSprites()
    {
        // Vida (corazón verde)
        let g = this.add.graphics();
        g.fillStyle(0x2ECC71, 1);
        g.fillCircle(8, 10, 6); g.fillCircle(16, 10, 6);
        g.fillTriangle(4, 12, 20, 12, 12, 22);
        g.lineStyle(2, 0x0E6F3B, 1);
        g.strokeTriangle(4, 12, 20, 12, 12, 22);
        g.generateTexture('pu_life', 24, 24);
        g.destroy();

        // Velocidad (rayo azul)
        g = this.add.graphics();
        g.fillStyle(0x3498DB, 1);
        const bolt = [
            { x:12, y:4 }, { x:16, y:12 }, { x:12, y:12 }, { x:14, y:20 }, { x:8, y:12 }, { x:12, y:12 }
        ];
        g.fillPoints(bolt as any, true);
        g.lineStyle(2, 0x154360, 1);
        g.strokePoints(bolt as any, true);
        g.generateTexture('pu_speed', 24, 24);
        g.destroy();

        // Invencibilidad (estrella amarilla)
        g = this.add.graphics();
        g.fillStyle(0xF1C40F, 1);
        const star = (cx:number,cy:number,r1:number,r2:number,n:number)=>{
            const pts: {x:number,y:number}[] = [];
            for(let i=0;i<n*2;i++){
                const a = (Math.PI*i)/n;
                const r = i%2===0?r1:r2; pts.push({ x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r });
            }
            return pts;
        };
        const pts = star(12,12,8,4,5);
        g.fillPoints(pts, true);
        g.lineStyle(2, 0x8A6E00, 1); g.strokePoints(pts, true);
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

        // Glow de puerta (círculo amarillo con alpha)
        g = this.add.graphics();
        for (let r = 44; r >= 16; r -= 8) {
            const alpha = (r - 12) / 44 * 0.25;
            g.fillStyle(0xfff176, alpha);
            g.fillCircle(48, 48, r);
        }
        g.generateTexture('door_glow', 96, 96);
        g.destroy();

        // Flecha guía (triángulo)
        g = this.add.graphics();
        g.fillStyle(0xffff00, 1);
        g.fillTriangle(12, 24, 24, 24, 18, 8);
        g.lineStyle(2, 0x000000, 0.8);
        g.strokeTriangle(12, 24, 24, 24, 18, 8);
        g.generateTexture('door_arrow', 36, 32);
        g.destroy();
    }

    createHeroSprites()
    {
        // Función eliminada - ahora usamos spritesheets desde assets
    }

    create ()
    {
        // Definir animaciones para cada héroe desde las spritesheets
        
        // SPEED
        this.anims.create({ key: 'idle_speed', frames: this.anims.generateFrameNumbers('hero_speed_sheet', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'walk_speed', frames: this.anims.generateFrameNumbers('hero_speed_sheet', { start: 4, end: 9 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'jump_speed', frames: this.anims.generateFrameNumbers('hero_speed_sheet', { start: 10, end: 12 }), frameRate: 8, repeat: 0 });
        this.anims.create({ key: 'pick_speed', frames: this.anims.generateFrameNumbers('hero_speed_sheet', { start: 13, end: 16 }), frameRate: 10, repeat: 0 });

        // JUMP
        this.anims.create({ key: 'idle_jump', frames: this.anims.generateFrameNumbers('hero_jump_sheet', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'walk_jump', frames: this.anims.generateFrameNumbers('hero_jump_sheet', { start: 4, end: 9 }), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'jump_jump', frames: this.anims.generateFrameNumbers('hero_jump_sheet', { start: 10, end: 12 }), frameRate: 8, repeat: 0 });
        this.anims.create({ key: 'pick_jump', frames: this.anims.generateFrameNumbers('hero_jump_sheet', { start: 13, end: 16 }), frameRate: 10, repeat: 0 });

        // TANK
        this.anims.create({ key: 'idle_tank', frames: this.anims.generateFrameNumbers('hero_tank_sheet', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'walk_tank', frames: this.anims.generateFrameNumbers('hero_tank_sheet', { start: 4, end: 9 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'jump_tank', frames: this.anims.generateFrameNumbers('hero_tank_sheet', { start: 10, end: 12 }), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'pick_tank', frames: this.anims.generateFrameNumbers('hero_tank_sheet', { start: 13, end: 16 }), frameRate: 8, repeat: 0 });

        // GOBLINS (verde y rojo comparten animaciones)
        this.anims.create({ key: 'goblin_idle', frames: this.anims.generateFrameNumbers('goblin_green_sheet', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'goblin_run', frames: this.anims.generateFrameNumbers('goblin_green_sheet', { start: 4, end: 9 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'goblin_atk', frames: this.anims.generateFrameNumbers('goblin_green_sheet', { start: 10, end: 12 }), frameRate: 8, repeat: 0 });
        this.anims.create({ key: 'goblin_hit', frames: this.anims.generateFrameNumbers('goblin_green_sheet', { start: 13, end: 16 }), frameRate: 10, repeat: 0 });

        // TROLL (jefe)
        this.anims.create({ key: 'troll_idle', frames: this.anims.generateFrameNumbers('boss_troll_sheet', { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'troll_run', frames: this.anims.generateFrameNumbers('boss_troll_sheet', { start: 4, end: 9 }), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'troll_cast', frames: this.anims.generateFrameNumbers('boss_troll_sheet', { start: 10, end: 12 }), frameRate: 8, repeat: 0 });
        this.anims.create({ key: 'troll_portal', frames: this.anims.generateFrameNumbers('boss_troll_sheet', { start: 13, end: 16 }), frameRate: 10, repeat: 0 });

        // MONEDA: animación falsa via tween (sin spritesheet)
        // Se maneja en Game.ts con tweens de escala/posición

        // POWER-UPS: pulso suave
        // POWER-UPS: sin spritesheets; se animan via tweens

        //  Mover al menú principal
        this.scene.start('MainMenu');
    }
}
