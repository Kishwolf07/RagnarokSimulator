// ===============================
// GLOBAL TRACKING VARIABLES
// ===============================
let currentJobTracked = "Novice";
let lastJobLevel = 1;
window.skillPoints = 0;
window.playerSkills = {}; // Global object for skills.js to access

// ===============================
// CHARACTER IMAGE & GENDER
// ===============================
function updateCharacterImage() {
    const job = document.getElementById("job").value;
    const genderToggle = document.getElementById("genderToggle");
    const characterGif = document.querySelector(".character-gif");

    // Checkbox checked = Female (G), unchecked = Male
    const isFemale = genderToggle && genderToggle.checked;

    // Mapping: "novice" -> "novice.gif" (Male) or "noviceG.gif" (Female)
    const jobFile = job.toLowerCase();
    const genderSuffix = isFemale ? "G" : "";
    const gifSrc = `jobs/${jobFile}${genderSuffix}.gif`;

    if (characterGif) {
        // Smooth fade-out before switching
        characterGif.style.transition = "opacity 0.2s ease";
        characterGif.style.opacity = 0;

        setTimeout(() => {
            characterGif.src = gifSrc;
            
            // Wait for image to load or just fade back in
            characterGif.onload = () => {
                characterGif.style.opacity = 1;
            };
            
            // Fallback in case onload doesn't fire (e.g. cached)
            setTimeout(() => { characterGif.style.opacity = 1; }, 50);
        }, 200);
    }
}

// ===============================
// TAB SYSTEM
// ===============================
function switchPanel(panelName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));

    if (panelName === 'stats') {
        document.getElementById('tab-stats').classList.add('active');
        document.getElementById('statsPanel').classList.add('active');
    } else if (panelName === 'skills') {
        document.getElementById('tab-skills').classList.add('active');
        document.getElementById('skillsPanel').classList.add('active');
        
        if (typeof updateSkillUI === 'function') {
            updateSkillUI();
        }
    }
}

// ===============================
// STAT POINT FORMULAS
// ===============================
function getPointsForLevel(level) {
    if (level <= 4) return 3;
    if (level >= 95) return 22;
    return Math.floor((level - 1) / 5) + 3;
}

function getTotalStatPoints(level) {
    let total = 48;
    for (let i = 2; i <= level; i++) {
        let pointsToAdd = getPointsForLevel(i);
        if (level === 99 && i === 99) {
            total += (pointsToAdd - 1);
        } else {
            total += pointsToAdd;
        }
    }
    return total;
}

function getStatCost(currentValue) {
    if (currentValue < 11) return 2;
    if (currentValue < 21) return 3;
    if (currentValue < 31) return 4;
    if (currentValue < 41) return 5;
    if (currentValue < 51) return 6;
    if (currentValue < 61) return 7;
    if (currentValue < 71) return 8;
    if (currentValue < 81) return 9;
    if (currentValue < 91) return 10;
    return 11;
}

function getTotalCost(statValue) {
    let total = 0;
    for (let i = 1; i < statValue; i++) total += getStatCost(i);
    return total;
}

