from simulation import Simulator, Fleet, do_battle, find_final_score
from base_stats import t10_f, t11_d, t12_d
from fleet_stats import look_ocean, lc_ocean, dedoninsidef1
import fleet_stats

stat_increase = {
    "attack": 1,
    "hp": 1,
    "armor": 1,
    "shield": 1,
    "final_attack": 0.1,
    "damage_reduction": 0.1,
    "leadership": 10
}

def optimize(f1_base_stat: dict, f1_stats: dict, stat_increase : dict, starting_leadership = 30):

    base_score = find_final_score(f1_base_stat, f1_stats, starting_leadership = starting_leadership)
    print("base score:"+ str(base_score))
    for stat in stat_increase:
        new_stat = f1_stats.copy()
        new_stat[stat] += stat_increase[stat]
        score = find_final_score(f1_base_stat, new_stat, starting_leadership = base_score)
        score_diff = score - base_score
        print(f"{stat} +{stat_increase[stat]} gives +{score_diff} score")


#find_stat_value(t10_f, fleet_stats.dedoninsidef1, stat_increase)
#find_stat_value(t11_d, fleet_stats.xander_laser, stat_increase)

def compare_stats(f1_base_stat: dict, f1_stats: dict, stats_changes : list[dict], starting_leadership = 30):
    base_score = find_final_score(f1_base_stat, f1_stats, starting_leadership = starting_leadership)
    print("base score:"+ str(base_score))
    for i, stat_change in enumerate(stats_changes):
        print()
        new_stat = f1_stats.copy()
        for stat in stat_change:
            new_stat[stat] += stat_change[stat]
        score = find_final_score(f1_base_stat, new_stat, starting_leadership = starting_leadership)
        score_diff = score - base_score
        print(f"Setup {i} gives +{score_diff} score")

def simulate_battle(f1_base_stat: dict, f1_stats: dict, f2_base_stat: dict, f2_stats: dict, starting_leadership = 30):

    f1 = Fleet(f1_base_stat, f1_stats, name="Fleet 1")
    f2 = Fleet(f2_base_stat, f2_stats, name="Fleet 2")
    f1_wins = do_battle(f1, f2, True)
    print(f"Fleet 1 wins: {f1_wins}")

stat_compare = [{
    "attack": 42.5,
    "hp": 60.7,
    "armor": 0,
    "shield": 0,
    "final_attack": 0,
    "damage_reduction": 0,
    "leadership": -1800
}]


compare_stats(t10_f, fleet_stats.dedoninsidef1, stat_compare)