// ================= GLYPHOS SCENES (planet 06: the jungle of the Ystran ruins and the Dig Camp) =================
// 51 areas on the same 30 x 30 grid as the other worlds, x 10..249, z -30..179 (row r at z = -30 + 30r):
// r0  F1 Chime Falls Upper - F2 Chime Falls Ridge - S1 Sunspire North - S2 Sunspire Summit Trail - V1 Canopy Walk - Y9 Temple of Voices
// r1  Q4 Fern Hollow - F3 Chime Falls Basin - F4 Chime Falls Pool - S3 Sunspire West - S4 Sunspire Trailhead - V2 Canopy Walk Landing - Y8 Temple Steps
// r2  YK Grotto Deep Chamber - YE Grotto Lower Hall - YB Grotto Upper Hall - YX Sunken Channel - YZ Forgotten Forum - YV Temple of Trials - YY Glyph Hollow
// r3  Q1 Vine Bridge Canopy - Q2 Heron Pools - Q3 Old Quarry - YG Drowned Grotto - Q6 Monolet Garden - YA Pillar Hollows - Y4 Storehouse - E1 Excavation Pits
// r4  YO Coral Grove - Y7 Sunken Temple Court - YU Tidepool Ruins - YS Glyph Steps - YQ Quiet Court - YM Mural Overlook - E2 Sunwell Terraces - E3 Orchid Ravine
// r5  YI Island Chain - YN Sunken Shallows - YT Tidepool Fork - YJ Glyph Junction - YC Ruin Crossroads - YW Landing Causeway - YP Spaceport - E4 Beacon Point
// r6  EC Shipwreck Cove - YL Sunken Landing (spawn) - YD Dig Camp - YH Lane Homes - YF Farmstead - YR Relay Tower - EB Turtle Beach
const gyO = (X, Y, x, z, ry = 0) => ({ x: X + x, z: Y + z, ry });
// door paths: a short flagstone walk from each building's south door down (or up) to a row that is already walkable
const gyDoors = (X, Y, bld, t = "s") => { for (const b of bld) { const dx = X + b[1] + Math.floor(b[3] / 2), dy = Y + b[2] + b[4]; let y = dy; while (y < dy + 6 && !"pPs,.gk".includes(at(dx, y))) y++; tLine(dx - 0.5 + 0.5, dy, dx + 0.5, y + 0.5, 3, t); } };
// a wild area: a ragged meadow around the hub, extra blobs (meadow, clearing, water, field), patches of tall grass and an optional quest stele
const gyW = (id, gx, gy, name, o = {}) => { const hub = o.hub || [15, 15];
  TS({ id, gx, gy, name, hub, wild: !o.town, wk: o.wk, jungle: o.jungle, palms: o.palms, trees: o.trees, rocks: o.rocks, grotto: o.grotto, ruins: o.ruins, bld: o.bld,
    ground(X, Y) { if (o.base) fillT(X, Y, X + 29, Y + 29, o.base); if (o.r !== 0) tBlob(X + hub[0], Y + hub[1], (o.r ?? 10) + (o.town ? 0 : 1.6), o.hubT || "g", 0.32, gx * 0.13 + gy * 0.07);
      for (const [x, y, r, t, amp] of o.blobs || []) tBlob(X + x, Y + y, r, t || "g", amp ?? 0.3, x * 0.7 + y * 0.3 + gx * 0.01);
      if (o.ground) o.ground(X, Y); },
    after(X, Y) { if (o.after) o.after(X, Y); if (o.bld) gyDoors(X, Y, o.bld, o.wild === false ? "s" : ","); },
    build(X, Y) { for (const [x, y, rx, rz, k, n] of o.grass || []) tgW(X + x, Y + y, rx, rz, k, { name: n }); if (o.quest) gyQuest(X + o.quest[0], Y + o.quest[1], o.quest[2], o.quest[3], o.quest[4] || 0); if (o.build) o.build(X, Y); } }); };
const gyOnTrail = (x, z) => { for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) if ("p,ks".includes(at(Math.floor(x + dx * 0.8), Math.floor(z + dz * 0.8)))) return true; return false; };
const gyRuinRing = (X, Y, cx, cz, r, n, h = 3.6, broken = 0.4, a0 = 0) => { for (let k = 0; k < n; k++) { const a = (k / n) * TAU + a0, px = X + cx + Math.cos(a) * r, pz = Y + cz + Math.sin(a) * r; if (gyOnTrail(px, pz)) continue; gyColumn({ x: px, z: pz, ry: 0 }, h, nh(X + k, Y, 5) < broken ? 0.4 + nh(X, Y + k, 6) * 0.5 : 0); } };
const gyCascade = (x, z, w, h, ry = 0) => { const G = grp(x, 0, z, ry), wm = thM("gyFall", () => new THREE.MeshStandardMaterial({ color: "#bff4ee", emissive: "#3a8a88", emissiveIntensity: 0.25, transparent: true, opacity: 0.78, roughness: 0.15, side: THREE.DoubleSide }));
  const g = new THREE.PlaneGeometry(w, h, 6, 12), P = g.attributes.position; for (let i = 0; i < P.count; i++) { const y = P.getY(i), u = (y + h / 2) / h; P.setZ(i, (1 - u) * (1 - u) * 1.6 + Math.sin(P.getX(i) * 3 + y) * 0.05); } g.computeVertexNormals(); add(g, wm, [0, h / 2 + 0.1, 0.2], [0, 0, 0], "nocol", G);
  for (let k = 0; k < 5; k++) add(new THREE.SphereGeometry(0.6 + R() * 0.5, 8, 6), thM("gyFoam", () => new THREE.MeshStandardMaterial({ color: "#f4fffc", transparent: true, opacity: 0.55, roughness: 0.4 })), [(R() - 0.5) * w, 0.15, 1.6 + R() * 0.8], [0, 0, 0], "nocol", G); return G; };
const gyCliff = (O, L, h) => { for (let u = 0; u < L; u += 1.6) { const hh = h * (0.8 + gh(O.x + u, O.z, 700) * 0.4); nnBx("stone", O, u + 0.8, 0, 0, 1.9, hh, 2.2 + gh(O.x + u, O.z, 701) * 1.2, ["#a89a7a", "#9a8c6c", "#b4a684", "#8c8064"][Math.floor(gh(O.x + u, O.z, 702) * 4)], (gh(O.x, O.z + u, 703) - 0.5) * 0.12); if (gh(O.x + u, O.z, 704) < 0.5) gyMoss(O, u + 0.8, hh, 0.3, 0.9 + gh(O.x + u, O.z, 705) * 0.6); } };

// ---------------- row 6: the south coast ----------------
gyW("EC", 10, 150, "Shipwreck Cove", { hub: [16, 11], r: 9, palms: 0.5, blobs: [[10, 20, 8, "."], [7, 26, 9, "w", 0.25], [22, 24, 5, "g"]],
  ground(X, Y) { fillT(X, Y + 27, X + 29, Y + 29, "w"); },
  grass: [[22, 22, 3.5, 2.6, "tide", "Cove dune grass"], [8, 8, 3, 2.4, "jungle", "Cove jungle edge"]], quest: [13, 19, "shipwreck-log", "Recover the captain's log", 0.4],
  build(X, Y) { const G = grp(X + 6, -0.3, Y + 22, 0.5); add(new THREE.CylinderGeometry(1.4, 1.1, 9, 10, 1, true, 0, Math.PI), thMat.woodD(), [0, 0.4, 0], [Math.PI / 2, 0.3, 0.25], null, G); for (let k = -3; k <= 3; k++) add(new THREE.BoxGeometry(0.16, 2.2, 0.16), thMat.woodD(), [1.1, 0.8, k * 1.2], [0, 0, 0.35], "nocol", G); add(new THREE.CylinderGeometry(0.1, 0.13, 6, 6), thMat.woodD(), [0, 2.4, 1.5], [0.6, 0, 0.9], "nocol", G);
    gyBoat(X + 23, Y + 27.5, 0.4); gyCrates(gyO(X, Y, 11, 21, 0.6), 3); gyRock(gyO(X, Y, 3, 15), 1.6); gyRock(gyO(X, Y, 26, 18), 1.2); gyCampfire(gyO(X, Y, 18, 19)); } });