// ===============================
// DATA TABLES
// ===============================
const jobBonuses = {
    "Swordsman": { 1: [0, 0, 0, 0, 0, 0], 2: [1, 0, 0, 0, 0, 0], 6: [1, 0, 1, 0, 0, 0], 10: [1, 0, 1, 0, 1, 0], 14: [2, 0, 1, 0, 1, 0], 18: [2, 0, 2, 0, 1, 0], 22: [2, 0, 2, 0, 2, 0], 26: [2, 0, 2, 0, 2, 1], 30: [2, 1, 2, 0, 2, 1], 33: [3, 1, 2, 0, 2, 1], 36: [3, 1, 2, 0, 3, 1], 38: [3, 1, 3, 0, 3, 1], 40: [4, 1, 3, 0, 3, 1], 42: [4, 1, 4, 0, 3, 1], 44: [4, 1, 4, 0, 3, 2], 46: [4, 2, 4, 0, 3, 2], 47: [5, 2, 4, 0, 3, 2], 49: [6, 2, 4, 0, 3, 2], 50: [7, 2, 4, 0, 3, 2] },
    "Mage": { 1: [0, 0, 0, 0, 0, 0], 2: [0, 0, 0, 1, 0, 0], 6: [0, 0, 0, 1, 1, 0], 10: [0, 0, 0, 1, 2, 0], 14: [0, 0, 0, 2, 2, 0], 18: [0, 1, 0, 2, 2, 0], 22: [0, 1, 0, 3, 2, 0], 26: [0, 2, 0, 3, 2, 0], 30: [0, 2, 0, 3, 2, 1], 33: [0, 2, 0, 4, 2, 1], 36: [0, 2, 0, 4, 3, 1], 38: [0, 2, 0, 5, 3, 1], 40: [0, 3, 0, 5, 3, 1], 42: [0, 3, 0, 5, 3, 2], 44: [0, 3, 0, 6, 3, 2], 46: [0, 3, 0, 7, 3, 2], 47: [0, 4, 0, 7, 3, 2], 49: [0, 4, 0, 7, 3, 3], 50: [0, 4, 0, 8, 3, 3] },
    "Archer": { 1: [0, 0, 0, 0, 0, 0], 2: [0, 0, 0, 0, 1, 0], 6: [1, 0, 0, 0, 1, 0], 10: [1, 0, 0, 1, 1, 0], 14: [1, 0, 0, 1, 2, 0], 18: [1, 0, 0, 1, 3, 0], 22: [1, 0, 0, 1, 3, 1], 26: [1, 1, 0, 1, 3, 1], 30: [1, 1, 0, 1, 4, 1], 33: [1, 2, 0, 1, 4, 1], 36: [1, 2, 0, 1, 5, 1], 38: [2, 2, 0, 1, 5, 1], 40: [3, 2, 0, 1, 5, 1], 42: [3, 2, 0, 1, 6, 1], 44: [3, 2, 0, 1, 6, 2], 46: [3, 2, 1, 1, 6, 2], 47: [3, 2, 1, 2, 6, 2], 49: [3, 3, 1, 2, 6, 2], 50: [3, 3, 1, 2, 7, 2] },
    "Merchant": { 1: [0, 0, 0, 0, 0, 0], 2: [0, 0, 1, 0, 0, 0], 6: [0, 0, 1, 0, 1, 0], 10: [1, 0, 1, 0, 1, 0], 14: [1, 0, 1, 0, 2, 0], 18: [1, 0, 2, 0, 2, 0], 22: [2, 0, 2, 0, 2, 0], 26: [2, 0, 2, 1, 2, 0], 30: [2, 0, 3, 1, 2, 0], 33: [2, 1, 3, 1, 2, 0], 36: [2, 1, 3, 1, 2, 1], 38: [2, 1, 3, 1, 3, 1], 40: [3, 1, 3, 1, 3, 1], 42: [3, 1, 3, 1, 4, 1], 44: [4, 1, 3, 1, 4, 1], 46: [4, 1, 3, 1, 4, 2], 47: [4, 1, 4, 1, 4, 2], 49: [5, 1, 4, 1, 4, 2], 50: [5, 1, 4, 1, 5, 2] },
    "Thief": { 1: [0, 0, 0, 0, 0, 0], 2: [0, 1, 0, 0, 0, 0], 6: [1, 1, 0, 0, 0, 0], 10: [1, 1, 0, 0, 1, 0], 14: [1, 1, 1, 0, 1, 0], 18: [1, 1, 1, 1, 1, 0], 22: [1, 1, 1, 1, 2, 0], 26: [1, 1, 1, 1, 2, 1], 30: [2, 1, 1, 1, 2, 1], 33: [2, 2, 1, 1, 2, 1], 36: [2, 3, 1, 1, 2, 1], 38: [3, 3, 1, 1, 2, 1], 40: [3, 3, 1, 1, 2, 2], 42: [3, 3, 1, 1, 3, 2], 44: [3, 3, 2, 1, 3, 2], 46: [3, 3, 2, 1, 3, 3], 47: [4, 3, 2, 1, 3, 3], 49: [4, 3, 2, 1, 4, 3], 50: [4, 4, 2, 1, 4, 3] },
    "Acolyte": { 1: [0, 0, 0, 0, 0, 0], 2: [0, 0, 0, 0, 0, 1], 6: [0, 0, 1, 0, 0, 1], 10: [0, 0, 1, 1, 0, 1], 14: [0, 0, 1, 1, 1, 1], 18: [0, 0, 1, 1, 1, 2], 22: [0, 1, 1, 1, 1, 2], 26: [1, 1, 1, 1, 1, 2], 30: [1, 1, 2, 1, 1, 2], 36: [1, 1, 2, 2, 2, 2], 38: [1, 1, 2, 2, 2, 3], 40: [1, 2, 2, 2, 2, 3], 42: [2, 2, 2, 2, 2, 3], 44: [2, 2, 3, 2, 2, 3], 46: [2, 2, 3, 3, 3, 3], 49: [3, 2, 3, 3, 3, 3], 50: [3, 2, 3, 3, 3, 4] }
};

