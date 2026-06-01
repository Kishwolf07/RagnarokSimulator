// ===============================
// SKILL TREE DATA and code
// ===============================

let currentJobLevel = 1;
window.skillPoints = 0;
window.playerSkills = {};

// skills each job
const jobSkills = {
    "Novice": {
        basicSkill: { name: "Basic Skill", maxLevel: 9, type: "normal", desc: "Enables the use of Basic Interface Skills such as Trading, Kafra use and Chatroom and Party creation." },
        firstAid: { name: "First Aid", maxLevel: 1, type: "quest", desc: "Consume 3 SP to restore 5 HP.", quest: true, reqBase: 4 },
        playDead: { name: "Play Dead", maxLevel: 1, type: "quest", desc: "Pretend to fall dead on the ground, becoming immune from all attacks from Players and monsters.", quest: true, reqBase: 4 }
    },
    "Swordsman": {
        swordMastery: { name: "Sword Mastery", maxLevel: 10, type: "normal", desc: "Increases damage done with One-Handed Swords." },
        twoHandedMastery: { name: "Two-Handed Sword Mastery", maxLevel: 10, type: "normal", desc: "Increases damage done with Two-Handed Swords.", req: { swordMastery: 1 } },
        bash: { name: "Bash", maxLevel: 10, type: "normal", desc: "Bash is a skill that increases ATK and Accuracy. It also has a chance to stun opponents once the quest skill Fatal Blow is obtained." },
        magnumBreak: { name: "Magnum Break", maxLevel: 10, type: "normal", desc: "Magnum Break is an instant fire-element AoE skill that consumes 30 SP and a small amount of HP. It damages enemies in a 5×5 area, knocks them back 2 cells, and increases the user’s ATK and accuracy. After casting, it also grants a 10-second buff that boosts Fire-property attack damage by 20%.", req: { bash: 5 } },
        provoke: { name: "Provoke", maxLevel: 10, type: "normal", desc: "Increase a target's attack by up to 32% and decrease its defense by up to 55%." },
        endure: { name: "Endure", maxLevel: 10, type: "normal", desc: "Disables Fliching Status for up to 7 Hits and up to 37 seconds. Also grants 10 bonus Mdef with casted.", req: { provoke: 5 } },
        increaseHP: { name: "Increase HP Recovery", maxLevel: 10, type: "normal", desc: "The backbone of the Swordman classes. For every 10 seconds that elapse while a character remains on the same tile without manually moving themselves away from it, a certain amount of HP dependent on the skill level and the character's Max HP will be restored. " },
        berserk: { name: "Berserk", maxLevel: 1, type: "quest", desc: "Increases attack, but decreases Defense as per Provoke level 10 when HP drops below 25%.", quest: true, reqJob: 30 },
        fatalBlow: { name: "Fatal Blow", maxLevel: 1, type: "quest", desc: "Adds a chance to stun targets hit with Bash level 6 and up.", quest: true, reqJob: 30 },
        movingHP: { name: "HP Recovery While Moving", maxLevel: 1, type: "quest", desc: "Allows HP recovery while walking.", quest: true, reqJob: 35 }
    },
    "Mage": {
        spRecovery: { name: "Increase SP Recovery", maxLevel: 10, type: "normal", desc: "Passively increases SP recovery speed when not moving. Also increases efficiency of SP-restoring items consumed and thrown by an Alchemist." },
        fireBolt: { name: "Fire Bolt", maxLevel: 10, type: "normal", desc: "Attack a single target with up to 10× MATK Fire-element damage." },
        fireBall: { name: "Fire Ball", maxLevel: 10, type: "normal", desc: "Attack a target and enemies in a 5×5 area around it for up to 170% Fire-element damage.", req: { fireBolt: 4 } },
        fireWall: { name: "Fire Wall", maxLevel: 10, type: "normal", desc: "Put up a small fire wall that causes 50% Fire-element damage to enemies passing through and pushes them back.", req: { fireBall: 5, sight: 1 } },
        sight: { name: "Sight", maxLevel: 1, type: "normal", desc: "Reveal hidden enemies in a 7×7 area around the user.", req: { fireBolt: 1 } },
        coldBolt: { name: "Cold Bolt", maxLevel: 10, type: "normal", desc: "Attack a single target with up to 10× MATK Water-element damage." },
        frostDiver: { name: "Frost Diver", maxLevel: 10, type: "normal", desc: "Attack a target for up to 200% Water-element damage with a chance to freeze it, rendering it immobile and turning it to Water 1 element.", req: { coldBolt: 5 } },
        lightningBolt: { name: "Lightning Bolt", maxLevel: 10, type: "normal", desc: "Attack a single target with up to 10× MATK Wind-element damage." },
        thunderstorm: { name: "Thunderstorm", maxLevel: 10, type: "normal", desc: "Wind-element AoE attack dealing up to 8× MATK damage to targets in a 5*5 area.", req: { lightningBolt: 4 } },
        napalmBeat: { name: "Napalm Beat", maxLevel: 10, type: "normal", desc: "Deal up to 170% MATK Ghost-element damage to target and all enemies in a 3×3 area around it." },
        soulStrike: { name: "Soul Strike", maxLevel: 10, type: "normal", desc: "Ghost-element attack dealing up to 5× MATK damage to a single target. Does additional damage to Undead-element enemies.", req: { napalmBeat: 4 } },
        safetyWall: { name: "Safety Wall", maxLevel: 10, type: "normal", desc: "Use a Blue Gemstone to create a pillar on a cell that protects whoever stands in it from melee attacks.", req: { soulStrike: 5 } },
        stoneCurse: { name: "Stone Curse", maxLevel: 10, type: "normal", desc: "Attempt to turn target into stone, rendering it immobile and turning it to Earth 1 element.", req: { napalmBeat: 1 } },
        energyCoat: { name: "Energy Coat", maxLevel: 1, type: "quest", desc: "Reduces damage from incoming physical attacks while consuming SP.", quest: true, reqJob: 35 }
    },
    "Archer": {
        owlsEye: { name: "Owl's Eye", maxLevel: 10, type: "normal", desc: "Increases DEX by up to 10." },
        vulturesEye: { name: "Vulture's Eye", maxLevel: 10, type: "normal", desc: "Increases range and HIT when using bows.", req: { owlsEye: 3 } },
        improveConcentration: { name: "Improve Concentration", maxLevel: 10, type: "normal", desc: "Increase DEX and AGI by up to 12% for a duration. Uncovers hidden enemies in a 3*3 area when activated.", req: { vulturesEye: 1 } },
        doubleStrafe: { name: "Double Strafe", maxLevel: 10, type: "normal", desc: "Deal up to 380% damage to a single target." },
        arrowShower: { name: "Arrow Shower", maxLevel: 10, type: "normal", desc: "Deal up to 125% damage to targets in a 5*5 area around target.", req: { doubleStrafe: 5 } },
        arrowCrafting: { name: "Arrow Crafting", maxLevel: 1, type: "quest", desc: "Create arrows from various items.", quest: true, reqJob: 30 },
        arrowRepel: { name: "Arrow Repel", maxLevel: 1, type: "quest", desc: "Shoot a target to inflict 150% damage and push it back 6 cells.", quest: true, reqJob: 35 }
    },
    "Merchant": {
        enlargeWeight: { name: "Enlarge Weight Limit", maxLevel: 10, type: "normal", desc: "Increase your character's maximum Weight Limit by up to 2000 points." },
        discount: { name: "Discount", maxLevel: 10, type: "normal", desc: "Buy items from NPC's with an up to 24% discount.", req: { enlargeWeight: 3 } },
        overcharge: { name: "Overcharge", maxLevel: 10, type: "normal", desc: "Get up to 24% more Zeny from selling items to NPC's.", req: { discount: 3 } },
        pushcart: { name: "Pushcart", maxLevel: 10, type: "normal", desc: "Carry an additional 8000 weight units and/or 100 items in a separate inventory.", req: { enlargeWeight: 5 } },
        vending: { name: "Vending", maxLevel: 10, type: "normal", desc: "Open a shop with up to 12 item stacks for other players to buy.", req: { pushcart: 3 } },
        mammonite: { name: "Mammonite", maxLevel: 10, type: "normal", desc: "Powerful melee attack dealing up to 600% damage that costs up to 1000 Zeny." },
        itemAppraisal: { name: "Item Appraisal", maxLevel: 1, type: "normal", desc: "Identify items without a magnifier." },
        cartRevolution: { name: "Cart Revolution", maxLevel: 1, type: "quest", desc: "Melee AoE attack that gets stronger as your cart gets heavier.", quest: true, reqJob: 35 },
        changeCart: { name: "Change Cart", maxLevel: 1, type: "quest", desc: "Change your cart's appearance as you gain levels.", quest: true, reqJob: 30 },
        crazyUproar: { name: "Crazy Uproar", maxLevel: 1, type: "quest", desc: "A self-buff that grants +4 Strength.", quest: true, reqJob: 15 }
    },
    "Thief": {
        doubleAttack: { name: "Double Attack", maxLevel: 10, type: "normal", desc: "Adds a high chance to deal double damage when attacking with a dagger." },
        improveDodge: { name: "Improve Dodge", maxLevel: 10, type: "normal", desc: "Adds up to 30 Flee. Bonus increases when you become a Rogue or Assassin. Also increases Movement Speed if you're an Assassin." },
        steal: { name: "Steal", maxLevel: 10, type: "normal", desc: "Steal items from monsters. Affected monster may still drop the stolen item normally." },
        hiding: { name: "Hiding", maxLevel: 10, type: "normal", desc: "Hide to protect yourself. Does not work against Boss, Insect and Demon monsters, counterable by some AoE skills and items.", req: { steal: 5 } },
        envenom: { name: "Envenom", maxLevel: 10, type: "normal", desc: "Poison-element melee attack that deals up to 150 additional damage and has a chance of poisoning its target." },
        detoxify: { name: "Detoxify", maxLevel: 1, type: "normal", desc: "Cures yourself or a target from being poisoned.", req: { envenom: 3 } },
        backSlide: { name: "Back Slide", maxLevel: 1, type: "quest", desc: "Instantly move back 5 cells.", quest: true, reqJob: 35 },
        findStone: { name: "Find Stone", maxLevel: 1, type: "quest", desc: "Provide ammunition for Stone Fling or other creative uses.", quest: true, reqJob: 20 },
        sandAttack: { name: "Sand Attack", maxLevel: 1, type: "quest", desc: "Earth-element attack dealing 125% damage with a 15% chance of blinding its target.", quest: true, reqJob: 25 },
        stoneFling: { name: "Stone Fling", maxLevel: 1, type: "quest", desc: "Throw a stone at a target for 50 neutral-element, armor-ignoring damage. Has a 5% chance to blind and/or stun its target.", quest: true, reqJob: 15}
    },
    "Acolyte": {
        divineProtection: { name: "Divine Protection", maxLevel: 10, type: "normal", desc: "Increases VIT defense against Demons and Undead monsters by 3~30." },
        demonBane: { name: "Demon Bane", maxLevel: 10, type: "normal", desc: "Increases attack against against Demons and Undead monsters by 3~30.", req: { divineProtection: 3 } },
        ruwach: { name: "Ruwach", maxLevel: 1, type: "normal", desc: "Reveal hidden enemies in a 5×5 area around the user and deal 145% MATK damage to them." },
        teleport: { name: "Teleport", maxLevel: 2, type: "normal", desc: "Instantly move to a random spot on the map or the user's save spot. Does not work in PvP environments.", req: { ruwach: 1 } },
        warpPortal: { name: "Warp Portal", maxLevel: 4, type: "normal", desc: "Use a Blue Gemstone to open a portal to the user's save spot or an area memorized earlier for up to 8 players to pass through. (0~3 memo points, 10~25 seconds)", req: { teleport: 2 } },
        pneuma: { name: "Pneuma", maxLevel: 1, type: "normal", desc: "Protects a 3×3 area from incoming ranged attacks.", req: { warpPortal: 4 } },
        heal: { name: "Heal", maxLevel: 10, type: "normal", desc: "Restore a target's HP, or damage Undead targets. (Base factor 12~84)" },
        cure: { name: "Cure", maxLevel: 1, type: "normal", desc: "Cures a target from Silence, Blind and Chaos statuses.", req: { heal: 2 } },
        increaseAgi: { name: "Increase AGI", maxLevel: 10, type: "normal", desc: "For 60~240 seconds, increase target's AGI by 3~12.", req: { heal: 3 } },
        decreaseAgi: { name: "Decrease AGI", maxLevel: 10, type: "normal", desc: "Attempts to lower a target's AGI by 3~12 with 42~60% chance of success. (30~120 seconds vs. monsters, 20~65 seconds vs. players)", req: { increaseAgi: 1 } },
        angelus: { name: "Angelus", maxLevel: 10, type: "normal", desc: "Increase VIT DEF of the user and all party members nearby for 5~50% for 30~300 seconds.", req: { divineProtection: 3 } },
        signumCrusis: { name: "Signum Crusis", maxLevel: 10, type: "normal", desc: "Decrease Undead-element and Demon monsters' DEF by 14~50% in a wide radius around the user, with 27~63% success chance.", req: { demonBane: 3 } },
        aquaBenedicta: { name: "Aqua Benedicta", maxLevel: 1, type: "normal", desc: "Create 1 Holy Water while standing in shallow water. Each use consumes an Empty Bottle." },
        blessing: {name: "Blessing", maxLevel: 10, type: "normal", desc: "For 60~240 seconds, increase a target's STR, DEX and INT by 1~10. When used on Undead or Demons, reduces their DEX and INT by 50%.", req: { divineProtection: 5 }},
        holyLight: { name: "Holy Light", maxLevel: 1, type: "quest", desc: "Holy-element attack that deals 125% MATK damage to a single target. Cancels Kyrie Eleison on target.", quest: true, reqJob: 30 }
    }
};