gyW("YL", 40, 150, "Sunken Landing", { town: true, hub: [15, 13], r: 13, palms: 0.4,
  bld: [["g_store", 2, 1, 9, 7, "Harbor Store"], ["g_home", 20, 1, 9, 7, "Harbormaster's Hut"], ["g_hut", 21, 17, 8, 6, "Net Mender's Hut"]],
  ground(X, Y) { ellT(X + 15, Y + 13, 7, 5.5, "P"); fillT(X + 1, Y + 9, X + 28, Y + 17, "g"); tLine(X + 2, Y + 13, X + 28, Y + 13, 5, "p"); fillT(X, Y + 24, X + 29, Y + 29, "w"); tBlob(X + 8, Y + 21, 5, ".", 0.25, 3); tBlob(X + 15, Y + 22, 4, ".", 0.2, 4); },
  after(X, Y) { tLine(X + 15, Y + 18, X + 15, Y + 29, 3.4, "k", "w"); tLine(X + 15, Y + 27, X + 24, Y + 27, 3.4, "k", "w"); },
  grass: [[6, 21, 3, 2, "tide", "Landing shore grass"]],
  build(X, Y) { gyChimeTower(gyO(X, Y, 15, 13), 6); for (const [x, z] of [[10, 9.5], [20, 9.5], [10, 16.8], [20, 16.8]]) gyBrazier(gyO(X, Y, x, z)); gyBoat(X + 11.5, Y + 27.5, 0.2); gyBoat(X + 20, Y + 29, -0.3); gyFlag(gyO(X, Y, 13.2, 20.5), 4.5, GYC.turq); gyFlag(gyO(X, Y, 16.8, 20.5), 4.5, GYC.gold);
    gyCrates(gyO(X, Y, 18, 21.5, 0.3), 4); gyAwning(gyO(X, Y, 6, 18.5, 0.1), 4.5, 2.6, 2.4, "#e8dcc0"); gyTable(gyO(X, Y, 6, 18.8)); gyBench(gyO(X, Y, 9.5, 9.3, Math.PI)); gyBench(gyO(X, Y, 20.5, 9.3, Math.PI)); } });

gyW("YD", 70, 150, "Dig Camp", { town: true, hub: [15, 13], r: 13,
  bld: [["g_clinic", 2, 1, 9, 7, "Dig Camp Recovery Tent"], ["g_store", 19, 1, 10, 8, "Dig Camp HQ Tent"], ["g_tent", 2, 18, 9, 6, "Expedition Tent"], ["g_hut", 19, 18, 10, 7, "Finds Shed"]],
  ground(X, Y) { fillT(X + 1, Y + 8, X + 28, Y + 28, "g"); ellT(X + 15, Y + 13, 6, 4.6, "P"); tLine(X + 1, Y + 13, X + 29, Y + 13, 5, "p"); tLine(X + 2, Y + 26.5, X + 28, Y + 26.5, 3, ","); tBlob(X + 15, Y + 22, 3.6, ".", 0.2, 2); },
  grass: [[25, 28, 3, 1.4, "ruin", "Dig Camp spoil heaps"]], quest: [24.5, 16.5, "lost-trowel", "Find Dr. Ixa's lost trowel", -0.5],
  build(X, Y) { gyCampfire(gyO(X, Y, 15, 13)); for (const [x, z] of [[11, 10.4], [19, 10.4], [11, 15.8], [19, 15.8]]) gyLantern(gyO(X, Y, x, z)); gyDigGrid(gyO(X, Y, 15, 21.5), 5, 4); gySieve(gyO(X, Y, 12, 18.6, 0.4)); gyBarrow(gyO(X, Y, 18.4, 18.8, -0.6));
    gyLookout(gyO(X, Y, 28, 16.8), 6); gyFlag(gyO(X, Y, 28, 8.8), 5, GYC.gold); gyFlag(gyO(X, Y, 1.5, 9), 4.5, GYC.turq); gyAwning(gyO(X, Y, 23.5, 16.6), 4.4, 2.2, 2.3, "#e8d8b0"); gyTable(gyO(X, Y, 23.5, 16.7)); gyToolRack(gyO(X, Y, 27.2, 9.4)); gyCrates(gyO(X, Y, 3.5, 16, 0.2), 5);
    gyWall(gyO(X, Y, 12.2, 24.6), 5.6, 1.6, 0.6, 0.5); gyScaffold(gyO(X, Y, 15, 24.8), 4, 3.2); gyColumn(gyO(X, Y, 11.2, 19.5), 2.4, 0.5); gyBench(gyO(X, Y, 9.5, 14.8, Math.PI / 2)); gyGlyphStone(gyO(X, Y, 18.2, 18.6, 0.3), 0.9); } });

gyW("YH", 100, 150, "Lane Homes", { town: true, hub: [15, 13], r: 13,
  bld: [["g_home", 2, 1, 9, 7, "Kalo's House"], ["g_home2", 20, 1, 9, 7, "Brightstone House"], ["g_home", 1, 18, 8, 7, "Ixa's House"], ["g_hut", 11, 18, 7, 6, "Potter's Hut"], ["g_shop", 20, 18, 9, 7, "Dig Camp Supply Shop"]],
  ground(X, Y) { fillT(X + 1, Y + 8, X + 28, Y + 28, "g"); tLine(X, Y + 13, X + 29, Y + 13, 5, "p"); ellT(X + 15, Y + 13, 4.5, 3.6, "P"); tLine(X + 1, Y + 26.5, X + 28, Y + 26.5, 3, "s"); tLine(X + 9.8, Y + 15, X + 9.8, Y + 27, 2.2, "s"); tLine(X + 19.2, Y + 15, X + 19.2, Y + 27, 2.2, "s"); },
  grass: [[25, 28.4, 3, 1.2, "jungle", "Lane hedgerow"]],
  build(X, Y) { gyUrn(gyO(X, Y, 15, 13)); for (const [x, z] of [[1.5, 9.6], [11, 9.6], [28, 9.6], [8.5, 17.2], [26, 17.2]]) gyFlowers(gyO(X, Y, x, z)); gyBench(gyO(X, Y, 12, 16.6, Math.PI)); gyBench(gyO(X, Y, 24, 10.0));
    for (const x of [3, 9, 21, 27]) gyLantern(gyO(X, Y, x, 10.4)); gyTable(gyO(X, Y, 14.5, 28.5), false); } });

gyW("YF", 130, 150, "Farmstead", { town: true, hub: [15, 13], r: 13,
  bld: [["g_lodge", 2, 1, 10, 8, "Farmstead Lodge"], ["g_tent", 20, 2, 8, 6, "Dig Camp Tent"]],
  ground(X, Y) { fillT(X + 1, Y + 8, X + 28, Y + 28, "g"); tLine(X, Y + 13, X + 29, Y + 13, 5, "p"); for (const [x0, y0, x1, y1] of [[2, 18, 11, 27], [17, 18, 27, 23], [17, 25, 27, 28]]) fillT(X + x0, Y + y0, X + x1, Y + y1, "f"); },
  grass: [[26, 9, 2.6, 1.8, "jungle", "Farmstead verge"]], quest: [14, 21, "seed-thief", "Catch the seed thief", 0],
  build(X, Y) { for (const [x0, y0, x1, y1] of [[2, 18, 11, 27], [17, 18, 27, 23], [17, 25, 27, 28]]) for (let x = x0 + 0.5; x <= x1; x += 1.2) for (let z = y0 + 0.6; z <= y1; z += 1.3) { const O = gyO(X, Y, x, z, nh(x, z, 1)); nnCy("fern", O, 0, 0, 0, 0.05, 0.5, "#5a8a2a"); gyMoss(O, 0, 0.55, 0, 0.26); }
    for (const [x, z, L, ry] of [[1.6, 17.4, 10.5, 0], [16.4, 17.4, 11.2, 0], [1.6, 17.4, 11, Math.PI / 2]]) for (let u = 0; u <= L; u += 1.8) { const O = { x: X + x + Math.cos(ry) * u, z: Y + z + Math.sin(ry) * u }; nnCy("lit", O, 0, 0, 0, 0.06, 1.0, "#8a6a40"); } gyBarrow(gyO(X, Y, 13.5, 17.5, 0.4)); gyCrates(gyO(X, Y, 18, 9, 0), 4); gyToolRack(gyO(X, Y, 28, 10)); } });

