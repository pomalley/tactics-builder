import type { UnitOptionDef, UnitTypeDef } from '../types'
import { vehicleDefinitions, vehicleOptions } from './vehicles'

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
        extras: ['Morale +1 (Weapon Team)'],
        models: [
            { name: 'Gunner', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: [] },
            { name: 'Loader 1', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: [] },
            { name: 'Loader 2', class: 'Soldier', slots: { sidearm: 'Service Pistol' }, extras: [] }
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
    ...vehicleDefinitions
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
    ...vehicleOptions
}

type UnitGroupLabel =
  | "Squads"
  | "Individuals"
  | "Specialists"
  | "Alternate Squad Types"
  | "Vehicles";

const unitTypeToGroup: Record<UnitType, UnitGroupLabel> = {
  Infantry: "Squads",
  Recon: "Squads",
  Storm: "Squads",
  "Weapon Team": "Squads",
  "Minor Character": "Individuals",
  "Major Character": "Individuals",
  "Epic Character": "Individuals",
  Tech: "Specialists",
  Sharpshooter: "Specialists",
  "Fire Section": "Specialists",
  Comms: "Specialists",
  Medic: "Specialists",
  Scout: "Specialists",
  Enforcers: "Alternate Squad Types",
  Militia: "Alternate Squad Types",
  Pirate: "Alternate Squad Types",
  Cavalry: "Alternate Squad Types",
  "Nomad Bike": "Vehicles",
  Scouter: "Vehicles",
  Lancer: "Vehicles",
  "Frontier Trike": "Vehicles",
  "Raider Trike": "Vehicles",
  "Armored Car": "Vehicles",
  APC: "Vehicles",
  "APC - Grav": "Vehicles",
  IFV: "Vehicles",
  "IFV - Grav": "Vehicles",
  "Light Tank": "Vehicles",
  "Light Tank - Grav": "Vehicles",
  "Medium Tank": "Vehicles",
  "Medium Tank - Grav": "Vehicles",
  "Heavy Tank": "Vehicles",
  "Light Walker": "Vehicles",
  "Heavy Walker": "Vehicles",
  "CIM-L": "Vehicles",
  "CIM-APP": "Vehicles",
};

export const unitGroups = (
  [
    "Squads",
    "Individuals",
    "Specialists",
    "Alternate Squad Types",
    "Vehicles",
  ] as UnitGroupLabel[]
).map((label) => ({
  label,
  types: (Object.keys(unitDefinitions) as UnitType[]).filter((type) => unitTypeToGroup[type] === label),
}));
