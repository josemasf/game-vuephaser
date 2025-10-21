import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Sfx } from '../audio/Sfx';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    // Pantalla principal limpia, selección se mueve a CharacterSelect

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 200, 'logo').setDepth(100);

        this.title = this.add.text(512, 350, 'Goblins & Heroes', {
            fontFamily: 'Arial Black', fontSize: 48, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Instrucciones del juego
        this.add.text(512, 450, 'Usa las flechas para moverte\nFlecha arriba o Espacio para saltar\nRecoge todas las monedas\nEvita los enemigos rojos', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Botón para ir al selector de personajes
        this.add.text(512, 620, 'Haz clic para elegir personaje', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffff00',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Hacer la pantalla clickeable para iniciar el juego
        this.input.once('pointerdown', () => {
            Sfx.click(this);
            this.changeScene();
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }
        this.scene.start('CharacterSelect');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }

    // Selección movida a CharacterSelect
}