gyW("YR", 160, 150, "Relay Tower", { hub: [14, 24], r: 5, blobs: [[25, 23, 4, "g"], [5, 23, 4, "."]],
  ground(X, Y) { fillT(X + 5, Y + 1, X + 22, Y + 18, "b"); fillT(X, Y + 28, X + 29, Y + 29, "w"); },
  grass: [[26, 22, 2.6, 2.2, "jungle", "Relay hill grass"], [3, 10, 2.4, 2, "ruin", "Relay ruin grass"]], quest: [8, 25, "relay-tower", "Retune the old Relay Tower", 0.5],
  build(X, Y) { gyRelayTower(gyO(X, Y, 14, 10)); gyBrazier(gyO(X, Y, 11, 20.6)); gyBrazier(gyO(X, Y, 17, 20.6)); gyStele(gyO(X, Y, 21.5, 23, -0.6), 2.4); gyCrates(gyO(X, Y, 3.5, 21, 0.3), 3); } });

gyW("EB", 190, 150, "Turtle Beach", { hub: [13, 12], r: 9, palms: 0.6, blobs: [[15, 21, 9, "."], [24, 12, 5, "g"], [6, 26, 7, "w", 0.2], [24, 27, 7, "w", 0.2]],
  ground(X, Y) { fillT(X, Y + 27, X + 29, Y + 29, "w"); },
  grass: [[22, 19, 3.6, 2.4, "tide", "Turtle Beach dunes"]], quest: [17, 23, "turtle-nests", "Guard the turtle nests", 0],
  build(X, Y) { for (let k = 0; k < 7; k++) { const O = gyO(X, Y, 12 + (k % 4) * 2.4, 22 + Math.floor(k / 4) * 2, nh(k, 3, 4) * 6); nnP("lit", O, "sph", 0, 0.08, 0, 0.9, 0.35, 0.9, "#c8b890"); for (let e = 0; e < 3; e++) nnSp("lit", O, (e - 1) * 0.18, 0.28, 0.05, 0.1, "#f4ecd8"); }
    gyRock(gyO(X, Y, 4, 18), 1.5); gyRock(gyO(X, Y, 27, 21), 1.3); gyLog(gyO(X, Y, 20, 17, 0.8)); gyBoat(X + 26, Y + 28.5, 1.2); } });

// ---------------- row 5 ----------------
gyW("YI", 10, 120, "Island Chain", { hub: [15, 15], r: 0, base: "w", palms: 0.7, wk: 0.4,
  ground(X, Y) { for (const [x, y, r] of [[15, 15, 5], [5, 6, 3.5], [24, 6, 3.6], [6, 24, 3.4], [24, 23, 4]]) { tBlob(X + x, Y + y, r, ".", 0.3, x + y); tBlob(X + x, Y + y, r * 0.6, "g", 0.3, x * y); }
    tLine(X + 15, Y + 15, X + 15, Y, 3.4, "."); tLine(X + 15, Y + 15, X + 14, Y + 29, 3.4, "."); for (const [x, y] of [[5, 6], [24, 6], [6, 24], [24, 23]]) tLine(X + 15, Y + 15, X + x, Y + y, 3.4, "k", "w"); tLine(X + 15, Y + 15, X + 29, Y + 15, 3.4, "k", "w"); },
  grass: [[24, 23, 2.6, 2.4, "tide", "Island reed beds"], [5, 6, 2.4, 2, "jungle", "Islet ferns"]], quest: [6, 24, "island-bell", "Ring the drowned bell", 0.3],
  build(X, Y) { gyRuinRing(X, Y, 15, 15, 3.6, 6, 3, 0.5); gyArch(gyO(X, Y, 24, 6, 0.4), 3, 3.6, 0.8); gyChimePost(gyO(X, Y, 6, 24)); gyBoat(X + 10, Y + 21, 0.7); gyBoat(X + 21, Y + 10.5, -0.4); } });

gyW("YN", 40, 120, "Sunken Shallows", { hub: [15, 15], r: 0, base: "w",
  ground(X, Y) { tBlob(X + 15, Y + 15, 5.5, ".", 0.25, 2); tBlob(X + 15, Y + 15, 3, "g", 0.3, 3); tLine(X + 15, Y + 15, X + 15, Y + 29, 4, "."); tLine(X + 15, Y + 15, X + 15, Y, 3, "."); tBlob(X + 7, Y + 6, 3, ".", 0.3, 4); tBlob(X + 23, Y + 23, 3.4, ".", 0.3, 5);
    tLine(X + 15, Y + 15, X, Y + 15, 3.4, "k", "w"); tLine(X + 15, Y + 15, X + 29, Y + 15, 3.4, "k", "w"); tLine(X + 15, Y + 15, X + 7, Y + 6, 3.4, "k", "w"); tLine(X + 15, Y + 15, X + 23, Y + 23, 3.4, "k", "w"); },
  grass: [[23, 23, 2.4, 2.4, "tide", "Shallows reed bank"]], quest: [7.5, 6, "sunken-idol", "Raise the sunken idol", 0.6],
  build(X, Y) { for (let k = 0; k < 14; k++) { const x = 3 + R() * 24, z = 3 + R() * 24; if (at(Math.floor(X + x), Math.floor(Y + z)) !== "w") continue; gyColumn({ x: X + x, z: Y + z, ry: R() * 6, floor: -0.6 }, 1.6 + R() * 2.4, 0.5); } gyHead(gyO(X, Y, 20, 9, -0.6), 1.4); gyStele(gyO(X, Y, 13, 12.5), 2); } });

gyW("YT", 70, 120, "Tidepool Fork", { hub: [16, 15], r: 9, blobs: [[5, 15, 6, "w", 0.25], [24, 6, 4, "w", 0.3], [22, 24, 6, "."], [9, 25, 4, "g"]],
  ground(X, Y) { tLine(X, Y + 15, X + 8, Y + 15, 5, "w"); },
  grass: [[22, 23, 3.4, 2.6, "tide", "Tidepool fork grass"], [12, 7, 3, 2.2, "jungle", "Fork jungle verge"]],
  build(X, Y) { gyArch(gyO(X, Y, 16, 4.5), 4, 4, 0.9); for (const [x, z] of [[24, 6], [5, 10]]) for (let k = 0; k < 4; k++) gyRock({ x: X + x + (R() - 0.5) * 5, z: Y + z + (R() - 0.5) * 4 }, 0.6 + R() * 0.6); gyStele(gyO(X, Y, 20, 18, -0.5), 2); } });

gyW("YJ", 100, 120, "Glyph Junction", { town: true, hub: [15, 15], r: 13,
  bld: [["g_study", 1, 1, 9, 7, "Glyph Study"], ["g_home", 20, 1, 9, 7, "Wayfinder's House"], ["g_home2", 20, 20, 9, 7, "Stonecutter's House"]],
  ground(X, Y) { fillT(X + 1, Y + 8, X + 28, Y + 28, "g"); ellT(X + 15, Y + 15, 6.5, 6.5, "P"); tLine(X + 18, Y + 27.8, X + 29, Y + 27.8, 2.4, "s"); },
  grass: [[5, 24, 3.4, 2.6, "ruin", "Junction ruin grass"]],
  build(X, Y) { gyChimeTower(gyO(X, Y, 15, 15), 7); gyRuinRing(X, Y, 15, 15, 5.6, 4, 3.4, 0.25, Math.PI / 4); for (const [x, z] of [[9, 9], [21, 9], [9, 21], [21, 21]]) gyLantern(gyO(X, Y, x, z)); gyBench(gyO(X, Y, 10.5, 12, -Math.PI / 2)); gyBench(gyO(X, Y, 19.5, 18, Math.PI / 2)); gyGlyphStone(gyO(X, Y, 4, 18, 0.4)); } });

