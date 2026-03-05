import type { EquipmentName } from './data/equipment'
import type { UnitType } from './data/units'
import type { Lifeform } from './data/lifeforms'
export type { UnitType };

export type ModelClass = 'Civilian' | 'Soldier' | 'Minor Character' | 'Major Character' | 'Epic Character' | 'Vehicle';

export interface ModelStats {
    points: number;
    speed: number;
    reaction: number;
    combatSkill: number;
    toughness: number;
    killPoints: number;
    savvy: number;
    training: number;
    crew?: number;
    capacity?: number;
}

export interface Model {
    id: string;
    name: string;
    lifeform: Lifeform;
    class: ModelClass;
    basePoints?: number;                  // if provided, overrides lifeformStats points
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
    minimized?: boolean;
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
        setBasePoints?: number;                  // override the model's base points
    }[];
}

export interface Army {
    id: string;
    name: string;
    units: Unit[];
    freeEdit: boolean;
    defaultLifeform: Lifeform;
}

export interface AppState {
    armies: Army[];
    currentArmyId: string | null;
    selectedUnitId: string | null;
}
