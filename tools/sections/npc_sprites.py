"""Give every townsperson a sprite that fits who they are, and a voice that fits the sprite.

    python tools/sections/npc_sprites.py            -> data/npc_sprites.json + report
    python tools/sections/npc_sprites.py --voices CSV [CSV...]   also rewrites those voice lists' townsfolk voices

Each NPC's role comes from its first line ("Old Resident: ..."), or its trainer class. Sprites (the world's own folk
sheet + the generic ones) are tagged by age, sex and job; the best fit is picked (job match, then this world's folk,
then a stable hash), never the same sprite twice in one map when another fits. Story characters keep their own
sprite (Dax, Grub, Strand...). The voice follows the sprite (an old man sprite never gets a young woman's voice).
tools/build.js uses data/npc_sprites.json in place of its old random swap.
"""
import csv, hashlib, json, re, sys, collections

W = json.load(open('data/world.json', encoding='utf-8'))['sections']
FOLK = json.load(open('data/world_folk.json', encoding='utf-8'))
H = lambda s: int(hashlib.md5(s.encode()).hexdigest(), 16)

# age k/a/e, sex m/f/x, jobs
T = {}
def tag(name, age, sex, *jobs): T[name] = (age, sex, set(jobs))
for n, a, s, j in [
 ('explorer','a','m','travel'), ('researcher','a','m','sci'), ('civilian','a','f',''), ('technician','a','m','tech'),
 ('miner','e','m','travel'), ('pilgrim','a','x','mystic'), ('wanderer','a','x','travel'), ('townsfolk','k','m',''),
 # Dustara
 ('dustara_canyon_courier','a','f','travel'), ('dustara_crater_stargazer','a','f','sci mystic'), ('dustara_dune_farmer','a','m','farm'),
 ('dustara_spice_vendor','a','f','trade'), ('dustara_sand_ranger','a','x','travel guard'), ('dustara_seedpod_hunter','a','m','travel sci'),
 ('dustara_mesa_mechanic','a','m','tech'), ('dustara_desert_elder','e','m','mystic'),
 # Ferrox
 ('ferrox_crane_operator','a','m','tech'), ('ferrox_scrap_picker','a','m','tech'), ('ferrox_rail_conductor','a','m','travel'),
 ('ferrox_forge_smith','a','m','mine'), ('ferrox_rust_tinkerer','a','m','tech'), ('ferrox_salvage_trader','a','m','trade'),
 ('ferrox_weld_apprentice','a','m','tech'), ('ferrox_ferrox_foreman','a','m','tech guard'),
 # Sporeholm
 ('sporeholm_mushroom_forager','a','f','farm'), ('sporeholm_spore_researcher','a','x','sci'), ('sporeholm_bog_fisher','a','m','sea'),
 ('sporeholm_swamp_herbalist','e','f','farm mystic'), ('sporeholm_firefly_kid','k','x',''), ('sporeholm_moss_ranger','a','x','travel guard'),
 ('sporeholm_stilt_builder','a','m','tech'), ('sporeholm_spore_singer','a','f','mystic'),
 # Thalassa
 ('thalassa_dock_hand','a','m','sea tech'), ('thalassa_fishmonger','a','f','trade sea'), ('thalassa_pearl_diver','a','f','sea'),
 ('thalassa_lighthouse_keeper','e','m','sea'), ('thalassa_harbor_sailor','a','m','sea'), ('thalassa_beach_kid','k','m',''),
 ('thalassa_shipwright','a','m','tech'), ('thalassa_coral_researcher','a','f','sci'),
 # Neonis
 ('neonis_neon_raver','a','f','fan'), ('neonis_holo_promoter','a','f','trade fan'), ('neonis_neon_skater','a','m','fan'),
 ('neonis_arcade_kid','k','f',''), ('neonis_cable_tech','a','m','tech'), ('neonis_noodle_cook','a','m','trade'),
 ('neonis_glitch_hunter','a','x','sci tech'), ('neonis_night_courier','a','f','travel'),
 # Glyphos
 ('glyphos_archaeologist','a','f','sci'), ('glyphos_mural_copyist','a','f','sci'), ('glyphos_chime_keeper','a','f','mystic'),
 ('glyphos_camp_cook','a','m','trade'), ('glyphos_relic_porter','a','m','travel'), ('glyphos_rune_scholar','a','m','sci'),
 ('glyphos_jungle_guide','a','m','travel'), ('glyphos_ruins_kid','k','m',''),
 # Pyros
 ('pyros_lava_miner','a','x','mine'), ('pyros_lamplighter','a','x','mystic'), ('pyros_drill_operator','a','m','mine'),
 ('pyros_obsidian_carver','a','f','mine'), ('pyros_fire_warden','a','x','guard'), ('pyros_cinder_kid','k','m',''),
 ('pyros_spring_keeper','a','f','trade'), ('pyros_ash_elder','e','m','mystic'),
 # Glacia
 ('glacia_ice_fisher','a','m','sea'), ('glacia_aurora_watcher','a','f','sci'), ('glacia_sled_courier','a','m','travel'),
 ('glacia_snow_researcher','a','f','sci'), ('glacia_fur_trader','a','m','trade'), ('glacia_snowball_kid','k','x',''),
 ('glacia_ice_climber','a','m','travel'), ('glacia_frost_baker','a','f','trade'),
 # Helix
 ('helix_station_engineer','a','m','tech'), ('helix_lab_assistant','a','f','sci'), ('helix_hydro_gardener','a','f','farm'),
 ('helix_docking_pilot','a','m','travel'), ('helix_service_droid','a','x','tech'), ('helix_helix_grunt','a','x','guard'),
 ('helix_freed_captive','a','m','travel'), ('helix_station_kid','k','m',''),
 # Halo
 ('halo_sky_pilgrim','a','f','mystic'), ('halo_cloud_farmer','a','f','farm'), ('halo_wind_glider','a','f','travel'),
 ('halo_bellringer','a','m','mystic'), ('halo_sky_postman','a','m','travel'), ('halo_kite_kid','k','m',''),
 ('halo_starwatch_monk','a','f','mystic sci'), ('halo_feather_weaver','a','f','trade'),
 # Umbra
 ('umbra_lantern_lighter','a','x','mystic'), ('umbra_gravekeeper','e','m','mystic'), ('umbra_shadow_mapper','a','m','travel'),
 ('umbra_night_vendor','a','f','trade'), ('umbra_veiled_mourner','a','f','mystic'), ('umbra_ghost_story_kid','k','m',''),
 ('umbra_void_researcher','a','m','sci'), ('umbra_mine_watchman','a','m','guard mine'),
 # Starfall
 ('starfall_rift_surveyor','a','m','sci travel'), ('starfall_seedpod_collector','a','f','travel'), ('starfall_camp_medic','a','f','nurse'),
 ('starfall_meteor_prospector','a','m','mine'), ('starfall_rim_cook','a','m','trade'), ('starfall_signal_operator','a','f','tech'),
 ('starfall_containment_officer','a','m','guard'), ('starfall_starchart_kid','k','m',''),
 # Apex
 ('apex_telescope_tech','a','m','sci tech'), ('apex_summit_climber','a','m','travel'), ('apex_star_scholar','a','f','sci'),
 ('apex_relay_engineer','a','m','tech'), ('apex_quorum_delegate','a','x','fan'), ('apex_mountain_porter','a','m','travel'),
 ('apex_prime_hopeful','a','m','fan'), ('apex_observatory_kid','k','f',''),
 # Ystra
 ('ystra_ystran_elder','e','x','mystic'), ('ystra_seedkeeper','a','f','farm'), ('ystra_ystran_scout','a','x','travel'),
 ('ystra_echo_child','k','x',''), ('ystra_blight_cleanser','a','x','mystic'), ('ystra_ystran_artisan','a','f','trade'),
 ('ystra_fragment_wanderer','a','m','travel'), ('ystra_memory_keeper','a','f','mystic')]:
    tag(n, a, s, *j.split())