gyW("YC", 130, 120, "Ruin Crossroads", { town: true, hub: [15, 15], r: 13,
  bld: [["g_hall", 1, 1, 10, 8, "Ruin Wardens' Hall"], ["g_home2", 20, 1, 9, 7, "Lantern House"], ["g_tent", 20, 20, 9, 6, "Trader's Tent"]],
  ground(X, Y) { fillT(X + 1, Y + 9, X + 28, Y + 28, "g"); ellT(X + 15, Y + 15, 5, 5, "P"); tLine(X + 18, Y + 27.5, X + 29, Y + 27.5, 2.6, "s"); },
  grass: [[7, 27.6, 4, 1.4, "jungle", "Crossroads thicket"]], quest: [10.5, 24.5, "warden-badge", "Earn a Ruin Warden's badge", 0.2],
  build(X, Y) { gyUrn(gyO(X, Y, 15, 15)); for (const [x, z, c] of [[4.5, 20.6, "#c8502e"], [9.6, 20.6, "#3fbfb0"], [4.5, 24.4, "#e8b84a"]]) { gyAwning(gyO(X, Y, x, z), 3.6, 2.2, 2.3, c); gyTable(gyO(X, Y, x, z)); }
    gyCrates(gyO(X, Y, 8.6, 24.6, 0.5), 3); for (const [x, z] of [[10, 10.2], [20, 10.2], [10, 19.8], [20, 19.8]]) gyLantern(gyO(X, Y, x, z)); } });

gyW("YW", 160, 120, "Landing Causeway", { hub: [15, 15], r: 0, base: "w", wk: 0.35,
  ground(X, Y) { tLine(X, Y + 15, X + 29, Y + 15, 7, "."); tLine(X + 15, Y + 15, X + 15, Y, 7, "."); ellT(X + 15, Y + 15, 6, 6, "."); tBlob(X + 6, Y + 24, 3, "g", 0.3, 1); tBlob(X + 24, Y + 6, 3.4, "g", 0.3, 2); tLine(X + 15, Y + 15, X + 6, Y + 24, 3.4, "k", "w"); },
  grass: [[6, 24, 2.4, 2.2, "tide", "Causeway reed islet"], [24, 6, 2.6, 2.4, "jungle", "Causeway islet ferns"]],
  build(X, Y) { for (let u = 2; u < 29; u += 4) for (const s of [-1, 1]) { gyColumn(gyO(X, Y, u, 15 + s * 3.4), 2.2, nh(u, s, 9) < 0.35 ? 0.5 : 0, 0.32); if (u % 8 === 2) gyLantern(gyO(X, Y, u + 2, 15 + s * 2.6, s < 0 ? 0 : Math.PI)); } gyGlyphStone(gyO(X, Y, 18.5, 11, 0.6)); } });

gyW("YP", 190, 120, "Glyphos Spaceport", { town: true, hub: [15, 15], r: 13,
  bld: [["g_hall", 1, 1, 11, 8, "Spaceport Hall"], ["g_home", 20, 1, 9, 7, "Pilot's Bunkhouse"]],
  ground(X, Y) { fillT(X + 1, Y + 9, X + 28, Y + 28, "g"); ellT(X + 15, Y + 18, 9, 8, "P"); },
  grass: [[26, 27.5, 2.6, 1.4, "jungle", "Spaceport verge"]],
  build(X, Y) { gyShip(X + 8, Y + 22, 0.3, 0.8); gyShip(X + 23, Y + 22, -0.5, 0.8); for (const [x, z] of [[6.5, 12], [23.5, 12], [6.5, 25], [23.5, 25]]) gyBrazier(gyO(X, Y, x, z)); gyCrates(gyO(X, Y, 26, 15, 0.2), 6); gyFlag(gyO(X, Y, 13, 10.5), 5, GYC.turq); gyFlag(gyO(X, Y, 17, 10.5), 5, GYC.gold); } });

gyW("E4", 220, 120, "Beacon Point", { hub: [12, 15], r: 10, palms: 0.5, blobs: [[22, 15, 6, "."], [24, 26, 5, "w", 0.25]],
  grass: [[10, 23, 3.4, 2.4, "tide", "Beacon Point grass"], [12, 6, 3, 2.2, "orchid", "Beacon orchid bank"]], quest: [19, 12, "light-beacon", "Light the beacon on the point", -0.7],
  build(X, Y) { gyLookout(gyO(X, Y, 23, 15), 7); gyBrazier({ x: X + 23, z: Y + 15, floor: 7.2 }); gyRuinRing(X, Y, 23, 15, 4.2, 6, 2.6, 0.5); } });

// ---------------- row 4 ----------------
gyW("YO", 10, 90, "Coral Grove", { hub: [15, 16], r: 9, palms: 0.4, blobs: [[15, 8, 5, "w", 0.25], [7, 20, 4, "."], [23, 22, 5, "g"]],
  grass: [[22, 21, 3.4, 3, "orchid", "Coral Grove orchids"], [7, 20, 2.6, 2, "tide", "Grove pool reeds"]], quest: [10, 14, "coral-grove", "Find the secret of the Coral Grove", 0.5],
  build(X, Y) { for (let k = 0; k < 9; k++) { const a = (k / 9) * TAU; thCoral(X + 15 + Math.cos(a) * 3.6, Y + 8 + Math.sin(a) * 3, 0.8 + R() * 0.6); } gyArch(gyO(X, Y, 15, 12.5), 3.6, 4, 0.8); gyVines(gyO(X, Y, 15, 12.6), 3.6, 4); } });

gyW("Y7", 40, 90, "Sunken Temple Court", { hub: [15, 17], r: 0, base: "w", wk: 0.3,
  ground(X, Y) { tBlob(X + 15, Y + 13, 9, ".", 0.2, 7); ellT(X + 15, Y + 17, 7.5, 5.5, "P"); fillT(X + 9, Y + 4, X + 21, Y + 10, "b"); tBlob(X + 5, Y + 25, 3.2, "g", 0.3, 8); tBlob(X + 25, Y + 25, 2.6, ".", 0.3, 9);
    tLine(X + 15, Y + 17, X + 5, Y + 25, 3, "k", "w"); tLine(X + 15, Y + 17, X + 25, Y + 25, 3, "k", "w"); tLine(X + 21, Y + 17, X + 29, Y + 17, 3.4, "k", "w"); },
  grass: [[5, 25, 2.4, 2.2, "tide", "Temple court reeds"]], quest: [21.5, 20, "sunken-court", "Light the sunken court braziers", -0.5],
  build(X, Y) { gyTemple(gyO(X, Y, 15, 7), 12, 7, 5); for (const [x, z] of [[10, 14.5], [20, 14.5], [10, 20.5], [20, 20.5]]) gyBrazier(gyO(X, Y, x, z)); gyGlyphStone(gyO(X, Y, 15, 19.5), 0.9);
    for (const [x, z, ry] of [[3.5, 9, 0.3], [26.5, 9, -0.3], [15, 27, 0]]) { const O = { x: X + x, z: Y + z, ry, floor: -0.6 }; gyArch(O, 3.2, 3.8, 0.8); gyVines(O, 3.2, 3.6); }
    for (let k = 0; k < 12; k++) { const a = (k / 12) * TAU + 0.2, px = X + 15 + Math.cos(a) * 9.5, pz = Y + 16 + Math.sin(a) * 8; if (at(Math.floor(px), Math.floor(pz)) !== "w" || pz < Y + 11) continue; gyColumn({ x: px, z: pz, ry: a, floor: -0.6 }, 2.6 + nh(k, 3, 11) * 1.8, nh(k, 4, 12) < 0.5 ? 0.5 : 0); }
    gyHead({ x: X + 27, z: Y + 18.5, ry: -0.9, floor: -0.7 }, 1.3); for (let k = 0; k < 26; k++) { const x = 1 + R() * 28, z = 1 + R() * 28; if (at(Math.floor(X + x), Math.floor(Y + z)) === "w") gyLily(X + x, Y + z); }
    gyChimePost(gyO(X, Y, 5, 25)); gyStele(gyO(X, Y, 25, 25), 1.8); } });

