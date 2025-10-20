# 🎮 Juego de Plataformas 2D

Un emocionante juego de plataformas 2D desarrollado con **Phaser.js**, **Vue.js** y **TypeScript**.

## 🎯 Objetivo del Juego

¡Recoge todas las monedas doradas mientras evitas a los enemigos rojos! Llega a la cima del nivel para ganar.

## 🕹️ Controles

- **←** y **→**: Mover izquierda y derecha
- **↑**: Saltar
- **Ratón**: Hacer clic para navegar por los menús

## 🎮 Mecánicas del Juego

### Elementos del Juego

- **Jugador (Cuadrado Azul)**: Tu personaje principal
- **Plataformas (Marrón)**: Superficies sobre las que puedes caminar y saltar
- **Monedas (Doradas)**: Recógelas todas para ganar (10 puntos cada una)
- **Enemigos (Rojos)**: Evítalos o perderás una vida

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

- [ ] Múltiples niveles
- [x] Power-ups especiales
- [x] Efectos de sonido
- [ ] Animaciones de sprites
- [ ] Sistema de puntuaciones altas
- [ ] Enemigos con patrones más complejos
- [ ] Plataformas móviles

## 🎮 Tips para Jugar

1. **Explora todo el nivel**: Las monedas están distribuidas en diferentes alturas
2. **Cuidado con los enemigos**: Se mueven constantemente, observa sus patrones
3. **Usa el salto estratégicamente**: Algunos saltos requieren timing perfecto
4. **No tengas prisa**: Es mejor ir despacio que perder una vida
5. **La moneda final**: Está en la parte más alta del nivel

¡Disfruta del juego y trata de conseguir la puntuación más alta posible! 🏆
