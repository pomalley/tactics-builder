import type { EquipmentDef } from '../types';

// prettier-ignore
const _equipmentDefinitions = {
  'None': { points: 0 },
  // Rifles
  'Military Rifle': { points: 3, weapon: { range: 24, shots: 1, damage: 0 }, traits: [] },
  'Infantry Laser': { points: 4, weapon: { range: 30, shots: 1, damage: 0 }, traits: ['Snap Shot'] },
  'Precision Rifle': { points: 6, weapon: { range: 36, shots: 1, damage: 1 }, traits: ['Critical', 'Sniping'] },
  'Blaster': { points: 3, weapon: { range: 18, shots: 1, damage: 1 }, traits: [] },
  'Primitive Weapon': { points: 1, weapon: { range: 18, shots: 1, damage: 0 }, traits: ['Weak'] },
  'Shotgun': { points: 2, weapon: { range: 12, shots: 1, damage: 0 }, traits: ['Critical'] },
  // Support Weapons
  'Light Machine Gun': { points: 10, weapon: { range: 30, shots: 3, damage: 0 }, traits: ['Heavy', 'Team'] },
  'Flak Gun': { points: 5, weapon: { range: 12, shots: 2, damage: 1 }, traits: ['Focused', 'Shrapnel', 'Team'] },
  'Grenade Launcher': { points: 10, weapon: { range: 24, shots: null, damage: null }, traits: ['Launcher', 'Heavy', 'Team'] },
  'Fury Rifle': { points: 15, weapon: { range: 24, shots: 1, damage: 3, bonusDamage: 2 }, traits: ['Heavy', 'Piercing', 'Knock Back', 'Team'] },
  'Plasma Rifle': { points: 8, weapon: { range: 20, shots: 2, damage: 1 }, traits: ['Focused', 'Piercing', 'Overheat', 'Team'] },
  'Sniper Rifle': { points: 10, weapon: { range: 40, shots: 1, damage: 1, bonusDamage: 2 }, traits: ['Heavy', 'Piercing', 'Sniping', 'Team'] },
  'Hyper Blaster': { points: 14, weapon: { range: 24, shots: 3, damage: 1 }, traits: ['Overheat', 'Team'] },
  'Flame Projector': { points: 6, weapon: { range: 6, shots: null, damage: 1 }, traits: ['Stream', 'Burn', 'Team'] },
  'Fusion Rifle': { points: 10, weapon: { range: 15, shots: 1, damage: 3, bonusDamage: 2 }, traits: ['Piercing', 'Team'] },
  // Melee
  'Blade': { points: 1, weapon: { range: null, shots: null, damage: 1 }, traits: ['Melee'] },
  'Glare Sword': { points: 2, weapon: { range: null, shots: null, damage: 1 }, traits: ['Melee', 'Elegant'] },
  'Powered Claw': { points: 3, weapon: { range: null, shots: null, damage: 3 }, traits: ['Melee', 'Clumsy', 'Piercing'] },
  'Breaching Axe': { points: 4, weapon: { range: null, shots: null, damage: 3 }, traits: ['Melee', 'Clumsy', 'Knock Back', 'x2 vs Vehicles'] },
  'Suppression Maul': { points: 1, weapon: { range: null, shots: null, damage: 0 }, traits: ['Melee', 'Stun'] },
  'Ripper Sword': { points: 3, weapon: { range: null, shots: null, damage: 2 }, traits: ['Melee', 'Piercing'] },
  // Sidearms
  'Service Pistol': { points: 1, weapon: { range: 9, shots: 1, damage: 0 }, traits: ['Pistol'] },
  'Hand Laser': { points: 2, weapon: { range: 9, shots: 1, damage: 0 }, traits: ['Pistol', 'Snap Shot'] },
  'Blast Pistol': { points: 2, weapon: { range: 8, shots: 1, damage: 1 }, traits: ['Pistol'] },
  // Grenades
  'Frag Grenade': { points: 1, weapon: { range: 6, shots: null, damage: 0 }, traits: ['Area'] },
  'Penetrator Grenade': { points: 2, weapon: { range: 6, shots: null, damage: 3 }, traits: ['Piercing', 'Knock Back'] },
  'Jinx Grenade': { points: 3, weapon: { range: 6, shots: null, damage: 5 }, traits: ['Lock On', 'Destructive'] },
  'Fog Grenade': { points: 1, weapon: { range: 6, shots: null, damage: null }, traits: ['Area', 'Gas', 'Fog'] },
  'Cling-fire Grenade': { points: 2, weapon: { range: 6, shots: null, damage: 0 }, traits: ['Area', 'Burn'] },
  'Shock Grenade': { points: 1, weapon: { range: 6, shots: null, damage: null }, traits: ['Area', 'Shock'] },
  // Crewed Weapons
  'Laser Cannon': { points: 35, weapon: { range: 48, shots: 1, damage: 5, bonusDamage: 3 }, traits: ['Crewed'] },
  'Pulse Laser': { points: 35, weapon: { range: 36, shots: 2, damage: 4, bonusDamage: 2 }, traits: ['Crewed'] },
  'Anti-tank Laser': { points: 45, weapon: { range: 60, shots: 1, damage: 6, bonusDamage: 3 }, traits: ['Pin-point', 'Crewed'] },
  'Anti-tank missile': { points: 30, weapon: { range: 96, shots: 1, damage: 4, bonusDamage: 4 }, traits: ['Minimum Range', 'Limited Supply', 'Lock On', 'Crewed'] },
  '20mm Autocannon': { points: 20, weapon: { range: 36, shots: 3, damage: 2 }, traits: ['Crewed'] },
  '40mm Autocannon': { points: 25, weapon: { range: 48, shots: 2, damage: 3 }, traits: ['Crewed'] },
  'Infantry Mortar': { points: 15, weapon: { range: 48, shots: 1, damage: 1 }, traits: ['Area', 'Indirect Fire', 'Minimum Range', 'Crewed'] },
  'Heavy Plasma Gun': { points: 20, weapon: { range: 24, shots: 1, damage: 4 }, traits: ['Area', 'Burn', 'Crewed'] },
  '75mm Cannon': { points: 45, weapon: { range: 60, shots: 1, damage: 5, bonusDamage: 3 }, traits: ['Ammo Choice', 'Crewed', 'Frag Shell (D1, Area)'] },
  '100mm Cannon': { points: 55, weapon: { range: 72, shots: 1, damage: 6, bonusDamage: 3 }, traits: ['Ammo Choice', 'Crewed', 'Frag Shell (D2, Area)'] },
  // Armor
  'Powered Armor': { points: 2, traits: ['6+ Save'] },
  'Breach Armor': { points: 4, traits: ['5+ Save'] },
  // Individual Upgrades
  'Hero': { points: 5, traits: ['Never Suppressed', '6+ Save'] },
  'Leader': { points: 10, traits: ['Inspiration', 'Direct Command' ] },
  // Squad Veteran Skills
  'Brave': { points: 10 },
  'Tank Hunters': { points: 15 },
  'Keen Shots': { points: 10 },
  'Die Hards': { points: 5 },
  'Fire Drill': { points: 10 },
  'Brawers': { points: 5 },
  'Fearless': { points: 5 },
  'Bombers': { points: 5 },
  'Guerillas': { points: 10 },
  'Quick': { points: 10 },
  // Sergeant Veteran Skills
  'Rugged': { points: 5 },
  'Parry': { points: 5 },
  'Motivator': { points: 5 },
  'Fighter': { points: 5 },
  'Survivor': { points: 5 },
  'Tactics': { points: 10 },
  'Experienced Eye': { points: 5 },
  'Alert': { points: 5 },
  // Individual Veteran Skills
  'Gun-slinging': { points: 5 },
  'Quick Feet': { points: 5 },
  'Deadly Accuracy': { points: 5 },
  'Lucky': { points: 5 },
  'Skilled Leader': { points: 5 },
  'Expert Fighter': { points: 5 },
  // Gun Crew Veteran Skills
  'Defend the Guns': { points: 5 },
  'Fortified Positions': { points: 5 },
  'Deploy Hidden': { points: 5 },
  'Gun Drill': { points: 10 },
  'Redeployment': { points: 5 },
  'Target Selection': { points: 5 },
  // Vehicle Veteran Skills
  'Gunnery': { points: 15 },
  'Command': { points: 10 },
  'Driving': { points: 10 },
  'Damage Control': { points: 5 },
  'Improvised Armor': { points: 10 },
  'Defensive Measures': { points: 5 },
  // Misc Abilities
  'Observation +1': { points: 1 },                    
  'Morale +1 (Weapon Team)': { points: 2 },           
  'Morale +1 (Fire Section)': { points: 5 },          
  'Tech +1 (hacking, repairs, etc.)': { points: 4 },  
  'Sharpshooter +1 Hit': { points: 4 },               
  'Comms +1': { points: 9 },                          
  'Medic (Remove 1 suppression)': { points: 9 },      
  'Scout +1" Spd, +2 Obs': { points: 6 },             
  'Cavalry': { points: 1 },
} as const satisfies Record<string, EquipmentDef>;

