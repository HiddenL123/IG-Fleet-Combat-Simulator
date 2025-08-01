def added_percent(value: float) -> float:
    return 1 + (value / 100)

def total_output_and_time(row_percent, base_stat):
    return (added_percent(row_percent['attack'] + row_percent['weapon_attack']) *
            base_stat['attack_per_hit'] * base_stat['attack_bonus'] *
            added_percent(row_percent['final_attack'])), base_stat["cooldown"] * 1000

def calc_armor_damage_reduction(row_percent, base_stat):
    armor_scaled = added_percent(row_percent['armor']) * base_stat['armor']
    armor_coef = (12000 + armor_scaled)/12000
    return armor_coef

def calc_damage_reduction(row):
    return added_percent(row['damage_reduction'])

def ocean(stats):
    stat_increase = {
    "attack": 300,
    "hp": 300,
    "armor": 300,
    "shield": 300,
    "final_attack": 30,
    "damage_reduction": 30,
    }
    new_stats = stats.copy()
    for stat in stat_increase:
        new_stats[stat] += stat_increase[stat]
    return new_stats

def exit_ocean(stats):
    stat_increase = {
    "attack": -300,
    "hp": -300,
    "armor": -300,
    "shield": -300,
    "final_attack": -30,
    "damage_reduction": -30,
    }
    new_stats = stats.copy()
    for stat in stat_increase:
        new_stats[stat] += stat_increase[stat]
    return new_stats