gyW("YU", 70, 90, "Tidepool Ruins", { hub: [15, 15], r: 9, blobs: [[7, 7, 4.5, "w", 0.3], [23, 8, 4, "w", 0.3], [8, 23, 4, "w", 0.3], [22, 22, 5, "."]],
  grass: [[22, 22, 3.4, 3, "tide", "Tidepool ruin grass"]], quest: [18.5, 11, "tidepool-glyph", "Read the tidepool glyph", -0.4],
  build(X, Y) { for (const [x, z] of [[7, 7], [23, 8], [8, 23]]) { gyRuinRing(X, Y, x, z, 3.2, 5, 2.4, 0.7); } gyWall(gyO(X, Y, 18, 19, 0.3), 6, 2.2, 0.8, 0.6); gyStele(gyO(X, Y, 11, 18), 2); } });

gyW("YS", 100, 90, "Glyph Steps", { hub: [12, 21], r: 8, blobs: [[19, 10, 8, "."], [5, 22, 4, "g"], [25, 24, 4, "g"]],
  ground(X, Y) { fillT(X + 15, Y + 4, X + 24, Y + 13, "b"); },
  grass: [[5, 22, 3, 3, "ruin", "Glyph Steps east grass"], [25, 23, 3, 2.6, "ruin", "Glyph Steps west grass"]], quest: [20, 17, "glyph-steps", "Read the Glyph Steps at dawn", Math.PI],
  build(X, Y) { gyPyramid(gyO(X, Y, 20, 9), 10.5, 5, 1.2, true); for (const s of [-1, 1]) { gyColumn(gyO(X, Y, 20 + s * 3.2, 15.6), 4, 0); gyBrazier(gyO(X, Y, 20 + s * 5.2, 15.4)); } } });

gyW("YQ", 130, 90, "Quiet Court", { town: true, hub: [15, 15], r: 12,
  bld: [["g_study", 1, 1, 9, 7, "Archivist's Study"], ["g_helix", 20, 1, 9, 7, "Shrine Chamber"]],
  ground(X, Y) { fillT(X + 1, Y + 8, X + 28, Y + 28, "g"); ellT(X + 15, Y + 15, 6.5, 6.5, "P"); ellT(X + 15, Y + 15, 1.8, 1.8, "w"); },
  grass: [[5, 24, 3.2, 2.6, "orchid", "Court garden orchids"], [25, 24, 3, 2.4, "jungle", "Court thicket"]],
  build(X, Y) { gyRuinRing(X, Y, 15, 15, 5.2, 4, 3.6, 0, Math.PI / 4); for (const [x, z] of [[10.5, 10.5], [19.5, 10.5], [10.5, 19.5], [19.5, 19.5]]) gyUrn(gyO(X, Y, x, z)); gyBench(gyO(X, Y, 15, 22, 0)); gyBench(gyO(X, Y, 8, 15, Math.PI / 2)); gyStele(gyO(X, Y, 22, 15, -Math.PI / 2), 2.2); } });

gyW("YM", 160, 90, "Mural Overlook", { hub: [15, 18], r: 10, blobs: [[15, 8, 6, "."], [25, 24, 4, "g"]],
  grass: [[24, 23, 3, 2.6, "ruin", "Overlook grass"], [6, 24, 3, 2.4, "jungle", "Overlook thicket"]], quest: [10, 12, "faded-mural", "Restore the faded mural", 0],
  build(X, Y) { gyWall(gyO(X, Y, 6, 5.5), 18, 3.6, 0.9, 0.15); for (let k = 0; k < 8; k++) gyGlyph(gyO(X, Y, 7 + k * 2.2, 6.1), 0, 1.4 + (k % 2) * 0.8, 0.5, 0.9, 0.8, 0, [GYC.gold, GYC.turq, GYC.jade][k % 3]); gyBench(gyO(X, Y, 12, 11, Math.PI)); gyBench(gyO(X, Y, 18, 11, Math.PI)); gyVines(gyO(X, Y, 10, 6), 6, 3.6); } });

gyW("E2", 190, 90, "Sunwell Terraces", { hub: [15, 18], r: 10, blobs: [[22, 10, 6, "."], [6, 6, 4, "g"], [8, 26, 4, "g"]],
  ground(X, Y) { ellT(X + 22, Y + 10, 2.6, 2.6, "w"); },
  grass: [[6, 6, 3, 2.6, "jungle", "Terrace ferns"], [8, 26, 3, 2.4, "orchid", "Terrace orchids"]], quest: [24, 15.5, "sunwell", "Fill the Sunwell with light", -0.7],
  build(X, Y) { gyRuinRing(X, Y, 22, 10, 4.6, 8, 3.8, 0.25); for (let k = 0; k < 3; k++) gyWall(gyO(X, Y, 17 + k, 25.6 + k * 1.3), 10 - k * 2, 0.6, 0.9, 0); gyBrazier(gyO(X, Y, 18, 14.6)); gyBrazier(gyO(X, Y, 26, 5.6)); } });

gyW("E3", 220, 90, "Orchid Ravine", { hub: [12, 15], r: 8, jungle: 1.2, blobs: [[20, 8, 5, "g"], [20, 22, 5, "g"]],
  ground(X, Y) { tLine(X + 26, Y + 2, X + 25, Y + 28, 3, "r"); },
  grass: [[20, 8, 3.4, 3, "orchid", "Upper ravine orchids"], [20, 22, 3.4, 3, "orchid", "Lower ravine orchids"]],
  build(X, Y) { for (let z = 2; z < 28; z += 2.4) gyRock(gyO(X, Y, 26 + (R() - 0.5), z), 1.2 + R() * 0.9); gyStele(gyO(X, Y, 15, 11), 1.8); } });

// ---------------- row 3 ----------------
gyW("Q1", 10, 60, "Vine Bridge Canopy", { hub: [16, 16], r: 9, jungle: 1.15, palms: 0.05, blobs: [[6, 7, 5, "w", 0.3], [24, 25, 4.2, "w", 0.3], [6, 24, 4, "."], [24, 8, 4, "g"]],
  grass: [[6, 24, 3, 2.4, "jungle", "Canopy floor ferns"], [24, 8, 3, 2.6, "jungle", "Canopy fern bed"]], quest: [10.5, 16, "vine-bridge", "Cross the vine bridges", Math.PI / 2],
  build(X, Y) { const T = [[9, 11], [21, 11], [21, 21], [10, 21]].filter(([x, z]) => !gyOnTrail(X + x, Y + z)); for (const [x, z] of T) { gyLookout(gyO(X, Y, x, z), 6); gyTree(gyO(X, Y, x + (x < 15 ? -2.6 : 2.6), z + (z < 15 ? -2.4 : 2.4)), 1.5); }
    for (let k = 0; k < T.length; k++) gyRopeBridge(X + T[k][0], Y + T[k][1], X + T[(k + 1) % T.length][0], Y + T[(k + 1) % T.length][1], 6.14);
    for (const [x, z] of [[4, 15], [27, 16], [15, 4], [16, 27]]) if (!gyOnTrail(X + x, Y + z)) gyTree(gyO(X, Y, x, z), 1.3); for (let k = 0; k < 8; k++) { const x = 3 + R() * 24, z = 3 + R() * 24; if (at(Math.floor(X + x), Math.floor(Y + z)) === "w") gyLily(X + x, Y + z); } } });
gyW("Q2", 40, 60, "Heron Pools", { hub: [15, 15], r: 10, blobs: [[8, 8, 4, "w", 0.3], [22, 22, 4.5, "w", 0.3], [23, 7, 4, "."]],
  grass: [[23, 7, 3, 2.6, "tide", "Heron pool reeds"], [7, 22, 3.2, 2.6, "jungle", "Heron thicket"]], quest: [19, 17, "heron-feather", "Find the white heron feather", 0],
  build(X, Y) { for (const [x, z] of [[9, 9], [21, 21]]) for (let k = 0; k < 2; k++) { const O = gyO(X, Y, x + k * 1.6, z + 2.4, 0.4 + k); nnCy("lit", O, 0, 0, 0, 0.03, 0.8, "#c87a3a"); nnP("lit", O, "sph", 0, 1.0, 0, 0.3, 0.38, 0.5, "#f4f0e8"); nnCy("lit", O, 0, 1.2, 0.18, 0.04, 0.5, "#f4f0e8"); } gyLog(gyO(X, Y, 14, 6, 0.6)); } });