const skillConnections = {
    "Novice": [["basicSkill", "firstAid"], ["basicSkill", "playDead"]],
    "Swordsman": [["swordMastery", "twoHandedMastery"], ["bash", "magnumBreak"], ["provoke", "endure"]],
    "Mage": [["napalmBeat", "soulStrike"], ["soulStrike", "safetyWall"], ["sight", "fireWall"], ["fireBolt", "fireBall"], ["fireBall", "fireWall"], ["coldBolt", "frostDiver"], ["lightningBolt", "thunderstorm"],["napalmBeat", "stoneCurse"]],
    "Archer": [["owlsEye", "vulturesEye"], ["vulturesEye", "improveConcentration"], ["doubleStrafe", "arrowShower"]],
    "Merchant": [["enlargeWeight", "discount"], ["enlargeWeight", "pushcart"], ["discount", "overcharge"], ["pushcart", "vending"]],
    "Thief": [["steal", "hiding"], ["envenom", "detoxify"]],
    "Acolyte": [["divineProtection", "demonBane"], ["divineProtection", "angelus"], ["demonBane", "signumCrusis"], ["heal", "cure"], ["heal", "increaseAgi"], ["increaseAgi", "decreaseAgi"], ["ruwach", "teleport"], ["teleport", "warpPortal"], ["warpPortal", "pneuma"], ["divineProtection", "blessing"]]
};

