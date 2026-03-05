import type { ModelClass, ModelStats } from '../types'

const _lifeformStats: Record<string, Record<ModelClass, ModelStats>> = {
    'Human': {
        'Civilian': {
            'points': 5,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Soldier': {
            'points': 10,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 0,
            'training': 1
        },
        'Minor Character': {
            'points': 15,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 0,
            'training': 2
        },
        'Major Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 0,
            'training': 2
        },
        'Epic Character': {
            'points': 30,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 3,
            'savvy': 1,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Feral': {
        'Civilian': {
            'points': 6,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Soldier': {
            'points': 12,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 0,
            'training': 1
        },
        'Minor Character': {
            'points': 17,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Major Character': {
            'points': 22,
            'speed': 5,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Epic Character': {
            'points': 32,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 1,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Hulker': {
        'Civilian': {
            'points': NaN,
            'speed': NaN,
            'reaction': NaN,
            'combatSkill': NaN,
            'toughness': NaN,
            'killPoints': NaN,
            'savvy': NaN,
            'training': NaN
        },
        'Soldier': {
            'points': 15,
            'speed': 5,
            'reaction': 1,
            'combatSkill': 1,
            'toughness': 5,
            'killPoints': 2,
            'savvy': 0,
            'training': 0
        },
        'Minor Character': {
            'points': 20,
            'speed': 5,
            'reaction': 1,
            'combatSkill': 1,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 0,
            'training': 0
        },
        'Major Character': {
            'points': 25,
            'speed': 5,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 0,
            'training': 0
        },
        'Epic Character': {
            'points': 40,
            'speed': 6,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 6,
            'killPoints': 4,
            'savvy': 1,
            'training': 1
        },
        'Vehicle': {
            'points': 0,
            'speed': 10,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 11,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Erekish (Precursor)': {
        'Civilian': {
            'points': 6,
            'speed': 5,
            'reaction': 2,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 1,
            'training': 0
        },
        'Soldier': {
            'points': 12,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 1,
            'training': 1
        },
        'Minor Character': {
            'points': 18,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Major Character': {
            'points': 25,
            'speed': 5,
            'reaction': 4,
            'combatSkill': 2,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Epic Character': {
            'points': 35,
            'speed': 6,
            'reaction': 4,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 3,
            'savvy': 1,
            'training': 1
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    "K'Erin": {
        'Civilian': {
            'points': 6,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Soldier': {
            'points': 13,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 0,
            'training': 1
        },
        'Minor Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Major Character': {
            'points': 25,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 5,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Epic Character': {
            'points': 35,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 1,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Soulless': {
        'Civilian': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 2,
            'training': 1
        },
        'Soldier': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 2,
            'training': 1
        },
        'Minor Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 2,
            'training': 1
        },
        'Major Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 2,
            'training': 1
        },
        'Epic Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 2,
            'training': 1
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Converted': {
        'Civilian': {
            'points': 10,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Soldier': {
            'points': 15,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Minor Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Major Character': {
            'points': 25,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 0,
            'training': 1
        },
        'Epic Character': {
            'points': 35,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 1,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Horde': {
        'Civilian': {
            'points': 6,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Soldier': {
            'points': 10,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 0,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Minor Character': {
            'points': 15,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 0,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 0,
            'training': 0
        },
        'Major Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 5,
            'killPoints': 2,
            'savvy': 0,
            'training': 0
        },
        'Epic Character': {
            'points': 30,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 1,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 1,
            'training': 1
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Serian (Engineer)': {
        'Civilian': {
            'points': 7,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 2,
            'training': 1
        },
        'Soldier': {
            'points': 11,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 2,
            'training': 1
        },
        'Minor Character': {
            'points': 16,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 2,
            'training': 1
        },
        'Major Character': {
            'points': 22,
            'speed': 4,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 2,
            'training': 1
        },
        'Epic Character': {
            'points': 32,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 3,
            'savvy': 3,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Swift': {
        'Civilian': {
            'points': 6,
            'speed': 5,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 0,
            'training': 0
        },
        'Soldier': {
            'points': 12,
            'speed': 5,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 0,
            'training': 1
        },
        'Minor Character': {
            'points': 17,
            'speed': 5,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Major Character': {
            'points': 22,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Epic Character': {
            'points': 32,
            'speed': 6,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 3,
            'savvy': 1,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 14,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Keltrin (Skulker)': {
        'Civilian': {
            'points': 6,
            'speed': 6,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 1,
            'training': 0
        },
        'Soldier': {
            'points': 12,
            'speed': 6,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 1,
            'training': 1
        },
        'Minor Character': {
            'points': 17,
            'speed': 6,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Major Character': {
            'points': 22,
            'speed': 6,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Epic Character': {
            'points': 32,
            'speed': 7,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 3,
            'savvy': 2,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Hakshan': {
        'Civilian': {
            'points': 5,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 1,
            'training': 0
        },
        'Soldier': {
            'points': 10,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 0,
            'training': 1
        },
        'Minor Character': {
            'points': 15,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Major Character': {
            'points': 20,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 0,
            'training': 2
        },
        'Epic Character': {
            'points': 30,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 3,
            'savvy': 1,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Clones': {
        'Civilian': {
            'points': 8,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 0,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 1,
            'training': 1
        },
        'Soldier': {
            'points': 15,
            'speed': 4,
            'reaction': 3,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 1,
            'training': 1
        },
        'Minor Character': {
            'points': 20,
            'speed': 4,
            'reaction': 3,
            'combatSkill': 1,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Major Character': {
            'points': 30,
            'speed': 4,
            'reaction': 4,
            'combatSkill': 2,
            'toughness': 3,
            'killPoints': 2,
            'savvy': 1,
            'training': 2
        },
        'Epic Character': {
            'points': 40,
            'speed': 5,
            'reaction': 4,
            'combatSkill': 2,
            'toughness': 4,
            'killPoints': 3,
            'savvy': 2,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Ystrik (Manipulator)': {
        'Civilian': {
            'points': 5,
            'speed': 4,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 1,
            'killPoints': 1,
            'savvy': 1,
            'training': 0
        },
        'Soldier': {
            'points': 8,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 1,
            'killPoints': 1,
            'savvy': 1,
            'training': 1
        },
        'Minor Character': {
            'points': 13,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 2,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Major Character': {
            'points': 18,
            'speed': 4,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 2,
            'killPoints': 2,
            'savvy': 1,
            'training': 1
        },
        'Epic Character': {
            'points': 27,
            'speed': 5,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 3,
            'killPoints': 3,
            'savvy': 2,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'Krag (Dwarf)': {
        'Civilian': {
            'points': 5,
            'speed': 3,
            'reaction': 1,
            'combatSkill': 0,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 1,
            'training': 0
        },
        'Soldier': {
            'points': 10,
            'speed': 3,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 0,
            'training': 1
        },
        'Minor Character': {
            'points': 15,
            'speed': 3,
            'reaction': 2,
            'combatSkill': 1,
            'toughness': 4,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Major Character': {
            'points': 20,
            'speed': 3,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 5,
            'killPoints': 2,
            'savvy': 0,
            'training': 1
        },
        'Epic Character': {
            'points': 30,
            'speed': 4,
            'reaction': 3,
            'combatSkill': 2,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 1,
            'training': 2
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    },
    'None': {
        'Civilian': {
            'points': 0,
            'speed': 4,
            'reaction': 2,
            'combatSkill': 2,
            'toughness': 3,
            'killPoints': 1,
            'savvy': 3,
            'training': 2
        },
        'Soldier': {
            'points': 0,
            'speed': 6,
            'reaction': 4,
            'combatSkill': 4,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 4,
            'training': 4
        },
        'Minor Character': {
            'points': 0,
            'speed': 6,
            'reaction': 5,
            'combatSkill': 5,
            'toughness': 4,
            'killPoints': 1,
            'savvy': 4,
            'training': 5
        },
        'Major Character': {
            'points': 0,
            'speed': 6,
            'reaction': 6,
            'combatSkill': 6,
            'toughness': 5,
            'killPoints': 2,
            'savvy': 5,
            'training': 6
        },
        'Epic Character': {
            'points': 0,
            'speed': 8,
            'reaction': 7,
            'combatSkill': 7,
            'toughness': 5,
            'killPoints': 3,
            'savvy': 6,
            'training': 7
        },
        'Vehicle': {
            'points': 0,
            'speed': 12,
            'reaction': 3,
            'combatSkill': 4,
            'toughness': 10,
            'killPoints': 5,
            'savvy': 0,
            'training': 4,
            'crew': 2,
            'capacity': 0
        }
    }
};

export type Lifeform = keyof typeof _lifeformStats;

export const lifeformStats: Record<Lifeform, Record<ModelClass, ModelStats>> = _lifeformStats;

export const lifeforms = Object.keys(_lifeformStats) as Lifeform[];
