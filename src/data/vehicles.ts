import type { UnitOptionDef, UnitTypeDef } from '../types';

const vehicleVeteranSkill: UnitOptionDef = {
  id: 'vehicle_veteran_skill',
  name: 'Vehicle Veteran Skill',
  type: 'slot',
  slotName: 'veteran_skill',
  choices: [
    { id: 'vehicle_veteran_skill_none', name: 'None' },
    { id: 'vehicle_veteran_skill_gunnery', name: 'Gunnery' },
    { id: 'vehicle_veteran_skill_command', name: 'Command' },
    { id: 'vehicle_veteran_skill_driving', name: 'Driving' },
    { id: 'vehicle_veteran_skill_damage_control', name: 'Damage Control' },
    { id: 'vehicle_veteran_skill_armor', name: 'Improvised Armor' },
    { id: 'vehicle_veteran_skill_defensive', name: 'Defensive Measures' },
  ],
};

const ifvOptions: UnitOptionDef[] = [
  vehicleVeteranSkill,
  {
    id: 'ifv_turret_slot',
    name: 'Turret',
    type: 'slot',
    slotName: 'turret',
    choices: [
      { id: 'ifv_20mm', name: '20mm Autocannon' },
      { id: 'ifv_heavy_plasma', name: 'Heavy Plasma Gun' },
    ],
  },
];

const lightTankOptions: UnitOptionDef[] = [
  vehicleVeteranSkill,
  {
    id: 'light_tank_turret_slot',
    name: 'Turret',
    type: 'slot',
    slotName: 'turret',
    choices: [
      { id: 'light_tank_40mm', name: '40mm Autocannon' },
      { id: 'light_tank_pulse', name: 'Pulse Laser' },
    ],
  },
];

const mediumTankOptions: UnitOptionDef[] = [
  vehicleVeteranSkill,
  {
    id: 'medium_tank_coax_slot',
    name: 'Coaxial',
    type: 'slot',
    slotName: 'coaxial',
    choices: [
      { id: 'medium_tank_lmg', name: 'Light Machine Gun' },
      { id: 'medium_tank_heavy_plasma', name: 'Heavy Plasma Gun' },
    ],
  },
  {
    id: 'medium_tank_turret_slot',
    name: 'Turret',
    type: 'slot',
    slotName: 'turret',
    choices: [
      { id: 'medium_tank_100mm', name: '100mm Cannon' },
      { id: 'medium_tank_at_laser', name: 'Anti-tank Laser' },
    ],
  },
];

const baseStats = {
  reaction: 2,
  combatSkill: 1,
  savvy: 0,
  training: 1,
};