const skillTreeLayout = {
    "Novice": { basicSkill: { x: 50, y: 20 }, firstAid: { x: 35, y: 80 }, playDead: { x: 65, y: 80 } },
    "Swordsman": { swordMastery: { x: 50, y: 20 }, twoHandedMastery: { x: 50, y: 80 }, bash: { x: 30, y: 20 }, magnumBreak: { x: 30, y: 80 }, provoke: { x: 70, y: 20 }, endure: { x: 70, y: 80 }, increaseHP: { x: 50, y: 140 }, berserk: { x: 30, y: 200 }, fatalBlow: { x: 50, y: 200 }, movingHP: { x: 70, y: 200 } },
    "Mage": { fireBolt: { x: 50, y: 20 }, fireBall: { x: 50, y: 80 }, fireWall: { x: 50, y: 140 }, sight: { x: 30, y: 140 }, coldBolt: { x: 30, y: 20 }, frostDiver: { x: 30, y: 80 }, lightningBolt: { x: 70, y: 20 }, thunderstorm: { x: 70, y: 80 }, napalmBeat: { x: 50, y: 200 }, soulStrike: { x: 40, y: 260 }, safetyWall: { x: 60, y: 260 }, stoneCurse: { x: 30, y: 260 }, spRecovery: { x: 50, y: 320 }, energyCoat: { x: 50, y: 380 } },
    "Archer": { owlsEye: { x: 50, y: 20 }, vulturesEye: { x: 50, y: 80 }, improveConcentration: { x: 50, y: 140 }, doubleStrafe: { x: 35, y: 200 }, arrowShower: { x: 65, y: 200 }, arrowCrafting: { x: 35, y: 260 }, arrowRepel: { x: 65, y: 260 } },
    "Merchant": { enlargeWeight: { x: 50, y: 20 }, discount: { x: 30, y: 70 }, pushcart: { x: 70, y: 70 }, overcharge: { x: 30, y: 130 }, vending: { x: 70, y: 130 }, mammonite: { x: 30, y: 190 }, itemAppraisal: { x: 70, y: 190 }, cartRevolution: { x: 30, y: 250 }, changeCart: { x: 50, y: 250 }, crazyUproar: { x: 70, y: 250 } },
    "Thief": { steal: { x: 50, y: 20 }, hiding: { x: 50, y: 80 }, envenom: { x: 30, y: 20 }, detoxify: { x: 30, y: 80 }, doubleAttack: { x: 70, y: 20 }, improveDodge: { x: 70, y: 80 }, backSlide: { x: 20, y: 140 }, findStone: { x: 40, y: 140 }, sandAttack: { x: 60, y: 140 }, stoneFling: { x: 80, y: 140 } },
    "Acolyte": { heal: { x: 50, y: 20 }, cure: { x: 30, y: 70 }, increaseAgi: { x: 70, y: 70 }, decreaseAgi: { x: 70, y: 130 }, blessing: { x: 50, y: 190 }, divineProtection: { x: 50, y: 130 }, angelus: { x: 30, y: 130 }, demonBane: { x: 70, y: 190 }, signumCrusis: { x: 70, y: 250 }, ruwach: { x: 30, y: 190 }, teleport: { x: 30, y: 250 }, warpPortal: { x: 30, y: 310 }, pneuma: { x: 30, y: 370 }, aquaBenedicta: { x: 70, y: 310 }, holyLight: { x: 70, y: 370 } }
};

