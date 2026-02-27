import { describe, it, expect, beforeEach } from 'vitest'
import { 
    armyState, 
    addUnit, 
    toggleUnitOption, 
    selectUnitOptionChoice, 
    calculateModelPoints, 
    totalArmyPoints,
    changeUnitType,
    calculateUnitPoints
} from './store'

describe('Army Store', () => {
    beforeEach(() => {
        armyState.units = []
        armyState.name = 'Test Army'
    })

    it('should add a unit with default models', () => {
        addUnit()
        expect(armyState.units.length).toBe(1)
        expect(armyState.units[0].models.length).toBeGreaterThan(0)
    })

    it('should calculate model points correctly', () => {
        addUnit() // Default is Infantry for Human
        const model = armyState.units[0].models[0] // Sergeant
        // Human Minor Character is 15.
        // Slots: rifle: 'Military Rifle' (3).
        // Extras: 'Frag Grenade' (1).
        // Total: 15 + 3 + 1 = 19.
        expect(calculateModelPoints(model)).toBe(19)
    })

    it('should deduplicate extras when multiple options add the same item', () => {
        addUnit() // Add Infantry
        const unit = armyState.units[0]
        
        let trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
        
        // Initial state: Trooper 4 has Frag Grenade
        expect(trooper4.extras).toContain('Frag Grenade')
        expect(trooper4.extras).not.toContain('Fog Grenade')

        // 1. Toggle Fog Grenades option (this is a toggle)
        toggleUnitOption(unit.id, 'fog_grenades')
        trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
        expect(trooper4.extras.filter(x => x === 'Fog Grenade').length).toBe(1)

        // 2. Select Grenade Launcher (which is a choice in the infantry_support_slot)
        selectUnitOptionChoice(unit.id, 'infantry_support_slot', 'support_grenade_launcher')
        trooper4 = unit.models.find(m => m.name === 'Trooper 4')!
        
        // Should still only have ONE Fog Grenade
        expect(trooper4.extras.filter(x => x === 'Fog Grenade').length).toBe(1)
        
        // Points check for Trooper 4
        // Human Soldier (10)
        // Slot: support: 'Grenade Launcher' (10)
        // Extras: 'Frag Grenade' (1), 'Fog Grenade' (1)
        // Total: 10 + 10 + 1 + 1 = 22
        expect(calculateModelPoints(trooper4)).toBe(22)
    })

    it('should update total army points when units are modified', () => {
        addUnit() 
        const initialPoints = totalArmyPoints.value
        expect(initialPoints).toBeGreaterThan(0)

        addUnit()
        expect(totalArmyPoints.value).toBe(initialPoints * 2)
    })

    it('should calculate unit points correctly with unit-level slots', () => {
        addUnit() // Add Infantry
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Weapon Team')
        
        // Initial state: Weapon Team has Laser Cannon (35 pts)
        // Models:
        // Gunner: Human Soldier (10) + Service Pistol (1) + Morale +1 (0) = 11
        // Loader 1: Human Soldier (10) + Service Pistol (1) + Morale +1 (0) = 11
        // Loader 2: Human Soldier (10) + Service Pistol (1) + Morale +1 (0) = 11
        // Unit slot: Laser Cannon (35)
        // Total: 11 * 3 + 35 = 68
        expect(calculateUnitPoints(unit)).toBe(68)

        // Select 20mm Autocannon (20 pts)
        selectUnitOptionChoice(unit.id, 'weapteam_crew_weapon', 'wt_auto_cannon')
        // Total: 11 * 3 + 20 = 53
        expect(calculateUnitPoints(unit)).toBe(53)
    })

    it('should calculate unit points correctly with unit-level extras (Fire Section)', () => {
        addUnit() // Add Infantry
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Fire Section')

        // Fire Section:
        // Unit Extras: 'Morale +1 (Fire Section)' (5 pts)
        // Models:
        // Grenadier: Human Soldier (10) + Plasma Rifle (8) + Service Pistol (1) = 19
        // Support: Human Soldier (10) + Service Pistol (1) = 11
        // Total: 5 + 19 + 11 = 35
        expect(calculateUnitPoints(unit)).toBe(35)
    })

    it('should calculate unit points correctly for vehicles using basePoints', () => {
        addUnit() // Add Infantry
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Nomad Bike')
        selectUnitOptionChoice(unit.id, 'nomad_forward_slot', 'nomad_lmg')
        // basePoints: 15 (fixed comment)
        // slots: forward: 'Light Machine Gun' (10)
        expect(calculateUnitPoints(unit)).toBe(25)
    })

    it('should calculate unit points correctly for Scouter', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Scouter')
        // Scouter: basePoints: 25 + LMG (10) = 35
        expect(calculateUnitPoints(unit)).toBe(35)
    })

    it('should calculate unit points correctly for Lancer and its weapon swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Lancer')
        // Lancer: basePoints: 22 + Plasma Rifle (8) = 30
        expect(calculateUnitPoints(unit)).toBe(30)

        // Swap to Fury Rifle (15 pts)
        selectUnitOptionChoice(unit.id, 'lancer_forward_slot', 'lancer_fury')
        // 22 + 15 = 37
        expect(calculateUnitPoints(unit)).toBe(37)
    })

    it('should calculate unit points correctly for Frontier Trike', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Frontier Trike')
        // Frontier Trike: basePoints: 25 + LMG (10) = 35
        expect(calculateUnitPoints(unit)).toBe(35)
    })

    it('should calculate unit points correctly for Raider Trike and its weapon swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Raider Trike')
        // Raider Trike: basePoints: 25 + LMG (10) = 35
        expect(calculateUnitPoints(unit)).toBe(35)

        // Swap to Fury Rifle (15 pts)
        selectUnitOptionChoice(unit.id, 'raider_forward_side_slot', 'raider_fury')
        // 25 + 15 = 40
        expect(calculateUnitPoints(unit)).toBe(40)
    })

    it('should calculate unit points correctly for Armored Car', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Armored Car')
        // Armored Car: basePoints: 40 + 20mm Autocannon (20) = 60
        expect(calculateUnitPoints(unit)).toBe(60)
    })

    it('should calculate unit points correctly for APC', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'APC')
        // APC: basePoints: 40 + LMG (10) = 50
        expect(calculateUnitPoints(unit)).toBe(50)
    })

    it('should calculate unit points correctly for APC - Grav', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'APC - Grav')
        // APC - Grav: basePoints: 45 + LMG (10) = 55
        expect(calculateUnitPoints(unit)).toBe(55)
    })

    it('should calculate unit points correctly for IFV and its turret swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'IFV')
        // IFV: base 40 + LMG (10) + 20mm (20) = 70
        expect(calculateUnitPoints(unit)).toBe(70)

        // Swap to Heavy Plasma Gun (20 pts)
        selectUnitOptionChoice(unit.id, 'ifv_turret_slot', 'ifv_heavy_plasma')
        // 40 + 10 + 20 = 70 (same cost)
        expect(calculateUnitPoints(unit)).toBe(70)
    })

    it('should calculate unit points correctly for IFV - Grav and its turret swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'IFV - Grav')
        // IFV - Grav: base 45 + LMG (10) + 20mm (20) = 75
        expect(calculateUnitPoints(unit)).toBe(75)

        // Swap to Heavy Plasma Gun (20 pts)
        selectUnitOptionChoice(unit.id, 'ifv_turret_slot', 'ifv_heavy_plasma')
        // 45 + 10 + 20 = 75 (same cost)
        expect(calculateUnitPoints(unit)).toBe(75)
    })

    it('should calculate unit points correctly for Light Tank and its turret swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Light Tank')
        // Light Tank: base 55 + LMG (10) + Coaxial LMG (10) + 40mm (25) = 100
        expect(calculateUnitPoints(unit)).toBe(100)

        // Swap to Pulse Laser (35 pts)
        selectUnitOptionChoice(unit.id, 'light_tank_turret_slot', 'light_tank_pulse')
        // 55 + 10 + 10 + 35 = 110
        expect(calculateUnitPoints(unit)).toBe(110)
    })

    it('should calculate unit points correctly for Light Tank - Grav and its turret swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Light Tank - Grav')
        // Light Tank - Grav: base 70 + LMG (10) + Coaxial LMG (10) + 40mm (25) = 115
        expect(calculateUnitPoints(unit)).toBe(115)

        // Swap to Pulse Laser (35 pts)
        selectUnitOptionChoice(unit.id, 'light_tank_turret_slot', 'light_tank_pulse')
        // 70 + 10 + 10 + 35 = 125
        expect(calculateUnitPoints(unit)).toBe(125)
    })

    it('should calculate unit points correctly for Medium Tank and its swaps', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Medium Tank')
        // Medium Tank: base 65 + LMG (10) + Coaxial LMG (10) + 100mm (55) = 140
        expect(calculateUnitPoints(unit)).toBe(140)

        // Swap coax to Heavy Plasma (20 pts)
        selectUnitOptionChoice(unit.id, 'medium_tank_coax_slot', 'medium_tank_heavy_plasma')
        // 140 - 10 + 20 = 150
        expect(calculateUnitPoints(unit)).toBe(150)

        // Swap turret to AT Laser (45 pts)
        selectUnitOptionChoice(unit.id, 'medium_tank_turret_slot', 'medium_tank_at_laser')
        // 150 - 55 + 45 = 140
        expect(calculateUnitPoints(unit)).toBe(140)
    })

    it('should calculate unit points correctly for Medium Tank - Grav and its swaps', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Medium Tank - Grav')
        // Medium Tank - Grav: base 75 + LMG (10) + Coaxial LMG (10) + 100mm (55) = 150
        expect(calculateUnitPoints(unit)).toBe(150)

        // Swap coax to Heavy Plasma (20 pts)
        selectUnitOptionChoice(unit.id, 'medium_tank_coax_slot', 'medium_tank_heavy_plasma')
        // 150 - 10 + 20 = 160
        expect(calculateUnitPoints(unit)).toBe(160)

        // Swap turret to AT Laser (45 pts)
        selectUnitOptionChoice(unit.id, 'medium_tank_turret_slot', 'medium_tank_at_laser')
        // 160 - 55 + 45 = 150
        expect(calculateUnitPoints(unit)).toBe(150)
    })

    it('should calculate unit points correctly for Heavy Tank and its swaps', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Heavy Tank')
        // Heavy Tank: base 125 + LMG (10) + Coaxial LMG (10) + 100mm (55) = 200
        expect(calculateUnitPoints(unit)).toBe(200)

        // Swap front to Heavy Plasma (20 pts)
        selectUnitOptionChoice(unit.id, 'heavy_tank_front_slot', 'heavy_front_plasma')
        // 200 - 10 + 20 = 210
        expect(calculateUnitPoints(unit)).toBe(210)

        // Swap coax to Heavy Plasma (20 pts)
        selectUnitOptionChoice(unit.id, 'heavy_tank_coax_slot', 'heavy_coax_plasma')
        // 210 - 10 + 20 = 220
        expect(calculateUnitPoints(unit)).toBe(220)
    })

    it('should calculate unit points correctly for Light Walker and its swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Light Walker')
        // Light Walker: base 44 + 20mm (20) + Flame Projector (6) = 70
        expect(calculateUnitPoints(unit)).toBe(70)

        // Swap to Fusion Rifle (10 pts)
        selectUnitOptionChoice(unit.id, 'walker_arm2_slot', 'walker_fusion')
        // 44 + 20 + 10 = 74
        expect(calculateUnitPoints(unit)).toBe(74)
    })

    it('should calculate unit points correctly for Heavy Walker', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Heavy Walker')
        // Heavy Walker: base 55 + Pulse Laser (35) + LMG (10) = 100
        expect(calculateUnitPoints(unit)).toBe(100)
    })

    it('should calculate unit points correctly for CIM-L and its swap', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'CIM-L')
        // CIM-L: base 21 + Hyper Blaster (14) = 35
        expect(calculateUnitPoints(unit)).toBe(35)

        // Swap to Fury Rifle (15 pts)
        selectUnitOptionChoice(unit.id, 'ciml_weapon_slot', 'ciml_fury')
        // 21 + 15 = 36
        expect(calculateUnitPoints(unit)).toBe(36)
    })

    it('should calculate unit points correctly for CIM-APP', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'CIM-APP')
        // CIM-APP: base 25 + 20mm Autocannon (20) = 45
        expect(calculateUnitPoints(unit)).toBe(45)
    })

    it('should calculate unit points correctly for Recon with veteran skill', () => {
        addUnit() // Add Infantry
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Recon')

        // Initial Recon points (sum of models' base points + weapons/extras)
        // Recon models: 5 models. Sergeant (Minor Character 15), 4 Troopers (Soldier 10 each).
        // Weapons: Sergeant rifle (Military Rifle 3), Troopers 1-3 rifle (Military Rifle 3), Trooper 4 support (Precision Rifle 6)
        // Extras: 5x Observation +1 (1 each)
        // Total: (15 + 3 + 1) + 3*(10 + 3 + 1) + (10 + 6 + 1) = 19 + 3*14 + 17 = 19 + 42 + 17 = 78
        expect(calculateUnitPoints(unit)).toBe(78)

        // Add Tank Hunters (15 pts)
        selectUnitOptionChoice(unit.id, 'squad_veteran_skill', 'squad_veteran_skill_tank_hunters')
        // 78 + 15 = 93
        expect(calculateUnitPoints(unit)).toBe(93)
    })

    it('should calculate unit points correctly for Infantry Sergeant with veteran skill', () => {
        addUnit() // Default is Infantry (82 pts)
        const unit = armyState.units[0]
        expect(calculateUnitPoints(unit)).toBe(82)

        // Add Rugged to Sergeant (5 pts)
        selectUnitOptionChoice(unit.id, 'sergeant_veteran_skill', 'sergeant_veteran_skill_rugged')
        // 82 + 5 = 87
        expect(calculateUnitPoints(unit)).toBe(87)
    })

    it('should calculate unit points correctly for Minor Character with veteran skill', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Minor Character')
        // Human Minor Character (15) + Hand Laser (2) + Glare Sword (2) + Fog Grenade (1) = 20
        expect(calculateUnitPoints(unit)).toBe(20)

        // Add Lucky (5 pts)
        selectUnitOptionChoice(unit.id, 'character_veteran_skill', 'character_veteran_skill_lucky')
        // 20 + 5 = 25
        expect(calculateUnitPoints(unit)).toBe(25)
    })

    it('should calculate unit points correctly for Weapon Team with veteran skill', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'Weapon Team')
        // Default Weapon Team: 11*3 + 35 = 68
        expect(calculateUnitPoints(unit)).toBe(68)

        // Add Gun Drill (10 pts)
        selectUnitOptionChoice(unit.id, 'gun_crew_veteran_skill', 'gun_crew_veteran_skill_drill')
        // 68 + 10 = 78
        expect(calculateUnitPoints(unit)).toBe(78)
    })

    it('should calculate unit points correctly for vehicle with veteran skill', () => {
        addUnit()
        const unit = armyState.units[0]
        changeUnitType(unit.id, 'APC')
        // APC: base 40 + turret LMG (10) = 50
        expect(calculateUnitPoints(unit)).toBe(50)

        // Add Gunnery (15 pts)
        selectUnitOptionChoice(unit.id, 'vehicle_veteran_skill', 'vehicle_veteran_skill_gunnery')
        // 50 + 15 = 65
        expect(calculateUnitPoints(unit)).toBe(65)
    })
})
