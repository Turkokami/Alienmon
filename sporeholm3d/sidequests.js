/* Side quests for the first levels (Dustara + Ferrox), built on the story actor system in game.js.
   game.js exposes window.STORY.SQ = {world, P, T, ae, save} and calls window.__SQ.talk / hint / bang.
   S03 Pink Gills (Dustara): beat the pink Blinkit by the trading post stalls 3 times -> Harmonic Pod.
   S21 Crane Yard Brawl (Ferrox): Hank Briggs asks you to beat 3 junkers at the crane yard -> 2 Mega Gels.
   S22 Forgemaul Sighting (Ferrox): the Scrapper at Coolant Pond; wait for night at the Forge Rock,
       catch the Forgemaul -> 800 Stardust.
   Save flags live in the story save: r.flags.s03 / s03w, s21, s22 (0 or missing = not started, 1 = active, 2 = done). */
(() => {
  const ST = () => window.STORY, RPG = () => window.RPG;
  const say = (a, d) => ST().play(a, d);
  const pod = () => RPG().S;
  const has = (sp) => pod().party.concat(pod().box).some((m) => m.sp === sp);
  const fighting = () => !!(RPG() && RPG().B);
  const talking = () => { try { return !!ST().CS.on; } catch (e) { return false; } };
  let cur = null;        // the SQ object we registered on
  let H = {};            // talk / hint / bang for the current world
  let tick = null;       // per-frame logic for the current world
  let busy = false;      // a side-quest battle is starting or running

  const startTrainer = (opts) => {
    if (busy || fighting() || !pod().party.length) return;
    busy = true;
    const done = (fn) => (...a) => { busy = false; fn && fn(...a); };
    // startTrainer resolves once the battle has begun; if it refused (team needs rest), free the lock
    Promise.resolve(RPG().startTrainer(Object.assign({}, opts, { onWin: done(opts.onWin), onLose: done(opts.onLose) })))
      .then(() => { if (!fighting()) busy = false; }, () => { busy = false; });
  };

  /* ---------------- Dustara: S03 Pink Gills ---------------- */
  const dustara = (sq) => {
    const { P, T, ae, save } = sq, r = ST().ST, f = r.flags;
    const PB = "The pink Blinkit";
    P("sqBlink", { name: "Pink Blinkit", mon: "Blinkit", h: 0.5, scene: "DB4", pos: () => ae(104.5, 51.5),
      show: () => pod().party.length > 0 && !(busy && fighting()) });
    const fight = () => {
      const a = T.sqBlink, n = (f.s03w | 0) + 1;
      startTrainer({ x: a.x, z: a.z, name: "Pink Blinkit", solo: "Pink", team: [["Blinkit", 4 + n]],
        intro: [n === 1 ? PB + " puffs up its gills and glares at you!" : PB + " puffs up its gills again! Round " + n + "!"],
        canLose: true, loseLines: [PB + " flutters its gills proudly.", "Rest up and try again!"],
        noRun: PB + " blocks the way. It wants to finish this battle!",
        noLink: PB + " bats the pod away. It only wants a battle!",
        onWin: () => {
          f.s03w = n;
          if (n >= 3) {
            f.s03 = 2; RPG().give("harmonic", 1); save();
            say([{ cam: "sqBlink" }, "After its third loss it happily hands you a shiny stone it was guarding.",
              "It's a Harmonic Pod! Rook received 1 Harmonic Pod."]);
          } else {
            save();
            say([{ cam: "sqBlink" }, PB + " shakes off the loss and puffs its gills right back up. " + (3 - n) + (n === 2 ? " more win" : " more wins") + " to go!"]);
          }
        },
        onLose: () => {} });
    };
    H.talk = (id) => {
      if (id !== "sqBlink") return false;
      if (f.s03 === 2) { say([{ cam: id }, PB + " chirps happily and wiggles its gills at you."]); return true; }
      if (!pod().party.length) return true;
      if (!f.s03) { f.s03 = 1; f.s03w = 0; save();
        say([{ cam: id }, "The pink Alienmon puffs up its gills. It looks like it wants a rematch... again and again."], fight); return true; }
      say([{ cam: id }, "Keep at it, Linker. You've got this."], fight);
      return true;
    };
    H.hint = (id) => id === "sqBlink" ? (f.s03 === 2 ? "E  Talk to the Pink Blinkit" : "E  Battle the Pink Blinkit  (!)") : null;
    H.bang = (id) => id === "sqBlink" && f.s03 !== 2 && !busy;
    tick = null;
  };

  /* ---------------- Ferrox: S21 Crane Yard Brawl + S22 Forgemaul Sighting ---------------- */
  const ferrox = (sq) => {
    const { P, T, ae, save } = sq, r = ST().ST, f = r.flags;
    const STEPS = ["arrive", "route", "orphans", "homes", "gleam", "caboose", "tower", "keeper", "hankB", "hangar", "done"];
    const past = (s) => STEPS.indexOf(r.step) >= STEPS.indexOf(s);
    const HANK = "Hank Briggs";
    const O3 = Object.getPrototypeOf(window.GAME.sc.constructor.prototype).constructor; // THREE.Object3D

    // S21: three junkers in front of the jammed crawler crane (Crane Overlook)
    const J = [
      { id: "sqJ1", name: "Junker Rizz", model: "d055_scorpion_shell_packer", at: [129.6, 24.2],
        team: [["Cogglet", 10], ["Gearhound", 11]],
        hi: "These cranes are full of free scrap. Finders keepers!", bye: "Fine, fine! I'll find another yard." },
      { id: "sqJ2", name: "Junker Marta", model: "d025_salt_flat_runner", at: [132.2, 25.0],
        team: [["Coilet", 11], ["Magnub", 11]],
        hi: "Rizz lost? Then I'll jam the cranes myself!", bye: "Ugh. Hank's got a bodyguard now." },
      { id: "sqJ3", name: "Junker Bolt", model: "d028_obsidian_bead_cutter", at: [134.8, 24.2],
        team: [["Gleamgrub", 11], ["Gongorr", 12]],
        hi: "I'm the boss of this crew. You won't beat me!", bye: "Okay, okay! We'll leave the cranes alone." },
    ];
    const next = () => J.find((j) => !r.beat[j.id]);
    J.forEach((j) => {
      const a = P(j.id, { name: j.name, model: j.model, h: 1.75, scene: "FA5", pos: () => ae(j.at[0], j.at[1]),
        show: () => f.s21 === 1 && !r.beat[j.id] });
      // Only the next junker in line battles; the game's own trainer trigger reads .trainer
      Object.defineProperty(a, "trainer", { enumerable: true, get: () => (f.s21 === 1 && next() === j ? {
        name: j.name, team: j.team, intro: [j.name + ": " + j.hi], winLines: [j.name + ": " + j.bye], prize: 200 } : null) });
    });
    const allBeat = () => J.every((j) => r.beat[j.id]);

    // S22: the Scrapper (talk overlay on the townsfolk Scrapper), the Forge Rock and the Forgemaul
    const npcAt = (name, x, z) => {
      const v = ae(x, z), n = (window.GAME.NPCS || []).find((n) => n.name === name);
      if (n) v.set(n.x, window.GAME.groundY(n.x, n.z), n.z);
      return v;
    };
    P("sqScrap", { name: "Scrapper", build: () => new O3(), h: 1.7, scene: "FC5", pos: () => npcAt("Scrapper", 137, 73),
      show: () => r.step !== "arrive" });
    P("sqRock", { name: "Forge Rock", build: () => new O3(), h: 2.6, scene: "FC5", pos: () => ae(137.6, 82.4),
      show: () => f.s22 === 1 && !has("Forgemaul") && !window.ISNIGHT() });
    let maulBattle = null, wasNight = null;
    P("sqMaul", { name: "Forgemaul", mon: "Forgemaul", h: 1.8, scene: "FC5", pos: () => ae(135.6, 80.4),
      show: () => f.s22 === 1 && !has("Forgemaul") && window.ISNIGHT() });
    const W = window.GAME.WILD;
    if (W && !W.__sq) { const push = W.push; W.push = function (...a) { return push.apply(this, a.filter((x) => !(x && x.__sq))); }; W.__sq = 1; }

    const hankIds = ["hankK", "hankY", "hankH"];
    const hankStory = (id, step) => (id === "hankK" && ["tower", "keeper"].includes(step)) || (id === "hankH" && step === "hangar");
    const s21Ready = () => past("hankB") && (!f.s21 || (f.s21 === 1 && allBeat()));

    const fightMaul = () => {
      const a = T.sqMaul;
      if (!a.G || busy || fighting()) return;
      const w = { G: a.G, x: a.x, z: a.z, name: "Forgemaul", __sq: 1 };
      maulBattle = { w, had: has("Forgemaul"), G: a.G };
      RPG().startWild(w);
      if (!fighting()) maulBattle = null;   // refused (team needs rest)
    };

    H.talk = (id, a, step) => {
      if (hankIds.includes(id)) {
        if (hankStory(id, step) || !past("hankB")) return false;
        if (!f.s21) {
          f.s21 = 1; save();
          say([{ cam: id }, HANK + ": Three junkers keep jamming my cranes. Teach 'em some manners.",
            HANK + ": They hang around the big crawler crane at Crane Overlook. Go show 'em what a Linker can do."]
            .concat(step === "hankB" ? [HANK + ": And come by my hangar after, son."] : []));
          return true;
        }
        if (f.s21 === 1 && allBeat()) {
          f.s21 = 2; RPG().give("megagel", 2); save();
          say([{ cam: id }, HANK + ": Cranes are running smooth. You're welcome back anytime.", "Rook received 2 Mega Gels."]);
          return true;
        }
        if (f.s21 === 1) { say([{ cam: id }, "Keep at it, Linker. You've got this."]
          .concat(step === "hankB" ? [HANK + ": Come by my hangar, son. First thing."] : [])); return true; }
        return false;   // S21 done: Hank's own lines
      }
      const j = J.find((j) => j.id === id);
      if (j) {
        const n = next();
        if (n === j) return false;   // the game starts the trainer battle
        say([{ cam: id }, j.name + ": Beat " + n.name.split(" ")[1] + " first, if you can!"]);
        return true;
      }
      if (id === "sqScrap") {
        if (f.s22 === 2) { say([{ cam: id }, "Scrapper: That Forgemaul of yours still makes my ears ring. Legend."]); return true; }
        if (f.s22 === 1 && has("Forgemaul")) {
          f.s22 = 2; pod().dust += 800; save();
          say([{ cam: id }, "Scrapper: You actually did it! Legend.", "Rook received 800 Stardust."]);
          return true;
        }
        if (f.s22 === 1) { say([{ cam: id }, "Keep at it, Linker. You've got this.",
          "Scrapper: The Forge Rock's at the south end of the pond. It only shows up after dark."]); return true; }
        f.s22 = 1; save();
        say([{ cam: id }, "Scrapper: Something big's been hammering down by the pond at night. A Forgemaul, they say. Nobody's ever caught one.",
          "Scrapper: Wait by the Forge Rock at the south end of the pond after dark. Bring plenty of pods!"]);
        return true;
      }
      if (id === "sqRock") {
        say([{ cam: id }, "Nothing here but warm, dented rock and the hiss of coolant.",
          "Rook sits down by the Forge Rock and waits for the sun to go down...",
          () => { wasNight = window.ISNIGHT(); window.SETNIGHT(true); },
          { wait: 1.2 }, "CLANG! CLANG! Something huge is hammering on the Forge Rock!"]);
        return true;
      }
      if (id === "sqMaul") { fightMaul(); return true; }
      return false;
    };
    H.hint = (id, a, step) => {
      if (hankIds.includes(id)) return !hankStory(id, step) && s21Ready() ? "E  Talk to " + HANK + "  (!)" : null;
      const j = J.find((j) => j.id === id);
      if (j) return next() === j ? "E  Battle " + j.name + "  (!)" : "E  Talk to " + j.name;
      if (id === "sqScrap") return "E  Talk to Scrapper" + (!f.s22 || (f.s22 === 1 && has("Forgemaul")) ? "  (!)" : "");
      if (id === "sqRock") return "E  Wait for nightfall at the Forge Rock  (!)";
      if (id === "sqMaul") return "E  Battle the wild Forgemaul  (!)";
      return null;
    };
    H.bang = () => false;
    const BANG = (a, on) => { if (a && a.bub) a.bub.visible = !!on && !!a.G && a.G.visible && !talking() && !fighting(); };
    tick = () => {
      BANG(T.sqJ1, next() === J[0]); BANG(T.sqJ2, next() === J[1]); BANG(T.sqJ3, next() === J[2]);
      BANG(T.sqScrap, !f.s22 || (f.s22 === 1 && has("Forgemaul")));
      BANG(T.sqRock, true); BANG(T.sqMaul, true);
      for (const id of hankIds) if (T[id] && !hankStory(id, r.step)) BANG(T[id], s21Ready());
      // Forgemaul battle bookkeeping
      if (maulBattle) {
        if (fighting()) maulBattle.on = true;
        else if (maulBattle.on && !talking()) {
          const mb = maulBattle; maulBattle = null;
          const a = T.sqMaul;
          if (a.G === mb.G) { if (a.G.parent) a.G.parent.remove(a.G); a.G = null; }  // reload at its rock next frame
          const caught = !mb.had && has("Forgemaul");
          const dawn = wasNight === false;
          say([caught ? (dawn ? "The hammering stops. Dawn creeps back over Coolant Pond. " : "The hammering stops. ") + "Time to tell the Scrapper!"
            : "The Forgemaul crashes off into the dark." + (dawn ? " The sun comes back up over Coolant Pond." : ""),
            () => { if (dawn) window.SETNIGHT(false); wasNight = null; }]);
        }
      }
    };
  };

  /* ---------------- wiring ---------------- */
  window.__SQ = {
    talk: (id, a, step) => { try { return !!(H.talk && H.talk(id, a, step)); } catch (e) { console.error(e); return false; } },
    hint: (id, a, step) => { try { return H.hint ? H.hint(id, a, step) : null; } catch (e) { return null; } },
    bang: (id) => { try { return !!(H.bang && H.bang(id)); } catch (e) { return false; } },
  };
  const loop = () => {
    try {
      const s = window.STORY && window.STORY.SQ;
      if (s && s !== cur && window.RPG && window.GAME) {
        cur = s; H = {}; tick = null;
        if (s.world === "dustara") dustara(s); else if (s.world === "ferrox") ferrox(s);
      }
      if (tick) tick();
    } catch (e) { console.error("sidequests", e); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
