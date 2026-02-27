export const equipmentPoints = {
    'None': 0,
    // Rifles
    'Military Rifle': 3,
    'Infantry Laser': 4,
    'Precision Rifle': 6,
    'Blaster': 3,
    'Primitive Weapon': 1,
    'Shotgun': 2,
    // Support Weapons
    'Light Machine Gun': 10,
    'Flak Gun': 5,
    'Grenade Launcher': 10,
    'Fury Rifle': 15,
    'Plasma Rifle': 8,
    'Sniper Rifle': 10,
    'Hyper Blaster': 14,
    'Flame Projector': 6,
    'Fusion Rifle': 10,
    // Melee
    'Blade': 1,
    'Glare Sword': 2,
    'Powered Claw': 3,
    'Breaching Axe': 4,
    'Suppression Maul': 1,
    'Ripper Sword': 3,
    // Sidearms
    'Service Pistol': 1,
    'Hand Laser': 2,
    'Blast Pistol': 2,
    // Grenades
    'Frag Grenade': 1,
    'Penetrator Grenade': 2,
    'Jinx Grenade': 3,
    'Fog Grenade': 1,
    'Cling-fire Grenade': 2,
    'Shock Grenade': 1,
    // Crewed Weapons
    'Laser Cannon': 35,
    'Pulse Laser': 35,
    'Anti-tank Laser': 45,
    'Anti-tank missile': 30,
    '20mm Autocannon': 20,
    '40mm Autocannon': 25,
    'Infantry Mortar': 15,
    'Heavy Plasma Gun': 20,
    '75mm Cannon': 45,
    '100mm Cannon': 55,
    // Armor
    'Powered Armor': 2,
    'Breach Armor': 4,
    // Individual Upgrades
    'Hero': 5,
    'Leader': 10,
    // Squad Veteran Skills
    'Brave': 10,
    'Tank Hunters': 15,
    'Keen Shots': 10,
    'Die Hards': 5,
    'Fire Drill': 10,
    'Brawers': 5,
    'Fearless': 5,
    'Bombers': 5,
    'Guerillas': 10,
    'Quick': 10,
    // Sergeant Veteran Skills
    'Rugged': 5,
    'Parry': 5,
    'Motivator': 5,
    'Fighter': 5,
    'Survivor': 5,
    'Tactics': 10,
    'Experienced Eye': 5,
    'Alert': 5,
    // Individual Veteran Skills
    'Gun-slinging': 5,
    'Quick Feet': 5,
    'Deadly Accuracy': 5,
    'Lucky': 5,
    'Skilled Leader': 5,
    'Expert Fighter': 5,
    // Gun Crew Veteran Skills
    'Defend the Guns': 5,
    'Fortified Positions': 5,
    'Deploy Hidden': 5,
    'Gun Drill': 10,
    'Redeployment': 5,
    'Target Selection': 5,
    // Vehicle Veteran Skills
    'Gunnery': 15,
    'Command': 10,
    'Driving': 10,
    'Damage Control': 5,
    'Improvised Armor': 10,
    'Defensive Measures': 5,
    // Misc Abilities
    'Observation +1': 1,                    // Recon squad (per soldier)
    'Morale +1 (Weapon Team)': 2,           // Weapon team (whole squad)
    'Morale +1 (Fire Section)': 5,          // Fire section (whole squad)
    'Tech +1 (hacking, repairs, etc.)': 4,  // Tech specialist
    'Sharpshooter +1 Hit': 4,               // Sharpshooter specialist
    'Comms +1': 9,                          // Comms specialist
    'Medic (Remove 1 suppression)': 9,      // Medic specialist
    'Scout +1" Spd, +2 Obs': 6,             // Scout specialist
    'Cavalry': 1,                           // Cavalry unit
} as const;

export type EquipmentName = keyof typeof equipmentPoints;

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
    'None': 'None',
    // Rifles
    'Military Rifle': 'Rifles',
    'Infantry Laser': 'Rifles',
    'Precision Rifle': 'Rifles',
    'Blaster': 'Rifles',
    'Primitive Weapon': 'Rifles',
    'Shotgun': 'Rifles',
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
    'Blade': 'Melee',
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
    'Hero': 'Individual Upgrades',
    'Leader': 'Individual Upgrades',
    // Squad Veteran Skills
    'Brave': 'Squad Veteran Skills',
    'Tank Hunters': 'Squad Veteran Skills',
    'Keen Shots': 'Squad Veteran Skills',
    'Die Hards': 'Squad Veteran Skills',
    'Fire Drill': 'Squad Veteran Skills',
    'Brawers': 'Squad Veteran Skills',
    'Fearless': 'Squad Veteran Skills',
    'Bombers': 'Squad Veteran Skills',
    'Guerillas': 'Squad Veteran Skills',
    'Quick': 'Squad Veteran Skills',
    // Sergeant Veteran Skills
    'Rugged': 'Sergeant Veteran Skills',
    'Parry': 'Sergeant Veteran Skills',
    'Motivator': 'Sergeant Veteran Skills',
    'Fighter': 'Sergeant Veteran Skills',
    'Survivor': 'Sergeant Veteran Skills',
    'Tactics': 'Sergeant Veteran Skills',
    'Experienced Eye': 'Sergeant Veteran Skills',
    'Alert': 'Sergeant Veteran Skills',
    // Individual Veteran Skills
    'Gun-slinging': 'Individual Veteran Skills',
    'Quick Feet': 'Individual Veteran Skills',
    'Deadly Accuracy': 'Individual Veteran Skills',
    'Lucky': 'Individual Veteran Skills',
    'Skilled Leader': 'Individual Veteran Skills',
    'Expert Fighter': 'Individual Veteran Skills',
    // Gun Crew Veteran Skills
    'Defend the Guns': 'Gun Crew Veteran Skills',
    'Fortified Positions': 'Gun Crew Veteran Skills',
    'Deploy Hidden': 'Gun Crew Veteran Skills',
    'Gun Drill': 'Gun Crew Veteran Skills',
    'Redeployment': 'Gun Crew Veteran Skills',
    'Target Selection': 'Gun Crew Veteran Skills',
    // Vehicle Veteran Skills
    'Gunnery': 'Vehicle Veteran Skills',
    'Command': 'Vehicle Veteran Skills',
    'Driving': 'Vehicle Veteran Skills',
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
    'Cavalry': 'Misc Abilities',
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
        'None'
    ] as EquipmentGroupLabel[]
).map(label => ({
    label,
    equipment: (Object.keys(equipmentPoints) as EquipmentName[]).filter(name => equipmentToGroup[name] === label)
})).filter(group => group.equipment.length > 0);