const jobData = {
    Novice: { hpFactor: 0, spFactor: 1, maxJob: 10 },
    Swordsman: { hpFactor: 0.7, spFactor: 2, maxJob: 50 },
    Mage: { hpFactor: 0.3, spFactor: 6, maxJob: 50 },
    Archer: { hpFactor: 0.5, spFactor: 2, maxJob: 50 },
    Thief: { hpFactor: 0.5, spFactor: 2, maxJob: 50 },
    Acolyte: { hpFactor: 0.4, spFactor: 5, maxJob: 50 },
    Merchant: { hpFactor: 0.4, spFactor: 3, maxJob: 50 }
};

const jobWeaponBTBA = {
    "Novice": { "Hand": 1.0, "Dagger": 1.3, "One-handed Sword": 1.4, "One-handed Axe": 1.6, "One-handed Mace": 1.4, "Two-handed Mace": 1.4, "Rod & Staff": 1.3, "Two-handed Staff": 1.3 },
    "Swordsman": { "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.1, "Two-handed Sword": 1.2, "One-handed Spear": 1.3, "Two-handed Spear": 1.4, "One-handed Axe": 1.4, "Two-handed Axe": 1.5, "One-handed Mace": 1.3, "Two-handed Mace": 1.4 },
    "Mage": { "Hand": 1.0, "Dagger": 1.2, "Rod & Staff": 1.4, "Two-handed Staff": 1.4 },
    "Archer": { "Hand": 0.8, "Dagger": 1.2, "Bow": 1.4 },
    "Thief": { "Hand": 0.8, "Dagger": 1.0, "One-handed Sword": 1.3, "One-handed Axe": 1.6, "Bow": 1.6 },
    "Acolyte": { "Hand": 0.8, "One-handed Mace": 1.2, "Two-handed Mace": 1.2, "Rod & Staff": 1.2, "Two-handed Staff": 1.2 },
    "Merchant": { "Hand": 0.8, "Dagger": 1.2, "One-handed Sword": 1.4, "One-handed Axe": 1.4, "Two-handed Axe": 1.5, "One-handed Mace": 1.4, "Two-handed Mace": 1.4 }
};

const jobWeightModifier = { "Novice": 0, "Swordsman": 800, "Mage": 200, "Archer": 600, "Thief": 400, "Acolyte": 400, "Merchant": 800 };

// ===============================
// CORE CALCULATIONS (Skill-Aware)
// ===============================
function getBonusForJobLevel(job, level) {
    const classData = jobBonuses[job] || { 1: [0, 0, 0, 0, 0, 0] };
    const sortedLevels = Object.keys(classData).map(Number).sort((a, b) => a - b);
    let activeLevel = 1;
    for (let l of sortedLevels) { if (l <= level) activeLevel = l; else break; }
    return classData[activeLevel];
}

function calculateBaseHP(level, hpFactor, job) {
    let baseHP = (job === "Swordsman") ? 37 : 35;
    baseHP += (level * 5); 
    for (let i = 2; i <= level; i++) {
        baseHP += Math.round(hpFactor * i); 
    }
    return baseHP;
}

function calculateHPRegen(maxHP, vit, job) {
    let hpPart = Math.floor(maxHP / 200);
    let vitPart = Math.floor(vit / 5);
    let hpr = hpPart + vitPart + 1;
    
    // Swordsman: Increase HP Recovery (Skill-aware)
    if (window.playerSkills.increaseHP) {
        const lvl = window.playerSkills.increaseHP;
        hpr += (5 * lvl) + Math.floor(maxHP * 0.002 * lvl); 
    }
    return hpr;
}

function calculateSPRegen(maxSP, int, job) {
    let spr = 1 + Math.floor(maxSP / 100) + Math.floor(int / 6);
    if (int >= 120) spr += Math.floor(int / 2 - 56);
    
    // Mage: Increase SP Recovery (Skill-aware)
    if (window.playerSkills.spRecovery) {
        spr += (Math.floor(maxSP / 500) + 3) * window.playerSkills.spRecovery;
    }
    return Math.floor(spr);
}

function calculateASPD(job, weapon, agi, dex) {
    const btba = (jobWeaponBTBA[job] && jobWeaponBTBA[job][weapon]) ? jobWeaponBTBA[job][weapon] : 1.0;
    let WD = 50 * btba;
    let drAgi = Math.round(WD * agi / 25);
    let drDex = Math.round(WD * dex / 100);
    let aspd = 200 - (WD - Math.floor((drAgi + drDex) / 10));
    return Math.min(Math.max(aspd, 0), 190);
}

// ===============================
// UI HELPERS
// ===============================
function updateWeaponOptions() {
    const job = document.getElementById("job").value;
    const weaponSelect = document.getElementById("weapon");
    const weapons = {
        Novice: ["Hand", "Dagger", "One-handed Sword", "One-handed Axe", "One-handed Mace", "Two-handed Mace", "Rod & Staff", "Two-handed Staff"],
        Swordsman: ["Hand", "Dagger", "One-handed Sword", "Two-handed Sword", "One-handed Spear", "Two-handed Spear", "One-handed Axe", "Two-handed Axe", "One-handed Mace", "Two-handed Mace"],
        Mage: ["Hand", "Dagger", "Rod & Staff", "Two-handed Staff"],
        Archer: ["Hand", "Dagger", "Bow"],
        Thief: ["Hand", "Dagger", "One-handed Sword", "One-handed Axe", "Bow"],
        Acolyte: ["Hand", "One-handed Mace", "Two-handed Mace", "Rod & Staff", "Two-handed Staff"],
        Merchant: ["Hand", "Dagger", "One-handed Sword", "One-handed Axe", "Two-handed Axe", "One-handed Mace", "Two-handed Mace"]
    };
    weaponSelect.innerHTML = "";
    (weapons[job] || ["Hand"]).forEach(w => {
        let option = document.createElement("option");
        option.value = w; option.textContent = w;
        weaponSelect.appendChild(option);
    });
}

function updateStats(changedStatId) {
    const jobLevelInput = document.getElementById("jobLevel");
    let jobLevel = parseInt(jobLevelInput.value) || 1;
    let job = document.getElementById("job").value;
    let jobInfo = jobData[job] || jobData["Novice"];

    // 1. Validation
    if (jobLevel > jobInfo.maxJob) {
        jobLevel = jobInfo.maxJob;
        jobLevelInput.value = jobInfo.maxJob;
    }

    // 2. Handle Job Switch & Point Tracking
    if (job !== currentJobTracked) {
        window.playerSkills = {}; 
        currentJobTracked = job;
        updateWeaponOptions();
    }

    // SYNC SKILLS: Pass 'true' to prevent the skill script from calling updateStats back
    if (typeof handleSkillLevelChange === 'function') {
        handleSkillLevelChange(true);
    }

    // 3. Base Level Validation
    const baseLevelInput = document.getElementById("baseLevel");
    let level = parseInt(baseLevelInput.value) || 1;
    if (level > 99) { level = 99; baseLevelInput.value = 99; }
    else if (level < 1) { level = 1; baseLevelInput.value = 1; }

    // 4. Raw Stats & Costs
    let rawStats = {
        str: Math.max(1, parseInt(document.getElementById("str").value) || 1),
        agi: Math.max(1, parseInt(document.getElementById("agi").value) || 1),
        vit: Math.max(1, parseInt(document.getElementById("vit").value) || 1),
        int: Math.max(1, parseInt(document.getElementById("int").value) || 1),
        dex: Math.max(1, parseInt(document.getElementById("dex").value) || 1),
        luk: Math.max(1, parseInt(document.getElementById("luk").value) || 1)
    };

    let totalPoints = getTotalStatPoints(level);
    let spentPoints = Object.keys(rawStats).reduce((sum, key) => sum + getTotalCost(rawStats[key]), 0);

    if (changedStatId && spentPoints > totalPoints) {
        let el = document.getElementById(changedStatId);
        while (spentPoints > totalPoints && parseInt(el.value) > 1) {
            el.value = parseInt(el.value) - 1;
            rawStats[changedStatId] = parseInt(el.value);
            spentPoints = Object.keys(rawStats).reduce((sum, key) => sum + getTotalCost(rawStats[key]), 0);
        }
    }

    // 5. Passive Stat Bonuses
    let skillStatBonus = { str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 };
    if (window.playerSkills.owlsEye) skillStatBonus.dex += window.playerSkills.owlsEye;
    if (window.playerSkills.crazyUproar) skillStatBonus.str += 4;

    // 6. Final Effective Stats
    const bonuses = getBonusForJobLevel(job, jobLevel);
    const statKeys = ["str", "agi", "vit", "int", "dex", "luk"];
    let stats = {};
    statKeys.forEach((key, index) => {
        const bonusVal = bonuses[index];
        const skillVal = skillStatBonus[key];
        document.getElementById(key + "Bonus").innerText = (bonusVal + skillVal);
        stats[key] = rawStats[key] + bonusVal + skillVal;
        document.getElementById(key + "Req").innerText = getStatCost(rawStats[key]);
    });

    // 7. HP/SP/Weight
    let weightBonus = (window.playerSkills.enlargeWeight) ? (window.playerSkills.enlargeWeight * 200) : 0;
    let weight = 2000 + (30 * stats.str) + (jobWeightModifier[job] || 0) + weightBonus;
    
    let baseHP = calculateBaseHP(level, jobInfo.hpFactor, job);   
    let maxHP = Math.floor(baseHP * (1 + stats.vit * 0.01));
    let maxSP = Math.floor((10 + (level * jobInfo.spFactor)) * (1 + stats.int * 0.01));

    document.getElementById("weight").innerText = weight;
    document.getElementById("hpValue").innerText = maxHP;
    document.getElementById("spValue").innerText = maxSP;
    document.getElementById("hpRegen").innerText = calculateHPRegen(maxHP, stats.vit, job);
    document.getElementById("spRegen").innerText = calculateSPRegen(maxSP, stats.int, job);

    // 8. Combat Masteries & Double Attack
    let weapon = document.getElementById("weapon").value;
    let skillAtkBonus = 0;

    // Double Attack Logic
    let doubleAttackChance = 0;
    if (weapon === "Dagger" && window.playerSkills.doubleAttack) {
        doubleAttackChance = window.playerSkills.doubleAttack * 5; 
    }

    if ((weapon === "One-handed Sword" || weapon === "Dagger") && window.playerSkills.swordMastery) {
        skillAtkBonus += window.playerSkills.swordMastery * 4;
    }
    if (weapon === "Two-handed Sword" && window.playerSkills.twoHandedMastery) {
        skillAtkBonus += window.playerSkills.twoHandedMastery * 4;
    }

    let baseAtk = (weapon === "Bow")
        ? (stats.dex + Math.pow(Math.floor(stats.dex / 10), 2) + Math.floor(stats.str / 5) + Math.floor(stats.luk / 5))
        : (stats.str + Math.pow(Math.floor(stats.str / 10), 2) + Math.floor(stats.dex / 5) + Math.floor(stats.luk / 5));
    
    document.getElementById("atk").innerText = `${baseAtk} + ${skillAtkBonus}`;
    
    let matkMin = stats.int + Math.pow(Math.floor(stats.int / 7), 2);
    let matkMax = stats.int + Math.pow(Math.floor(stats.int / 5), 2);
    document.getElementById("matk").innerText = `${matkMin} ~ ${matkMax}`;

    // 9. Defense, Hit & Flee
    let skillHardDefBonus = (window.playerSkills.divineProtection) ? window.playerSkills.divineProtection * 3 : 0;
    document.getElementById("def").innerText = `${skillHardDefBonus} + ${stats.vit}`;
    document.getElementById("mdef").innerText = `0 + ${stats.int}`;
    
    let skillFleeBonus = 0;
    if (window.playerSkills.improveDodge) {
        let fleeRate = (job === "Assassin" || job === "Rogue") ? 4 : 3;
        skillFleeBonus = window.playerSkills.improveDodge * fleeRate;
    }
    
    let totalFlee = (level + stats.agi + skillFleeBonus);
    document.getElementById("flee").innerText = `${totalFlee} + ${Math.floor(stats.luk / 10) + 1}`;
    
    let skillHitBonus = (window.playerSkills.vulturesEye) ? window.playerSkills.vulturesEye : 0;
    if (weapon === "Dagger" && window.playerSkills.doubleAttack) {
        skillHitBonus += window.playerSkills.doubleAttack;
    }
    document.getElementById("hit").innerText = level + stats.dex + skillHitBonus;

    document.getElementById("critical").innerText = Math.floor(stats.luk * 0.3) + 1;
    document.getElementById("aspd").innerText = calculateASPD(job, weapon, stats.agi, stats.dex);

    // 10. Resource Bar Updates
    updateResourceBars(maxHP, maxSP);

    // Final UI Refresh
    document.getElementById("statusPoints").innerText = Math.max(totalPoints - spentPoints, 0);
    const spDisplay = document.getElementById("skillPointsValue") || document.querySelector(".sp-value");
    if (spDisplay) spDisplay.innerText = window.skillPoints;

    if (document.getElementById('skillsPanel').classList.contains('active') && typeof updateSkillUI === 'function') {
        updateSkillUI();
    }
}

// Helper function to update the visual bars
function updateResourceBars(hp, sp) {
    const hpText = document.getElementById("hpText");
    const spText = document.getElementById("spText");

    // In the simulator, we fill to 100%
    if (hpBar) hpBar.style.width = "100%";
    if (spBar) spBar.style.width = "100%";
}

function resetCharacter() {
    document.getElementById("baseLevel").value = 1;
    document.getElementById("jobLevel").value = 1;
    document.getElementById("job").value = "Novice";
    ["str", "agi", "vit", "int", "dex", "luk"].forEach(s => document.getElementById(s).value = 1);
    window.playerSkills = {};
    updateWeaponOptions();
    updateCharacterImage();
    updateStats();
    switchPanel('stats');
}