const skillTypes = {
    "Novice": { basicSkill: "Passive", firstAid: "Supportive", playDead: "Supportive" },
    "Swordsman": { swordMastery: "Passive", twoHandedMastery: "Passive", bash: "Offensive", magnumBreak: "Offensive", provoke: "Active", endure: "Active", increaseHP: "Passive", berserk: "Passive", fatalBlow: "Passive", movingHP: "Passive" },
    "Mage": { fireBolt: "Offensive", fireBall: "Offensive", fireWall: "Offensive", sight: "Active", coldBolt: "Offensive", frostDiver: "Offensive", lightningBolt: "Offensive", thunderstorm: "Offensive", napalmBeat: "Offensive", soulStrike: "Offensive", safetyWall: "Supportive", stoneCurse: "Active", spRecovery: "Passive", energyCoat: "Supportive" },
    "Archer": { owlsEye: "Passive", vulturesEye: "Passive", improveConcentration: "Supportive", doubleStrafe: "Offensive", arrowShower: "Offensive", arrowCrafting: "Active", arrowRepel: "Offensive" },    "Merchant": { enlargeWeight: "Passive", discount: "Passive", pushcart: "Passive", overcharge: "Passive", vending: "Active", mammonite: "Offensive", itemAppraisal: "Active", cartRevolution: "Offensive", changeCart: "Active", crazyUproar: "Supportive" },
    "Thief": { steal: "Active", hiding: "Active", envenom: "Offensive", detoxify: "Supportive", doubleAttack: "Passive", improveDodge: "Passive", backSlide: "Active", findStone: "Active", sandAttack: "Offensive", stoneFling: "Offensive" },
    "Acolyte": { heal: "Supportive", cure: "Supportive", increaseAgi: "Supportive", decreaseAgi: "Active", blessing: "Supportive", divineProtection: "Passive", angelus: "Supportive", demonBane: "Passive", signumCrusis: "Supportive", ruwach: "Offensive", teleport: "Supportive", warpPortal: "Supportive", pneuma: "Supportive", aquaBenedicta: "Active", holyLight: "Offensive" }
};

