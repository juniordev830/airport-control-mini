import Phaser from 'phaser';
import { distance, landingResult, missionState, moveToward, withinRadius, type Point, type MissionState } from './rules.js';

type Aircraft = { id: number; position: Point; speed: number; cleared: boolean; tint: number };
const W = 1000;
const H = 640;
const RUNWAY: Point = { x: 500, y: 328 };
const LAND_RADIUS = 22;
const TARGET_LANDINGS = 8;
const MAX_MISSES = 3;

class AirportScene extends Phaser.Scene {
  private aircraft: Aircraft[] = [];
  private nextId = 1;
  private spawned = 0;
  private timer = 0;
  private landed = 0;
  private missed = 0;
  private phase: MissionState = 'active';
  private radar!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Text;
  private notice!: Phaser.GameObjects.Text;

  constructor() { super('AirportScene'); }

  create(): void {
    this.aircraft = [];
    this.nextId = 1;
    this.spawned = 0;
    this.timer = 0;
    this.landed = 0;
    this.missed = 0;
    this.phase = 'active';
    this.drawBackground();
    this.radar = this.add.graphics();
    this.hud = this.add.text(25, 19, '', {
      fontFamily: 'monospace', fontSize: '20px', fontStyle: 'bold', color: '#e1f9ff',
      backgroundColor: '#07182edb', padding: { x: 12, y: 9 }
    });
    this.notice = this.add.text(W / 2, H - 37, 'Selecione um avião antes de chegar à pista.', {
      fontFamily: 'sans-serif', fontSize: '17px', color: '#ffe6ad',
      backgroundColor: '#0d1c2d', padding: { x: 16, y: 6 }
    }).setOrigin(0.5);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.phase !== 'active') { this.scene.restart(); return; }
      let closest: Aircraft | undefined;
      let nearest = Number.POSITIVE_INFINITY;
      for (const plane of this.aircraft) {
        const d = distance(plane.position, { x: pointer.worldX, y: pointer.worldY });
        if (d < nearest) { nearest = d; closest = plane; }
      }
      if (closest && nearest < 31 && !closest.cleared) {
        closest.cleared = true;
        this.notice.setText(`Voo ${closest.id} autorizado para pouso!`);
      }
    });
    this.input.keyboard?.on('keydown-R', () => this.scene.restart());
    this.spawnAircraft();
    this.refresh();
  }

  private drawBackground(): void {
    const grid = this.add.graphics();
    grid.fillStyle(0x071e30);
    grid.fillRect(0, 0, W, H);
    grid.lineStyle(1, 0x16506b, 0.33);
    for (let x = 0; x <= W; x += 40) grid.lineBetween(x, 0, x, H);
    for (let y = 0; y <= H; y += 40) grid.lineBetween(0, y, W, y);
    grid.lineStyle(1, 0x3d99a8, 0.25);
    for (const radius of [115, 220, 310]) grid.strokeCircle(RUNWAY.x, RUNWAY.y, radius);
    grid.fillStyle(0x1d3445);
    grid.fillRoundedRect(376, 292, 248, 72, 8);
    grid.fillStyle(0x394f5b);
    grid.fillRoundedRect(402, 310, 195, 34, 3);
    grid.lineStyle(3, 0x9ce4f5, 0.9);
    grid.lineBetween(412, 327, 590, 327);
    grid.lineStyle(3, 0x95ee7e);
    grid.strokeCircle(RUNWAY.x, RUNWAY.y, LAND_RADIUS);
    this.add.text(625, 305, 'PISTA 01', { fontFamily: 'monospace', fontSize: '16px', color: '#a0d2e7' });
    this.add.text(37, H - 73, 'RADAR OPERACIONAL  •  CLIMA ESTÁVEL  •  ÁREA SIMULADA', {
      fontFamily: 'monospace', fontSize: '13px', color: '#719cac'
    });
  }

  private spawnAircraft(): void {
    if (this.spawned >= TARGET_LANDINGS + MAX_MISSES - 1 || this.phase !== 'active') return;
    const side = this.spawned % 4;
    const lane = (this.spawned * 83) % 180 - 90;
    const origins: Point[] = [
      { x: 40, y: RUNWAY.y + lane },
      { x: W - 40, y: RUNWAY.y + lane },
      { x: RUNWAY.x + lane, y: 45 },
      { x: RUNWAY.x + lane, y: H - 45 }
    ];
    this.aircraft.push({ id: this.nextId++, position: origins[side], speed: 61 + (this.spawned % 3) * 8, cleared: false, tint: 0xffce62 });
    this.spawned++;
  }

  update(_time: number, delta: number): void {
    if (this.phase !== 'active') return;
    const elapsed = Math.min(delta / 1000, 0.05);
    this.timer += delta;
    if (this.timer >= 3000) {
      this.timer = 0;
      this.spawnAircraft();
    }

    for (const plane of [...this.aircraft]) {
      plane.position = moveToward(plane.position, RUNWAY, plane.speed, elapsed);
      if (withinRadius(plane.position, RUNWAY, LAND_RADIUS)) {
        const result = landingResult(plane.cleared);
        if (result === 'landed') this.landed++;
        else this.missed++;
        this.aircraft.splice(this.aircraft.indexOf(plane), 1);
        this.notice.setText(result === 'landed' ? `Pouso confirmado: voo ${plane.id}!` : `Voo ${plane.id} sem autorização: aproximação perdida!`);
      }
    }

    this.phase = missionState(this.landed, this.missed, this.landed + this.missed, TARGET_LANDINGS, MAX_MISSES);
    if (this.phase !== 'active') {
      this.notice.setText(this.phase === 'victory' ? 'MISSÃO CUMPRIDA! Clique ou pressione R para reiniciar.' : 'MISSÃO ENCERRADA! Clique ou pressione R para reiniciar.');
    }
    this.refresh();
  }

  private refresh(): void {
    this.radar.clear();
    for (const plane of this.aircraft) {
      const x = plane.position.x, y = plane.position.y;
      const theta = Math.atan2(RUNWAY.y - y, RUNWAY.x - x);
      const points = [
        { x: x + Math.cos(theta) * 17, y: y + Math.sin(theta) * 17 },
        { x: x + Math.cos(theta + 2.5) * 13, y: y + Math.sin(theta + 2.5) * 13 },
        { x: x + Math.cos(theta - 2.5) * 13, y: y + Math.sin(theta - 2.5) * 13 }
      ];
      this.radar.fillStyle(plane.cleared ? 0x56eaa2 : 0xffc75f);
      this.radar.fillPoints(points, true);
      this.radar.lineStyle(1, 0x75bddd, 0.35);
      this.radar.lineBetween(x, y, RUNWAY.x, RUNWAY.y);
      this.radar.lineStyle(1, plane.cleared ? 0x56eaa2 : 0xffc75f, 0.45);
      this.radar.strokeCircle(x, y, 24);
    }
    this.hud.setText([
      `POUSOS ${this.landed} / ${TARGET_LANDINGS}`,
      `INCIDENTES ${this.missed} / ${MAX_MISSES}`,
      `VOOS EM RADAR ${this.aircraft.length}`
    ]);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#071e30',
  width: W,
  height: H,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: AirportScene
});
