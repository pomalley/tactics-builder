import type { Lifeform, ModelClass, UnitOptionDef } from './types'

export const weaponPoints = {
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
    // Upgrades
    'Hero': 5,
    'Leader': 10,
    // Abilities
    'Observation +1': 1,
    'Morale +1': 0,
    'Tech +1 (hacking, repairs, etc.)': 4,
    'Sharpshooter +1 Hit': 4,
    'Morale +1 (Fire Section)': 5,
    'Comms +1': 9,
    'Medic (Remove 1 suppression)': 9,
    'Scout +1" Spd, +2 Obs': 6,
    'Cavalry': 1,
    // Armor
    'None': 0,
    'Powered Armor': 2,
    'Breach Armor': 4
} as const;

export type EquipmentName = keyof typeof weaponPoints;

export interface ModelDef {
    name: string;
    class: ModelClass;
    basePoints?: number;
    slots: Partial<Record<string, EquipmentName>>;
    extras: EquipmentName[];
}

export interface UnitTypeDef {
    slots?: Partial<Record<string, EquipmentName>>;
    extras?: EquipmentName[];
    models: ModelDef[];
}

const _unitDefinitions = {
    'Infantry': {
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Military Rifle' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { support: 'Light Machine Gun' }, extras: ['Frag Grenade'] }
        ]
    },
    'Recon': {
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Military Rifle' }, extras: ['Observation +1'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Observation +1'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Observation +1'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Observation +1'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { support: 'Precision Rifle' }, extras: ['Observation +1'] }
        ]
    },
    'Storm': {
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Shotgun', sgt_melee: 'Blade' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Breaching Axe' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Blade' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Blade' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Blade' }, extras: ['Frag Grenade', 'Fog Grenade'] }
        ]
    },
    'Weapon Team': {
        slots: { crewed_weapon: 'Laser Cannon' },
        models: [
            { name: 'Gunner', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Morale +1'] },
            { name: 'Loader 1', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Morale +1'] },
            { name: 'Loader 2', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Morale +1'] }
        ]
    },
    'Minor Character': {
        models: [
            { name: 'Character', class: 'Minor Character', slots: { sidearm: 'Hand Laser', melee: 'Glare Sword' }, extras: ['Fog Grenade'] }
        ]
    },
    'Major Character': {
        models: [
            { name: 'Character', class: 'Major Character', slots: { sidearm: 'Hand Laser', melee: 'Glare Sword' }, extras: ['Fog Grenade'] }
        ]
    },
    'Epic Character': {
        models: [
            { name: 'Character', class: 'Epic Character', slots: { sidearm: 'Hand Laser', melee: 'Glare Sword' }, extras: ['Fog Grenade'] }
        ]
    },
    'Tech': {
        models: [
            { name: 'Tech', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Tech +1 (hacking, repairs, etc.)'] }
        ]
    },
    'Sharpshooter': {
        models: [
            { name: 'Sharpshooter', class: 'Soldier', slots: { rifle: 'Sniper Rifle', sidearm: 'Service Pistol' }, extras: ['Sharpshooter +1 Hit'] }
        ]
    },
    'Fire Section': {
        extras: ['Morale +1 (Fire Section)'],
        models: [
            { name: 'Grenadier', class: 'Soldier', slots: { rifle: 'Plasma Rifle', sidearm: 'Service Pistol' }, extras: [] },
            { name: 'Support', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: [] }
        ]
    },
    'Comms': {
        models: [
            { name: 'Comms', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Comms +1'] }
        ]
    },
    'Medic': {
        models: [
            { name: 'Medic', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Medic (Remove 1 suppression)'] }
        ]
    },
    'Scout': {
        models: [
            { name: 'Scout', class: 'Soldier', slots: { rifle: 'Infantry Laser' }, extras: ['Scout +1" Spd, +2 Obs'] }
        ]
    },
    'Enforcers': {
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
        ]
    },
    'Militia': {
        models: [
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 5', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
        ]
    },
    'Pirate': {
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Blaster' }, extras: [] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Blaster' }, extras: [] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Blaster' }, extras: [] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Blaster' }, extras: [] },
            { name: 'Trooper 4', class: 'Soldier', slots: { support: 'Fusion Rifle' }, extras: [] },
        ]
    },
    'Cavalry': {
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
        ]
    },
    'Nomad Bike': {
        models: [
            { name: 'Nomad Bike', class: 'Vehicle', basePoints: 15, slots: { forward: 'None' }, extras: [] }
        ]
    },
    'Scouter': {
        models: [
            { name: 'Scouter', class: 'Vehicle', basePoints: 25, slots: { forward: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'Lancer': {
        models: [
            { name: 'Lancer', class: 'Vehicle', basePoints: 22, slots: { forward: 'Plasma Rifle' }, extras: [] }
        ]
    },
    'Frontier Trike': {
        models: [
            { name: 'Frontier Trike', class: 'Vehicle', basePoints: 25, slots: { 'Forward/Side': 'Light Machine Gun' }, extras: [] }
        ]
    },
    'Raider Trike': {
        models: [
            { name: 'Raider Trike', class: 'Vehicle', basePoints: 25, slots: { 'Forward/Side': 'Light Machine Gun' }, extras: [] }
        ]
    },
    'Armored Car': {
        models: [
            { name: 'Armored Car', class: 'Vehicle', basePoints: 40, slots: { turret: '20mm Autocannon' }, extras: [] }
        ]
    },
    'APC': {
        models: [
            { name: 'APC', class: 'Vehicle', basePoints: 40, slots: { turret: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'APC - Grav': {
        models: [
            { name: 'APC - Grav', class: 'Vehicle', basePoints: 45, slots: { turret: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'IFV': {
        models: [
            { name: 'IFV', class: 'Vehicle', basePoints: 40, slots: { front: 'Light Machine Gun', turret: '20mm Autocannon' }, extras: [] }
        ]
    },
    'IFV - Grav': {
        models: [
            { name: 'IFV - Grav', class: 'Vehicle', basePoints: 45, slots: { front: 'Light Machine Gun', turret: '20mm Autocannon' }, extras: [] }
        ]
    },
    'Light Tank': {
        models: [
            { name: 'Light Tank', class: 'Vehicle', basePoints: 55, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '40mm Autocannon' }, extras: [] }
        ]
    },
    'Light Tank - Grav': {
        models: [
            { name: 'Light Tank - Grav', class: 'Vehicle', basePoints: 70, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '40mm Autocannon' }, extras: [] }
        ]
    },
    'Medium Tank': {
        models: [
            { name: 'Medium Tank', class: 'Vehicle', basePoints: 65, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '100mm Cannon' }, extras: [] }
        ]
    },
    'Medium Tank - Grav': {
        models: [
            { name: 'Medium Tank - Grav', class: 'Vehicle', basePoints: 75, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '100mm Cannon' }, extras: [] }
        ]
    },
    'Heavy Tank': {
        models: [
            { name: 'Heavy Tank', class: 'Vehicle', basePoints: 125, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '100mm Cannon' }, extras: [] }
        ]
    },
    'Light Walker': {
        models: [
            { name: 'Light Walker', class: 'Vehicle', basePoints: 44, slots: { arm1: '20mm Autocannon', arm2: 'Flame Projector' }, extras: [] }
        ]
    },
    'Heavy Walker': {
        models: [
            { name: 'Heavy Walker', class: 'Vehicle', basePoints: 55, slots: { shoulder: 'Pulse Laser', arm: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'CIM-L': {
        models: [
            { name: 'CIM-L', class: 'Vehicle', basePoints: 21, slots: { weapon: 'Hyper Blaster' }, extras: [] }
        ]
    },
    'CIM-APP': {
        models: [
            { name: 'CIM-APP', class: 'Vehicle', basePoints: 25, slots: { weapon: '20mm Autocannon' }, extras: [] }
        ]
    }
} satisfies Record<string, UnitTypeDef>;

export type UnitType = keyof typeof _unitDefinitions;

export const unitDefinitions: Record<UnitType, UnitTypeDef> = _unitDefinitions;

export const lifeformClassPoints: Record<Lifeform, Record<ModelClass, number>> = {
    'Human': {
        'Civilian': 5,
        'Soldier': 10,
        'Minor Character': 15,
        'Major Character': 20,
        'Epic Character': 30,
        'Vehicle': NaN
    },
    'Feral': {
        'Civilian': 6,
        'Soldier': 12,
        'Minor Character': 17,
        'Major Character': 22,
        'Epic Character': 32,
        'Vehicle': NaN
    },
    'K\'Erin': {
        'Civilian': 6,
        'Soldier': 13,
        'Minor Character': 20,
        'Major Character': 25,
        'Epic Character': 35,
        'Vehicle': NaN
    },
    'None': {
        'Civilian': 0,
        'Soldier': 0,
        'Minor Character': 0,
        'Major Character': 0,
        'Epic Character': 0,
        'Vehicle': 0
    }
}

const techOptions: UnitOptionDef[] = [
    {
        id: 'tech_sidearm_swap',
        name: 'Pistol Swap',
        type: 'slot',
        slotName: 'sidearm',
        choices: [
            { id: 'tech_pistol', name: 'Service Pistol' },
            { id: 'tech_laser', name: 'Hand Laser' }
        ]
    },
    {
        id: 'tech_jinx',
        name: 'Jinx Grenades',
        modifications: [{ addExtras: ['Jinx Grenade'] }]
    }
]

const fireSectionOptions: UnitOptionDef[] = [
    {
        id: 'firesection_rifle_swap',
        name: 'Weapon',
        type: 'slot',
        slotName: 'rifle',
        choices: [
            { id: 'fs_plasma', name: 'Plasma Rifle' },
            { id: 'fs_lmg', name: 'Light Machine Gun' },
            { id: 'fs_grenade', name: 'Grenade Launcher', modifications: [{ targetName: 'Grenadier', addExtras: ['Frag Grenade', 'Fog Grenade'] }] },
            { id: 'fs_fury', name: 'Fury Rifle' },
            { id: 'fs_hyper', name: 'Hyper Blaster' }
        ]
    }
]

const armorOptions: UnitOptionDef = {
    id: 'armor_selection',
    name: 'Armor',
    choices: [
        { id: 'armor_powered', name: 'Powered Armor', modifications: [{ setSlot: { armor: 'Powered Armor' } }] },
        { id: 'armor_breach', name: 'Breach Armor', modifications: [{ setSlot: { armor: 'Breach Armor' } }] },
    ]
}

const characterOptions: UnitOptionDef[] = [
    armorOptions,
    {
        id: 'char_sidearm',
        name: 'Sidearm',
        type: 'slot',
        slotName: 'sidearm',
        choices: [
            { id: 'char_sidearm_laser', name: 'Hand Laser' },
            { id: 'char_sidearm_blast', name: 'Blast Pistol' }
        ]
    },
    {
        id: 'char_melee',
        name: 'Melee',
        type: 'slot',
        slotName: 'melee',
        choices: [
            { id: 'char_melee_glare', name: 'Glare Sword' },
            { id: 'char_melee_ripper', name: 'Ripper Sword' },
            { id: 'char_melee_powered', name: 'Powered Claw' }
        ]
    },
    {
        id: 'char_rifle_swap',
        name: 'Swap Sidearm & Melee for Infantry Laser',
        modifications: [
            {
                clearSlot: 'sidearm',
                setSlot: { rifle: 'Infantry Laser' }
            },
            {
                clearSlot: 'melee'
            }
        ]
    },
    {
        id: 'char_hero',
        name: 'Hero',
        modifications: [{ addExtras: ['Hero'] }]
    },
    {
        id: 'char_leader',
        name: 'Leader',
        modifications: [{ addExtras: ['Leader'] }]
    },
    {
        id: 'char_frag',
        name: 'Frag Grenade',
        modifications: [{ addExtras: ['Frag Grenade'] }]
    },
    {
        id: 'char_jinx',
        name: 'Jinx Grenade',
        modifications: [{ addExtras: ['Jinx Grenade'] }]
    },
    {
        id: 'char_cling',
        name: 'Cling-fire Grenade',
        modifications: [{ addExtras: ['Cling-fire Grenade'] }]
    },
    {
        id: 'char_shock',
        name: 'Shock Grenade',
        modifications: [{ addExtras: ['Shock Grenade'] }]
    }
]

const mediumTankOptions: UnitOptionDef[] = [
    {
        id: 'medium_tank_coax_slot',
        name: 'Coaxial',
        type: 'slot',
        slotName: 'coaxial',
        choices: [
            { id: 'medium_tank_lmg', name: 'Light Machine Gun' },
            { id: 'medium_tank_heavy_plasma', name: 'Heavy Plasma Gun' }
        ]
    },
    {
        id: 'medium_tank_turret_slot',
        name: 'Turret',
        type: 'slot',
        slotName: 'turret',
        choices: [
            { id: 'medium_tank_100mm', name: '100mm Cannon' },
            { id: 'medium_tank_at_laser', name: 'Anti-tank Laser' }
        ]
    }
]

const lightTankOptions: UnitOptionDef[] = [
    {
        id: 'light_tank_turret_slot',
        name: 'Turret',
        type: 'slot',
        slotName: 'turret',
        choices: [
            { id: 'light_tank_40mm', name: '40mm Autocannon' },
            { id: 'light_tank_pulse', name: 'Pulse Laser' }
        ]
    }
]

const ifvOptions: UnitOptionDef[] = [
    {
        id: 'ifv_turret_slot',
        name: 'Turret',
        type: 'slot',
        slotName: 'turret',
        choices: [
            { id: 'ifv_20mm', name: '20mm Autocannon' },
            { id: 'ifv_heavy_plasma', name: 'Heavy Plasma Gun' }
        ]
    }
]

export const unitOptions: Record<UnitType, UnitOptionDef[]> = {
    'Infantry': [
        armorOptions,
        {
            id: 'infantry_rifle_slot',
            name: 'Rifle',
            type: 'slot',
            slotName: 'rifle',
            choices: [
                { id: 'rifle_military', name: 'Military Rifle' },
                { id: 'rifle_laser', name: 'Infantry Laser' }
            ]
        },
        {
            id: 'infantry_support_slot',
            name: 'Support Weapon',
            type: 'slot',
            slotName: 'support',
            choices: [
                { id: 'support_lmg', name: 'Light Machine Gun' },
                { id: 'support_hyper_blaster', name: 'Hyper Blaster' },
                { id: 'support_fury_rifle', name: 'Fury Rifle' },
                { id: 'support_grenade_launcher', name: 'Grenade Launcher', modifications: [{ targetName: 'Trooper 4', addExtras: ['Fog Grenade'] }] },
                { id: 'support_plasma_rifle', name: 'Plasma Rifle' }
            ]
        },
        {
            id: 'sergeant_shotgun',
            name: 'Sergeant takes Shotgun and Blade',
            modifications: [
                {
                    targetName: 'Sergeant',
                    setSlot: { rifle: 'Shotgun', melee: 'Blade' }
                }
            ]
        },
        {
            id: 'fog_grenades',
            name: 'Add Fog Grenades',
            modifications: [
                {
                    addExtras: ['Fog Grenade']
                }
            ]
        }
    ],
    'Recon': [
        armorOptions,
        {
            id: 'recon_rifle_slot',
            name: 'Rifle',
            type: 'slot',
            slotName: 'rifle',
            choices: [
                { id: 'recon_rifle_military', name: 'Military Rifle' },
                { id: 'recon_rifle_laser', name: 'Infantry Laser' }
            ]
        },
        {
            id: 'recon_second_precision',
            name: 'Second Precision Rifle (Trooper 3)',
            modifications: [
                {
                    targetName: 'Trooper 3',
                    clearSlot: 'rifle',
                    setSlot: { support: 'Precision Rifle' }
                }
            ]
        },
        {
            id: 'recon_service_pistol',
            name: 'Service Pistols',
            modifications: [
                { addExtras: ['Service Pistol'] }
            ]
        }
    ],
    'Storm': [
        armorOptions,
        // Primary Weapon selection
        {
            id: 'storm_rifle_slot',
            name: 'Primary Weapon',
            type: 'slot',
            slotName: 'rifle',
            choices: [
                { id: 'storm_rifle_shotgun', name: 'Shotgun' },
                { id: 'storm_rifle_blaster', name: 'Blaster' }
            ]
        },
        // Sergeant Melee Upgrade (Unique Slot)
        {
            id: 'storm_sergeant_melee',
            name: 'Sergeant Melee',
            type: 'slot',
            slotName: 'sgt_melee',
            choices: [
                { id: 'sgt_blade', name: 'Blade' },
                { id: 'sgt_glare_sword', name: 'Glare Sword' },
                { id: 'sgt_powered_claw', name: 'Powered Claw' }
            ]
        },
        // 0-2 troopers may replace their weapon with a support weapon
        {
            id: 'storm_support_1',
            name: 'Support Weapon (1st)',
            choices: [
                { id: 'storm_s1_flak', name: 'Flak Gun', modifications: [{ targetName: 'Trooper 2', setSlot: { rifle: 'Flak Gun' } }] },
                { id: 'storm_s1_flame', name: 'Flame Projector', modifications: [{ targetName: 'Trooper 2', setSlot: { rifle: 'Flame Projector' } }] },
                { id: 'storm_s1_fusion', name: 'Fusion Rifle', modifications: [{ targetName: 'Trooper 2', setSlot: { rifle: 'Fusion Rifle' } }] }
            ]
        },
        {
            id: 'storm_support_2',
            name: 'Support Weapon (2nd)',
            choices: [
                { id: 'storm_s2_flak', name: 'Flak Gun', modifications: [{ targetName: 'Trooper 3', setSlot: { rifle: 'Flak Gun' } }] },
                { id: 'storm_s2_flame', name: 'Flame Projector', modifications: [{ targetName: 'Trooper 3', setSlot: { rifle: 'Flame Projector' } }] },
                { id: 'storm_s2_fusion', name: 'Fusion Rifle', modifications: [{ targetName: 'Trooper 3', setSlot: { rifle: 'Fusion Rifle' } }] }
            ]
        },
        // Penetrator grenades for the whole squad
        {
            id: 'storm_penetrator',
            name: 'Penetrator Grenades',
            modifications: [
                { addExtras: ['Penetrator Grenade'] }
            ]
        }
    ],
    'Weapon Team': [
        armorOptions,
        {
            id: 'weapteam_crew_weapon',
            name: 'Crewed Weapon',
            type: 'slot',
            slotName: 'crewed_weapon',
            choices: [
                { id: 'wt_laser_cannon', name: 'Laser Cannon' },
                { id: 'wt_auto_cannon', name: '20mm Autocannon' },
                { id: 'wt_mortar', name: 'Infantry Mortar' }
            ]
        }
    ],
    'Minor Character': characterOptions,
    'Major Character': characterOptions,
    'Epic Character': characterOptions,
    'Tech': [armorOptions, ...techOptions],
    'Sharpshooter': [armorOptions],
    'Fire Section': [armorOptions, ...fireSectionOptions],
    'Comms': [armorOptions],
    'Medic': [armorOptions],
    'Scout': [armorOptions],
    'Enforcers': [
        armorOptions,
        {
            id: 'enforcer_sgt_maul',
            name: 'Sergeant: Suppression Maul',
            modifications: [{
                targetName: 'Sergeant',
                setSlot: { melee: 'Suppression Maul' }
            }]
        },
        {
            id: 'enforcer_support',
            name: 'Support Weapon',
            choices: [
                { id: 'enforcer_flak', name: 'Flak Gun', modifications: [{ targetName: 'Trooper 1', setSlot: { rifle: 'Flak Gun' } }] },
                { id: 'enforcer_grenade', name: 'Grenade Launcher', modifications: [{ targetName: 'Trooper 1', setSlot: { rifle: 'Grenade Launcher' } }] }
            ]
        },
    ],
    'Militia': [
        armorOptions,
        {
            id: 'militia_grenade',
            name: 'Penetrator Grenade (one soldier)',
            modifications: [
                { targetName: 'Trooper 2', addExtras: ['Penetrator Grenade'] }
            ]
        },
        {
            id: 'militia_support',
            name: 'Support Weapon',
            choices: [
                { id: 'militia_precision', name: 'Precision Rifle', modifications: [{ targetName: 'Trooper 1', setSlot: { rifle: 'Precision Rifle' } }] },
                { id: 'militia_light_machine_gun', name: 'Light Machine Gun', modifications: [{ targetName: 'Trooper 1', setSlot: { rifle: 'Light Machine Gun' } }] }
            ]
        }
    ],
    'Pirate': [
        armorOptions,
        {
            id: 'pirate_support_slot',
            name: 'Support Weapon',
            type: 'slot',
            slotName: 'support',
            choices: [
                { id: 'support_fusion', name: 'Fusion Rifle' },
                { id: 'support_lmg', name: 'Light Machine Gun' },
            ]
        },
        {
            id: 'pirate_sergeant_melee',
            name: 'Sergeant Melee',
            slotName: 'sgt_melee',
            choices: [
                { id: 'sgt_blade', name: 'Blade', modifications: [{ targetName: 'Sergeant', setSlot: { melee: 'Blade' } }] },
                { id: 'sgt_powered_claw', name: 'Ripper Sword', modifications: [{ targetName: 'Sergeant', setSlot: { melee: 'Ripper Sword' } }] }
            ]
        },
        {
            id: 'pirate_sgt_grenade',
            name: 'Sergeant Cling-Fire Grenades',
            modifications: [
                { targetName: 'Sergeant', addExtras: ['Cling-fire Grenade'] }
            ]
        },
        {
            id: 'pirate_axe_1',
            name: 'Breaching Axe (1st)',
            modifications: [
                { targetName: 'Trooper 1', setSlot: { melee: 'Breaching Axe' } }
            ]
        },
        {
            id: 'pirate_axe_2',
            name: 'Breaching Axe (2nd)',
            modifications: [
                { targetName: 'Trooper 2', setSlot: { melee: 'Breaching Axe' } }
            ]
        }
    ],
    'Cavalry': [armorOptions],
    'Nomad Bike': [
        {
            id: 'nomad_forward_slot',
            name: 'Forward',
            type: 'slot',
            slotName: 'forward',
            choices: [
                {id: 'nomad_none', name: 'None'},
                {id: 'nomad_lmg', name: 'Light Machine Gun'}
            ]
        }
    ],
    'Scouter': [],
    'Lancer': [
        {
            id: 'lancer_forward_slot',
            name: 'Forward',
            type: 'slot',
            slotName: 'forward',
            choices: [
                { id: 'lancer_plasma', name: 'Plasma Rifle' },
                { id: 'lancer_fury', name: 'Fury Rifle' }
            ]
        }
    ],
    'Frontier Trike': [],
    'Raider Trike': [
        {
            id: 'raider_forward_side_slot',
            name: 'Forward/Side',
            type: 'slot',
            slotName: 'Forward/Side',
            choices: [
                { id: 'raider_lmg', name: 'Light Machine Gun' },
                { id: 'raider_fury', name: 'Fury Rifle' }
            ]
        }
    ],
    'Armored Car': [],
    'APC': [],
    'APC - Grav': [],
    'IFV': ifvOptions,
    'IFV - Grav': ifvOptions,
    'Light Tank': lightTankOptions,
    'Light Tank - Grav': lightTankOptions,
    'Medium Tank': mediumTankOptions,
    'Medium Tank - Grav': mediumTankOptions,
    'Heavy Tank': [
        {
            id: 'heavy_tank_front_slot',
            name: 'Front Weapon',
            type: 'slot',
            slotName: 'front',
            choices: [
                { id: 'heavy_front_lmg', name: 'Light Machine Gun' },
                { id: 'heavy_front_plasma', name: 'Heavy Plasma Gun' }
            ]
        },
        {
            id: 'heavy_tank_coax_slot',
            name: 'Coaxial Weapon',
            type: 'slot',
            slotName: 'coaxial',
            choices: [
                { id: 'heavy_coax_lmg', name: 'Light Machine Gun' },
                { id: 'heavy_coax_plasma', name: 'Heavy Plasma Gun' }
            ]
        }
    ],
    'Light Walker': [
        {
            id: 'walker_arm2_slot',
            name: 'Arm 2 Weapon',
            type: 'slot',
            slotName: 'arm2',
            choices: [
                { id: 'walker_flame', name: 'Flame Projector' },
                { id: 'walker_fusion', name: 'Fusion Rifle' }
            ]
        }
    ],
    'Heavy Walker': [],
    'CIM-L': [
        {
            id: 'ciml_weapon_slot',
            name: 'Weapon',
            type: 'slot',
            slotName: 'weapon',
            choices: [
                { id: 'ciml_hyper', name: 'Hyper Blaster' },
                { id: 'ciml_fury', name: 'Fury Rifle' }
            ]
        }
    ],
    'CIM-APP': []
}