gyW("Q3", 70, 60, "Old Quarry", { hub: [15, 15], r: 10, rocks: 0.12, blobs: [[15, 15, 6, "."], [5, 25, 4, "g"]],
  grass: [[5, 25, 3, 2.6, "ruin", "Quarry spoil grass"], [25, 6, 2.6, 2.2, "ruin", "Quarry rim grass"]], quest: [11, 11, "quarry-cart", "Fix the old quarry cart", 0.8],
  build(X, Y) { for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU, O = gyO(X, Y, 15 + Math.cos(a) * 7.4, 15 + Math.sin(a) * 7.4, a); nnBx("stone", O, 0, 0, 0, 1.6 + R(), 0.9 + R() * 1.3, 1.1, "#c8b88a"); } gyScaffold(gyO(X, Y, 20, 11, 0.4), 3, 3.6); gyBarrow(gyO(X, Y, 12, 18, 2)); gyToolRack(gyO(X, Y, 18.5, 19, 0.3)); gyCrates(gyO(X, Y, 9, 17, 0.4), 3); } });

gyW("YG", 100, 60, "Drowned Grotto", { hub: [15, 20], r: 9, grotto: true, blobs: [[15, 8, 5, "w", 0.2], [6, 22, 4, "."], [24, 22, 4, "."]],
  ground(X, Y) { tLine(X + 15, Y + 20, X + 15, Y, 5, "."); fillT(X + 13, Y + 2, X + 17, Y + 10, "."); },
  grass: [[6, 22, 3, 2.4, "ruin", "Grotto mouth grass"], [24, 22, 3, 2.4, "tide", "Grotto pool reeds"]], quest: [19, 16, "grotto-gate", "Open the grotto's water gate", -0.4],
  build(X, Y) { gyArch(gyO(X, Y, 15, 12), 5, 5.2, 1.2); gyVines(gyO(X, Y, 15, 12.1), 5, 5); gyWall(gyO(X, Y, 3, 12), 9, 3.4, 1, 0.3); gyWall(gyO(X, Y, 18, 12), 9, 3.4, 1, 0.3); gyHead(gyO(X, Y, 10, 6.5, 0.3), 1.2); gyHead(gyO(X, Y, 20, 6.5, -0.3), 1.2); } });

gyW("Q6", 130, 60, "Monolet Garden", { hub: [15, 15], r: 11, blobs: [[15, 15, 5, "."]],
  grass: [[7, 7, 3.4, 2.8, "orchid", "Monolet orchid bed"], [23, 23, 3.4, 2.8, "ruin", "Monolet stone grass"]], quest: [19, 19, "monolet-stones", "Line up the Monolet stones", 0.8],
  build(X, Y) { for (let k = 0; k < 7; k++) { const a = (k / 7) * TAU + 0.3; gyStele(gyO(X, Y, 15 + Math.cos(a) * 4.2, 15 + Math.sin(a) * 4.2, -a + Math.PI / 2), 2 + (k % 3) * 0.5); } gyGlyphStone(gyO(X, Y, 15, 15), 1.3); for (let k = 0; k < 12; k++) gyFlowers(gyO(X, Y, 6 + R() * 18, 6 + R() * 18)); } });

gyW("YA", 160, 60, "Pillar Hollows", { hub: [15, 15], r: 11, blobs: [[8, 22, 4, "."], [22, 8, 4, "."]],
  grass: [[8, 8, 3, 2.6, "ruin", "Pillar hollow grass"], [22, 22, 3.2, 2.8, "jungle", "Hollow ferns"]],
  build(X, Y) { for (let x = 5; x <= 25; x += 4) for (let z = 5; z <= 25; z += 4) { if (Math.hypot(x - 15, z - 15) < 3 || nh(x, z, 3) < 0.25) continue; if (!"g.".includes(at(X + x, Y + z))) continue; gyColumn(gyO(X, Y, x + (R() - 0.5), z + (R() - 0.5)), 3 + R() * 2.4, nh(x, z, 4) < 0.35 ? 0.5 : 0); } } });

gyW("Y4", 190, 60, "Dig Camp Storehouse", { town: true, hub: [15, 15], r: 12,
  bld: [["g_store", 1, 2, 10, 8, "Dig Camp Storehouse"], ["g_tent", 1, 19, 9, 6, "Packer's Tent"]],
  ground(X, Y) { fillT(X + 1, Y + 9, X + 28, Y + 28, "g"); ellT(X + 15, Y + 15, 4.6, 4.6, "P"); },
  grass: [[24, 7, 3, 2.4, "jungle", "Storehouse thicket"]], quest: [20, 22, "missing-crates", "Track down the missing crates", 0.3],
  build(X, Y) { gyCrates(gyO(X, Y, 13.5, 11, 0.2), 6); gyCrates(gyO(X, Y, 18, 19.5, -0.4), 5); gyBarrow(gyO(X, Y, 11, 18, 0.6)); gyAwning(gyO(X, Y, 23, 13.5), 4.5, 2.6, 2.3, "#d8c8a0"); gyTable(gyO(X, Y, 23, 13.6)); gyLookout(gyO(X, Y, 25, 25), 5); for (const [x, z] of [[11, 15], [19, 15]]) gyLantern(gyO(X, Y, x, z)); gyCellarHatch(gyO(X, Y, 16, 6)); } });

gyW("E1", 220, 60, "Excavation Pits", { hub: [15, 15], r: 11, blobs: [[8, 8, 4, "."], [22, 8, 4, "."], [8, 22, 4, "."], [22, 22, 4, "."]],
  grass: [[15, 4, 3, 1.8, "ruin", "Pit rim grass"], [4, 15, 1.8, 3, "jungle", "Pit thicket"]], quest: [15, 19, "excavation", "Help dig out the buried door", Math.PI],
  build(X, Y) { for (const [x, z] of [[8, 8], [22, 8], [8, 22], [22, 22]]) { gyDigGrid(gyO(X, Y, x, z), 4, 3.4); gyColumn(gyO(X, Y, x - 1.5, z - 0.6), 1.6, 0.5); } gyScaffold(gyO(X, Y, 22, 11.2), 4, 3); gySieve(gyO(X, Y, 11.5, 22)); gyBarrow(gyO(X, Y, 18.5, 22, 1)); gyTent(gyO(X, Y, 15, 9, 0), 3, 2.6, 2.2, "#e8dcc0"); gyToolRack(gyO(X, Y, 11, 7.5)); } });

// ---------------- row 2: the grotto halls and the upper ruins ----------------
gyW("YK", 40, 30, "Grotto Deep Chamber", { hub: [16, 16], r: 9, grotto: true, hubT: ".", blobs: [[9, 8, 4, "w", 0.25], [22, 22, 3.4, "w", 0.25], [8, 22, 4, "g"]],
  grass: [[8, 22, 3, 2.6, "ruin", "Deep chamber moss"]], quest: [20, 13, "deep-chamber", "Wake the Deep Chamber's guardian", -0.6],
  build(X, Y) { gyHead(gyO(X, Y, 16, 9.5), 2.4); for (let k = 0; k < 6; k++) gyGlyph(gyO(X, Y, 10 + k * 2.4, 6.5), 0, 1.6, 0, 0.7, 0.6, 0, k % 2 ? GYC.turq : GYC.jade); gyRuinRing(X, Y, 16, 16, 5.2, 8, 4.2, 0.4); gyBrazier(gyO(X, Y, 12, 12)); gyBrazier(gyO(X, Y, 20, 12)); } });

gyW("YE", 70, 30, "Grotto Lower Hall", { hub: [15, 15], r: 9, grotto: true, hubT: ".", blobs: [[7, 22, 4, "w", 0.3], [23, 8, 4, "g"]],
  grass: [[23, 8, 3, 2.6, "ruin", "Lower hall moss"], [8, 8, 2.6, 2.2, "jungle", "Lower hall ferns"]],
  build(X, Y) { for (let u = 3; u <= 27; u += 4.8) { gyColumn(gyO(X, Y, u, 11.5), 4.4, nh(u, 1, 2) < 0.3 ? 0.5 : 0); gyColumn(gyO(X, Y, u, 18.5), 4.4, nh(u, 2, 2) < 0.3 ? 0.5 : 0); } gyWall(gyO(X, Y, 20, 23), 7, 2.6, 0.9, 0.5); gyStele(gyO(X, Y, 15, 21.4), 2); } });

