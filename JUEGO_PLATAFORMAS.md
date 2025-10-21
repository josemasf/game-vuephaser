# 🎮 Goblins & Heroes

**Goblins & Heroes** es un emocionante juego de plataformas 2D desarrollado con **Phaser.js**, **Vue.js** y **TypeScript**.

## 🎯 Objetivo del Juego

¡Recoge todas las monedas doradas mientras evitas a los enemigos rojos! Llega a la cima del nivel para ganar.

## 🕹️ Controles

- **←** y **→**: Mover izquierda y derecha
- **↑**: Saltar
- **Ratón**: Hacer clic para navegar por los menús y seleccionar personaje

## 🎮 Mecánicas del Juego

### Elementos del Juego

- **Jugador**: Elige entre 3 héroes con ventajas únicas:
  - **Velocidad**: Más rápido, menos vidas (2)
  - **Salto**: Salto más alto, equilibrio general (3 vidas)
  - **Tanque**: Más vidas (4), menor velocidad
- **Plataformas (Marrón)**: Superficies sobre las que puedes caminar y saltar
- **Monedas (Doradas)**: Recógelas todas para ganar (10 puntos cada una)
- **Enemigos (Rojos)**: Evítalos o perderás una vida
 - **Puertas**: Tras completar un nivel, aparecen 2 puertas; cada una lleva a un siguiente nivel diferente (ramificación)
 - **Jefe Final**: En el tercer nivel, aparece un jefe con poderes (proyectiles y teletransporte)

### Sistema de Puntuación

- **Moneda recogida**: +10 puntos
- **Completar nivel**: +100 puntos de bonus
- **Vidas**: Empiezas con 3 vidas

### Condiciones de Victoria/Derrota

- **Victoria**: Recoge todas las 8 monedas doradas
- **Derrota**: Pierde todas las vidas (3) tocando enemigos o cayendo
- **Reinicio**: Si caes del mapa, regresas al punto de inicio

## 🎨 Características

- **Sprites procedurales**: Todos los sprites se generan mediante código
- **Física realista**: Sistema de gravedad y colisiones
- **Enemigos con IA simple**: Se mueven de forma automática
- **Interfaz informativa**: Muestra puntuación y vidas en tiempo real
- **Responsive design**: Se adapta a diferentes tamaños de pantalla
- **Estética pixel art**: Renderizado nítido sin suavizado
- **Selección de personaje**: 3 héroes con habilidades propias (Velocidad, Salto, Tanque)
- **Persistencia de selección**: El personaje elegido se recuerda entre sesiones
 - **Pantalla de selección dedicada**: Vista con descripción y confirmación del héroe

## 🚀 Tecnologías Utilizadas

- **Phaser.js 3.90.0**: Motor de juegos 2D
- **Vue.js 3.5.13**: Framework frontend
- **TypeScript**: Tipado estático
- **Vite**: Herramienta de desarrollo rápida
- **Arcade Physics**: Sistema de física para colisiones

## 🏗️ Estructura del Proyecto

```
src/game/scenes/
├── Boot.ts          # Inicialización
├── Preloader.ts     # Carga de assets y sprites procedurales
├── MainMenu.ts      # Menú principal
├── Game.ts          # Lógica principal del juego
└── GameOver.ts      # Pantalla de fin de juego
```

## 🛠️ Instalación y Ejecución

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build
```

## 🎯 Próximas Mejoras

- [x] Múltiples niveles (3) con jefe final
- [x] Power-ups especiales
- [x] Efectos de sonido
- [x] Animaciones de sprites
- [ ] Sistema de puntuaciones altas
- [ ] Enemigos con patrones más complejos
- [ ] Plataformas móviles
- [ ] Música de fondo y control de volumen
- [ ] Indicador/temporizador de power-ups en HUD
- [ ] Soporte gamepad y controles táctiles
- [ ] Transiciones de escena (fade/zoom) y efectos de cámara
- [ ] Sistema de niveles con mapas (Tiled) y tileset pixel art
- [ ] Menú de pausa con reinicio rápido

## 🎮 Tips para Jugar

1. **Explora todo el nivel**: Las monedas están distribuidas en diferentes alturas
2. **Cuidado con los enemigos**: Se mueven constantemente, observa sus patrones
3. **Usa el salto estratégicamente**: Algunos saltos requieren timing perfecto
4. **No tengas prisa**: Es mejor ir despacio que perder una vida
5. **La moneda final**: Está en la parte más alta del nivel

¡Disfruta del juego y trata de conseguir la puntuación más alta posible! 🏆
