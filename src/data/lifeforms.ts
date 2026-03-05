import type { ModelClass } from '../types'

const _lifeformClassPoints: Record<string, Record<ModelClass, number>> = {
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
    'Hulker': {
        'Civilian': NaN,  // There are no Hulker civilians
        'Soldier': 15,
        'Minor Character': 20,
        'Major Character': 25,
        'Epic Character': 40,
        'Vehicle': NaN
    },
    'Erekish (Precursor)': {
        'Civilian': 6,
        'Soldier': 12,
        'Minor Character': 18,
        'Major Character': 25,
        'Epic Character': 35,
        'Vehicle': NaN
    },
    "K'Erin": {
        'Civilian': 6,
        'Soldier': 13,
        'Minor Character': 20,
        'Major Character': 25,
        'Epic Character': 35,
        'Vehicle': NaN
    },
    // Soulless only have one profile; this is a bit of a hack.
    'Soulless': {
        'Civilian': 20,
        'Soldier': 20,
        'Minor Character': 20,
        'Major Character': 20,
        'Epic Character': 20,
        'Vehicle': NaN
    },
    'Converted': {
        'Civilian': 10,
        'Soldier': 15,
        'Minor Character': 20,
        'Major Character': 25,
        'Epic Character': 35,
        'Vehicle': NaN
    },
    'Horde': {
        'Civilian': 6,
        'Soldier': 10,
        'Minor Character': 15,
        'Major Character': 20,
        'Epic Character': 30,
        'Vehicle': NaN
    },
    'Serian (Engineer)': {
        'Civilian': 7,
        'Soldier': 11,
        'Minor Character': 16,
        'Major Character': 22,
        'Epic Character': 32,
        'Vehicle': NaN
    },
    'Swift': {
        'Civilian': 6,
        'Soldier': 12,
        'Minor Character': 17,
        'Major Character': 22,
        'Epic Character': 32,
        'Vehicle': NaN
    },
    'Keltrin (Skulker)': {
        'Civilian': 6,
        'Soldier': 12,
        'Minor Character': 17,
        'Major Character': 22,
        'Epic Character': 32,
        'Vehicle': NaN
    },
    'Hakshan': {
        'Civilian': 5,
        'Soldier': 10,
        'Minor Character': 15,
        'Major Character': 20,
        'Epic Character': 30,
        'Vehicle': NaN
    },
    'Clones': {
        'Civilian': 8,
        'Soldier': 15,
        'Minor Character': 20,
        'Major Character': 30,
        'Epic Character': 40,
        'Vehicle': NaN
    },
    'Ystrik (Manipulator)': {
        'Civilian': 5,
        'Soldier': 8,
        'Minor Character': 13,
        'Major Character': 18,
        'Epic Character': 27,
        'Vehicle': NaN
    },
    'Krag (Dwarf)': {
        'Civilian': 5,
        'Soldier': 10,
        'Minor Character': 15,
        'Major Character': 20,
        'Epic Character': 30,
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

export type Lifeform = keyof typeof _lifeformClassPoints;

export const lifeformClassPoints: Record<Lifeform, Record<ModelClass, number>> = _lifeformClassPoints;

export const lifeforms = Object.keys(_lifeformClassPoints) as Lifeform[];