gyW("YB", 100, 30, "Grotto Upper Hall", { hub: [15, 15], r: 9, grotto: true, hubT: ".", blobs: [[22, 21, 4, "w", 0.25], [7, 8, 4, "g"]],
  grass: [[7, 8, 3, 2.6, "jungle", "Upper hall ferns"]],
  build(X, Y) { gyArch(gyO(X, Y, 15, 7), 4.6, 5, 1.1); gyArch(gyO(X, Y, 15, 23), 4.6, 5, 1.1); gyVines(gyO(X, Y, 15, 7.1), 4.6, 5); gyRuinRing(X, Y, 15, 15, 4.4, 6, 3.6, 0.5); gyGlyphStone(gyO(X, Y, 9, 19, 0.6)); } });

gyW("YX", 130, 30, "Sunken Channel", { hub: [10, 15], r: 8, blobs: [[22, 15, 5, "w", 0.2], [10, 6, 4, "g"]],
  ground(X, Y) { tLine(X + 22, Y + 1, X + 23, Y + 29, 5, "w"); },
  after(X, Y) { tLine(X + 10, Y + 15, X + 29, Y + 15, 3.4, "k", "w"); },
  grass: [[10, 23, 3, 2.6, "tide", "Channel bank reeds"], [10, 6, 3, 2.4, "jungle", "Channel ferns"]],
  build(X, Y) { for (let z = 3; z < 28; z += 5) for (const s of [-1, 1]) gyColumn(gyO(X, Y, 22.5 + s * 3.4, z), 2.4 + R(), nh(z, s, 7) < 0.4 ? 0.6 : 0, 0.34); gyBoat(X + 22.5, Y + 6, Math.PI / 2); } });

gyW("YZ", 160, 30, "Forgotten Forum", { hub: [16, 15], r: 11, blobs: [[16, 15, 6.5, "."]],
  ground(X, Y) { fillT(X + 10, Y + 9, X + 22, Y + 21, "P"); },
  grass: [[5, 6, 3, 2.4, "ruin", "Forum edge grass"], [26, 25, 2.6, 2.4, "jungle", "Forum thicket"]],
  build(X, Y) { for (let u = 10.5; u <= 21.5; u += 3.6) for (const z of [9.6, 20.4]) { if (gyOnTrail(X + u, Y + z) || gyOnTrail(X + u, Y + z + (z < 15 ? -1.5 : 1.5))) continue; gyColumn(gyO(X, Y, u, z), 4, nh(u, z, 1) < 0.35 ? 0.5 : 0); } gyStele(gyO(X, Y, 16, 15), 2.6); for (const [x, z] of [[12, 12], [20, 18]]) gyUrn(gyO(X, Y, x, z)); } });

gyW("YV", 190, 30, "Temple of Trials", { hub: [10, 24], r: 6, blobs: [[3, 11, 3, "g"], [25, 26, 3.5, "g"]],
  ground(X, Y) { fillT(X + 7, Y + 1, X + 28, Y + 18, "b"); },
  grass: [[3, 11, 2.4, 2.2, "jungle", "Trials thicket"], [25, 26, 2.6, 2.2, "ruin", "Trials yard grass"]], quest: [15, 26, "trials", "Pass the three Trials", Math.PI],
  build(X, Y) { gyTrialsHall(gyO(X, Y, 18, 10)); } });

gyW("YY", 220, 30, "Glyph Hollow", { hub: [15, 15], r: 10, blobs: [[15, 15, 4.6, "w", 0.2], [8, 24, 4, "g"]],
  ground(X, Y) { ellT(X + 15, Y + 15, 2.5, 2.5, "g"); },
  after(X, Y) { for (const [x, y] of [[15, 0], [15, 29], [0, 15], [29, 15]]) tLine(X + 15, Y + 15, X + x, Y + y, 3.4, "k", "w"); },
  grass: [[8, 24, 3, 2.6, "orchid", "Hollow orchids"], [24, 7, 3, 2.4, "jungle", "Hollow ferns"]], quest: [15, 15, "glyph-hollow", "Light the glyph in the hollow", 0],
  build(X, Y) { gyRuinRing(X, Y, 15, 15, 6.6, 10, 3.2, 0.5); } });

// ---------------- row 1 ----------------
gyW("Q4", 40, 0, "Fern Hollow", { hub: [16, 16], r: 10, jungle: 1.25, blobs: [[8, 8, 4, "g"], [24, 24, 4, "."]],
  grass: [[8, 8, 3.2, 2.8, "jungle", "Fern Hollow ferns"], [24, 24, 3, 2.6, "jungle", "Hollow floor ferns"]],
  build(X, Y) { for (let k = 0; k < 20; k++) gyFern(gyO(X, Y, 8 + R() * 16, 8 + R() * 16, R() * 6), 1.1); gyLog(gyO(X, Y, 20, 10, 0.4)); } });

gyW("F3", 70, 0, "Chime Falls Basin", { hub: [15, 18], r: 10, blobs: [[15, 6, 5.5, "w", 0.25], [5, 24, 4, "w", 0.25], [24, 24, 4, "g"]],
  grass: [[24, 24, 3, 2.6, "jungle", "Basin ferns"], [6, 12, 2.6, 2.4, "tide", "Basin reeds"]],
  build(X, Y) { for (let k = 0; k < 6; k++) gyChimePost(gyO(X, Y, 8 + k * 3, 11.5 + (k % 2) * 0.8)); gyRock(gyO(X, Y, 10, 3), 1.6); gyRock(gyO(X, Y, 21, 4), 1.4); } });

gyW("F1", 70, -30, "Chime Falls", { hub: [15, 21], r: 8, blobs: [[15, 12, 5.5, "w", 0.2], [6, 24, 4, "g"], [24, 24, 4, "."]],
  ground(X, Y) { fillT(X + 4, Y + 2, X + 26, Y + 5, "r"); },
  grass: [[6, 24, 3, 2.6, "jungle", "Falls ferns"], [24, 24, 3, 2.4, "tide", "Falls spray grass"]], quest: [20, 17, "falls-chimes", "Tune the chimes at the falls", -0.5],
  build(X, Y) { gyCliff(gyO(X, Y, 3.5, 4.5), 23, 9); gyCascade(X + 11, Y + 6.2, 3, 8.6); gyCascade(X + 19, Y + 6.2, 2.2, 8.2); gyChimeTower(gyO(X, Y, 25, 14), 5); for (let k = 0; k < 4; k++) gyRock(gyO(X, Y, 9 + k * 4, 16.5), 0.9 + R() * 0.6); } });

gyW("F2", 100, -30, "Chime Falls Ridge", { hub: [13, 12], r: 10, blobs: [[22, 22, 5, "g"], [6, 24, 4, "."]],
  ground(X, Y) { fillT(X, Y + 2, X + 6, Y + 5, "r"); },
  grass: [[22, 22, 3.4, 3, "jungle", "Ridge grass"], [20, 6, 3, 2.4, "orchid", "Ridge orchids"]],
  build(X, Y) { gyCliff(gyO(X, Y, -0.5, 4.5), 7, 8); for (let k = 0; k < 5; k++) gyChimePost(gyO(X, Y, 6 + k * 3.6, 18 + (k % 2) * 1.6, k)); gyBench(gyO(X, Y, 12, 7, 0)); } });

gyW("F4", 100, 0, "Chime Falls Pool", { hub: [14, 18], r: 9, blobs: [[15, 8, 5.5, "w", 0.2], [24, 24, 4, "g"]],
  grass: [[24, 24, 3, 2.6, "jungle", "Pool bank ferns"], [6, 24, 3, 2.4, "tide", "Pool reeds"]], quest: [9, 13, "pool-stones", "Cross the pool on the old stones", 0.4],
  build(X, Y) { for (let k = 0; k < 5; k++) nnCy("stone", { x: X + 11 + k * 1.6, z: Y + 6 + k * 0.9, floor: -0.4 }, 0, 0, 0, 0.55, 0.7, "#b0a080"); gyRuinRing(X, Y, 15, 8, 6.4, 7, 2.8, 0.6); } });

