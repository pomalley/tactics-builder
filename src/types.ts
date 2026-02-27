import type { EquipmentName } from './data'

export type Lifeform = 'Human' | 'Feral' | 'K\'Erin';
// TODO: Refactor UnitType to be dynamically generated from Object.keys(unitDefinitions)
export type UnitType = 'Infantry' | 'Recon' | 'Storm' | 'Weapon Team' | 'Minor Character' | 'Major Character' | 'Epic Character' | 'Tech' | 'Sharpshooter' | 'Fire Section' | 'Comms' | 'Medic' | 'Scout' | 'Enforcers' | 'Militia' | 'Pirate' | 'Cavalry';
export type ModelClass = 'Civilian' | 'Soldier' | 'Minor Character' | 'Major Character' | 'Epic Character';

export interface Model {
    id: string;
    name: string;
    lifeform: Lifeform;
    class: ModelClass;
    slots: Record<string, EquipmentName>; // named weapon slots, e.g. { rifle: 'Military Rifle', support: 'Light Machine Gun' }
    extras: EquipmentName[];              // non-swappable items: grenades, blades, etc.
}

export interface Unit {
    id: string;
    name: string;
    type: UnitType;
    lifeform: Lifeform;
    selectedOptions: string[];
    models: Model[];
    slots: Record<string, EquipmentName>;
    extras: EquipmentName[];
}

export interface UnitOptionDef {
    id: string;
    name: string;
    type?: 'toggle' | 'slot'; // default: 'toggle'
    slotName?: string;        // for type='slot': which slot this controls
    choices?: UnitOptionDef[];
    modifications?: {
        targetName?: string;
        targetClass?: ModelClass;
        clearSlot?: string;             // remove this slot from the model entirely
        setSlot?: Record<string, EquipmentName>; // override a slot value, e.g. { rifle: 'Shotgun' }
        clearUnitSlot?: string;                  // remove this slot from the unit entirely
        setUnitSlot?: Record<string, EquipmentName>; // override a unit-level slot value
        addExtras?: EquipmentName[];             // push items onto the model's extras
        addUnitExtras?: EquipmentName[];         // push items onto the unit's extras
    }[];
}

export interface Army {
    name: string;
    units: Unit[];
}
