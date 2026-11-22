/* Rigged-model test (preview only). Loads the new rigged copies of the first-5-level Alienmon for battles, and the new rigged
   characters' own idle/walk/run. Add ?rig=0 to the address to play with the old models for comparison. */
(function(){if(/[?&]rig=0/.test(location.search))return;var A={
"br_rig_blinkit": "url:m/rig/br_rig_blinkit.446ad43b.glb",
"br_rig_bogeel": "url:m/rig/br_rig_bogeel.5df5e232.glb",
"br_rig_cactling": "url:m/rig/br_rig_cactling.44ba30ea.glb",
"br_rig_chirpod": "url:m/rig/br_rig_chirpod.edacff8f.glb",
"br_rig_cogglet": "url:m/rig/br_rig_cogglet.086ae28e.glb",
"br_rig_coilet": "url:m/rig/br_rig_coilet.4c6ca355.glb",
"br_rig_drippit": "url:m/rig/br_rig_drippit.7bc91103.glb",
"br_rig_dunetrot": "url:m/rig/br_rig_dunetrot.3ff8febf.glb",
"br_rig_fizzle": "url:m/rig/br_rig_fizzle.a817bf62.glb",
"br_rig_fizzlord": "url:m/rig/br_rig_fizzlord.bdc8c56f.glb",
"br_rig_gleamgrub": "url:m/rig/br_rig_gleamgrub.2f2686b7.glb",
"br_rig_gloopa": "url:m/rig/br_rig_gloopa.6ae636a8.glb",
"br_rig_hivemaw": "url:m/rig/br_rig_hivemaw.f7d30bd0.glb",
"br_rig_liftant": "url:m/rig/br_rig_liftant.8ebe6f13.glb",
"br_rig_magnub": "url:m/rig/br_rig_magnub.ef9d9a95.glb",
"br_rig_pebblet": "url:m/rig/br_rig_pebblet.e8c3301d.glb",
"br_rig_skitterbit": "url:m/rig/br_rig_skitterbit.acc63159.glb",
"br_rig_spindyn": "url:m/rig/br_rig_spindyn.f3fa6e09.glb",
"br_rig_sporix": "url:m/rig/br_rig_sporix.49721186.glb",
"br_rig_tiktrill": "url:m/rig/br_rig_tiktrill.533e8daf.glb",
"tr_d002_sola_reyes": "url:m/rig/tr_d002_sola_reyes.b70eb5ff.glb",
"tr_d004_dr_imogen_vashti": "url:m/rig/tr_d004_dr_imogen_vashti.f51a626b.glb",
"tr_d005_dx_4": "url:m/rig/tr_d005_dx_4.d63b996b.glb",
"tr_d006_nana_wren": "url:m/rig/tr_d006_nana_wren.696fca42.glb",
"tr_d011_rock_girl": "url:m/rig/tr_d011_rock_girl.e7343b39.glb",
"tr_n2_story_kit": "url:m/rig/tr_n2_story_kit.c3bc9679.glb",
"tr_n2_story_sola": "url:m/rig/tr_n2_story_sola.921dacaa.glb",
"tr_r2_kid": "url:m/rig/tr_r2_kid.cfbde01b.glb"
};for(var k in A)window.ASSETS.glb[k]=A[k];
window.RIGGED={"Blinkit": "br_rig_blinkit", "Bogeel": "br_rig_bogeel", "Cactling": "br_rig_cactling", "Chirpod": "br_rig_chirpod", "Cogglet": "br_rig_cogglet", "Coilet": "br_rig_coilet", "Drippit": "br_rig_drippit", "Dunetrot": "br_rig_dunetrot", "Fizzle": "br_rig_fizzle", "Fizzlord": "br_rig_fizzlord", "Gleamgrub": "br_rig_gleamgrub", "Gloopa": "br_rig_gloopa", "Hivemaw": "br_rig_hivemaw", "Liftant": "br_rig_liftant", "Magnub": "br_rig_magnub", "Pebblet": "br_rig_pebblet", "Skitterbit": "br_rig_skitterbit", "Spindyn": "br_rig_spindyn", "Sporix": "br_rig_sporix", "Tiktrill": "br_rig_tiktrill"};window.YAWFIX=Object.assign(window.YAWFIX||{},{"br_rig_chirpod": -1.5708, "br_rig_gloopa": -1.5708});})();
