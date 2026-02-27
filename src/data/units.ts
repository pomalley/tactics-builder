import type { ModelClass, UnitOptionDef } from '../types'
import type { EquipmentName } from './equipment'

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
        slots: { squad_veteran_skill: 'None' },
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Military Rifle', veteran_skills: 'None' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Frag Grenade'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { support: 'Light Machine Gun' }, extras: ['Frag Grenade'] }
        ]
    },
    'Recon': {
        slots: { squad_veteran_skill: 'None' },
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Military Rifle', veteran_skills: 'None' }, extras: ['Observation +1'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Observation +1'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Observation +1'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: ['Observation +1'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { support: 'Precision Rifle' }, extras: ['Observation +1'] }
        ]
    },
    'Storm': {
        slots: { squad_veteran_skill: 'None' },
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Shotgun', sgt_melee: 'Blade', veteran_skills: 'None' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Breaching Axe' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Blade' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Blade' }, extras: ['Frag Grenade', 'Fog Grenade'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Shotgun', melee: 'Blade' }, extras: ['Frag Grenade', 'Fog Grenade'] }
        ]
    },
    'Weapon Team': {
        slots: { crewed_weapon: 'Laser Cannon', veteran_skill: 'None' },
        models: [
            { name: 'Gunner', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Morale +1'] },
            { name: 'Loader 1', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Morale +1'] },
            { name: 'Loader 2', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: ['Morale +1'] }
        ]
    },
    'Minor Character': {
        models: [
            { name: 'Character', class: 'Minor Character', slots: { sidearm: 'Hand Laser', melee: 'Glare Sword', veteran_skill: 'None' }, extras: ['Fog Grenade'] }
        ]
    },
    'Major Character': {
        models: [
            { name: 'Character', class: 'Major Character', slots: { sidearm: 'Hand Laser', melee: 'Glare Sword', veteran_skill: 'None' }, extras: ['Fog Grenade'] }
        ]
    },
    'Epic Character': {
        models: [
            { name: 'Character', class: 'Epic Character', slots: { sidearm: 'Hand Laser', melee: 'Glare Sword', veteran_skill: 'None' }, extras: ['Fog Grenade'] }
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
        slots: { squad_veteran_skill: 'None' },
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Shotgun', veteran_skills: 'None' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Shotgun' }, extras: ['Shock Grenade'] },
        ]
    },
    'Militia': {
        slots: { squad_veteran_skill: 'None' },
        models: [
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
            { name: 'Trooper 5', class: 'Soldier', slots: { rifle: 'Military Rifle' }, extras: [] },
        ]
    },
    'Pirate': {
        slots: { squad_veteran_skill: 'None' },
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Blaster', veteran_skills: 'None' }, extras: [] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Blaster' }, extras: [] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Blaster' }, extras: [] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Blaster' }, extras: [] },
            { name: 'Trooper 4', class: 'Soldier', slots: { support: 'Fusion Rifle' }, extras: [] },
        ]
    },
    'Cavalry': {
        slots: { squad_veteran_skill: 'None' },
        models: [
            { name: 'Sergeant', class: 'Minor Character', slots: { rifle: 'Military Rifle', melee: 'Blade', veteran_skills: 'None' }, extras: ['Cavalry'] },
            { name: 'Trooper 1', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
            { name: 'Trooper 2', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
            { name: 'Trooper 3', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
            { name: 'Trooper 4', class: 'Soldier', slots: { rifle: 'Military Rifle', melee: 'Blade' }, extras: ['Cavalry'] },
        ]
    },
    'Nomad Bike': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Nomad Bike', class: 'Vehicle', basePoints: 15, slots: { forward: 'None' }, extras: [] }
        ]
    },
    'Scouter': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Scouter', class: 'Vehicle', basePoints: 25, slots: { forward: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'Lancer': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Lancer', class: 'Vehicle', basePoints: 22, slots: { forward: 'Plasma Rifle' }, extras: [] }
        ]
    },
    'Frontier Trike': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Frontier Trike', class: 'Vehicle', basePoints: 25, slots: { 'Forward/Side': 'Light Machine Gun' }, extras: [] }
        ]
    },
    'Raider Trike': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Raider Trike', class: 'Vehicle', basePoints: 25, slots: { 'Forward/Side': 'Light Machine Gun' }, extras: [] }
        ]
    },
    'Armored Car': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Armored Car', class: 'Vehicle', basePoints: 40, slots: { turret: '20mm Autocannon' }, extras: [] }
        ]
    },
    'APC': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'APC', class: 'Vehicle', basePoints: 40, slots: { turret: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'APC - Grav': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'APC - Grav', class: 'Vehicle', basePoints: 45, slots: { turret: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'IFV': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'IFV', class: 'Vehicle', basePoints: 40, slots: { front: 'Light Machine Gun', turret: '20mm Autocannon' }, extras: [] }
        ]
    },
    'IFV - Grav': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'IFV - Grav', class: 'Vehicle', basePoints: 45, slots: { front: 'Light Machine Gun', turret: '20mm Autocannon' }, extras: [] }
        ]
    },
    'Light Tank': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Light Tank', class: 'Vehicle', basePoints: 55, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '40mm Autocannon' }, extras: [] }
        ]
    },
    'Light Tank - Grav': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Light Tank - Grav', class: 'Vehicle', basePoints: 70, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '40mm Autocannon' }, extras: [] }
        ]
    },
    'Medium Tank': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Medium Tank', class: 'Vehicle', basePoints: 65, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '100mm Cannon' }, extras: [] }
        ]
    },
    'Medium Tank - Grav': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Medium Tank - Grav', class: 'Vehicle', basePoints: 75, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '100mm Cannon' }, extras: [] }
        ]
    },
    'Heavy Tank': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Heavy Tank', class: 'Vehicle', basePoints: 125, slots: { front: 'Light Machine Gun', coaxial: 'Light Machine Gun', turret: '100mm Cannon' }, extras: [] }
        ]
    },
    'Light Walker': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Light Walker', class: 'Vehicle', basePoints: 44, slots: { arm1: '20mm Autocannon', arm2: 'Flame Projector' }, extras: [] }
        ]
    },
    'Heavy Walker': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'Heavy Walker', class: 'Vehicle', basePoints: 55, slots: { shoulder: 'Pulse Laser', arm: 'Light Machine Gun' }, extras: [] }
        ]
    },
    'CIM-L': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'CIM-L', class: 'Vehicle', basePoints: 21, slots: { weapon: 'Hyper Blaster' }, extras: [] }
        ]
    },
    'CIM-APP': {
        slots: { veteran_skill: 'None' },
        models: [
            { name: 'CIM-APP', class: 'Vehicle', basePoints: 25, slots: { weapon: '20mm Autocannon' }, extras: [] }
        ]
    }
} satisfies Record<string, UnitTypeDef>;

