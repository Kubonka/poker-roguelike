export async function startPhaser(
  container: HTMLElement,
): Promise<Phaser.Game | null> {
  if (typeof window === "undefined") return null;

  if (window.__PHASER_GAME__) {
    return window.__PHASER_GAME__;
  }

  const Phaser = await import("phaser");

  const { BootScene } = await import("./scenes/BootScene");
  const { PlayScene } = await import("./scenes/PlayScene");
  const { Game } = await import("./Game");

  const gameLogic = new Game();

  const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: container,
    width: 1600,
    height: 900,
    backgroundColor: "#505050",
    scene: [BootScene, PlayScene],
  });
  //*A VER SI ANDA
  game.registry.set("bus", gameLogic.bus);

  window.__PHASER_GAME__ = game;

  window.addEventListener("beforeunload", () => {
    window.__PHASER_GAME__?.destroy(true);
    window.__PHASER_GAME__ = null;
  });

  return game;
}