export const vehicleDefinitions = {
  'Nomad Bike': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Nomad Bike',
        baseStats: {
          points: 15,
          speed: 12,
          toughness: 6,
          killPoints: 2,
          crew: 1,
          capacity: 0,
          ...baseStats,
        },
        slots: { forward: 'None' },
        extras: [],
      },
    ],
  },
  Scouter: {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Scouter',
        baseStats: {
          points: 25,
          speed: 16,
          toughness: 5,
          killPoints: 2,
          crew: 1,
          capacity: 0,
          ...baseStats,
        },
        slots: { forward: 'Light Machine Gun' },
        extras: [],
      },
    ],
  },
  Lancer: {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Lancer',
        baseStats: {
          points: 22,
          speed: 12,
          toughness: 5,
          killPoints: 2,
          crew: 2,
          capacity: 0,
          ...baseStats,
        },
        slots: { forward: 'Plasma Rifle' },
        extras: [],
      },
    ],
  },
  'Frontier Trike': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Frontier Trike',
        baseStats: {
          points: 25,
          speed: 10,
          toughness: 6,
          killPoints: 3,
          crew: 2,
          capacity: 0,
          ...baseStats,
        },
        slots: { 'Forward/Side': 'Light Machine Gun' },
        extras: [],
      },
    ],
  },
  'Raider Trike': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Raider Trike',
        baseStats: {
          points: 25,
          speed: 15,
          toughness: 5,
          killPoints: 3,
          crew: 2,
          capacity: 0,
          ...baseStats,
        },
        slots: { 'Forward/Side': 'Light Machine Gun' },
        extras: [],
      },
    ],
  },
  'Armored Car': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Armored Car',
        baseStats: {
          points: 40,
          speed: 9,
          toughness: 7,
          killPoints: 5,
          crew: 2,
          capacity: 0,
          ...baseStats,
        },
        slots: { turret: '20mm Autocannon' },
        extras: [],
      },
    ],
  },
  APC: {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'APC',
        baseStats: {
          points: 40,
          speed: 8,
          toughness: 7,
          killPoints: 5,
          crew: 2,
          capacity: 10,
          ...baseStats,
        },
        slots: { turret: 'Light Machine Gun' },
        extras: [],
      },
    ],
  },
  'APC - Grav': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'APC - Grav',
        baseStats: {
          points: 45,
          speed: 9,
          toughness: 7,
          killPoints: 4,
          crew: 2,
          capacity: 8,
          ...baseStats,
        },
        slots: { turret: 'Light Machine Gun' },
        extras: [],
      },
    ],
  },
  IFV: {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'IFV',
        baseStats: {
          points: 40,
          speed: 8,
          toughness: 7,
          killPoints: 5,
          crew: 3,
          capacity: 6,
          ...baseStats,
        },
        slots: { front: 'Light Machine Gun', turret: '20mm Autocannon' },
        extras: [],
      },
    ],
  },
  'IFV - Grav': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'IFV - Grav',
        baseStats: {
          points: 45,
          speed: 9,
          toughness: 7,
          killPoints: 4,
          crew: 3,
          capacity: 5,
          ...baseStats,
        },
        slots: { front: 'Light Machine Gun', turret: '20mm Autocannon' },
        extras: [],
      },
    ],
  },
  'Light Tank': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Light Tank',
        baseStats: {
          points: 55,
          speed: 8,
          toughness: 8,
          killPoints: 6,
          crew: 4,
          capacity: 0,
          ...baseStats,
        },
        slots: {
          front: 'Light Machine Gun',
          coaxial: 'Light Machine Gun',
          turret: '40mm Autocannon',
        },
        extras: [],
      },
    ],
  },
  'Light Tank - Grav': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Light Tank - Grav',
        baseStats: {
          points: 70,
          speed: 7,
          toughness: 8,
          killPoints: 6,
          crew: 4,
          capacity: 0,
          ...baseStats,
        },
        slots: {
          front: 'Light Machine Gun',
          coaxial: 'Light Machine Gun',
          turret: '40mm Autocannon',
        },
        extras: [],
      },
    ],
  },
  'Medium Tank': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Medium Tank',
        baseStats: {
          points: 65,
          speed: 7,
          toughness: 9,
          killPoints: 7,
          crew: 4,
          capacity: 0,
          ...baseStats,
        },
        slots: {
          front: 'Light Machine Gun',
          coaxial: 'Light Machine Gun',
          turret: '100mm Cannon',
        },
        extras: [],
      },
    ],
  },
  'Medium Tank - Grav': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Medium Tank - Grav',
        baseStats: {
          points: 75,
          speed: 8,
          toughness: 9,
          killPoints: 6,
          crew: 4,
          capacity: 0,
          ...baseStats,
        },
        slots: {
          front: 'Light Machine Gun',
          coaxial: 'Light Machine Gun',
          turret: '100mm Cannon',
        },
        extras: [],
      },
    ],
  },
  'Heavy Tank': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Heavy Tank',
        baseStats: {
          points: 125,
          speed: 6,
          toughness: 10,
          killPoints: 8,
          crew: 5,
          capacity: 0,
          ...baseStats,
        },
        slots: {
          front: 'Light Machine Gun',
          coaxial: 'Light Machine Gun',
          turret: '100mm Cannon',
        },
        extras: [],
      },
    ],
  },
  'Light Walker': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Light Walker',
        baseStats: {
          points: 44,
          speed: 5,
          toughness: 8,
          killPoints: 4,
          crew: 1,
          capacity: 0,
          ...baseStats,
        },
        slots: { arm1: '20mm Autocannon', arm2: 'Flame Projector' },
        extras: [],
      },
    ],
  },
  'Heavy Walker': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'Heavy Walker',
        baseStats: {
          points: 55,
          speed: 4,
          toughness: 8,
          killPoints: 5,
          crew: 1,
          capacity: 0,
          ...baseStats,
        },
        slots: { shoulder: 'Pulse Laser', arm: 'Light Machine Gun' },
        extras: [],
      },
    ],
  },
  'CIM-L': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'CIM-L',
        baseStats: {
          points: 21,
          speed: 6,
          toughness: 7,
          killPoints: 3,
          crew: 0,
          capacity: 0,
          ...baseStats,
        },
        slots: { weapon: 'Hyper Blaster' },
        extras: [],
      },
    ],
  },
  'CIM-APP': {
    slots: { veteran_skill: 'None' },
    models: [
      {
        name: 'CIM-APP',
        baseStats: {
          points: 25,
          speed: 4,
          toughness: 8,
          killPoints: 4,
          crew: 0,
          capacity: 0,
          ...baseStats,
        },
        slots: { weapon: '20mm Autocannon' },
        extras: [],
      },
    ],
  },
} satisfies Record<string, UnitTypeDef>;