export type UnitType = keyof typeof _unitDefinitions;

export const unitDefinitions: Record<UnitType, UnitTypeDef> = _unitDefinitions;

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

const squadVeteranSkills: UnitOptionDef = {
    id: 'squad_veteran_skill',
    name: 'Squad Veteran Skill',
    type: 'slot',
    slotName: 'squad_veteran_skill',
    choices: [
        { id: 'squad_veteran_skill_none', name: 'None' },
        { id: 'squad_veteran_skill_brave', name: 'Brave' },
        { id: 'squad_veteran_skill_tank_hunters', name: 'Tank Hunters' },
        { id: 'squad_veteran_skill_keen_shots', name: 'Keen Shots' },
        { id: 'squad_veteran_skill_die_hards', name: 'Die Hards' },
        { id: 'squad_veteran_skill_fire_drill', name: 'Fire Drill' },
        { id: 'squad_veteran_skill_brawers', name: 'Brawers' },
        { id: 'squad_veteran_skill_fearless', name: 'Fearless' },
        { id: 'squad_veteran_skill_bombers', name: 'Bombers' },
        { id: 'squad_veteran_skill_guerillas', name: 'Guerillas' },
        { id: 'squad_veteran_skill_quick', name: 'Quick' }
    ]
}

const sergeantVeteranSkills: UnitOptionDef = {
    id: 'sergeant_veteran_skill',
    name: 'Sergeant Veteran Skill',
    type: 'slot',
    slotName: 'veteran_skills',
    choices: [
        { id: 'sergeant_veteran_skill_none', name: 'None' },
        { id: 'sergeant_veteran_skill_rugged', name: 'Rugged' },
        { id: 'sergeant_veteran_skill_parry', name: 'Parry' },
        { id: 'sergeant_veteran_skill_motivator', name: 'Motivator' },
        { id: 'sergeant_veteran_skill_fighter', name: 'Fighter' },
        { id: 'sergeant_veteran_skill_survivor', name: 'Survivor' },
        { id: 'sergeant_veteran_skill_tactics', name: 'Tactics' },
        { id: 'sergeant_veteran_skill_experienced_eye', name: 'Experienced Eye' },
        { id: 'sergeant_veteran_skill_alert', name: 'Alert' }
    ]
}

