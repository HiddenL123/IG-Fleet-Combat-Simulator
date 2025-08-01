# IG-Fleet-Combat-Simulator
A simple combat simulator and calculator for the game Infinite Galaxy by Camel Games

# About
Currently this simulator only has basic combat mechanics an stats and will not take into account flagship, carrier abilities, range, or any special abilities from flagship, warship mastery, or space paradise buildings.
This combat simulation uses a combination of community data minedd information, in game testing, and a bit a guesswwork to produce. It might not be 100% accurate. 
# How to use
Battle Simulation
1. Find a desirable battle report for both fleets (or you can just make up the stats as long as it's reasonable)
2. Input the respective stats (Note: If you have decoding unlocked, you will have to add [final attack + {ship type} final attack. Similarily you will have to do the same for damage reduction)
3. Press calculate
Optimize
1. Find a desirable battle report for the fleet you want to optimize
2. (Optional) Setup the stats of the opposing fleet that you want to optimize against (Note: Leadership is not nessecary as the enemy fleet will adjust in size during the calculation)
3. Press Calculate
4. The output will be in the console. The 'value' of each stat is shown. This will give a rough idea on what stat should be optimized. Multiply by the desired amount to for different intervals
   Example: If you want to compare 5% attack vs 1% damage reduction, and
   1% attack = 450, 0.1% damage reduction = 350
   then
   5% attack value = 450/1%  * 5%
   0.1% damage reduction = 350/0.1% * 1%

   Be aware this will be less accurate for higher stat intervals. For changes greater than 100x the unit value, please use the compare option

Compare
1. Find a desirable battle report for the fleet you want to optimize
2. (Optional) Setup the stats of the opposing fleet that you want to optimize against (Note: Leadership is not nessecary as the enemy fleet will adjust in size during the calculation)
3. Enter in the change in stats you want to test. You can add more presets to test at the same time. Every preset will be relative to the fleet stat inputted
4. Press Calculate
5. Each preset will be scored in the output console
