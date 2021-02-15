export interface EnemyData {
  img: string;
  size: number;
  hp: number;
  mainTint: number;
  targetTint: number;
}

export interface EnemyRepo {
  [x: string]: EnemyData;
}

const enemyConst: EnemyRepo = {
  1: {
    img: "enemy1",
    size: 12,
    hp: 2,
    mainTint: 0xbdbdbd,
    targetTint: 0xbdbdbd,
  },
  2: {
    img: "enemy2",
    size: 12,
    hp: 3,
    mainTint: 0x00ae5b,
    targetTint: 0xbdbdbd,
  },
  3: {
    img: "enemy3",
    size: 16,
    hp: 4,
    mainTint: 0x00a3ff,
    targetTint: 0x00ae5b,
  },
  4: {
    img: "enemy4",
    size: 20,
    hp: 5,
    mainTint: 0x7439b2,
    targetTint: 0x00a3ff,
  },
  5: {
    img: "enemy5",
    size: 24,
    hp: 6,
    mainTint: 0xff0099,
    targetTint: 0x7439b2,
  },
  6: {
    img: "enemy6",
    size: 28,
    hp: 7,
    mainTint: 0xe2ff00,
    targetTint: 0xff0099,
  },
  7: {
    img: "enemy7",
    size: 32,
    hp: 8,
    mainTint: 0xff8a00,
    targetTint: 0xe2ff00,
  },
};

export default enemyConst;