const characterVeteranSkills: UnitOptionDef = {
    id: 'character_veteran_skill',
    name: 'Veteran Skill',
    type: 'slot',
    slotName: 'veteran_skill',
    choices: [
        { id: 'character_veteran_skill_none', name: 'None' },
        { id: 'character_veteran_skill_gun_slinging', name: 'Gun-slinging' },
        { id: 'character_veteran_skill_quick_feet', name: 'Quick Feet' },
        { id: 'character_veteran_skill_deadly_accuracy', name: 'Deadly Accuracy' },
        { id: 'character_veteran_skill_lucky', name: 'Lucky' },
        { id: 'character_veteran_skill_skilled_leader', name: 'Skilled Leader' },
        { id: 'character_veteran_skill_expert_fighter', name: 'Expert Fighter' }
    ]
}

const gunCrewVeteranSkill: UnitOptionDef = {
    id: 'gun_crew_veteran_skill',
    name: 'Gun Crew Veteran Skill',
    type: 'slot',
    slotName: 'veteran_skill',
    choices: [
        { id: 'gun_crew_veteran_skill_none', name: 'None' },
        { id: 'gun_crew_veteran_skill_defend', name: 'Defend the Guns' },
        { id: 'gun_crew_veteran_skill_fortified', name: 'Fortified Positions' },
        { id: 'gun_crew_veteran_skill_hidden', name: 'Deploy Hidden' },
        { id: 'gun_crew_veteran_skill_drill', name: 'Gun Drill' },
        { id: 'gun_crew_veteran_skill_redeploy', name: 'Redeployment' },
        { id: 'gun_crew_veteran_skill_target', name: 'Target Selection' }
    ]
}

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
        { id: 'vehicle_veteran_skill_defensive', name: 'Defensive Measures' }
    ]
}

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
    characterVeteranSkills,
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
    vehicleVeteranSkill,
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
    vehicleVeteranSkill,
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
    vehicleVeteranSkill,
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
        squadVeteranSkills,
        sergeantVeteranSkills,
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
        squadVeteranSkills,
        sergeantVeteranSkills,
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
        squadVeteranSkills,
        sergeantVeteranSkills,
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
        gunCrewVeteranSkill,
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
        squadVeteranSkills,
        sergeantVeteranSkills,
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
        squadVeteranSkills,
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
        squadVeteranSkills,
        sergeantVeteranSkills,
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
    'Cavalry': [armorOptions, squadVeteranSkills, sergeantVeteranSkills],
    'Nomad Bike': [
        vehicleVeteranSkill,
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
    'Scouter': [vehicleVeteranSkill],
    'Lancer': [
        vehicleVeteranSkill,
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
                { id: 'raider_fury', name: 'Fury Rifle' }
            ]
        }
    ],
    'Armored Car': [vehicleVeteranSkill],
    'APC': [vehicleVeteranSkill],
    'APC - Grav': [vehicleVeteranSkill],
    'IFV': ifvOptions,
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
        vehicleVeteranSkill,
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
                { id: 'ciml_fury', name: 'Fury Rifle' }
            ]
        }
    ],
    'CIM-APP': []
}
