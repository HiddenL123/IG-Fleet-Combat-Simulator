import { 
  calcArmorDamageReduction, 
  calcDamageReduction, 
  totalOutputAndTime, 
  addedPercent 
} from './combatMath.js';

function restraintMultiplier(f1Class, f2Class) {
  if (f1Class === f2Class) return 1; // Tie

  const winMap = {
    frigates: 'cruisers',
    cruisers: 'destroyers',
    destroyers: 'frigates',
    flagships: 'Na',
    Na: 'flagships',
    None: 'Na',
    Na: 'None'
  };

  if (winMap[f1Class] === f2Class) return 1.15;
  else if (winMap[f2Class] === f1Class) return 0.85;
  else return 1;
}

export class Fleet {
  constructor(baseStat, statsBonus, name = 'Fleet', fsOutputPerSecond = 0) {
    this.name = name;
    this.count = statsBonus.leadership / baseStat.leadership;
    this.totalCount = this.count;
    this.leadershipPerShip = baseStat.leadership;
    this.powerPerShip = baseStat.power;
    this.countUnrounded = this.count;
    const [outputPerShipAttack, totalCooldown] = totalOutputAndTime(statsBonus, baseStat);
    this.outputPerShipAttack = outputPerShipAttack;
    this.totalCooldown = totalCooldown;

    this.cooldown = 0;
    this.totalShieldValue = baseStat.shield * addedPercent(statsBonus.shield) * this.count;
    this.shieldValue = this.totalShieldValue;

    this.hpValue = baseStat.hp * addedPercent(statsBonus.hp);
    this.armorMultiplier = calcArmorDamageReduction(statsBonus, baseStat);
    this.damageReductionCoefficient = calcDamageReduction(statsBonus);

    this.alive = true;
    this.fsDamage = fsOutputPerSecond;
    this.weaponType = baseStat.type;
    this.shipType = baseStat.class;
  }

  takeDamage(attackValue, weaponType, shipType = 'None') {
    const restraintBonus = restraintMultiplier(shipType, this.shipType);

    const newAttackValue = (attackValue / this.damageReductionCoefficient) * restraintBonus;

    let shieldDamage = 1;
    let armorDamage = 1;

    if (weaponType === 'missile') {
      shieldDamage = 1.3;
    } else if (weaponType === 'laser') {
      armorDamage = 1.3;
      shieldDamage = 0.85;
    }

    let hpDamage;
    if (this.shieldValue <= 0) {
      hpDamage = newAttackValue;
    } else {
      const halfAttack = newAttackValue / 2;
      this.shieldValue -= halfAttack * shieldDamage;
      hpDamage = halfAttack;

      if (this.shieldValue < 0) {
        const overflow = (-this.shieldValue) / shieldDamage;
        hpDamage += overflow;
        this.shieldValue = 0;
      }
    }
    this.countUnrounded -= (hpDamage * armorDamage) / (this.hpValue * this.armorMultiplier);
    this.count = Math.ceil(this.countUnrounded);

    if (this.count <= 0) {
      this.alive = false;
    }
  }

  doDamage(tick) {
    let outputThisTick = 0;
    if (this.cooldown <= 0) {
      outputThisTick = this.count * this.outputPerShipAttack + (this.fsDamage * tick) / 1000;
      this.cooldown += this.totalCooldown;
    }

    this.cooldown -= tick;
    return [outputThisTick, this.weaponType, this.shipType];
  }

  toString() {
    return this.name;
  }
}

function plotY(fleet, plotType) {
  if (plotType === 'leadership') {
    return Math.max(fleet.count * fleet.leadershipPerShip, 0);
  } else if (plotType === 'percent') {
    return Math.max(fleet.countUnrounded / fleet.totalCount, 0) * 100;
  } else if (plotType === 'power') {
    return Math.max(fleet.count * fleet.powerPerShip, 0);
  }
  return 0;
}

export class Simulator {
  constructor(fleet1, fleet2, tickStep = 500) {
    this.fleet1 = fleet1;
    this.fleet2 = fleet2;
    this.tick = 0;
    this.tickStep = tickStep;

    this.timeLog = [];
    this.fleet1Counts = [];
    this.fleet2Counts = [];
    this.plotType = 'None'
  }

