import math
import matplotlib.pyplot as plt
from calc import calc_armor_damage_reduction, calc_damage_reduction, total_output_and_time, added_percent
import calc
from base_stats import t10_f, t11_f, t10_d, t11_d
from fleet_stats import basic_fleet_stat

def restraint_multiplier(f1_class, f2_class):
    if f1_class == f2_class:
        return 1  # Tie

    win_map = {
        "frigates": "cruisers",
        "cruisers": "destroyers",
        "destroyers": "frigates",
        "flagships": "Na",
        "Na": "flagships",
        "None": "Na",
        "Na": "None"
    }

    if win_map[f1_class] == f2_class:
        return 1.15
    elif win_map[f2_class] == f1_class:
        return 0.85
    else:
        return 1

class Fleet:
    def __init__(self, base_stat: dict, stats_bonus: dict, fs_output_per_second = 0, name = "Fleet"):
        self.name = name
        self.count = stats_bonus['leadership'] / base_stat['leadership']
        self.total_count = self.count
        self.leadership_per_ship = base_stat['leadership']
        self.power_per_ship = base_stat['power']
        self.count_unrounded = self.count
        self.output_per_ship_attack, self.total_cooldown = total_output_and_time(stats_bonus, base_stat)
        self.cooldown = 0
        self.total_shield_value = base_stat['shield']* added_percent(stats_bonus['shield']) * self.count
        self.shield_value = self.total_shield_value

        self.hp_value = base_stat['hp'] * added_percent(stats_bonus['hp'])
        self.armor_multiplier = calc_armor_damage_reduction(stats_bonus, base_stat)
        self.damage_reduction_coefficient = calc_damage_reduction(stats_bonus)
        self.alive = True
        self.fs_damage = fs_output_per_second
        self.weapon_type = base_stat['type']
        self.ship_type = base_stat['class']
    
    def take_damage(self, attack_value, weapon_type, ship_type = "None"):
        """
        Reduce the fleet's health based on the incoming attack value.
        The attack goes through shields first, and then the remaining damage is subtracted from the health.
        """
        
        restraint_bonus = restraint_multiplier(ship_type, self.ship_type)

        new_attack_value = attack_value / self.damage_reduction_coefficient * restraint_bonus

        shield_damage = 1
        armor_damage = 1
        if weapon_type == "missile":
            shield_damage = 1.3
        elif weapon_type == "laser":
            armor_damage = 1.3
            shield_damage = 0.85
        
        if self.shield_value == 0:
            hp_dmg = new_attack_value
        else:
            half_attack = new_attack_value / 2
            self.shield_value -= half_attack * shield_damage
            hp_dmg = half_attack
            if self.shield_value < 0:
                overflow = 0 - self.shield_value/ shield_damage
                hp_dmg += overflow
                self.shield_value = 0
        self.count_unrounded -= hp_dmg * armor_damage / (self.hp_value * self.armor_multiplier)
        self.count = math.ceil(self.count_unrounded)

        if self.count <= 0:
            self.alive = False
    
    def do_damage(self, tick):
        """
        Calculates the total damage this fleet does based on its count and attack per ship.
        """
        if self.cooldown <= 0:
            output_this_tick = self.count * self.output_per_ship_attack + self.fs_damage* tick / 1000
            self.cooldown += self.total_cooldown
        else:
            output_this_tick = 0

        # Decrease cooldown by the tick step
        self.cooldown -= tick
        return output_this_tick , self.weapon_type, self.ship_type
    
    def __str__(self):
        return self.name

def plot_y(fleet: Fleet, plot_type):
    if plot_type == 'leadership':
        return max(fleet.count * fleet.leadership_per_ship, 0)
    elif plot_type == 'percent':
        return max(fleet.count_unrounded/ fleet.total_count, 0)
    elif plot_type == 'power':
        return max(fleet.count * fleet.power_per_ship, 0)
    
class Simulator:
    def __init__(self, fleet_1: Fleet, fleet_2: Fleet, tick_step=500):
        self.fleet_1 = fleet_1
        self.fleet_2 = fleet_2
        self.tick = 0  # 1 tick is 1ms real time
        self.tick_step = tick_step

        self.time_log = []
        self.fleet1_counts = []
        self.fleet2_counts = []
        
    def run_battle(self, plot_result=False, plot_type = "power"):
        """
        Simulate the battle between the two fleets, and optionally plot the result.
        """
        self.time_log.append(0)  # in seconds

        self.fleet1_counts.append(plot_y(self.fleet_1, plot_type))
        self.fleet2_counts.append(plot_y(self.fleet_2, plot_type))

        while self.fleet_1.alive and self.fleet_2.alive:
            self.tick += self.tick_step  # Increase time in ms

            # Damage phase
            fleet_2_damage, f1_type, f1_class = self.fleet_1.do_damage(self.tick_step)
            fleet_1_damage, f2_type, f2_class = self.fleet_2.do_damage(self.tick_step)

            self.fleet_2.take_damage(fleet_2_damage, f1_type, f1_class)
            self.fleet_1.take_damage(fleet_1_damage, f2_type, f2_class)

            # Record state
            self.time_log.append(self.tick / 1000)  # in seconds
            self.fleet1_counts.append(plot_y(self.fleet_1, plot_type))
            self.fleet2_counts.append(plot_y(self.fleet_2, plot_type))

        # print result
        #winner = f"{self.fleet_1}" if self.fleet_1.alive else f"{self.fleet_2}"
        #print(f"{winner} wins after {self.tick / 1000:.2f} seconds")

        # Plot if requested
        if plot_result:
            self.plot_battle(plot_type)

        return self.fleet_1.alive
    
    def plot_battle(self, plot_type):
        """
        Plot the count of each fleet over time.
        """
        plt.figure(figsize=(10, 5))
        plt.plot(self.time_log, self.fleet1_counts, label=self.fleet_1, color="blue")
        plt.plot(self.time_log, self.fleet2_counts, label=self.fleet_2, color="red")
        plt.xlabel("Time (1000 ticks)")
        plt.ylabel(f"{plot_type}")
        plt.title(f"Fleet {plot_type} Count Over Time")
        plt.legend()
        plt.grid(True)
        plt.tight_layout()
        plt.show()


def do_battle(f1, f2, plot_battle = False, plot_type = "power"):
    sim = Simulator(f1, f2)
    f1_win = sim.run_battle(plot_result=plot_battle, plot_type = plot_type)
    return(f1_win)

def find_final_score(f1_base_stat, f1_stat, basic_fleet_stat = basic_fleet_stat, multiplier=1.1, basic_base_stat=t10_f, starting_leadership=0):
    
    # Initial lower and upper bounds
    low = starting_leadership
    high = starting_leadership or 1

    # Exponentially increase high until f1 loses
    while True:
        f1 = Fleet(f1_base_stat, f1_stat)
        basic_fleet = basic_fleet_stat.copy()
        basic_fleet['leadership'] = high
        f2 = Fleet(basic_base_stat, basic_fleet)
        if not do_battle(f1, f2):
            break
        low = high
        high = int(high * multiplier) + 1

    # Binary search between low and high to find final score
    while low < high:
        mid = (low + high) // 2
        f1 = Fleet(f1_base_stat, f1_stat)
        basic_fleet = basic_fleet_stat.copy()
        basic_fleet['leadership'] = mid
        f2 = Fleet(basic_base_stat, basic_fleet)
        if do_battle(f1, f2):
            low = mid + 1
        else:
            high = mid

    return low - 1  # The highest leadership where f1 still wins
    


    