// ---------------- Sunspire: four cells around the mountain at (160, 0) ----------------
gyW("S1", 130, -30, "Sunspire North", { hub: [3, 8], r: 0, ground(X, Y) { nnArea(X, Y, gmTile); }, build(X, Y) { gmBuild(X, Y); }, grass: [[12, 20, 4, 3.4, "jungle", "Sunspire north meadow"]] });
gyW("S2", 160, -30, "Sunspire Summit", { hub: [27, 12], r: 0, ground(X, Y) { nnArea(X, Y, gmTile); },
  build(X, Y) { gmBuild(X, Y); const [cx, cz] = GMC; gyChimeTower({ x: cx, z: cz - 0.4 }, 6); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; gyBrazier({ x: cx + Math.cos(a) * 3.2, z: cz + Math.sin(a) * 3.2 }); } gyQuest(cx - 2.6, cz + 1.4, "sunspire-shrine", "Light the Sunspire shrine", 0.6); }, grass: [[10, 8, 4, 3.4, "ruin", "Sunspire high meadow"]] });
gyW("S3", 130, 0, "Sunspire West", { hub: [4, 22], r: 0, ground(X, Y) { nnArea(X, Y, gmTile); }, build(X, Y) { gmBuild(X, Y); }, grass: [[12, 8, 4, 3.4, "orchid", "Sunspire west slope"]] });
gyW("S4", 160, 0, "Sunspire Trailhead", { hub: [22, 17], r: 0, ground(X, Y) { nnArea(X, Y, gmTile); },
  build(X, Y) { gmBuild(X, Y); gyArch({ x: X + 23.5, z: Y + 19.5, ry: 0.6 }, 3.6, 4, 0.8); gyStele({ x: X + 26, z: Y + 15, ry: -0.6 }, 2); }, grass: [[16, 25, 4, 3, "jungle", "Trailhead meadow"]] });

// ---------------- the canopy and the Temple of Voices ----------------
gyW("V1", 190, -30, "Canopy Walk", { hub: [12, 12], r: 9, jungle: 1.3, palms: 0.05, blobs: [[22, 22, 4, "g"]],
  grass: [[22, 22, 3, 2.6, "jungle", "Canopy floor ferns"], [6, 22, 2.6, 2.2, "orchid", "Canopy orchids"]],
  build(X, Y) { for (const [x, z] of [[6, 6], [18, 6], [6, 18], [18, 18]]) { gyTree(gyO(X, Y, x, z), 1.5); } for (const [x, z, h] of [[12, 6, 5], [12, 18, 5]]) gyLookout(gyO(X, Y, x, z), h); } });
gyW("V2", 190, 0, "Canopy Walk Landing", { hub: [12, 17], r: 9, jungle: 1.3, blobs: [[22, 8, 4, "g"]],
  grass: [[22, 8, 3, 2.6, "jungle", "Landing ferns"], [8, 26, 3, 1.8, "orchid", "Landing orchids"]], quest: [16, 22, "canopy-nest", "Return the fallen nest to the canopy", 0.3],
  build(X, Y) { gyLookout(gyO(X, Y, 18, 14), 6); gyScaffold(gyO(X, Y, 9, 13, 0.3), 3.4, 4); } });
gyW("Y9", 220, -30, "Temple of Voices", { hub: [15, 25], r: 6, blobs: [[15, 25, 5, "."]],
  ground(X, Y) { fillT(X + 4, Y + 1, X + 25, Y + 20, "b"); },
  grass: [[4, 26, 2.6, 2.2, "ruin", "Temple forecourt grass"], [26, 26, 2.6, 2.2, "ruin", "Temple side grass"]], quest: [20, 26.5, "temple-voices", "Hear the Temple of Voices sing", Math.PI],
  build(X, Y) { gyVoicesPyramid(gyO(X, Y, 15, 11)); for (const s of [-1, 1]) { gyChimeTower(gyO(X, Y, 15 + s * 9.5, 23.5), 6); gyHead(gyO(X, Y, 15 + s * 4.2, 23.6, 0), 1.3); } } });
gyW("Y8", 220, 0, "Temple of Voices Steps", { hub: [15, 15], r: 9, blobs: [[15, 6, 5, "."], [15, 24, 5, "."]],
  ground(X, Y) { fillT(X + 11, Y, X + 19, Y + 29, "P"); },
  grass: [[5, 8, 3, 2.6, "jungle", "Steps thicket"], [25, 22, 3, 2.6, "ruin", "Steps ruin grass"]],
  build(X, Y) { for (let z = 2; z < 29; z += 3.4) for (const s of [-1, 1]) { gyColumn(gyO(X, Y, 15 + s * 5.4, z), 3.8, nh(z, s, 3) < 0.3 ? 0.5 : 0); if (z % 6.8 < 3.4) gyLantern(gyO(X, Y, 15 + s * 4.4, z + 1.7, s < 0 ? Math.PI / 2 : -Math.PI / 2)); } } });

// ---------------- links (crossings default to the average of the two hubs along the shared edge; water crossings get a boardwalk too) ----------------
for (const [a, b, t, c0] of [
  ["YL", "YD"], ["YD", "YH"], ["YH", "YF"], ["YF", "YR", "p", 171], ["YR", "EB", "p", 171], ["YL", "EC"], ["YL", "YN"], ["YD", "YT"], ["YH", "YJ"], ["YF", "YC"], ["EB", "YP"],
  ["YI", "EC", "p", 24], ["YI", "YO", "p", 25], ["YN", "YI", "k", 135], ["YT", "YN", "k", 135], ["YJ", "YT"], ["YC", "YJ"], ["YC", "YW"], ["YW", "YP"], ["YP", "E4"],
  ["YT", "YU"], ["Y7", "YU", "k"], ["YJ", "YS"], ["YC", "YQ"], ["YM", "YW", "p", 175], ["E4", "E3"], ["YO", "Q1"], ["YU", "YS"], ["YQ", "YS"], ["YQ", "YM"], ["E3", "E2"], ["E2", "YM"],
  ["YU", "Q3"], ["YS", "YG"], ["Q6", "YQ"], ["YM", "YA"], ["E2", "Y4"], ["E3", "E1"], ["Q1", "Q2"], ["Q2", "Q3"], ["Q3", "YG"], ["Q6", "YG"], ["Q6", "YA"], ["Y4", "E1"],
  ["Q2", "YK"], ["YG", "YB", "p", 115], ["Q6", "YX"], ["YA", "YZ"], ["YV", "Y4"], ["E1", "YY"], ["YB", "YE"], ["YE", "YK"], ["YZ", "YX", "p", 45], ["YZ", "YV", "p", 54], ["YV", "YY", "p", 54], ["YY", "Y8"],
  ["Q4", "YK"], ["F4", "YB"], ["S3", "YX", "p", 137], ["S4", "YZ", "p", 182], ["V2", "YV", "p", 193], ["Q4", "F3"], ["F3", "F4"], ["F4", "S3", "p", 20], ["S4", "V2", "p", 17], ["V2", "Y8"],
  ["F1", "F3"], ["F2", "F4"], ["F1", "F2"], ["F2", "S1", "p", -20], ["S2", "V1", "p", -18], ["V1", "V2"], ["V1", "Y9", "p", -6], ["Y8", "Y9"]]) {
  const A = TSCN[a], B = TSCN[b]; if (!A || !B) throw new Error("glyphos link " + a + "-" + b); const horiz = A.gy === B.gy; if (!(horiz ? Math.abs(A.gx - B.gx) === 30 : A.gx === B.gx && Math.abs(A.gy - B.gy) === 30)) throw new Error("glyphos link not adjacent " + a + "-" + b);
  const s0 = horiz ? A.gy : A.gx; let c = c0; if (c === undefined) { const ha = horiz ? A.gy + A.hub[1] : A.gx + A.hub[0], hb = horiz ? B.gy + B.hub[1] : B.gx + B.hub[0], ta = !A.wild, tb = !B.wild; c = ta && tb ? Math.round((ha + hb) / 2) : ta ? ha : tb ? hb : Math.round((ha + hb) / 2 + (nh(A.gx + B.gx, A.gy + B.gy, 77) - 0.5) * 6); }
  c = Math.max(s0 + 4, Math.min(s0 + 25, c)); TLINK.push([a, b, t || "p", c]); if (t === "k") TLINK.push([a, b, "p", c]); }