GENERIC = {'explorer', 'wanderer', 'civilian', 'technician', 'miner', 'researcher', 'pilgrim', 'townsfolk'}
OWN = {'Dax': 'dax', 'Forge Miner Dax': 'dax', 'Grub': 'grub', 'Strand': 'strand', 'Pell': 'pell',
       'Tamsin': 'tamsin', 'Mina': 'mina', 'Fenna': 'fenna', 'Bram': 'bram', 'Mr. Abernathy': 'abernathy', 'Nurse Coral': 'coral',
       'Mom': 'mom', 'Kit': 'kit', 'Teo': 'teo', 'Sola': 'sola', 'DX-4': 'dx4', 'Dusty': 'dusty', 'Old Dusty': 'dusty'}
JOBS = [(r'\bkid\b|girl|boy|child', 'KID'), (r'\bold\b|\belder\b|grand|caretaker', 'ELDER'),
        (r'miner|digger|drill|smith|spelunk|prospect', 'mine'), (r'research|scien|archae|botan|astronom|archiv|stargaz|star watch|skywatch|scholar|geolog|biolog|surveyor|analyst', 'sci'),
        (r'technician|mechanic|engineer|scrapper|scaveng|tech|tinker|welder|radio|coder|signal|operator', 'tech'), (r'farmer|gardener|tender|picker|herbal|forager', 'farm'),
        (r'sailor|fisher|diver|beach|boater|swimmer|deckhand|ferry|net-mender', 'sea'), (r'pilgrim|mystic|seeker|lantern|rift walker|monk|singer', 'mystic'),
        (r'explorer|hiker|climber|hunter|traveller|wanderer|drifter|courier|porter|guide|nomad|ranger|scout|pilot', 'travel'),
        (r'clerk|receptionist|shop|trader|vendor|cook|baker|merchant', 'trade'), (r'guard|watchman|warden|officer|soldier', 'guard'),
        (r'\bfan\b|raver|skater|hopeful', 'fan'), (r'medic|nurse', 'nurse')]