function formatSkillIcon(name) {
    return name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

function getMissingPoints(skillName, job) {
    let extra = 0;
    const skill = jobSkills[job][skillName];

    if (skill && skill.req) {
        for (const [reqName, reqLvl] of Object.entries(skill.req)) {
            if (jobSkills[job][reqName].quest) continue;

            const current = window.playerSkills[reqName] || 0;

            if (current < reqLvl) {
                extra += (reqLvl - current) + getMissingPoints(reqName, job);
            }
        }
    }
    return extra;
}

function onSkillClick(skillName, level) {
    // 1. Save to global tracking object
    window.playerSkills[skillName] = level; 
    
    // 2. Refresh skill logic
    handleSkillLevelChange(); 
    
    // 3. Force the stats panel to recalculate the bonuses (ATK, Flee, etc.)
    if (typeof updateStats === 'function') {
        updateStats(); 
    }
}

//handle skil level change
function handleSkillLevelChange(skipStatsUpdate = false) {
    const jobLvlInput = document.getElementById("jobLevel"); 
    const baseLvlInput = document.getElementById("baseLevel");
    const currentJob = document.getElementById("job").value;

    if (!jobLvlInput) return;

    const currentJobLevel = parseInt(jobLvlInput.value) || 1;
    const currentBaseLevel = parseInt(baseLvlInput?.value) || 1;

    // --- AUTO-RESET LOGIC ---
    let tempSpent = 0;
    Object.keys(window.playerSkills).forEach(key => {
        const skillData = jobSkills[currentJob]?.[key];
        if (skillData && !skillData.quest && skillData.type !== "quest") {
            tempSpent += window.playerSkills[key] || 0;
        }
    });

    if (currentJobLevel === 1 || tempSpent > (currentJobLevel - 1)) {
        Object.keys(window.playerSkills).forEach(key => {
            const skillData = jobSkills[currentJob]?.[key];
            if (skillData && !skillData.quest && skillData.type !== "quest") {
                window.playerSkills[key] = 0;
            }
        });
        console.log("Job Level modified: Passive stats cleared.");
    }

    // --- QUEST SKILL AUTO-UNLOCK ---
    const skills = jobSkills[currentJob];
    if (skills) {
        Object.keys(skills).forEach(key => {
            if (!(key in window.playerSkills)) window.playerSkills[key] = 0;

            const skill = skills[key];
            const isQuest = skill.quest === true || skill.type === "quest";

            if (isQuest) {
                let shouldUnlock = (currentJob === "Novice") 
                    ? currentBaseLevel >= (skill.reqBase || 4)
                    : currentJobLevel >= (skill.reqJob || 1);

                window.playerSkills[key] = shouldUnlock ? 1 : 0;
            }
        });
    }

    // --- SP CALCULATION ---
    let totalSpent = 0;
    Object.keys(window.playerSkills).forEach(key => {
        const skillData = jobSkills[currentJob]?.[key];
        if (!skillData || skillData.quest || skillData.type === "quest") return;
        totalSpent += window.playerSkills[key] || 0;
    });

    window.skillPoints = Math.max(0, (currentJobLevel - 1) - totalSpent);

    const spDisplay = document.querySelector(".sp-value");
    if (spDisplay) spDisplay.innerText = window.skillPoints;

    if (typeof updateSkillUI === 'function') updateSkillUI();

    // --- TRIGGER STATS UPDATE ---
    // If we are NOT coming from updateStats, trigger it now to refresh HP/Weight panels
    if (!skipStatsUpdate && typeof updateStats === 'function') {
        updateStats();
    }
}

function renderSkillsForJob(job) {
    const treeBody = document.getElementById("skillTreeBody");
    treeBody.innerHTML = "";
    const skills = jobSkills[job];
    if (!skills) return;

    Object.keys(skills).forEach(key => {
        const skill = skills[key];
        const el = document.createElement("div");
        el.className = "skill";
        el.dataset.name = skill.name;
        el.dataset.desc = skill.desc;
        el.innerText = skill.name;
        treeBody.appendChild(el);
    });

    const skillCount = Object.keys(skills).length;
    treeBody.style.transform = skillCount > 15 ? "scale(0.85)" : "scale(1)";
}

const jobSelect = document.getElementById("job");
jobSelect.addEventListener("change", () => {
    playerSkills = {}; // Reset learned skills on job change
    
    const treeBody = document.getElementById("skillTreeBody");
    if(treeBody) treeBody.style.transform = "scale(1)";
    
    renderSkillsForJob(jobSelect.value);
    handleSkillLevelChange();
});

function getSkillState(skillName) {
    const job = document.getElementById("job").value;
    const skill = jobSkills[job][skillName];

    if (!skill) return "locked";

    const level = window.playerSkills[skillName] || 0;
    if (level > 0) return "learned";

    const currentBaseLevel = parseInt(document.getElementById("baseLevel")?.value) || 1;
    const isQuest = skill.quest === true || skill.type === "quest";

    if (job === "Novice") {
        if (isQuest && currentBaseLevel < 4) return "locked";
    } else {
        if (currentJobLevel < (skill.reqJob || 1)) return "locked";
    }

    if (skill.req) {
        for (const [reqSkill, reqLevel] of Object.entries(skill.req)) {
            if ((window.playerSkills[reqSkill] || 0) < reqLevel) {
                return "locked";
            }
        }
    }

    if (isQuest) return "available";

    return window.skillPoints > 0 ? "available" : "locked";
}

function updateSkillUI() {
    const job = document.getElementById("job").value;
    const treeBody = document.getElementById("skillTreeBody");

    if (!treeBody) return;

    treeBody.innerHTML = "";

    const skills = jobSkills[job];
    const layout = skillTreeLayout[job];

    if (!skills || !layout) return;

    Object.keys(skills).forEach(skillName => {
        if (!(skillName in window.playerSkills)) {
            window.playerSkills[skillName] = 0;
        }

        const skill = skills[skillName];
        const pos = layout[skillName];

        if (!pos) return;

        const el = document.createElement("div");
        el.className = "skill";
        el.dataset.skill = skillName;

        const isQuest = skill.quest === true || skill.type === "quest";
        if (isQuest) el.classList.add("quest-skill");

        el.innerHTML = `
            <img src="skills/${formatSkillIcon(skill.name)}.png"
                 onerror="this.src='skills/default.png'">
            <span class="lvl">${window.playerSkills[skillName]}</span>
        `;

        el.style.left = pos.x + "%";
        el.style.top = pos.y + "px";
        el.style.transform = "translateX(-50%)";

        const state = getSkillState(skillName);
        el.classList.add(state);

        el.onclick = () => upgradeSkill(skillName);
        el.oncontextmenu = (e) => {
            e.preventDefault();
            decreaseSkill(skillName);
        };

        treeBody.appendChild(el);
    });

    document.querySelector("#skillPoints .sp-value").innerText = window.skillPoints;

    setTimeout(drawSkillConnections, 50);
    bindSkillTooltips();
}

// New helper to check if a skill is affordable including its prerequisites
function getTotalCostToUpgrade(skillName, job) {
    let cost = 0;
    const skill = jobSkills[job][skillName];

    if (!skill || skill.quest || skill.type === "quest") return 0;

    // 1. Cost for the skill itself (if not already maxed)
    const currentLevel = window.playerSkills[skillName] || 0;
    if (currentLevel < skill.maxLevel) {
        cost += 1;
    } else {
        return 0; // Already maxed, no additional cost
    }

    // 2. Cost for prerequisites (recursive)
    if (skill.req) {
        for (const [reqName, reqLvl] of Object.entries(skill.req)) {
            const reqSkillData = jobSkills[job][reqName];
            
            // Skip quest skills as they don't cost points
            if (reqSkillData.quest || reqSkillData.type === "quest") continue;

            const currentReqLvl = window.playerSkills[reqName] || 0;
            if (currentReqLvl < reqLvl) {
                // Add the points needed to reach the required level
                cost += (reqLvl - currentReqLvl);
                // Also check if THAT prerequisite needs its own prerequisites
                cost += getMissingPoints(reqName, job); 
            }
        }
    }
    return cost;
}

// Optimized recursive function to actually APPLY the levels
function autoUpgradeParents(skillName, job) {
    const skill = jobSkills[job][skillName];
    if (!skill || !skill.req) return;

    for (const [reqName, reqLvl] of Object.entries(skill.req)) {
        const reqSkillData = jobSkills[job][reqName];
        if (reqSkillData.quest || reqSkillData.type === "quest") continue;

        // Ensure parent is at required level
        if ((window.playerSkills[reqName] || 0) < reqLvl) {
            autoUpgradeParents(reqName, job); // Go deeper first
            window.playerSkills[reqName] = reqLvl;
        }
    }
}

// Updated Upgrade function
function upgradeSkill(skillName) {
    const job = document.getElementById("job").value;
    const skill = jobSkills[job][skillName];
    const skillElement = document.querySelector(`[data-skill="${skillName}"]`);

    if (!skill || skill.quest || skill.type === "quest") return;

    const currentLevel = window.playerSkills[skillName] || 0;
    if (currentLevel >= skill.maxLevel) return;

    // Calculate total points needed for this click
    const totalRequired = getTotalCostToUpgrade(skillName, job);

    if (window.skillPoints >= totalRequired && totalRequired > 0) {
        // 1. Level up parents to their minimum requirements
        autoUpgradeParents(skillName, job);
        
        // 2. Level up the target skill
        window.playerSkills[skillName] = currentLevel + 1;

        // 3. Refresh SP and UI
        handleSkillLevelChange();
    } else {
        //Flash red if points are missing
        if (skillElement) {
            skillElement.classList.add("insufficient-points");
            
            // Remove the class after the animation ends (500ms)
            setTimeout(() => {
                skillElement.classList.remove("insufficient-points");
            }, 500);
        }
        console.log(`Need ${totalRequired} SP. You only have ${window.skillPoints}.`);
    }
}

// Decreases a skill and its dependents (to prevent broken trees)
function decreaseSkill(skillName) {
    const job = document.getElementById("job").value;
    const skill = jobSkills[job][skillName];

    if (!skill) return;

    // cannot downgrade quest
    if (skill.quest || skill.type === "quest") return;

    const currentLevel = window.playerSkills[skillName] || 0;

    if (currentLevel <= 0) return;

    window.playerSkills[skillName] = currentLevel - 1;

    handleSkillLevelChange();
}

function bindSkillTooltips() {
    let tooltip = document.querySelector('.skill-tooltip') || document.createElement('div');
    if (!tooltip.className) {
        tooltip.className = 'skill-tooltip';
        document.body.appendChild(tooltip);
    }

    const skills = document.querySelectorAll('.skill');
    const job = document.getElementById("job").value;
    const currentBaseLevel = parseInt(document.getElementById("baseLevel")?.value) || 1;

    skills.forEach(skillEl => {
        const skillName = skillEl.dataset.skill;
        const skill = jobSkills[job][skillName];

        skillEl.onmouseenter = () => {
            const skillType = (skillTypes[job] && skillTypes[job][skillName]) || "Passive";
            const isQuest = skill.type === "quest" || skill.quest === true;
            let reqText = "";
            
            if (isQuest) {
                if (job === "Novice") {
                    const met = currentBaseLevel >= 4;
                    reqText = `<br><span style="color:${met ? "#90ee90" : "#ff4d4d"}">Requires Base Lv: 4</span>`;
                } else {
                    const reqJobLvl = skill.reqJob || 1;
                    const met = currentJobLevel >= reqJobLvl;
                    reqText = `<br><span style="color:${met ? "#90ee90" : "#ff4d4d"}">Requires Job Lv: ${reqJobLvl}</span>`;
                }
            }

            let prereqText = "";
            if (skill.req) {
                Object.entries(skill.req).forEach(([reqName, reqLvl]) => {
                    const met = (playerSkills[reqName] || 0) >= reqLvl;
                    prereqText += `<br><span style="color:${met ? "#90ee90" : "#ff4d4d"}">Requires ${jobSkills[job][reqName].name} Lv: ${reqLvl}</span>`;
                });
            }

            tooltip.innerHTML = `
                <strong>${skill.name}</strong><br>
                ${skill.maxLevel ? `<em>Max Level: ${skill.maxLevel}</em><br>` : ""}
                ${skill.desc}
                ${reqText}${prereqText}
                <div style="margin-top:4px; font-size:11px; color:${isQuest ? "#ff69b4" : "#ffd96a"};">
                    Type: ${skillType}${isQuest ? " (Quest Skill)" : ""}
                </div>
            `;
            tooltip.classList.add('show');
        };

        skillEl.onmouseleave = () => tooltip.classList.remove('show');
        skillEl.onmousemove = (e) => {
            tooltip.style.left = e.clientX + 14 + 'px';
            tooltip.style.top = e.clientY - 16 + 'px';
        };
    });
}

function drawSkillConnections() {
    const job = document.getElementById("job").value;
    const layer = document.getElementById("skillConnections");
    if (!layer) return;
    layer.innerHTML = "";
    const connections = skillConnections[job];
    if (!connections) return;

    const treeBody = document.getElementById("skillTreeBody");
    const parentRect = treeBody.getBoundingClientRect();
    const scale = treeBody.style.transform ? parseFloat(treeBody.style.transform.replace("scale(", "").replace(")", "")) : 1;

    connections.forEach(([from, to]) => {
        const fromEl = document.querySelector(`[data-skill="${from}"]`);
        const toEl = document.querySelector(`[data-skill="${to}"]`);
        if (!fromEl || !toEl) return;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = ((fromRect.left + fromRect.width / 2) - parentRect.left) / scale;
        const y1 = ((fromRect.top + fromRect.height / 2) - parentRect.top) / scale;
        const x2 = ((toRect.left + toRect.width / 2) - parentRect.left) / scale;
        const y2 = ((toRect.top + toRect.height / 2) - parentRect.top) / scale;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        const line = document.createElement("div");
        line.className = "arrow-line";
        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}deg)`;
        layer.appendChild(line);
    });
}

// Initial Event Listeners
// Ensure both level changes trigger the check
document.getElementById("jobLevel")?.addEventListener("input", handleSkillLevelChange);
document.getElementById("baseLevel")?.addEventListener("input", handleSkillLevelChange);

document.getElementById("job")?.addEventListener("change", () => {
    window.playerSkills = {};
    handleSkillLevelChange();}
);

//anuu daw