export const vehicleOptions = {
  'Nomad Bike': [
    vehicleVeteranSkill,
    {
      id: 'nomad_forward_slot',
      name: 'Forward',
      type: 'slot',
      slotName: 'forward',
      choices: [
        { id: 'nomad_none', name: 'None' },
        { id: 'nomad_lmg', name: 'Light Machine Gun' },
      ],
    },
  ],
  Scouter: [vehicleVeteranSkill],
  Lancer: [
    vehicleVeteranSkill,
    {
      id: 'lancer_forward_slot',
      name: 'Forward',
      type: 'slot',
      slotName: 'forward',
      choices: [
        { id: 'lancer_plasma', name: 'Plasma Rifle' },
        { id: 'lancer_fury', name: 'Fury Rifle' },
      ],
    },
  ],
  'Frontier Trike': [vehicleVeteranSkill],
  'Raider Trike': [
    vehicleVeteranSkill,
    {
      id: 'raider_forward_side_slot',
      name: 'Forward/Side',
      type: 'slot',
      slotName: 'Forward/Side',
      choices: [
        { id: 'raider_lmg', name: 'Light Machine Gun' },
        { id: 'raider_fury', name: 'Fury Rifle' },
      ],
    },
  ],
  'Armored Car': [vehicleVeteranSkill],
  APC: [vehicleVeteranSkill],
  'APC - Grav': [vehicleVeteranSkill],
  IFV: ifvOptions,
  'IFV - Grav': ifvOptions,
  'Light Tank': lightTankOptions,
  'Light Tank - Grav': lightTankOptions,
  'Medium Tank': mediumTankOptions,
  'Medium Tank - Grav': mediumTankOptions,
  'Heavy Tank': [
    vehicleVeteranSkill,
    {
      id: 'heavy_tank_front_slot',
      name: 'Front Weapon',
      type: 'slot',
      slotName: 'front',
      choices: [
        { id: 'heavy_front_lmg', name: 'Light Machine Gun' },
        { id: 'heavy_front_plasma', name: 'Heavy Plasma Gun' },
      ],
    },
    {
      id: 'heavy_tank_coax_slot',
      name: 'Coaxial Weapon',
      type: 'slot',
      slotName: 'coaxial',
      choices: [
        { id: 'heavy_coax_lmg', name: 'Light Machine Gun' },
        { id: 'heavy_coax_plasma', name: 'Heavy Plasma Gun' },
      ],
    },
  ],
  'Light Walker': [
    vehicleVeteranSkill,
    {
      id: 'walker_arm2_slot',
      name: 'Arm 2 Weapon',
      type: 'slot',
      slotName: 'arm2',
      choices: [
        { id: 'walker_flame', name: 'Flame Projector' },
        { id: 'walker_fusion', name: 'Fusion Rifle' },
      ],
    },
  ],
  'Heavy Walker': [vehicleVeteranSkill],
  'CIM-L': [
    vehicleVeteranSkill,
    {
      id: 'ciml_weapon_slot',
      name: 'Weapon',
      type: 'slot',
      slotName: 'weapon',
      choices: [
        { id: 'ciml_hyper', name: 'Hyper Blaster' },
        { id: 'ciml_fury', name: 'Fury Rifle' },
      ],
    },
  ],
  'CIM-APP': [],
} satisfies Record<string, UnitOptionDef[]>;