  runBattle(plotResult = false, plotType = 'None') {
    this.plotType = plotType;
    this.timeLog.push(0);
    this.fleet1Counts.push(plotY(this.fleet1, plotType));
    this.fleet2Counts.push(plotY(this.fleet2, plotType));

    while (this.fleet1.alive && this.fleet2.alive) {
      this.tick += this.tickStep;

      const [fleet2Damage, f1Type, f1Class] = this.fleet1.doDamage(this.tickStep);
      const [fleet1Damage, f2Type, f2Class] = this.fleet2.doDamage(this.tickStep);

      this.fleet2.takeDamage(fleet2Damage, f1Type, f1Class);
      this.fleet1.takeDamage(fleet1Damage, f2Type, f2Class);

      this.timeLog.push(this.tick / 1000);
      this.fleet1Counts.push(plotY(this.fleet1, plotType));
      this.fleet2Counts.push(plotY(this.fleet2, plotType));
    }

    if (plotResult) {
      this.plotBattle(plotType);
    }

    return this.fleet1.alive;
  }

  plotBattle(canvas) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error('plotBattle expects a canvas element');
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any existing transform
    ctx.scale(dpr, dpr); // scale drawing for HiDPI

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const plotWidth = canvas.clientWidth - margin.left - margin.right;
    const plotHeight = canvas.clientHeight - margin.top - margin.bottom;

    const maxY = Math.max(...this.fleet1Counts, ...this.fleet2Counts, 1);
    const maxTime = Math.max(...this.timeLog, 1);

    const xScale = t => margin.left + (t / maxTime) * plotWidth;
    const yScale = val => margin.top + plotHeight - (val / maxY) * plotHeight;

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + plotHeight);
    ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', margin.left + plotWidth / 2, canvas.clientHeight - 5);

    ctx.save();
    ctx.translate(15, margin.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(this.plotType, 0, 0);
    ctx.restore();

    // Grid and ticks
    ctx.strokeStyle = '#ccc';
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
      const yVal = (maxY / 5) * i;
      const yPos = yScale(yVal);
      ctx.beginPath();
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(margin.left + plotWidth, yPos);
      ctx.stroke();
      ctx.fillText(yVal.toFixed(0), margin.left - 5, yPos + 4);
    }

    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const tVal = (maxTime / 5) * i;
      const xPos = xScale(tVal);
      ctx.beginPath();
      ctx.moveTo(xPos, margin.top + plotHeight);
      ctx.lineTo(xPos, margin.top + plotHeight + 5);
      ctx.stroke();
      ctx.fillText(tVal.toFixed(1), xPos, margin.top + plotHeight + 16);
    }

    // Draw fleet lines
    function drawLine(data, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((val, i) => {
        const x = xScale(this.timeLog[i]);
        const y = yScale(val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    drawLine.call(this, this.fleet1Counts, 'blue');
    drawLine.call(this, this.fleet2Counts, 'red');

    // Legend
    const legendX = canvas.clientWidth - 120;
    const legendY = margin.top;

    ctx.fillStyle = 'blue';
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(this.fleet1.name, legendX + 16, legendY + 10);

    ctx.fillStyle = 'red';
    ctx.fillRect(legendX, legendY + 20, 12, 12);
    ctx.fillStyle = '#000';
    ctx.fillText(this.fleet2.name, legendX + 16, legendY + 30);
  }

}

export function doBattle(fleet1, fleet2, plotBattle = false, plotType = 'power', graph = null) {
  const sim = new Simulator(fleet1, fleet2);
  const value = sim.runBattle(plotBattle, plotType);
  if (plotBattle && graph instanceof HTMLCanvasElement) {
    sim.plotBattle(graph);
  } else if (plotBattle) {
    console.error('plotBattle requires a valid canvas element');
  }
  return value;
}

export function findFinalScore(
  f1BaseStat,
  f1Stat,
  basicFleetStat,
  basicBaseStat,
  multiplier = 1.1,
  startingLeadership = 0,
  graph = null,
  gtype = 'None'
  
) {
  let low = startingLeadership;
  let high = startingLeadership || 1;

  while (true) {
    
    const f1 = new Fleet(f1BaseStat, f1Stat);
    const basicFleet = { ...basicFleetStat, leadership: high };
    const f2 = new Fleet(basicBaseStat, basicFleet);

    if (!doBattle(f1, f2)) break;
    low = high;
    high = Math.floor(high * multiplier) + 1;
  }

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const f1 = new Fleet(f1BaseStat, f1Stat);
    const basicFleet = { ...basicFleetStat, leadership: mid };
    const f2 = new Fleet(basicBaseStat, basicFleet);

    if (doBattle(f1, f2)) low = mid + 1;
    else high = mid;
  }
  
  if (graph instanceof HTMLCanvasElement) {
    const f1 = new Fleet(f1BaseStat, f1Stat, 'Your Fleet');
    const basicFleet = { ...basicFleetStat, leadership: low - 1 };
    const f2 = new Fleet(basicBaseStat, basicFleet, "Strongest beatable Enemy Fleet");
    doBattle(f1, f2, true, gtype, graph);
  }

  return low - 1;
}
