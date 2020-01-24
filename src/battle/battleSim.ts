import Monster from "../pokemon/pokemon";
export type TWeather = "sunlight" | "rain" | "sandstorm" | "hail" | "none";
export type TTerrain = "electric" | "grassy" | "misty" | "psychic" | "none";
type TAttack = typeof Monster.prototype.attackList[0];

type TBattleArgs = {
  monsters: [Monster, Monster];
  weather: TWeather;
  terrain: TTerrain;
};

export default class Battle {
  monsters: Monster[] = [];
  weather = "none";
  terrain = "none";
  monAHP = 0;
  monBHP = 0;
  constructor({ monsters, weather, terrain }: TBattleArgs) {
    const { main } = this;
    this.monsters = monsters;
    this.weather = weather;
    this.terrain = terrain;
    this.monAHP = monsters[0].statTotals[0];
    this.monBHP = monsters[1].statTotals[1];
    main();
  }

  turn = () => {
    const monATypes = this.monsters[0].types;
    const monBTypes = this.monsters[1].types;
  };
  main = () => {
    const { turn } = this;
    const monAHP = this.monAHP;
    const monBHP = this.monBHP;
    while (monAHP > 0 || monBHP > 0) {
      turn();
    }
  };
}