def role_of(n):
    t = (n.get('t') or [''])[0]
    m = re.match(r"^([A-Z][\w.'-]*(?: [A-Za-z&][\w.'-]*){0,3})(?: \([^)]*\))?:\s", t)
    if m: return m.group(1)
    if n.get('trainer'): return n['trainer'].get('cls') or ''
    return ''


def want(role):
    r = role.lower(); age, jobs = 'a', set()
    for rx, j in JOBS:
        if re.search(rx, r):
            if j == 'KID': age = 'k'
            elif j == 'ELDER': age = 'e'
            else: jobs.add(j)
    return age, jobs


STRONG = {'mine', 'sci', 'sea', 'farm', 'guard', 'nurse', 'trade', 'tech'}   # jobs worth borrowing another world's sprite for

def pool(pkey):
    return [f'{pkey}_{r}' for r in FOLK.get(pkey, []) if f'{pkey}_{r}' in T] + sorted(GENERIC)

ALLFOLK = [a for a in T if '_' in a]


FEM = r'woman|grandma|grandmother|mother|mum|mom|lady|aunt|girl|sister|mrs|ms|widow|queen|wife'
MAL = r'man|grandpa|grandfather|mr|uncle|boy|brother|king|husband|old salt|fisherman'
def sex_of(role):
    r = role.lower()
    return 'f' if re.search(FEM, r) else 'm' if re.search(MAL, r) else None