export type EquipmentName = keyof typeof _equipmentDefinitions;

export const equipmentDefinitions: Record<EquipmentName, EquipmentDef> = _equipmentDefinitions;

export const equipmentPoints: Record<EquipmentName, number> = Object.fromEntries(
  Object.entries(equipmentDefinitions).map(([name, def]) => [name, def.points])
) as Record<EquipmentName, number>;

export type EquipmentGroupLabel =
  | 'Rifles'
  | 'Support Weapons'
  | 'Melee'
  | 'Sidearms'
  | 'Grenades'
  | 'Crewed Weapons'
  | 'Armor'
  | 'Individual Upgrades'
  | 'Squad Veteran Skills'
  | 'Sergeant Veteran Skills'
  | 'Individual Veteran Skills'
  | 'Gun Crew Veteran Skills'
  | 'Vehicle Veteran Skills'
  | 'Misc Abilities'
  | 'None';

const equipmentToGroup: Record<EquipmentName, EquipmentGroupLabel> = {
  None: 'None',
  // Rifles
  'Military Rifle': 'Rifles',
  'Infantry Laser': 'Rifles',
  'Precision Rifle': 'Rifles',
  Blaster: 'Rifles',
  'Primitive Weapon': 'Rifles',
  Shotgun: 'Rifles',
  // Support Weapons
  'Light Machine Gun': 'Support Weapons',
  'Flak Gun': 'Support Weapons',
  'Grenade Launcher': 'Support Weapons',
  'Fury Rifle': 'Support Weapons',
  'Plasma Rifle': 'Support Weapons',
  'Sniper Rifle': 'Support Weapons',
  'Hyper Blaster': 'Support Weapons',
  'Flame Projector': 'Support Weapons',
  'Fusion Rifle': 'Support Weapons',
  // Melee
  Blade: 'Melee',
  'Glare Sword': 'Melee',
  'Powered Claw': 'Melee',
  'Breaching Axe': 'Melee',
  'Suppression Maul': 'Melee',
  'Ripper Sword': 'Melee',
  // Sidearms
  'Service Pistol': 'Sidearms',
  'Hand Laser': 'Sidearms',
  'Blast Pistol': 'Sidearms',
  // Grenades
  'Frag Grenade': 'Grenades',
  'Penetrator Grenade': 'Grenades',
  'Jinx Grenade': 'Grenades',
  'Fog Grenade': 'Grenades',
  'Cling-fire Grenade': 'Grenades',
  'Shock Grenade': 'Grenades',
  // Crewed Weapons
  'Laser Cannon': 'Crewed Weapons',
  'Pulse Laser': 'Crewed Weapons',
  'Anti-tank Laser': 'Crewed Weapons',
  'Anti-tank missile': 'Crewed Weapons',
  '20mm Autocannon': 'Crewed Weapons',
  '40mm Autocannon': 'Crewed Weapons',
  'Infantry Mortar': 'Crewed Weapons',
  'Heavy Plasma Gun': 'Crewed Weapons',
  '75mm Cannon': 'Crewed Weapons',
  '100mm Cannon': 'Crewed Weapons',
  // Armor
  'Powered Armor': 'Armor',
  'Breach Armor': 'Armor',
  // Individual Upgrades
  Hero: 'Individual Upgrades',
  Leader: 'Individual Upgrades',
  // Squad Veteran Skills
  Brave: 'Squad Veteran Skills',
  'Tank Hunters': 'Squad Veteran Skills',
  'Keen Shots': 'Squad Veteran Skills',
  'Die Hards': 'Squad Veteran Skills',
  'Fire Drill': 'Squad Veteran Skills',
  Brawers: 'Squad Veteran Skills',
  Fearless: 'Squad Veteran Skills',
  Bombers: 'Squad Veteran Skills',
  Guerillas: 'Squad Veteran Skills',
  Quick: 'Squad Veteran Skills',
  // Sergeant Veteran Skills
  Rugged: 'Sergeant Veteran Skills',
  Parry: 'Sergeant Veteran Skills',
  Motivator: 'Sergeant Veteran Skills',
  Fighter: 'Sergeant Veteran Skills',
  Survivor: 'Sergeant Veteran Skills',
  Tactics: 'Sergeant Veteran Skills',
  'Experienced Eye': 'Sergeant Veteran Skills',
  Alert: 'Sergeant Veteran Skills',
  // Individual Veteran Skills
  'Gun-slinging': 'Individual Veteran Skills',
  'Quick Feet': 'Individual Veteran Skills',
  'Deadly Accuracy': 'Individual Veteran Skills',
  Lucky: 'Individual Veteran Skills',
  'Skilled Leader': 'Individual Veteran Skills',
  'Expert Fighter': 'Individual Veteran Skills',
  // Gun Crew Veteran Skills
  'Defend the Guns': 'Gun Crew Veteran Skills',
  'Fortified Positions': 'Gun Crew Veteran Skills',
  'Deploy Hidden': 'Gun Crew Veteran Skills',
  'Gun Drill': 'Gun Crew Veteran Skills',
  Redeployment: 'Gun Crew Veteran Skills',
  'Target Selection': 'Gun Crew Veteran Skills',
  // Vehicle Veteran Skills
  Gunnery: 'Vehicle Veteran Skills',
  Command: 'Vehicle Veteran Skills',
  Driving: 'Vehicle Veteran Skills',
  'Damage Control': 'Vehicle Veteran Skills',
  'Improvised Armor': 'Vehicle Veteran Skills',
  'Defensive Measures': 'Vehicle Veteran Skills',
  // Misc Abilities
  'Observation +1': 'Misc Abilities',
  'Morale +1 (Weapon Team)': 'Misc Abilities',
  'Morale +1 (Fire Section)': 'Misc Abilities',
  'Tech +1 (hacking, repairs, etc.)': 'Misc Abilities',
  'Sharpshooter +1 Hit': 'Misc Abilities',
  'Comms +1': 'Misc Abilities',
  'Medic (Remove 1 suppression)': 'Misc Abilities',
  'Scout +1" Spd, +2 Obs': 'Misc Abilities',
  Cavalry: 'Misc Abilities',
};

export const equipmentGroups = (
  [
    'Rifles',
    'Support Weapons',
    'Melee',
    'Sidearms',
    'Grenades',
    'Crewed Weapons',
    'Armor',
    'Individual Upgrades',
    'Squad Veteran Skills',
    'Sergeant Veteran Skills',
    'Individual Veteran Skills',
    'Gun Crew Veteran Skills',
    'Vehicle Veteran Skills',
    'Misc Abilities',
    'None',
  ] as EquipmentGroupLabel[]
)
  .map((label) => ({
    label,
    equipment: (Object.keys(equipmentDefinitions) as EquipmentName[]).filter(
      (name) => equipmentToGroup[name] === label
    ),
  }))
  .filter((group) => group.equipment.length > 0);
