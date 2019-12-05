import json
import nlopt
import numpy as np
import random
from scipy.optimize import minimize, broyden1
from typing import *

pokemon = []
with open('output.json') as json_file:
    data = json.load(json_file)
    pokemon.extend(data)

charizard = pokemon[5]
opp = {
    'name': 'Garchomp',
    'hp': 183.5,
    'atk': 163.8,
    'def': 127.05,
    'spa': 80,
    'speed': 102,
    'types': ['Ground-type', 'Dragon-type']
}


def Solver(monster: Dict[str, Union[List[str], Dict[str, str]]], opponent: dict, level: int):
    natures = [
        "hardy",
        "lonely",
        "brave",
        "adamant",
        "naughty",
        "bold",
        "docile",
        "relaxed",
        "impish",
        "lax",
        "timid",
        "hasty",
        "serious",
        "jolly",
        "naive",
        "modest",
        "mild",
        "quiet",
        "bashful",
        "rash",
        "calm",
        "gentle",
        "sassy",
        "careful",
        "quirky"
    ]

    def map_types(atk_type: str, def_type: str, move_damage: float):
        normal_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 1,
            'Rock-Type': 0.5,
            'Bug-type': 1,
            'Ghost-type': 0,
            'Steel-type': 0.5,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        fighting_table = {
            'Normal-type': 2,
            'Fighting-type': 1,
            'Flying-type': 0.5,
            'Poison-type': 0.5,
            'Ground-type': 1,
            'Rock-Type': 2,
            'Bug-type': 0.5,
            'Ghost-type': 0,
            'Steel-type': 2,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 0.5,
            'Ice-type': 2,
            'Dragon-type': 1,
            'Dark-type': 2,
            'Fairy-type': 0.5
        }
        flying_table = {
            'Normal-type': 1,
            'Fighting-type': 2,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 1,
            'Rock-Type': 0.5,
            'Bug-type': 2,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 2,
            'Electric-type': 0.5,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        poison_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 1,
            'Poison-type': 0.5,
            'Ground-type': 0.5,
            'Rock-Type': 0.5,
            'Bug-type': 1,
            'Ghost-type': 0.5,
            'Steel-type': 0,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 2,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 1,
            'Fairy-type': 2
        }
        ground_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 0,
            'Poison-type': 2,
            'Ground-type': 1,
            'Rock-Type': 2,
            'Bug-type': 0.5,
            'Ghost-type': 1,
            'Steel-type': 2,
            'Fire-type': 2,
            'Water-type': 1,
            'Grass-type': 0.5,
            'Electric-type': 2,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        rock_table = {
            'Normal-type': 1,
            'Fighting-type': 0.5,
            'Flying-type': 2,
            'Poison-type': 1,
            'Ground-type': 0.5,
            'Rock-Type': 1,
            'Bug-type': 2,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 2,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 2,
            'Dragon-type': 1,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        bug_table = {
            'Normal-type': 1,
            'Fighting-type': 0.5,
            'Flying-type': 0.5,
            'Poison-type': 0.5,
            'Ground-type': 1,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 0.5,
            'Steel-type': 0.5,
            'Fire-type': 0.5,
            'Water-type': 1,
            'Grass-type': 2,
            'Electric-type': 1,
            'Psychic-type': 2,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 2,
            'Fairy-type': 0.5
        }
        ghost_table = {
            'Normal-type': 0,
            'Fighting-type': 1,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 1,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 2,
            'Steel-type': 1,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 2,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 0.5,
            'Fairy-type': 0
        }
        steel_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 1,
            'Rock-Type': 2,
            'Bug-type': 1,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 0.5,
            'Water-type': 0.5,
            'Grass-type': 1,
            'Electric-type': 0.5,
            'Psychic-type': 1,
            'Ice-type': 2,
            'Dragon-type': 1,
            'Dark-type': 1,
            'Fairy-type': 2
        }
        fire_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 1,
            'Rock-Type': 0.5,
            'Bug-type': 2,
            'Ghost-type': 1,
            'Steel-type': 2,
            'Fire-type': 0.5,
            'Water-type': 0.5,
            'Grass-type': 2,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 2,
            'Dragon-type': 0.5,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        water_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 2,
            'Rock-Type': 2,
            'Bug-type': 1,
            'Ghost-type': 1,
            'Steel-type': 1,
            'Fire-type': 2,
            'Water-type': 0.5,
            'Grass-type': 0.5,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 0.5,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        grass_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 0.5,
            'Poison-type': 0.5,
            'Ground-type': 2,
            'Rock-Type': 2,
            'Bug-type': 0.5,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 0.5,
            'Water-type': 2,
            'Grass-type': 0.5,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 0.5,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        electric_table = {
            'Normal-type': 1,
            'Fighting-type': 2,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 0,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 1,
            'Steel-type': 1,
            'Fire-type': 1,
            'Water-type': 2,
            'Grass-type': 0.5,
            'Electric-type': 0.5,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 0.5,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        psychic_table = {
            'Normal-type': 1,
            'Fighting-type': 2,
            'Flying-type': 1,
            'Poison-type': 2,
            'Ground-type': 1,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 0.5,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 0,
            'Fairy-type': 1
        }
        ice_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 2,
            'Poison-type': 1,
            'Ground-type': 2,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 0.5,
            'Water-type': 0.5,
            'Grass-type': 2,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 0.5,
            'Dragon-type': 2,
            'Dark-type': 1,
            'Fairy-type': 1
        }
        dragon_table = {
            'Normal-type': 1,
            'Fighting-type': 1,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 1,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 2,
            'Dark-type': 1,
            'Fairy-type': 0
        }
        dark_table = {
            'Normal-type': 1,
            'Fighting-type': 0.5,
            'Flying-type': 1,
            'Poison-type': 1,
            'Ground-type': 1,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 2,
            'Steel-type': 1,
            'Fire-type': 1,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 2,
            'Ice-type': 1,
            'Dragon-type': 1,
            'Dark-type': 0.5,
            'Fairy-type': 0.5
        }
        fairy_table = {
            'Normal-type': 1,
            'Fighting-type': 2,
            'Flying-type': 1,
            'Poison-type': 0.5,
            'Ground-type': 1,
            'Rock-Type': 1,
            'Bug-type': 1,
            'Ghost-type': 1,
            'Steel-type': 0.5,
            'Fire-type': 0.5,
            'Water-type': 1,
            'Grass-type': 1,
            'Electric-type': 1,
            'Psychic-type': 1,
            'Ice-type': 1,
            'Dragon-type': 2,
            'Dark-type': 2,
            'Fairy-type': 1
        }

        if 'Normal' in atk_type:
            return normal_table.get(def_type, 1) * move_damage
        if 'Fighting' in atk_type:
            return fighting_table.get(def_type, 1) * move_damage
        if 'Flying' in atk_type:
            return flying_table.get(def_type, 1) * move_damage
        if 'Poison' in atk_type:
            return poison_table.get(def_type, 1) * move_damage
        if 'Ground' in atk_type:
            return ground_table.get(def_type, 1) * move_damage
        if 'Rock' in atk_type:
            return rock_table.get(def_type, 1) * move_damage
        if 'Bug' in atk_type:
            return bug_table.get(def_type, 1) * move_damage
        if 'Ghost' in atk_type:
            return ghost_table.get(def_type, 1) * move_damage
        if 'Steel' in atk_type:
            return steel_table.get(def_type, 1) * move_damage
        if 'Fire' in atk_type:
            return fire_table.get(def_type, 1) * move_damage
        if 'Water' in atk_type:
            return water_table.get(def_type, 1) * move_damage
        if 'Grass' in atk_type:
            return grass_table.get(def_type, 1) * move_damage
        if 'Electric' in atk_type:
            return electric_table.get(def_type, 1) * move_damage
        if 'Psychic' in atk_type:
            return psychic_table.get(def_type, 1) * move_damage
        if 'Ice' in atk_type:
            return ice_table.get(def_type, 1) * move_damage
        if 'Dragon' in atk_type:
            return dragon_table.get(def_type, 1) * move_damage
        if 'Dark' in atk_type:
            return dark_table.get(def_type, 1) * move_damage
        if 'Fairy' in atk_type:
            return fairy_table.get(def_type, 1) * move_damage
        return 1 * move_damage

    def get_attack_moves():
        moves: List[Dict[str, str]] = []
        monster_moves: List[Dict[str, str]] = monster.get('moves', [])
        for move in monster_moves:
            move_name = move.get('moveName').lower()
            current_move = move.get('moveCategory', '').lower()
            is_max_move = 'max' in move_name
            is_other_move = 'other' in current_move
            if not is_other_move and not is_max_move:
                moves.append(move)
        return moves

    def get_base_stats():
        raw_stats = monster.get('baseStats', False)
        if raw_stats is False:
            return {
                'baseHP': 0,
                'baseAtk': 0,
                'baseDef': 0,
                'baseSpa': 0,
                'baseSpd': 0,
                'baseSpeed': 0
            }
        return {
            'baseHP': int(raw_stats.get('baseHP', 0)),
            'baseAtk': int(raw_stats.get('baseAtk', 0)),
            'baseDef': int(raw_stats.get('baseDef', 0)),
            'baseSpa': int(raw_stats.get('baseSpa', 0)),
            'baseSpd': int(raw_stats.get('baseSpd', 0)),
            'baseSpeed': int(raw_stats.get('baseSpeed', 0))
        }

    def get_nature(nature: str, stat: str, value: int):
        is_neutral = nature in ["hardy", "docile",
                                "serious", "bashful", "quirky"]
        positive_natures = {
            'atk': nature in ["lonely", "brave", "adamant", "naughty"],
            'def': nature in ["bold", "relaxed", "impish", "lax"],
            'spa': nature in ["modest", "mild", "quiet", "rash"],
            'spd': nature in ["calm", "gentle", "sassy", "careful"],
            'speed': nature in ["timid", "hasty", "jolly", "naive"]
        }

        is_positive = positive_natures.get(stat, False)

        negative_natures = {
            'atk': nature in ["bold", "timid", "modest", "calm"],
            'def': nature in ["lonely", "hasty", "mild", "gentle"],
            'spa': nature in ["adamant", "impish", "jolly", "careful"],
            'spd': nature in ["naughty", "lax", "naive", "rash"],
            'speed': nature in ["brave", "relaxed", "quiet", "sassy"]
        }

        is_negative = negative_natures.get(stat, False)

        if is_neutral:
            return value

        if is_positive:
            return value * 1.1

        if is_negative:
            return value * 0.9

        return value

    def get_stat_value(iv: int, ev: int, stat: int):
        return (iv + 2) * (stat + ev / 4) * (level / 100) + 5

    def get_stat_totals(x: list):
        hpEV = x[0]
        atkEV = x[1]
        defEV = x[2]
        spaEV = x[3]
        spdEV = x[4]
        speedEV = x[5]
        hpIV = x[6]
        atkIV = x[7]
        defIV = x[8]
        spaIV = x[9]
        spdIV = x[10]
        speedIV = x[11]
        nature_index = int(round(x[12]))
        has_valid_index = nature_index <= len(natures) - 1
        if not has_valid_index:
            return {
                'hp': 0,
                'atk': 0,
                'def': 0,
                'spa': 0,
                'spd': 0,
                'speed': 0
            }
        # print({'nature_index': nature_index})
        nature = natures[nature_index]
        base_stats = get_base_stats()
        base_hp = base_stats.get('baseHP', 0)
        hp = get_stat_value(hpIV, hpEV, base_hp)
        base_atk = base_stats.get('baseAtk', 0)
        atk = get_nature(
            nature, 'atk', get_stat_value(atkIV, atkEV, base_atk))
        base_def = base_stats.get('baseDef', 0)
        defense = get_nature(
            nature, 'def', get_stat_value(defIV, defEV, base_def))
        base_spa = base_stats.get('baseSpa', 0)
        spa = get_nature(nature, 'spa', get_stat_value(spaIV, spaEV, base_spa))
        base_spd = base_stats.get('baseSpd', 0)
        spd = get_nature(nature, 'spd', get_stat_value(spdIV, spdEV, base_spd))
        base_speed = base_stats.get('baseSpeed', 0)
        speed = get_nature(nature, 'speed', get_stat_value(
            speedIV, speedEV, base_speed))
        return {
            'hp': hp,
            'atk': atk,
            'def': defense,
            'spa': spa,
            'spd': spd,
            'speed': speed
        }

    def get_raw_damage(move: Dict[str, str], is_physical: bool, stat_totals: Dict[str, int], level_modifier: float):
        # print(move)
        if is_physical:
            atk = stat_totals.get('atk', 0)
            atk_vs_def = atk / opponent.get('def', 1)
            raw_damage = (level_modifier *
                          (int(move.get('movePower', 0)) / level)) + 2
            return raw_damage

        atk = stat_totals.get('spa', 0)
        atk_vs_def = atk / opponent.get('spd', 1)
        raw_damage = (level_modifier *
                      (int(move.get('movePower', 0)) / level)) + 2
        return raw_damage

    def get_stab_bonus(move_type: str):
        monster_types = monster.get('types', [])
        has_type = f"{move_type.strip()}-type" in monster_types
        if not has_type:
            return 1
        return 1.5

    def get_type_bonus(move_type: str, atk_dmg: float):
        output = atk_dmg
        attacking_type = move_type.strip()
        for defending_type in opponent.get('types', []):
            output = map_types(attacking_type, defending_type, output)
        return output

    def apply_multipliers(atk_dmg: float, move_type: str):
        ran_num = random.uniform(0.85, 1)
        stab_bonus = get_stab_bonus(move_type) * ran_num
        atk_with_stab = atk_dmg * stab_bonus
        return get_type_bonus(move_type, atk_with_stab)

    def get_damage_calculation(x: list, stat_totals: Dict[str, int]):
        moves = get_attack_moves()
        move_index = int(round(x[13]))
        has_valid_index = move_index <= len(moves) - 1
        if not has_valid_index:
            return 0
        move = moves[move_index]
        move_type = move.get('moveType', '')
        move_category = move.get('moveCategory', '').lower()
        is_physical_move = 'physical' in move_category

        level_modifier = ((2 * level) / 5) + 2
        raw_atk_damage = get_raw_damage(move,
                                        is_physical_move, stat_totals, level_modifier)
        atk_dmg = apply_multipliers(raw_atk_damage, move_type)
        return atk_dmg
    args = 15
    x = np.zeros(args)

    def objective(x, grad):
        if grad.size > 0:
            grad[0] = int(round(grad[0] + 1))
            grad[1] = int(round(grad[1] + 1))
            grad[2] = int(round(grad[2] + 1))
            grad[3] = int(round(grad[3] + 1))
            grad[4] = int(round(grad[4] + 1))
            grad[5] = int(round(grad[5] + 1))
            grad[6] = int(round(grad[6] + 1))
            grad[7] = int(round(grad[7] + 1))
            grad[8] = int(round(grad[8] + 1))
            grad[9] = int(round(grad[9] + 1))
            grad[10] = int(round(grad[10] + 1))
            grad[11] = int(round(grad[11] + 1))
            grad[12] = int(round(grad[12] + 1))
            grad[13] = int(round(grad[13] + 1))
        stat_totals = get_stat_totals(x)
        output = get_damage_calculation(x, stat_totals)
        return output

    def hp_ev_constraint(x, grad):
        return 255 - x[0]

    def atk_ev_constraint(x, grad):
        return 255 - x[1]

    def def_ev_constraint(x, grad):
        return 255 - x[2]

    def spa_ev_constraint(x, grad):
        return 255 - x[3]

    def spd_ev_constraint(x, grad):
        return 255 - x[4]

    def speed_ev_constraint(x, grad):
        return 255 - x[5]

    def hp_iv_constraint(x, grad):
        return 31 - x[6]

    def atk_iv_constraint(x, grad):
        return 31 - x[7]

    def def_iv_constraint(x, grad):
        return 31 - x[8]

    def spa_iv_constraint(x, grad):
        return 31 - x[9]

    def spd_iv_constraint(x, grad):
        return 31 - x[10]

    def speed_iv_constraint(x, grad):
        return 31 - x[11]

    def move_list_constraint(x, grad):
        move_list = get_attack_moves()
        return (len(move_list) - 1) - x[13]

    def nature_list_constraint(x, grad):
        return (len(natures) - 1) - x[12]

    def output_constraint(x, grad):
        stat_totals = get_stat_totals(x)
        output = get_damage_calculation(x, stat_totals)
        return output - opponent.get('hp')

    opt = nlopt.opt(nlopt.LD_MMA, 15)
    opt.set_lower_bounds([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    opt.set_max_objective(objective)
    opt.add_inequality_constraint(hp_ev_constraint)
    opt.add_inequality_constraint(atk_ev_constraint)
    opt.add_inequality_constraint(def_ev_constraint)
    opt.add_inequality_constraint(spa_ev_constraint)
    opt.add_inequality_constraint(spd_ev_constraint)
    opt.add_inequality_constraint(speed_ev_constraint)
    opt.add_inequality_constraint(hp_iv_constraint)
    opt.add_inequality_constraint(atk_iv_constraint)
    opt.add_inequality_constraint(def_iv_constraint)
    opt.add_inequality_constraint(spa_iv_constraint)
    opt.add_inequality_constraint(spd_iv_constraint)
    opt.add_inequality_constraint(speed_iv_constraint)
    opt.add_inequality_constraint(move_list_constraint)
    opt.add_inequality_constraint(nature_list_constraint)
    opt.add_inequality_constraint(output_constraint)
    # opt.set_initial_step(1)
    y = opt.optimize(x)
    results = opt.last_optimum_value()
    print("minimum value = ", results)
    print('hpEV = ' + str(y[0]))
    print('atkEV = ' + str(y[1]))
    print('defEV = ' + str(y[2]))
    print('spaEV = ' + str(y[3]))
    print('speedEV = ' + str(y[4]))
    print('hpIV = ' + str(y[5]))
    print('atkIV = ' + str(y[6]))
    print('defIV = ' + str(y[7]))
    print('spaIV = ' + str(y[8]))
    print('spdIV = ' + str(y[9]))
    print('speedIV = ' + str(y[10]))
    print("result code = ", opt.last_optimize_result())


Solver(charizard, opp, 50)