def choose(sid, i, role, pkey, used, sex=None):
    age, jobs = want(role); sex = sex or sex_of(role)
    best, bs = None, -1e9
    local = set(pool(pkey))
    for a in list(local) + [a for a in ALLFOLK if a not in local and ((jobs & STRONG & T[a][2]) or (age == 'e' and T[a][0] == 'e'))]:
        sa, ss, sj = T[a]
        if age == 'k' and sa != 'k': continue
        if age != 'k' and sa == 'k': continue
        if sex and ss != sex and not (ss == 'x' and sa != 'e'): continue
        sc = 0
        sc += 6 * len(jobs & sj)
        if jobs & STRONG and not (jobs & sj): sc -= 3
        if a not in local: sc -= 4
        if age == 'e': sc += 5 if sa == 'e' else -10
        elif sa == 'e': sc -= 2
        sc += 2 if not a in GENERIC else 0
        sc -= 8 * used[a]
        sc += (H(f'{sid}:{i}:{a}') % 1000) / 1000
        if sc > bs: best, bs = a, sc
    return best


def voice_for(art, role, h):
    sa, ss, sj = T.get(art, ('a', 'x', set()))
    age, jobs = want(role)
    if sa == 'k' or age == 'k': return 'kid'
    if sa == 'e' or age == 'e': return 'elder_f' if ss == 'f' else 'elder_m'
    for j, v in (('sci', 'researcher'), ('mine', 'miner'), ('guard', 'guard'), ('trade', 'clerk'), ('fan', 'fan'),
                 ('sea', 'sailor'), ('farm', 'farmer'), ('mystic', 'pilgrim'), ('nurse', 'nurse'), ('travel', 'explorer'), ('tech', 'technician')):
        if j in jobs: return v
    return {'m': 'townsman', 'f': 'townswoman'}.get(ss, ['townsman', 'townswoman'][h % 2])


def main():
    out, report, linevoice = {}, collections.Counter(), {}
    for sid in sorted(W):
        s = W[sid]; used = collections.Counter()
        for i, n in enumerate(s.get('npcs', [])):
            art = n.get('art', ''); role = role_of(n); key = n.get('src') or f'{sid}:{i}'
            new = None
            if role in OWN and art != OWN[role]: new = OWN[role]
            elif art in GENERIC or re.match(r'^[a-z]+_folk\d$', art) or (art == 'mom' and role != 'Mom'):
                if n.get('trainer') and not n['trainer'].get('linker') and art not in GENERIC: continue
                new = choose(sid, i, role, s['pkey'], used)
            final = new or art
            used[final] += 1
            if new: out.setdefault(sid, {})[str(i)] = new; report['re-picked'] += 1
            v = voice_for(final, role, H(key))
            for l in (n.get('t') or []): linevoice.setdefault(l, (v, final, role, sid))
    json.dump(out, open('data/npc_sprites.json', 'w', encoding='utf-8'), indent=0, sort_keys=True)
    print(dict(report))
    if '--voices' in sys.argv:
        ns = {}; norm = lambda t: re.sub(r'[^a-z0-9]+', ' ', re.sub(r"^[A-Z][\w.'&-]*(?: [A-Za-z&][\w.'-]*){0,3}(?: \([^)]*\))?:\s+", '', t).lower()).strip()
        byn = {norm(l): v for l, v in linevoice.items()}
        KEEP = {'kit', 'vashti', 'squid', 'mom', 'grub', 'tamsin', 'dx4', 'dusty', 'mina', 'grunt', 'xenodex', 'nurse', 'ystran'}
        for p in sys.argv[sys.argv.index('--voices') + 1:]:
            rows = list(csv.DictReader(open(p, encoding='utf-8'))); ch = collections.Counter()
            for r in rows:
                if r['voice'] in KEEP: continue
                hit = byn.get(norm(r['text']))
                if not hit: continue
                v = hit[0]
                if v != r['voice']:
                    ch[f"{r['voice']}->{v}"] += 1
                    r['file'] = r['file'].replace('_' + r['voice'] + '.mp3', '_' + v + '.mp3'); r['voice'] = v
            w = csv.DictWriter(open(p, 'w', newline='', encoding='utf-8'), fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
            print(p, sum(ch.values()), 'voices changed', ch.most_common(12))


if __name__ == '__main__':
    main()
