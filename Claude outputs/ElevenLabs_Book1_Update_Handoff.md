# Handoff for Claude in Chrome: update the ElevenLabs audiobook "Alienmon Book 1"

## Your task
You are updating my existing ElevenLabs Studio project **"Alienmon Book 1"** (the audiobook of *Alienmon: The Kessler Signal*). It was built from the first edition of the book (Oct 12). The book has since been revised. Change ONLY the text that changed and regenerate ONLY those parts, so I don't pay to re-render the whole novel.

Chapters with **no changes: Prologue, Chapter 11 and Chapter 23.** Don't touch them.

## Changed chapters
| Ch | Title | Mode | Edits | New words to generate |
|---|---|---|---|---|
| 1 | The Night the Bridge Hummed | paragraph edits | 6 | 491 |
| 2 | Zib | paragraph edits | 1 | 82 |
| 3 | Canyon Rivals | paragraph edits | 5 | 1,039 |
| 4 | The Cactus Garden Catch | paragraph edits | 8 | 1,278 |
| 5 | Leaving Dustmere | paragraph edits | 4 | 2,365 |
| 6 | The Stowaway | paragraph edits | 4 | 217 |
| 7 | The Gate That Woke | paragraph edits | 4 | 1,061 |
| 8 | The Iron Orphans | paragraph edits | 7 | 1,046 |
| 9 | Like Father, Like Kit | whole chapter | 6 | 2,657 |
| 10 | Launch Clearance | paragraph edits | 5 | 1,587 |
| 12 | Rival in the Lantern Marsh | paragraph edits | 14 | 1,818 |
| 13 | Lost in the Mushroom Maze | paragraph edits | 8 | 1,789 |
| 14 | Plazmet Ignites | paragraph edits | 8 | 2,082 |
| 15 | Port Ember | paragraph edits | 5 | 459 |
| 16 | Ghost Ship | paragraph edits | 10 | 516 |
| 17 | Harbor Under Siege | whole chapter | 13 | 2,427 |
| 18 | Captain's Orders | whole chapter | 7 | 2,389 |
| 19 | Sola's Choice | paragraph edits | 10 | 1,357 |
| 20 | City of Lights | paragraph edits | 6 | 1,411 |
| 21 | Pirate Radio | paragraph edits | 1 | 378 |
| 22 | Static on the Line | paragraph edits | 10 | 1,694 |
| 24 | Temple of Voices | whole chapter | 13 | 2,688 |
| 25 | Murals of Ystra | paragraph edits | 5 | 421 |
| 26 | The Crater Four | paragraph edits | 3 | 252 |

About 31,504 words need generating, about a third of the book. Four chapters (9, 17, 18, 24) changed so much that you replace the whole chapter text. The rest are paragraph-by-paragraph edits.

## How to work (follow exactly)
1. Open ElevenLabs (elevenlabs.io), go to **Studio**, open the project **Alienmon Book 1**. If you can't find it or I'm not signed in, stop and tell me.
2. Before editing, look at how the project is voiced. Note which voice is used for the Narrator, Rook, Kit, Sola, Dr. Vashti, Hank, Pell, Strand, Admin Vex, Director Thorne, Liss, Captain Marsh, DJ Static and anyone else, and how Zib's "Bip" is handled. Write this cast list down in your log; you'll reuse it for new lines.
3. Work **one chapter at a time, in order**, using that chapter's section in this file.
   - **Paragraph edits:** for each edit, find the OLD TEXT in the Studio editor. Use the "Find" anchor (the opening words of the first paragraph and the closing words of the last). Use the browser's find (Ctrl+F) on the opening words if needed. Select from the start of the first old paragraph to the end of the last old paragraph, delete it, and paste the NEW TEXT, keeping one paragraph per line break exactly as given. For INSERT edits, click at the end of the named paragraph, press Enter, and paste. For DELETE edits, remove the paragraph(s).
   - **Whole-chapter replacement:** keep the chapter and its title. Select all the text in the chapter body, delete it, and paste the NEW CHAPTER TEXT.
   - Paste plain text only. No formatting, no "> " quote marks (those only mark the old text in this file), no headings.
4. **Assign voices** to every new or changed paragraph, the same way the rest of the project is voiced:
   - Narration goes to the Narrator voice.
   - Quoted dialogue goes to the speaking character's voice (split a paragraph's quote onto the character voice if the project does that elsewhere).
   - New minor speakers keep to existing voices: a Helix grunt named Brann, a young grunt, Fenna, Mina and others. Reuse a matching minor/extra voice the project already has, otherwise use the Narrator. List every new speaker and the voice you chose in your log.
   - **Tone change for Helix:** Pell and Strand are no longer a comedy duo. Pell is calm, clipped and certain; Strand is quiet and uneasy; Vex is icy. If their existing voices are clearly comic or cartoonish, **stop and ask me** before changing voices or voice settings.
5. **Generate only what changed.** Studio marks edited paragraphs as not yet converted. Use the chapter's convert/generate button, which only renders unconverted paragraphs (or regenerate the changed paragraphs one by one). **Never use "Convert whole project" or regenerate unchanged chapters.** Before generating, check the credit cost shown. If it looks like it will regenerate the whole book, stop and ask me.
6. Spot-listen to the first and last changed paragraph in each chapter: the right voice, no cut-off words, and the pronunciations below.
7. Once every changed chapter is done, export/download the updated chapters (or the whole audiobook if Studio only exports everything; exporting doesn't cost credits) and tell me where the files are.

## Pronunciations (add to the project's pronunciation dictionary if they come out wrong)
Alienmon = AY-lee-en-mon · Plazmo = PLAZ-moe · Plazmet = PLAZ-met · Gloopa = GLOO-pah · Tidaloid = TIE-dah-loyd · Sporix = SPOR-ix · Mycelith = MY-seh-lith · Vashti = VASH-tee · Ystra = ISS-trah · Thalassa = thah-LASS-ah · Glyphos = GLIFF-oss · Neonis = nee-ON-iss · Glacia = GLAY-see-ah · Anvilox = ANN-vil-ox · Lumislug = LOO-mih-slug · Monolet = MON-oh-let · Skitterdrone = SKIT-er-drone.

## Rules
- Make exactly the edits listed. Don't rewrite, fix or "improve" any wording.
- If an OLD TEXT can't be found because the project text differs, search for a few distinctive words from the middle of it. If it still isn't there, skip that edit, note it in the log, and carry on.
- Stop and ask me before anything that costs credits beyond these chapters, before deleting a chapter, and before changing any voice's settings.
- Keep a running log (chapter → edits done → new speakers/voices → credits used → problems) and give it to me at the end.

---
# Chapter 1: The Night the Bridge Hummed

**Mode: 6 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 6
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Rook ran past the bakery, where Mr. Pell-Abernathy (no relation to anyone …" through the paragraph ending "… stubby foot. Rook waved back without slowing down."

**OLD TEXT (remove exactly this):**

> Rook ran past the bakery, where Mr. Pell-Abernathy (no relation to anyone important) was sliding loaves onto a cooling rack. He ran past the market, where people were setting out baskets of cactus fruit, strings of dried peppers and glittering canyon crystals. A little girl was riding on the back of a round, sand-colored Alienmon that looked like a rock with legs. It waved at Rook with one stubby foot. Rook waved back without slowing down.

**NEW TEXT (paste exactly this):**

Rook ran past the bakery, where Mr. Abernathy was sliding loaves onto a cooling rack. He ran past the market, where people were setting out baskets of cactus fruit, strings of dried peppers and glittering canyon crystals. A little girl was riding on the back of a round, sand-colored Alienmon that looked like a rock with legs. It waved at Rook with one stubby foot. Rook waved back without slowing down.

## Edit 2 of 6
**Type:** REPLACE 5 old paragraph(s) with 5 new paragraph(s)
**Find:** from the paragraph starting "Three glass capsules sat on velvet cushions in a row. Each capsule …" through the paragraph ending "… pulled its mushroom cap down over its eyes."

**OLD TEXT (remove exactly this):**

> Three glass capsules sat on velvet cushions in a row. Each capsule was about the size of a melon, rimmed with brass, and each one glowed softly from the inside. And inside each one, something was moving.

> Rook's breath caught in his throat.

> In the first capsule floated a little ball of fire. It was round and bright orange, about the size of an apple, and it had one big round eye right in the middle, dark and shiny and curious. Two tiny sparks spun around it in circles, like little moons around a little sun. As Rook leaned closer, the sparks began to spin faster.

> In the second capsule wobbled a blob of clear blue jelly, shaped like a dome, with a perfect round bubble glowing in its middle like a heart. When Rook looked at it, it jiggled.

> In the third capsule sat a round, fluffy puffball, cream-colored and soft-looking, wearing a mushroom cap on its head like a hat. The cap was red with white spots. It had two big shy eyes and a tiny mouth. When it saw Rook looking, it squeaked and pulled its mushroom cap down over its eyes.

**NEW TEXT (paste exactly this):**

Three glass capsules sat on velvet cushions in a row. Each capsule was about as big as a beach ball, rimmed with brass, and each one glowed softly from the inside. And inside each one, something was moving.

Rook's breath caught in his throat.

In the first capsule floated a little swirl of living fire, orange and gold, about as big as a pumpkin, and it had one big round eye blinking right in the middle, dark and shiny and curious. Two tiny sparks spun around it in circles, like little moons around a little sun. As Rook leaned closer, the sparks began to spin faster.

In the second capsule wobbled a blob of clear blue jelly, shaped like a dome, with a perfect round bubble glowing in its middle like a heart, and a fringe of curly little tentacles underneath that waved and tasted the air. When Rook looked at it, it jiggled and gave a gurgling giggle.

In the third capsule sat a round, fluffy puffball, cream-colored and soft-looking, wearing a mushroom cap on its head like a hat. The cap was red with white spots. It had two big shy eyes and a tiny mouth. When it saw Rook looking, it squeaked, the white spots on its cap puffed open in a nervous little cloud, and it pulled its mushroom cap down over its eyes.

## Edit 3 of 6
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "The jelly was jiggling politely. The puffball was still hiding under its …" through the paragraph ending "… it were so excited it couldn't hold still."

**OLD TEXT (remove exactly this):**

> The jelly was jiggling politely. The puffball was still hiding under its cap. But the little fire ball... the little fire ball was looking right at him. It had floated all the way to the front of its capsule and pressed its eye against the glass, and its two sparks were spinning so fast now they were just a blur, as if it were so excited it couldn't hold still.

**NEW TEXT (paste exactly this):**

The jelly was jiggling politely. The puffball was still hiding under its cap. But the little fire ball... the little fire ball was looking right at him. It had floated all the way to the front of its capsule and pressed its eye against the glass, its flames had shot up tall and wild, and its two sparks were spinning so fast now they were just a blur, as if it were so excited it couldn't hold still.

## Edit 4 of 6
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting ""Plazmo," he said. "I choose you, buddy."" through the paragraph ending ""Plazmo," he said. "I choose you, buddy.""

**OLD TEXT (remove exactly this):**

> "Plazmo," he said. "I choose you, buddy."

**NEW TEXT (paste exactly this):**

"Plazmo," he said softly. "Want to be my partner, buddy?"

## Edit 5 of 6
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Rook held out his hand. Plazmo floated down and settled into his …" through the paragraph ending "… hot cocoa, but it didn't burn at all."

**OLD TEXT (remove exactly this):**

> Rook held out his hand. Plazmo floated down and settled into his palm. It was warm, like a mug of hot cocoa, but it didn't burn at all.

**NEW TEXT (paste exactly this):**

Rook held out his hands. Plazmo floated down and settled into them. It was warm, like a mug of hot cocoa, but it didn't burn at all.

## Edit 6 of 6
**Type:** REPLACE 3 old paragraph(s) with 3 new paragraph(s)
**Find:** from the paragraph starting "She stepped forward, picked up the second capsule, the one with the …" through the paragraph ending "… walked out of the Observatory without saying goodbye."

**OLD TEXT (remove exactly this):**

> She stepped forward, picked up the second capsule, the one with the blue jelly inside, and pressed the button herself. The lid hissed open. The jelly wobbled out onto her palm.

> "I'll take this one," she said. "Gloopa. Water beats fire." She looked at Rook. "It's the one that beats yours."

> Then she tucked Gloopa into the big pocket of her father's jacket, turned around, and walked out of the Observatory without saying goodbye.

**NEW TEXT (paste exactly this):**

She stepped forward, picked up the second capsule, the one with the blue jelly inside, and pressed the button herself. The lid hissed open. The jelly wobbled out into her arms.

"I'll take this one," she said. "Gloopa. Water beats fire." She looked at Rook. "It's the one that beats yours."

Then she tucked Gloopa under her arm, inside the flap of her father's big jacket, turned around, and walked out of the Observatory without saying goodbye.


---

# Chapter 2: Zib

**Mode: 1 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 1
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It was the smallest, strangest, most wonderful thing he had ever seen. …" through the paragraph ending "… a cockpit, it had one huge round eye."

**OLD TEXT (remove exactly this):**

> It was the smallest, strangest, most wonderful thing he had ever seen. It was about the size of his hand. It was made of something silvery and smooth, like a seashell or a pearl. Its lights were blinking slowly all around its rim. And right in the middle of its top, where a saucer would have a cockpit, it had one huge round eye.

**NEW TEXT (paste exactly this):**

It was the smallest, strangest, most wonderful thing he had ever seen. It was about the size of his hand. It was made of something silvery and smooth, like a seashell or a pearl. Its lights were blinking slowly all around its rim. And right in the middle of its top, where a saucer would have a cockpit, it had a clear glass dome. Inside the dome sat a little round body, and that little round body had one huge round eye.


---

# Chapter 3: Canyon Rivals

**Mode: 5 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Plazmo zoomed forward like a rocket, its sparks blazing, leaving a trail …" through the paragraph ending "… leaving a trail of orange light behind it."

**OLD TEXT (remove exactly this):**

> Plazmo zoomed forward like a rocket, its sparks blazing, leaving a trail of orange light behind it.

**NEW TEXT (paste exactly this):**

Plazmo zoomed forward like a rocket, its sparks blazing, leaving a trail of orange light behind it. The kids on the fence ducked as it whooshed past their heads.

## Edit 2 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Plazmo gathered all its fire into one glowing ball, wound up, and …" through the paragraph ending "… the corral, crackling and fizzing, straight at Gloopa."

**OLD TEXT (remove exactly this):**

> Plazmo gathered all its fire into one glowing ball, wound up, and hurled it with all its might. It shot across the corral, crackling and fizzing, straight at Gloopa.

**NEW TEXT (paste exactly this):**

Plazmo gathered all its fire into one glowing ball, wound up, and hurled it with all its might. It shot across the corral, crackling and fizzing, so hot that Rook felt it go past on his cheeks, straight at Gloopa.

## Edit 3 of 5
**Type:** REPLACE 13 old paragraph(s) with 29 new paragraph(s)
**Find:** from the paragraph starting "Gloopa's middle swelled up. The bubble in its heart glowed bright blue. …" through the paragraph ending "… was so small now. It was barely warm."

**OLD TEXT (remove exactly this):**

> Gloopa's middle swelled up. The bubble in its heart glowed bright blue. Then it opened its mouth, and out rolled a wave. A real wave, made of a hundred shining bubbles stuck together, tall as a fence post, sparkling in the sun. It rolled across the dirt of the corral and crashed right into Plazmo.

> Plazmo went tumbling backward, end over end, its flame sputtering. It hit the fence with a little thump.

> "Plazmo!" Rook ran a step forward. "Are you okay?"

> Plazmo shook itself. Its flame flickered back up, a little smaller than before. Its eye was furious. It zoomed straight back into the fight without being told.

> "Wait—" Rook started.

> But Plazmo was already throwing another Spark Burst. Fssssst. It fizzled. Another Bubble Wave crashed down. Plazmo flew back, smaller still.

> "Again!" Rook shouted, because he didn't know what else to do. "Again, Plazmo! Harder!"

> Plazmo threw everything it had. Spark Burst after Spark Burst after Spark Burst. Every single one fizzled out against Gloopa's watery body. And every time, Gloopa answered with a wave that knocked Plazmo a little further back and made its flame a little smaller.

> It was over in less than a minute.

> The last Bubble Wave crashed down. When it cleared, Plazmo was lying on the ground in a patch of wet dirt. Its flame had shrunk down to the size of a candle. Its sparks had stopped spinning. Its one big eye was closed.

> The old trader raised his hand. "Gloopa wins!"

> Some people cheered. Some people just went "aww." Rook didn't hear any of it. He was already running across the corral. He dropped to his knees in the mud and scooped Plazmo up in both hands, very gently, the way you'd pick up a baby bird.

> Plazmo was so small now. It was barely warm.

**NEW TEXT (paste exactly this):**

Gloopa's middle swelled up. The bubble in its heart glowed bright blue. Then it flung its curly tentacles forward, and out rolled a wave. A real wave, made of a hundred shining bubbles stuck together, tall as a fence post, sparkling in the sun. It rolled across the dirt of the corral, picking up speed, and crashed right into Plazmo.

SPLOOOOSH.

Plazmo went tumbling backward, end over end, its flame hissing and sputtering, and hit the fence so hard the whole rail jumped. THWACK. Two kids on top grabbed each other to keep from falling off. Plazmo dropped into the dirt, and a cloud of white steam boiled up off it, so thick that for one awful second Rook couldn't see it at all.

"Plazmo!" Rook ran a step forward. His heart was banging against his ribs. "Are you okay?"

The steam thinned. Plazmo was lying in a puddle, its flame flattened and shivering, water dripping off its sparks. Then it shook itself, hard, like a wet dog, and its flame crept back up, a little smaller than before, with a dark sooty smudge across one side. Its eye was furious. It zoomed straight back into the fight without being told.

"Wait—" Rook started.

But Plazmo was already throwing another Spark Burst. Fssssst. It fizzled. Another Bubble Wave came rolling in, and this time Plazmo saw it coming. It jinked sideways, quick as a blink, and the wave only clipped the edge of its flame instead of swallowing it whole.

Rook didn't notice. He was too busy being scared. His mouth had gone dry, and everybody was watching, and the only thing in his head was a big loud DO SOMETHING.

"Again!" Rook shouted, because he didn't know what else to do. "Again, Plazmo! Harder!"

Plazmo heard him. Plazmo turned straight back in, the way Rook said. And the next wave hit it full in the face. SPLASH. It knocked Plazmo spinning into the dirt and rolled right over the top of it, and it came skidding out the other side, smaller still.

Plazmo threw everything it had. Spark Burst after Spark Burst after Spark Burst. Fsst. Fsst. Fssssst. Every single one fizzled out against Gloopa's watery body. And every time, Gloopa answered with a wave that knocked Plazmo a little further back and made its flame a little smaller.

SPLOOSH. Plazmo bounced off a barrel.

SPLOOSH. Plazmo skidded through the mud on its side, leaving a long dark trail behind it.

The dirt of the corral had turned to soup. Steam hung over everything like fog. Plazmo's sparks had wobbled right out of their circles, and it was panting, its whole flame going in and out, in and out, ragged at the edges like a candle in a draft. Gloopa hadn't moved an inch. It just sat in the middle of the mud with its bubble heart glowing, and waited.

The crowd had stopped cheering. Somebody near the lemonade stand said, "Oh, the poor little thing."

Plazmo dragged itself up off the ground. It wobbled. It nearly fell. And then it turned around, very slowly, and looked back across the corral at Rook.

It wasn't asking to stop. Rook could see that. It was waiting. Waiting for him to tell it what to do. Waiting for a plan.

Rook didn't have one. He opened his mouth and nothing came out. His knees felt like water. He wanted to run out there and grab Plazmo and hide it inside his jacket. He wanted to shout Stop! But his voice wouldn't work, and the only word that finally squeezed out was the same word as before.

"...Again."

And Plazmo went. Because Rook asked. It gathered up every last spark it had left, every scrap of fire, until it was blazing brighter than it had all day, and it flew straight at Gloopa with everything it had.

Sola watched it come. "Gloopa," she said quietly. "All of it."

Gloopa swelled up bigger than Rook had ever seen it, so big its jelly went thin and shiny, and it let out the biggest Bubble Wave of all. It was taller than the fence. It was taller than the trader on his barrel. It rose up over Plazmo's tiny burning shape like a cliff made of glass.

It was over in less than a minute.

The last Bubble Wave crashed down. KER-SPLOOOOSH. The ground shook. A sheet of muddy water flew up over the fence and soaked the whole front row. And then there was nothing but hissing.

When it cleared, Plazmo was lying on the ground in a patch of wet dirt. Its flame had shrunk down to the size of a candle. Then smaller. A tiny blue-edged flicker, sputtering in the mud. Its sparks had stopped spinning. Its one big eye was closed.

Across the corral, Gloopa sagged down into a puddle of its own, wobbling and out of breath, its bubble heart glowing dimmer than before.

The old trader raised his hand. "Gloopa wins!"

Some people cheered. Some people just went "aww." Rook didn't hear any of it. He was already running across the corral, slipping and sliding. He dropped to his knees in the mud and scooped Plazmo up in both hands, very gently, the way you'd pick up a baby bird.

Plazmo was so small now. It was barely warm. Little wisps of steam curled up off it into the air, and it was shivering.

## Edit 4 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "That made it worse, somehow. Rook's eyes stung." through the paragraph ending "That made it worse, somehow. Rook's eyes stung."

**OLD TEXT (remove exactly this):**

> That made it worse, somehow. Rook's eyes stung.

**NEW TEXT (paste exactly this):**

That made it worse, somehow. Rook's eyes stung. Plazmo had done every single thing he'd asked. It had gotten up every single time. And all he had given it to do was the one thing that didn't work.

## Edit 5 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "He sat there in the mud for a long time after everyone …" through the paragraph ending "… everyone had gone, holding Plazmo, thinking about that."

**OLD TEXT (remove exactly this):**

> He sat there in the mud for a long time after everyone had gone, holding Plazmo, thinking about that.

**NEW TEXT (paste exactly this):**

He sat there in the mud for a long time after everyone had gone, holding Plazmo against his chest to keep it warm, thinking about that.


---

# Chapter 4: The Cactus Garden Catch

**Mode: 8 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "A little round rock-shaped Alienmon called a Pebblet popped up out of …" through the paragraph ending "… his eyes shut, pressed the button, and fired."

**OLD TEXT (remove exactly this):**

> A little round rock-shaped Alienmon called a Pebblet popped up out of the grass. Plazmo bumped it gently with a small spark. The Pebblet rolled over, dizzy. Rook raised his Linker, squeezed his eyes shut, pressed the button, and fired.

**NEW TEXT (paste exactly this):**

A chunky brown stone block of an Alienmon called a Pebblet popped up out of the grass, with sleepy eyes and glittering indigo crystals tucked into its cracks. It took one look at Plazmo, tipped itself over, and came rolling straight at it like a bowling ball, no legs needed. BONK. Plazmo spun away through the air, its sparks knocked all crooked. The Pebblet rolled around in a circle and came back for more. This time Plazmo was ready. It bobbed aside and bumped the Pebblet with a small spark as it rumbled past. Pff. The Pebblet rolled over, dizzy. Rook raised his Linker, squeezed his eyes shut, pressed the button, and fired.

## Edit 2 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "A bouncy little fizzing Alienmon called a Fizzle came zipping through the …" through the paragraph ending "… this time. He aimed very carefully. He fired."

**OLD TEXT (remove exactly this):**

> A bouncy little fizzing Alienmon called a Fizzle came zipping through the grass, crackling and popping like a soda that had been shaken up. Plazmo chased it in circles until it was dizzy and puffing. Rook kept his eyes wide open this time. He aimed very carefully. He fired.

**NEW TEXT (paste exactly this):**

A fuzzy yellow puff of an Alienmon called a Fizzle came zipping through the grass, its huge ears tipped with glowing sparks, crackling and popping like a soda that had been shaken up. Every pop threw off a little zap. ZAP! ZAP-ZAP! One of them caught Plazmo right on the tip of its flame, and Plazmo's whole body scrunched up, and AH-CHOOO! a shower of sparks set a tuft of drift grass smoking, which Rook had to stamp out with his boot. Then Plazmo chased the Fizzle in circles, zap after zap stinging its flame, until the Fizzle was dizzy and puffing, and so was Plazmo. Rook kept his eyes wide open this time. He aimed very carefully. He fired.

## Edit 3 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It was sitting in the shade of a big barrel cactus, and …" through the paragraph ending "… an expression that said, very clearly, Go away."

**OLD TEXT (remove exactly this):**

> It was sitting in the shade of a big barrel cactus, and at first Rook thought it was a baby cactus. It was small, about the size of a loaf of bread, round and green and absolutely covered in short prickly spines. On top of its head grew a single pink flower. It had two little stubby legs, two little stubby arms, and an expression that said, very clearly, Go away.

**NEW TEXT (paste exactly this):**

It was sitting in the shade of a big barrel cactus, and at first Rook thought it was just a young cactus. It was stout and round and green, tall enough to come up past Rook's knees, and absolutely covered in short cream-colored spines. Right in the middle of its body bloomed a single creamy flower, and at the very heart of the flower was one green eye. It had two little stubby legs, two round stubby arms, and that one eye wore an expression that said, very clearly, Go away.

## Edit 4 of 8
**Type:** REPLACE 6 old paragraph(s) with 15 new paragraph(s)
**Find:** from the paragraph starting "The Cactling stomped one stubby foot. It huffed out its cheeks. And …" through the paragraph ending "It glared at them even harder."

**OLD TEXT (remove exactly this):**

> The Cactling stomped one stubby foot. It huffed out its cheeks. And then it threw a handful of needles straight at Plazmo.

> "Hey!" Plazmo dodged, just like they had practiced. The needles whizzed past and stuck into the dirt.

> The Cactling threw more. Plazmo dodged again. And again. Rook didn't shout anything. He just watched. Think first. The Cactling was strong, and grumpy, and very good at throwing needles. But every time it threw, it had to stop and wind up first, and for just a second, it was wide open.

> "Plazmo," Rook said quietly. "Next time it winds up. Little spark. Gentle."

> The Cactling wound up. Plazmo zipped in and tapped it with a small, warm spark, right on the flower. Not hard. Just a tap. The Cactling squeaked in surprise and sat down on its bottom.

> It glared at them even harder.

**NEW TEXT (paste exactly this):**

The Cactling stomped one stubby foot. It huffed, and every spine on its body bristled. And then it threw a handful of needles straight at Plazmo.

Fwip-fwip-fwip!

"Hey!" Plazmo dodged, just like they had practiced. The needles whizzed past and stuck into the dirt. Thunk-thunk-thunk. They went in right up to their ends. Rook stared at them. Those weren't little needles. Those were darts.

The Cactling threw more. Plazmo dodged again. And again. Then the Cactling threw two handfuls at once, one high and one low, exactly like Rook's flopping socks, and Plazmo dipped under the high one and went straight into the low one.

THWIP.

Three needles hit Plazmo square in the flame. Plazmo let out a sharp crackle, like a log popping in a fire, and spun right out of the air and hit the ground. The needles sizzled and burned away to ash. But Plazmo's flame had gone all ragged at the edges, and its sparks were wobbling.

The Cactling didn't wait. It charged, stubby legs pumping, and rammed Plazmo with its spiky shoulder. WHUMP. Plazmo went rolling through the drift grass in a shower of crackling blue static and fetched up against a barrel cactus. Then the Cactling planted itself over it, puffed up to twice its size with every spine bristling, and wound up again.

Rook's chest went tight. Every part of him wanted to yell. Spark Burst! Fight back! Again! Harder! He could feel the words climbing up his throat. They were the exact same words as the corral. The exact same mud.

Plazmo looked up at him from the grass, its flame flickering. Waiting.

Rook swallowed the words. He made himself stand still, and he just watched. Think first. The Cactling was strong, and grumpy, and very good at throwing needles. But every time it threw, it had to stop and wind up first, and for just a second, it was wide open.

"Plazmo," Rook said quietly. "I see it. Get up. Dodge one more. Then, next time it winds up: little spark. Gentle."

Gentle, because Tamsin had said never hurt. Over on her rock, Tamsin had stopped chewing her apple.

Plazmo pushed itself up off the ground. The Cactling flung. This time Plazmo didn't flee backward. It slipped sideways, low and close, so close that the needles hissed right past its flame and singed the grass behind it.

The Cactling wound up. Plazmo zipped in and tapped it with a small, warm spark, right on one round arm. Not hard. Just a tap. Pip. The Cactling squeaked in surprise and sat down on its bottom.

It glared at them even harder. Plazmo floated back to Rook's shoulder, panting, its flame still a little crooked, and Rook cupped a hand around it. "That's it," he whispered. "That's exactly it."

## Edit 5 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "At the edge of the Gardens, the canyon wall rose up tall …" through the paragraph ending "… up puffs of red dust, faster and faster."

**OLD TEXT (remove exactly this):**

> At the edge of the Gardens, the canyon wall rose up tall and red. And near the top, right where the sun had been baking it all day, a chunk of rock as big as a watermelon had broken loose. It came tumbling down the cliff face, bouncing off ledges, sending up puffs of red dust, faster and faster.

**NEW TEXT (paste exactly this):**

At the edge of the Gardens, the canyon wall rose up tall and red. And near the top, right where the sun had been baking it all day, a chunk of rock as big as a watermelon had broken loose. It came tumbling down the cliff face, bouncing off ledges, BANG, BANG, BANG, sending up puffs of red dust, faster and faster.

## Edit 6 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Rook was too far away. Plazmo was too far away. Tamsin was …" through the paragraph ending "… diving to the side. There was no time."

**OLD TEXT (remove exactly this):**

> Rook was too far away. Plazmo was too far away. Tamsin was diving to the side. There was no time.

**NEW TEXT (paste exactly this):**

Rook was too far away. Plazmo was too far away. Tamsin was diving to the side, and her hat went flying, and Zib tumbled off it onto the flat top of the rock and just sat there, staring up, his lights blinking white with fear. There was no time.

## Edit 7 of 8
**Type:** REPLACE 8 old paragraph(s) with 10 new paragraph(s)
**Find:** from the paragraph starting "The rock bounced off the Cactling's tough, spiny body like a ball …" through the paragraph ending "… until he was eye to eye with it."

**OLD TEXT (remove exactly this):**

> The rock bounced off the Cactling's tough, spiny body like a ball off a wall. It rolled away into the drift grass and stopped.

> For a moment, nobody moved.

> Then the Cactling slowly uncurled. It shook itself. A few spines had been knocked loose, and its flower was a little crooked. Otherwise, it seemed fine.

> Zib floated down very slowly until he was right in front of the Cactling's face. He looked at it with his huge round eye. The Cactling looked back at him with its little grumpy ones.

> "...Bip," said Zib softly. It was the gentlest bip Rook had ever heard.

> The Cactling went pink in the cheeks. It looked away. It huffed. Then it climbed down off the rock, walked over to Rook, sat down right in front of his boots, folded its stubby arms, and looked up at him. Its expression had changed. It wasn't saying go away anymore.

> It was saying: Well? Are you going to ask me or not?

> Rook knelt down in the dirt until he was eye to eye with it.

**NEW TEXT (paste exactly this):**

The sound went right through Rook's chest. The rock bounced off the Cactling's tough, spiny body like a ball off a wall, cracked clean in half, and the two pieces rolled away into the drift grass and stopped. The Cactling lay pressed flat against the stone. It didn't move.

For a moment, nobody moved.

"No," Rook heard himself say. "No, no, no." He was running. He didn't remember starting.

The Cactling was still curled up tight. Red dust was settling on it like snow. Rook skidded to his knees in front of the rock, and his hands were shaking so badly he didn't dare touch it.

Then the Cactling slowly uncurled. It took a long time. It shook itself, and a whole little shower of snapped spines fell off its back, leaving a bare, scuffed patch where the rock had hit. Its creamy flower was squashed crooked, and one petal was gone. It tried to stand, wobbled, sat down hard, and glared at its own legs as if they had betrayed it. Then it tried again, and this time it stayed up.

Zib floated down very slowly until he was right in front of the Cactling's face. He looked at it with his huge round eye. The Cactling looked back at him with its single grumpy green eye.

"...Bip," said Zib softly. It was the gentlest bip Rook had ever heard.

The Cactling's spines went flat, just for a second. It looked away. It huffed. Then it climbed down off the rock, one stiff careful step at a time, limped over to Rook, sat down right in front of his boots, folded its stubby arms, and looked up at him. Its expression had changed. It wasn't saying go away anymore.

It was saying: Well? Are you going to ask me or not?

Rook knelt down in the dirt until he was eye to eye with it. Up close, he could see the bare patch on its back and the way it was breathing, slow and careful. The Linker would let it rest, Dr. Vashti had said. It kept them safe when they were tired.

## Edit 8 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "The screen on Rook's Linker lit up. A picture of the Cactling …" through the paragraph ending "… it, grumpy face and crooked flower and all."

**OLD TEXT (remove exactly this):**

> The screen on Rook's Linker lit up. A picture of the Cactling appeared on it, grumpy face and crooked flower and all.

**NEW TEXT (paste exactly this):**

The screen on Rook's Linker lit up. A picture of the Cactling appeared on it, grumpy green eye and crooked flower and all.


---

# Chapter 5: Leaving Dustmere

**Mode: 4 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It was small and warm from her pocket. An old brass badge, …" through the paragraph ending "… a tiny bird with its wings spread out."

**OLD TEXT (remove exactly this):**

> It was small and warm from her pocket. An old brass badge, shaped like a cross, worn smooth and soft at the edges from years and years of being touched. In the middle of it, someone had engraved a tiny bird with its wings spread out.

**NEW TEXT (paste exactly this):**

It was small and warm from her pocket. An old brass badge, shaped like a cross, worn smooth and soft at the edges from years and years of being touched. In the middle of it, someone had engraved a tiny bird with its wings spread out. And right at its heart, set into the brass, was a small round stone that glowed a soft, steady blue, like a nightlight that never ran out.

## Edit 2 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "The Bonfire Ring was a circle of flat stones at the edge …" through the paragraph ending "… to knock over anybody's lemonade stand out there."

**OLD TEXT (remove exactly this):**

> The Bonfire Ring was a circle of flat stones at the edge of the plaza, where the people of Dustmere came together on special nights: birthdays, harvests, Starfall Day, and the night before a young trainer set off on a journey. Somebody brought a guitar. Somebody else brought a pot of spicy bean stew so big it took two people to carry it. Mr. Pell-Abernathy from the bakery brought a basket of honey rolls, still warm, and kept saying "No relation, no relation" to nobody in particular. The little girl with the rock-shaped Alienmon was there, and Bram with the missing teeth, and the old trader with the white mustache, who shook Rook's hand and told him not to knock over anybody's lemonade stand out there.

**NEW TEXT (paste exactly this):**

The Bonfire Ring was a circle of flat stones at the edge of the plaza, where the people of Dustmere came together on special nights: birthdays, harvests, Starfall Day, and the night before a young trainer set off on a journey. Somebody brought a guitar. Somebody else brought a pot of spicy bean stew so big it took two people to carry it. Mr. Abernathy from the bakery brought a basket of honey rolls, still warm. The little girl with the rock-shaped Alienmon was there, and Bram with the missing teeth, and the old trader with the white mustache, who shook Rook's hand and told him not to knock over anybody's lemonade stand out there.

## Edit 3 of 4
**Type:** REPLACE 30 old paragraph(s) with 46 new paragraph(s)
**Find:** from the paragraph starting "They were maybe halfway through when they heard it." through the paragraph ending "He aimed it straight at Zib."

**OLD TEXT (remove exactly this):**

> They were maybe halfway through when they heard it.

> First, a whining roar, like an engine that wasn't feeling well. Then a horrible, screeching SCRRRRRRAAAANNNNCH of metal against rock. Then a CRUNCH. Then silence.

> Then two voices, both talking at once.

> "You said LEFT!"

> "I said YOUR left!"

> "My left IS left! That's what left MEANS!"

> "Not when you're facing backwards!"

> "Why would I be facing BACKWARDS?"

> "I don't know, Pell, you tell me, you were the one driving!"

> Rook crept around a bend in the tunnel. Plazmo dimmed himself down to a careful glow. And there, in the middle of the passage, was a small white shuttle that had crash-landed nose-first into the tunnel wall. Its little wings were crumpled. Steam was hissing out of its engine. Painted on its side, in big black letters, was a shape like a twisting ladder, and the word HELIX.

> The side door creaked open, and two people tumbled out.

> They wore white jumpsuits with lots of zippers and big round helmets with visors that had fogged up completely, so they kept bumping into things. One of them was tall and thin and loud. The other one was short and round and seemed to be apologizing to the shuttle.

> They wiped their visors. They saw Rook. They saw Zib.

> They looked at each other. Then they leaped to their feet, stood back to back, and struck a pose. The tall one threw one arm up in the air. The short one tried to do the same thing but got his elbow stuck in a zipper.

> "We are the HELIX DIRECTIVE!" announced the tall one.

> "FIELD DIVISION!" announced the short one.

> There was a pause. The short one coughed into his glove.

> "...Second Class," he added.

> Rook stared at them. Plazmo stared at them. Cactling stared at them with an expression of deep and total disbelief.

> "I'm Pell," said the tall one, puffing out his chest. "Agent Pell. He's Strand."

> "Hello," said Strand, waving politely. "Sorry about the noise."

> "Don't APOLOGIZE to them, Strand! We're the bad guys!" Pell pointed at Zib. "And we'll be taking that little saucer, thank you very much! The Director says it's priority number one for Phase Two!"

> Strand clapped a hand over Pell's visor. "We're not supposed to say Phase Two out loud!"

> "Well, I didn't say Phase THREE, did I?"

> "Nobody even knows what Phase Three IS!"

> "Exactly! So I couldn't have said it!"

> Rook had absolutely no idea what they were talking about. But he understood one thing very clearly. These two wanted Zib. And Zib had zipped down off his cap and was hiding behind his ear, trembling so hard that Rook could hear the tiny engine inside him going whirrrrr-whirrrrr-whirrrrr.

> "You can't have him," Rook said. "He's not a thing. He's my friend."

> "Oh, we'll see about THAT." Pell reached behind his back and whipped out a big chunky gun with a wide funnel on the end. It was painted white and had a sticker on the side that said PROPERTY OF HELIX, DO NOT LICK. "Net gun! Set to MAXIMUM NET!"

> He aimed it straight at Zib.

**NEW TEXT (paste exactly this):**

They were maybe halfway through when the lanterns went out.

Not all at once. One at a time. Far ahead of them, the farthest blue flame winked out. Then the next one. Then the next, fft, fft, fft, coming closer and closer, like someone walking down the tunnel pinching out candles.

Rook stopped. Plazmo stopped. Cactling's needles stood up all over its body with a soft shff.

Rook turned around. Behind them, back the way they had come, the lanterns were going out too.

Fft. Fft. Fft.

And then the only light left in the whole tunnel was Plazmo, glowing orange in the middle of a darkness so thick it felt like it was pressing on Rook's eyes.

"Bip," whispered Zib. His lights had faded to a nervous, washed-out gray.

Something clicked in the dark.

Click-click. Click-click. A thin, dry buzzing, like a wasp in a jar. Then, at the very edge of Plazmo's glow, something floated into view. It was a bug-like flier as big as a small dog, with a hard white shell and two round wings shaped exactly like little satellite dishes. The dishes swiveled. They twitched. They turned, slowly and carefully, until both of them were pointing straight at Zib.

It wasn't looking at him. It was listening to him.

"Easy," said a voice. "Nobody needs to move fast."

A light clicked on. A small white headlamp, then a second one, a few steps behind the first. Two people stepped out of a side passage Rook hadn't even noticed, as calmly as if they were walking into a classroom.

They wore white jumpsuits, crisp and clean, with dark visors pulled down over their faces so Rook couldn't see their eyes. On each shoulder was a patch Rook had seen a hundred times, on posters and on the side of the radio mast above Dustmere: an orange ring with a diagonal slash through it.

The one in front was tall and lean and stood very straight. Slung across his chest was a squat white launcher with a wide funnel on the end, and a faint blue crackle ran around the rim of the funnel. He didn't point it at anybody. He didn't need to.

The second one was shorter and broader, and he stayed back by the tunnel wall. He had a launcher too. He held it low.

"Helix Directive," said the tall one. "Field Division." He paused, and when he went on, he said it the way some people say the name of a medal they have won, and the way some people say the name of a place they are trying very hard to leave. "Second Class. My name is Pell. That's Strand."

Strand didn't say anything at all.

"And you're Rook," said Pell. "From Dustmere."

Rook's mouth went dry. "How do you know my name?"

"Your Linker checked in with the Dustmere relay four days ago. Every Linker does. Who do you think built the grid?" Pell tilted his head toward the little white flier, which was still hanging in the air with its dishes locked on Zib. "And your friend there has been singing on a frequency we have been waiting a very long time to hear. You can hide a lot of things in a tunnel, Rook. You can't hide that."

Zib pressed himself flat against the back of Rook's neck. Rook could feel the tiny engine inside him going whirrrrr-whirrrrr-whirrrrr, fast as a heartbeat.

"Here's how this goes," said Pell. His voice was perfectly calm and perfectly reasonable, like a teacher explaining the rules of a test. "You hand over the scout. Helix pays well for strays. Enough to get you to every tower in the system and back again. You walk out the far end of this tunnel with your Plasma-type and your cactus, and nobody gets hurt."

"He's not a stray," Rook said. His voice cracked in the middle, and he hated that it did. "He's not a scout. He's my friend."

For just a moment, Pell looked almost sorry for him. "Everything's somebody's friend," he said. "That's never stopped anybody yet."

"Pell." It was the first time Strand had spoken. His voice was low and quiet. "He's a kid."

"And that," said Pell, without turning around, "is priority number one for Phase Two. The Director wants it."

"You're not supposed to say Phase Two in front of..."

"He doesn't know what it means. Nobody does." Pell lifted the launcher. "Mark it, Strand."

Strand didn't move.

"Strand."

A long second. Then Strand lifted his launcher too. But Rook noticed, even with his heart going wild, that the funnel wasn't pointed at Zib. It was pointed at the floor, a step to the left of Rook's boot.

Pell fired.

FWUMP.

A white net came blooming out of the funnel, wide as a bedsheet, weights swinging on every corner, crackling with blue light. And Plazmo shot straight up into the path of the net, the way a goalkeeper throws himself in front of a ball.

The net swallowed him whole.

The weights whipped around, zip-zip-zip, and the whole bundle hit the floor with a THUD. Inside it, Plazmo blazed. But the net didn't burn. Everywhere he pressed against it, it spat cold blue static, KZZT! KZZT!, and his flame jerked back like a hand off a hot stove.

"PLAZMO!"

"Static mesh," said Pell, almost kindly. "It doesn't burn. Plasma-types never work that out in time." He pulled a handle on the side of the launcher. CHUNK-CHUNK. A fresh net slid into place. "Drone. Take it."

The little white flier dove at Zib.

Cactling didn't wait to be told. It charged at Pell's boots, head down, needles up. Pell didn't yelp. He didn't even look down. He just stepped smoothly to one side, the way you would step around a puddle, and swung the heavy end of the launcher low. WHUMP. It caught Cactling right in the middle and sent it spinning across the tunnel. It hit the wall and landed upside down, stubby legs kicking, the creamy flower in the middle of its body bent sideways.

Over by the wall, Rook heard Strand make a small sound, as if he were the one who had been hit. He didn't fire.

Zib zigzagged around Rook's head with the drone right behind him, click-click, click-click, its dish wings swiveling to follow every turn. Zib was fast. But the drone didn't need to be faster. It only needed to keep listening, and wait for him to get tired.

Rook's heart was slamming so hard it hurt. He dropped to his knees and grabbed at the knots. They were tight as fists. Inside, Plazmo's flame had gone small and flickery, and every time he pushed, the static bit him, and he came back a little dimmer. "Hang on," Rook gasped. "Hang on, I'll get you out, I'll..."

Plazmo's eye found him through the mesh. It wasn't scared. It was furious. It flicked down to the bottom of the net, where one of the weights had landed crooked and left a gap, then back up to Rook.

Rook grabbed the weight and heaved. Plazmo shot out through the gap in a burst of smoke, singed and spitting mad. Cactling rocked once, twice, flopped onto its feet, and turned around with a glare that could have melted the net all by itself.

And Pell was already swinging the funnel around toward Zib, steady as a rock, his finger resting on the trigger. He wasn't rushing. He didn't need to.

## Edit 4 of 4
**Type:** REPLACE 15 old paragraph(s) with 30 new paragraph(s)
**Find:** from the paragraph starting "Plazmo shot forward in a blaze of orange and flung a crackling …" through the paragraph ending "… on all fourteen worlds, did they want Zib?"

**OLD TEXT (remove exactly this):**

> Plazmo shot forward in a blaze of orange and flung a crackling shower of sparks. At the very same moment, Cactling wound up its stubby arm and hurled a fistful of needles. The sparks and the needles flew side by side, and they hit the net gun at exactly the same moment, right on the trigger.

> The net gun went POP.

> The net shot out. Unfortunately for Pell, it shot out backwards.

> It wrapped around Pell from his helmet to his boots. Pell wobbled. Pell windmilled his arms. Pell toppled over sideways, right on top of Strand. And because the tunnel floor sloped gently downhill at that spot, the two of them began to roll. Over and over and over, tangled up in the net, picking up speed, bouncing off the walls, back the way they had come, like a big white snowball rolling down a mountain.

> "We'll be BAAAAAACK!" Pell's voice echoed through the tunnel, getting fainter and fainter.

> "Sorry!" Strand's voice called after it. Then, after a moment: "I mean... we'll be back!"

> And then they were gone.

> There was a long, long silence.

> Zib peeked out from behind Rook's ear. He looked down the dark tunnel where the agents had disappeared. Then he looked at Plazmo and Cactling, who were floating and standing side by side, looking extremely pleased with themselves.

> "Bip," said Zib, in a very small voice. Then, louder, flashing gold: "Bip-bip-BIP!"

> Rook laughed until he had to lean against the tunnel wall. "Did you see them? Did you SEE them roll?" He wiped his eyes. "Helix Directive. Field Division."

> "Bip-bip," said Zib, which Rook was pretty sure meant Second Class.

> But as they walked on, the laughter faded, and Rook found himself thinking. Helix. He'd heard the name before, somewhere. On the radio, maybe. Something about a big company that studied Alienmon. Something about doing important work for the whole Kessler system. It had all sounded very nice and very serious.

> It hadn't sounded like a net gun.

> And what was Phase Two? Who was the Director? And why, out of all the Alienmon on all fourteen worlds, did they want Zib?

**NEW TEXT (paste exactly this):**

Plazmo shot forward in a blaze of orange and flung a crackling shower of sparks. At the very same moment, Cactling wound up its stubby arm and hurled a fistful of needles. The sparks and the needles flew side by side, and they hit the launcher at exactly the same moment, right in the mouth of the funnel.

The needles jammed the loaded net in place. The sparks hit the static charge behind it.

KRAKKA-KRAKKA-KZZZT!

The net didn't fire. It burst. It came exploding out of the funnel sideways, half open, spitting blue static in every direction, and it wrapped itself around the launcher and Pell's arm and slammed them both flat against the tunnel wall. The drone, swooping low after Zib, flew straight into the crackling edge of it. KZZT. Its dish wings jerked. It dropped out of the air like a stone and lay on the floor, buzzing faintly.

Pell hissed through his teeth. With one hard twist he dragged his arm free of the mesh. The launcher stayed where it was, pinned to the wall, crackling and useless.

For a long moment, nobody moved.

Plazmo hung in the air in front of Rook, blazing as big and bright as he could make himself. Cactling stood by Rook's boot with its flower still bent and every needle pointed straight at Pell. Zib hovered over Rook's head, his lights burning a fierce, steady gold.

Pell looked at them. Rook watched him do it. The dark visor turned slowly from Plazmo, to Cactling, to the launcher on the wall, to the drone on the floor, to Strand, whose funnel was still pointed a step to the left of Rook's boot. It was like watching someone add up a sum in his head. And Rook knew the exact second Pell got the answer, because his shoulders changed.

"Strand," Pell said quietly. "Get the drone. We're done here."

As Strand passed him, Pell said something else, low, not meant for Rook. "You didn't fire."

"I didn't have a shot."

Pell's visor stayed turned toward his partner for a long moment. "Then that's what goes in the report," he said.

Strand slung his launcher over his back. He knelt and picked up the little white flier. He didn't grab it by a wing. He scooped it up in both hands, carefully, the way Rook's mom picked up a hurt bird, and held it against his chest.

Pell stepped back toward the side passage. His headlamp lit the edge of his visor and the orange ring on his shoulder.

"That was good," he said. "The Plasma-type and the cactus, together. That was really good. Remember it, Rook." His voice didn't get louder. It got quieter. "Because it's the last time it's going to be this easy. Helix doesn't lose things. We just collect them later."

Then he turned and walked away into the dark, without hurrying, without looking back.

Strand went after him. But at the edge of the light he stopped. For a second his visor turned back toward Rook, and Rook thought he was going to say something. Something he wasn't supposed to say.

"Go home, kid," Strand said, so softly it was barely more than a breath. "Please."

Then he was gone too.

One by one, ahead of them and behind them, the blue lanterns flickered back to life.

There was a long, long silence.

Rook's legs gave out, and he sat down hard on the cold tunnel floor. His hands were shaking. Plazmo was smaller than usual and still smoking at the edges. Cactling's flower was still bent, and it slapped Rook's hand away when he tried to fix it. "You jumped right in front of it," Rook whispered to Plazmo. Plazmo puffed up, proud, but his flame was still flickering.

Zib came down off Rook's cap and tucked himself into the crook of Rook's arm. He looked toward the dark side passage where the agents had disappeared. Then he looked at Plazmo and Cactling, a little scorched and a little dented, standing guard on either side of Rook, still facing the dark.

"Bip," said Zib, in a very small voice.

Rook didn't laugh. He wanted to. He wanted it to be the kind of story you could tell at the Bonfire Ring, the kind where everybody cheers at the end. But Pell hadn't run away. He had decided to leave. That wasn't the same thing at all.

And Helix. He knew that name. Everybody did. Helix had built the radio masts that carried music and weather reports all the way out to Dustmere. Helix had paid for the new roof on the schoolhouse, and there was a shiny brass plaque by the door that said so, with the orange ring and the slash. Whenever the radio talked about Helix, it said things like research, and the future, and for the good of the whole Kessler system. Grown-ups said the name the way they said doctor. Like it meant safe.

And Pell believed every word of it. Rook could tell. He hadn't sounded like a villain from a comic book. He had sounded like somebody doing his job, and proud of it.

That was the scariest part of all.

Rook looked down at the Linker on his wrist. Your Linker checked in with the Dustmere relay four days ago. Every Linker does. For the first time, the chunky brass watch felt heavy.

What was Phase Two? Who was the Director? And why, out of all the Alienmon on all fourteen worlds, did they want Zib?


---

# Chapter 6: The Stowaway

**Mode: 4 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Very gently, he reached into the satchel and lifted Sporix out with …" through the paragraph ending "… from under its cap every time it shivered."

**OLD TEXT (remove exactly this):**

> Very gently, he reached into the satchel and lifted Sporix out with both hands. It was soft, like holding a warm dinner roll, and lighter than he expected. It was trembling all over. Little puffs of pale dust came out from under its cap every time it shivered.

**NEW TEXT (paste exactly this):**

Very gently, he reached into the satchel and lifted Sporix out with both hands. It was soft, like holding a warm loaf of bread fresh from the oven, and heavier than it looked. It was trembling all over. Little puffs of pale dust came out of the white spots on its cap every time it shivered.

## Edit 2 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It was hot here. Much hotter than Dustmere. The air shimmered. Rook's …" through the paragraph ending "… to the pink sky like it was sunbathing."

**OLD TEXT (remove exactly this):**

> It was hot here. Much hotter than Dustmere. The air shimmered. Rook's cap was sticking to his forehead within about a minute. Cactling, who came from the desert and loved the heat, closed its eyes and turned its face up to the pink sky like it was sunbathing.

**NEW TEXT (paste exactly this):**

It was hot here. Much hotter than Dustmere. The air shimmered. Rook's cap was sticking to his forehead within about a minute. Cactling, who came from the desert and loved the heat, closed its one green eye and turned its flower up to the pink sky, petals spread wide, like it was sunbathing.

## Edit 3 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting ""Fair enough," said Nurse Coral. "Cactlings never like doctors. Proud little things." …" through the paragraph ending "… to hear: "Your flower's a bit crooked, though.""

**OLD TEXT (remove exactly this):**

> "Fair enough," said Nurse Coral. "Cactlings never like doctors. Proud little things." She leaned down and whispered, loud enough for Cactling to hear: "Your flower's a bit crooked, though."

**NEW TEXT (paste exactly this):**

"Fair enough," said Nurse Coral. "Most Cactlings are shy little things. You're not shy, though, are you? You're proud." She leaned down and whispered, loud enough for Cactling to hear: "Your flower's a bit crooked, though."

## Edit 4 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "She made them tea in tiny cups shaped like shells. Rook's was …" through the paragraph ending "… patch of moss, carefully not looking at Plazmo."

**OLD TEXT (remove exactly this):**

> She made them tea in tiny cups shaped like shells. Rook's was sweet and tasted like honey and oranges. Plazmo heated his own cup by sitting on it. Zib flew around the teapot in circles, fascinated by the steam. And Sporix, now pink and puffy and perfectly healthy, came out of the healing machine and sat on the table in a little wet patch of moss, carefully not looking at Plazmo.

**NEW TEXT (paste exactly this):**

She made them tea in tiny cups shaped like shells. Rook's was sweet and tasted like honey and oranges. Plazmo heated his own cup by sitting on it. Zib flew around the teapot in circles, fascinated by the steam. And Sporix, now bright red and puffy and perfectly healthy, came out of the healing machine and sat on the table in a little wet patch of moss, carefully not looking at Plazmo.


---

# Chapter 7: The Gate That Woke

**Mode: 4 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "A huge cloud of spores burst out from under its cap. Not …" through the paragraph ending "… a giant soft pillow, right above Kit's head."

**OLD TEXT (remove exactly this):**

> A huge cloud of spores burst out from under its cap. Not dry, dusty spores. These were thick and fluffy and golden, and they clumped together in the air like whipped cream, like a giant soft pillow, right above Kit's head.

**NEW TEXT (paste exactly this):**

A huge cloud of spores burst out of every white spot on its cap at once. Not dry, dusty spores. These were thick and fluffy and golden, and they clumped together in the air like whipped cream, like a giant soft pillow, right above Kit's head.

## Edit 2 of 4
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "Rumbler stomped forward. The ground shook with every step. Thoom. Thoom. Thoom. …" through the paragraph ending "… Rock and earth. Fire's not great against it.""

**OLD TEXT (remove exactly this):**

> Rumbler stomped forward. The ground shook with every step. Thoom. Thoom. Thoom. It was so big it blocked out the sun.

> "Rook," said Kit nervously. "That thing's a Terra-type. Rock and earth. Fire's not great against it."

**NEW TEXT (paste exactly this):**

Rumbler stomped forward. The ground shook with every step. Thoom. Thoom. Thoom. It was so big it blocked out the sun, and its shadow fell over Rook and Plazmo both.

"Rook," said Kit nervously. "That thing's a Magma-type. Rock and lava. Fire just makes it angrier."

## Edit 3 of 4
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Rumbler stomped. Plazmo hopped up and over. The ground cracked where his …" through the paragraph ending "… The ground cracked where his foot came down."

**OLD TEXT (remove exactly this):**

> Rumbler stomped. Plazmo hopped up and over. The ground cracked where his foot came down.

**NEW TEXT (paste exactly this):**

Rumbler stomped. Plazmo hopped up and over. The ground cracked where its foot came down, a long jagged crack.

## Edit 4 of 4
**Type:** REPLACE 8 old paragraph(s) with 37 new paragraph(s)
**Find:** from the paragraph starting "Rumbler was puffing now. Gravel was pouring off its shoulders with every …" through the paragraph ending "… the great glowing ring. "The Forge Gate's yours.""

**OLD TEXT (remove exactly this):**

> Rumbler was puffing now. Gravel was pouring off its shoulders with every breath. It lifted its foot for one more stomp.

> "NOW, Plazmo! Spark Burst! At its feet!"

> Plazmo gathered every bit of his fire into one bright ball and flung it, not at Rumbler's big rocky chest, but straight down at the ground under its one standing foot. The Spark Burst hit the dusty rock with a BANG and a bright flash, and the ground under Rumbler's foot cracked and crumbled. The big rock wobbled. It windmilled its stony arms. It tipped, and tipped, and tipped.

> THOOOOOM.

> Rumbler sat down hard on its bottom. It blinked its little red eyes. Then it lay back on the rock, spread out its arms, and refused to get up.

> The miners went quiet. Then one of them started clapping. Then they all were, whooping and banging their helmets with their hammers.

> Dax stared at his Alienmon for a long moment. Then he threw back his head and laughed, a big booming laugh that echoed off the cliffs.

> "Fair and square, kid!" He clapped Rook on the back so hard that Rook stumbled forward three steps. "Fair and square! Didn't even rush it. Most young trainers come up here swinging. You waited." He stepped aside, and swept his huge arm toward the great glowing ring. "The Forge Gate's yours."

**NEW TEXT (paste exactly this):**

Then Rumbler stopped swinging.

It dug both stony hands into the crack it had made and ripped up a slab of the ridge as big as a kitchen table.

"Oh no," Kit breathed.

Rumbler threw it.

Plazmo dodged the slab. He did. But it hit the rock behind him and burst, KA-BOOOM, into a hundred flying chunks, and one of them, a chunk the size of a loaf of bread, caught Plazmo square in the middle.

WHAM.

Plazmo shot backward like a ball off a bat. He smacked into the base of the scaffolding so hard the whole thing swayed and groaned, and he dropped onto the rock in a puff of dust.

And his fire went low.

Not out. But low and flat and flickering, like a match in the wind. He lay there in the dust, a little orange glow no bigger than Rook's thumb, and his sparks weren't spinning at all.

"PLAZMO!"

Rumbler went GRRRRRUMMMMMM and started toward him. Slowly. It didn't need to hurry.

"Rook," said Kit, very fast and very high. "He's hurt. Call him back."

Rook's hand was already on the Linker. He had told Plazmo to wait, and Plazmo had waited, and now he was lying in the dirt because of it. Maybe waiting was just a slower way to lose.

One button. That was all it would take.

Plazmo lifted himself off the rock.

He wobbled. A few sparks fell off him and fizzled out. But he rose up, inch by inch, and turned his one small eye toward Rook.

It wasn't asking to come back. It was asking, Are we still doing the plan?

Rook took his hand off the Linker.

"Yeah," he whispered. Then louder, so Plazmo could hear it: "Yeah. We're still doing the plan."

He made himself look again. Not at Plazmo. At everything. At Rumbler's stumpy legs. At the dust. At the long jagged crack running across the shelf, and the spiderweb of little cracks around it where Rumbler had been stomping and stomping and stomping the whole time. The rock there wasn't solid anymore. It was like a cookie that had been stepped on: still in one piece, but only just.

Rumbler had been breaking its own floor.

Rook's mouth went dry. Because the only way to use it was to get Rumbler to stomp right there, right on the cracks. And the only way to get Rumbler to stomp there was to put Plazmo right underneath its foot.

"Plazmo," he said, and his voice wobbled, and he let it. "Go stand on the crack. Right in the middle. Make it want to squash you. And don't move until I say. No matter how close it gets. Can you do that?"

Plazmo floated out over the spiderweb of cracks. He hung there, small and flickering, right in Rumbler's path. And he blew a tiny, rude raspberry of sparks at it.

Rumbler roared. THOOM. The cracks spread. Rumbler reared up and lifted one enormous foot high over Plazmo's head, and the little glow underneath it didn't move, didn't move, didn't move...

Rumbler was puffing now. Gravel was pouring off its shoulders with every breath. Its one standing leg trembled under all that rock.

"NOW, Plazmo! Spark Burst! At its feet!"

Plazmo gathered every bit of fire he had left into one bright ball and flung it, not at Rumbler's big rocky chest, but straight down at the ground under its one standing foot. The Spark Burst hit the cracked rock with a BANG and a bright flash, and the ground under Rumbler's foot cracked and crumbled. The big rock wobbled. It windmilled its stony arms. Its raised foot came down anyway, WHOOSH, right where Plazmo had been, and Rook screamed his name, and a little smoking spark shot out sideways from under the heel just in time. Rumbler tipped, and tipped, and tipped.

THOOOOOM.

The whole ridge jumped. Dust went up in a great gray cloud.

When the dust cleared, Rumbler was sitting down hard on its bottom. It blinked its little red eyes. Then it lay back on the rock, spread out its arms, and refused to get up.

Rook was already running. He found Plazmo in the settling dust beside Rumbler's heel, a little glow lying on the cracked rock, and scooped him up in both hands.

He was so dim, his warmth coming and going in Rook's palms in little weak pulses. But Plazmo's eye opened, and looked up at him, and his flame curled itself around Rook's thumb and held on.

Rook's eyes stung. He held Plazmo up against his chest. "You stayed," he whispered. "You stayed right under it. I'm sorry I almost..." He couldn't finish. Plazmo nudged his chin, warm and stubborn, as if to say I know. I saw. You didn't.

The miners went quiet. Then one of them started clapping. Then they all were, whooping and banging their helmets with their hammers.

Dax stared at his Alienmon for a long moment. He knocked twice on Rumbler's rocky belly, gently, and Rumbler let out a long, gravelly sigh. Then Dax threw back his head and laughed, a big booming laugh that echoed off the cliffs.

"Fair and square, kid!" He clapped Rook on the back so hard that Rook stumbled forward three steps, holding Plazmo tight. "Fair and square! Didn't even rush it. Most young trainers come up here swinging. You waited." He nodded at the little flicker in Rook's hands, and his big voice went gruff. "And that one waited right along with you. Under Rumbler's foot. Never seen anything do that." He stepped aside, and swept his huge arm toward the great glowing ring. "The Forge Gate's yours."


---

# Chapter 8: The Iron Orphans

**Mode: 7 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 7
**Type:** REPLACE 6 old paragraph(s) with 6 new paragraph(s)
**Find:** from the paragraph starting "The fifth Alienmon was different. It was a little bigger than the …" through the paragraph ending "… paint, was the shape of a twisting ladder."

**OLD TEXT (remove exactly this):**

> The fifth Alienmon was different. It was a little bigger than the Cogglets, round and soft-looking, sort of like a fat little grub made of copper, with a coat of fine, wiry bristles. It was sitting in front of the others, as if it were guarding them. And it was trembling so hard that it rattled.

> When it saw Rook and Kit, it puffed up all its wiry bristles to look as big as it could, and made a tiny, brave, squeaky growl.

> "It's okay," Rook said softly. "We're not going to hurt you."

> The little copper grub growled again. But its bristles were shaking.

> Kit wasn't looking at the Alienmon anymore. Kit was looking at something behind them. Half buried in the scrap was an old wooden crate, splintered and broken. Kit reached in and pulled it out, and wiped the dirt off one side with their sleeve.

> Stamped on the side, in black paint, was the shape of a twisting ladder.

**NEW TEXT (paste exactly this):**

The fifth Alienmon was different. It was a little bigger than the Cogglets: a fat little slug wearing a riveted shell of rusty metal, like a tiny dented tin can on its back. Two long eyestalks poked out of the front, each with a round green eye on the tip, and behind it on the metal ground ran a thin trail of glowing lime-green slime. It was sitting in front of the others, as if it were guarding them. And it was trembling so hard that it rattled.

When it saw Rook and Kit, it stretched its eyestalks up as tall as they would go to look as big as it could, and made a tiny, brave, squeaky growl.

"It's okay," Rook said softly. "We're not going to hurt you."

The little rust slug growled again. But its eyestalks were shaking.

Kit wasn't looking at the Alienmon anymore. Kit was looking at something behind them. Half buried in the scrap was an old wooden crate, splintered and broken. Kit reached in and pulled it out, and wiped the dirt off one side with their sleeve.

Stamped on the side, in faded orange paint, was a ring with a diagonal slash through it.

## Edit 2 of 7
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Rook stared at the little rusty Cogglets with their interlocked teeth. He …" through the paragraph ending "… Pell shouting that Zib was priority number one."

**OLD TEXT (remove exactly this):**

> Rook stared at the little rusty Cogglets with their interlocked teeth. He thought of the net gun in the tunnel. Property of Helix. Do not lick. He thought of Pell shouting that Zib was priority number one.

**NEW TEXT (paste exactly this):**

Rook stared at the little rusty Cogglets with their interlocked teeth. He thought of the static net crackling around Plazmo in the dark tunnel. He thought of Pell's calm voice saying Zib was priority number one, as if Zib were something to be stamped and packed in a crate.

## Edit 3 of 7
**Type:** REPLACE 3 old paragraph(s) with 3 new paragraph(s)
**Find:** from the paragraph starting "First, they had to get the Alienmon to trust them, which took …" through the paragraph ending "… Cactling permitted with an expression of enormous patience."

**OLD TEXT (remove exactly this):**

> First, they had to get the Alienmon to trust them, which took a long time and most of the fruit from Nurse Coral's basket. The Cogglets liked the oranges best. They rolled the slices around between their teeth like they were tasting them all over. The copper grub wouldn't eat at all until all four Cogglets had eaten first. Then it ate one grape, very slowly, without taking its eyes off Rook.

> Then they had to clean them up a bit. Kit had a rag and a little can of oil on the toolbelt, and they worked on the Cogglets one by one, rubbing the worst of the rust off their teeth so they could turn properly, oiling the stiff places until they could roll again. It was careful, fiddly work. Kit's fingers were quick and gentle. They talked to each Cogglet the whole time, in a low, calm, mumbly voice. "Easy, buddy. There we go. Little bit stuck there. Little bit more. There." Rook watched and realized that this was what Kit sounded like when they were fixing a machine, and that it was exactly how Nurse Coral had sounded fixing Sporix.

> Then they set off along the Scrap Route, with four Cogglets rolling along behind them in a wobbly line and the copper grub riding on top of Cactling's head, which Cactling permitted with an expression of enormous patience.

**NEW TEXT (paste exactly this):**

First, they had to get the Alienmon to trust them, which took a long time and most of the fruit from Nurse Coral's basket. The Cogglets liked the oranges best. They rolled the slices around between their teeth like they were tasting them all over. The little slug wouldn't touch the fruit at all. It waited until all four Cogglets had eaten first. Then it nibbled one flake of rust off a pipe, very slowly, without taking its eyes off Rook.

Then they had to clean them up a bit. Kit had a rag and a little can of oil on the toolbelt, and they worked on the Cogglets one by one, rubbing the worst of the rust off their teeth so they could turn properly, oiling the stiff places until they could roll again. It was careful, fiddly work. Kit's fingers were quick and gentle. They talked to each Cogglet the whole time, in a low, calm, mumbly voice. "Easy, buddy. There we go. Little bit stuck there. Little bit more. There." Rook watched and realized that this was what Kit sounded like when they were fixing a machine, and that it was exactly how Nurse Coral had sounded fixing Sporix.

Then they set off along the Scrap Route, with four Cogglets rolling along behind them in a wobbly line and the little rust slug riding on top of Cactling's head, because it was very, very slow, which Cactling permitted with an expression of enormous patience.

## Edit 4 of 7
**Type:** REPLACE 10 old paragraph(s) with 10 new paragraph(s)
**Find:** from the paragraph starting "The little copper grub." through the paragraph ending "… new, so bright they reflected the purple sky."

**OLD TEXT (remove exactly this):**

> The little copper grub.

> It had climbed down off Cactling's head by now. It was sitting in the middle of the road, watching the last Cogglet go rolling happily up into the water tower. Its bristles had gone flat. Its little eyes were sad.

> It had been guarding the Cogglets this whole time, Rook realized. Through all those days out in the scrap. Being brave for them. Being the one who growled. And now they all had homes, and they were all happy, and it was all alone.

> Rook knew that feeling. He thought Sporix probably knew it even better. Sporix was peeking out from Kit's overalls, watching the little grub with big, understanding eyes.

> "What is it?" Rook asked quietly. "What kind?"

> "A Gleamgrub," said Kit. "They're Alloy-types too. They're pretty rare. They eat rust." Kit crouched down. "That's probably why it was the least rusty one. It was eating the rust off the Cogglets to keep them going. Weren't you?"

> The Gleamgrub looked up at Kit. Then, very slowly, it waddled over. It looked at Kit's boots. It looked at Kit's patched-up knees. And then it looked at Kit's enormous toolbelt, with all its wrenches and screwdrivers and pliers and hammers, and its little eyes went very, very wide.

> The tools were old. Kit had been carrying most of them for years. They were scratched and stained, and more than a few were spotted with rust.

> The Gleamgrub took one step forward and threw its little wiry arms around the toolbelt in the biggest hug it could manage.

> There was a soft, fizzing, crackling sound, like a sparkler. The Gleamgrub's bristles glowed faintly. And where it was hugging, the rust just... disappeared. Melted away, like frost in the sun. When the Gleamgrub finally let go and sat back, licking its lips happily, every tool on the left side of Kit's belt was gleaming. Silver and brass and copper, shining like brand new, so bright they reflected the purple sky.

**NEW TEXT (paste exactly this):**

The little rust slug.

It had climbed down off Cactling's head by now. It was sitting in the middle of the road, watching the last Cogglet go rolling happily up into the water tower. Its eyestalks had drooped. Its little green eyes were sad.

It had been guarding the Cogglets this whole time, Rook realized. Through all those days out in the scrap. Being brave for them. Being the one who growled. And now they all had homes, and they were all happy, and it was all alone.

Rook knew that feeling. He thought Sporix probably knew it even better. Sporix was peeking out from Kit's overalls, watching the little slug with big, understanding eyes.

"What is it?" Rook asked quietly. "What kind?"

"A Gleamgrub," said Kit. "A rust slug. Toxin and Alloy. They're pretty rare, and super shy. Their slime eats metal, slowly, turns steel to rust. And then they eat the rust." Kit crouched down. "Scrappers use them to loosen stuck bolts. That's probably why the Cogglets weren't even rustier. It was eating the rust off them to keep them going. Weren't you?"

The Gleamgrub looked up at Kit. Then, very slowly, it slid over, leaving a little glowing lime trail behind it. It looked at Kit's boots. It looked at Kit's patched-up knees. And then it looked at Kit's enormous toolbelt, with all its wrenches and screwdrivers and pliers and hammers, and its eyestalks stretched out very, very long.

The tools were old. Kit had been carrying most of them for years. They were scratched and stained, and more than a few were spotted with rust.

The Gleamgrub slid up onto the toolbelt and pressed itself against the rustiest wrench in the biggest hug a slug could manage.

There was a soft, crunchy, munching sound, like somebody eating cornflakes. And where it was hugging, the rust just... disappeared. Flake by flake, it went into the Gleamgrub, and a fresh orange patch spread across a dent in its riveted shell. Then it reached Kit's old adjustable wrench, the one whose little screw had been rusted solid for as long as Kit could remember. It dabbed a blob of glowing lime slime into the stuck part. The slime fizzed. Something went creak. And the little screw spun free. When the Gleamgrub finally sat back, licking its lips happily, every rust spot on the left side of Kit's belt had been eaten clean away, and every stuck hinge and jaw and screw turned smooth as butter.

## Edit 5 of 7
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Kit thought about that for a while, watching the little Gleamgrub crackle …" through the paragraph ending "… the toolbelt, making every wrench and screwdriver shine."

**OLD TEXT (remove exactly this):**

> Kit thought about that for a while, watching the little Gleamgrub crackle and fizz its way along the toolbelt, making every wrench and screwdriver shine.

**NEW TEXT (paste exactly this):**

Kit thought about that for a while, watching the little Gleamgrub crunch and fizz its way along the toolbelt, freeing every stuck wrench and screwdriver.

## Edit 6 of 7
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "The Gleamgrub stopped eating. It looked at Kit for a long, long …" through the paragraph ending "… ball of copper bristles, and closed its eyes."

**OLD TEXT (remove exactly this):**

> The Gleamgrub stopped eating. It looked at Kit for a long, long moment, with its head tipped to one side.

> Then it climbed up onto Kit's knee, curled into a little round ball of copper bristles, and closed its eyes.

**NEW TEXT (paste exactly this):**

The Gleamgrub stopped eating. It looked at Kit for a long, long moment, with both eyestalks tipped to one side.

Then it climbed up onto Kit's knee, tucked itself snugly into its rusty shell, and drew its eyestalks down until its green eyes closed.

## Edit 7 of 7
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "They ate the last of Nurse Coral's fruit and lay down in …" through the paragraph ending "… the windowsill, his lights going slow and dim."

**OLD TEXT (remove exactly this):**

> They ate the last of Nurse Coral's fruit and lay down in the bunks. Plazmo floated by the stove, keeping it warm. Cactling slept in the doorway, guarding it. Sporix and Gleamgrub curled up together in Kit's bunk, one soft and one bristly, like a pillow and a scrubbing brush. And Zib settled on the windowsill, his lights going slow and dim.

**NEW TEXT (paste exactly this):**

They ate the last of Nurse Coral's fruit and lay down in the bunks. Plazmo floated by the stove, keeping it warm. Cactling slept in the doorway, guarding it. Sporix and Gleamgrub curled up together in Kit's bunk, one soft and one shelled, like a pillow and a rusty tin can. And Zib settled on the windowsill, his lights going slow and dim.


---

# Chapter 9: Like Father, Like Kit

**Mode: REPLACE THE WHOLE CHAPTER TEXT.** More than half of this chapter changed (2,657 of 4,666 words), so replacing it whole is simpler and safer than 6 separate edits. Select everything in this chapter (keep the chapter title), delete it, and paste the NEW CHAPTER TEXT below. Then assign voices and generate the whole chapter.

## NEW CHAPTER TEXT

When Rook woke up again, the sun was up, the stove was warm, and Kit was asleep in the bunk across from him as if they had never left it.

They were curled up on their side with their goggles still on. Sporix was curled against their chest like a pillow. Gleamgrub was snoring on an old scrap tin beside the bunk. And there was a smudge of black soot across Kit's cheek that definitely hadn't been there the night before.

Rook sat up and rubbed his eyes. Had he dreamed it? The empty bunk? The little white welding light at the top of the tower?

He looked out the cracked window. Far away across the scrap heaps, the great crystal on top of the Relay Tower was glowing a steady, beautiful blue. Not a flicker. Not a stutter. Perfect.

Kit yawned, stretched, and opened one eye.

"Morning," they mumbled.

"Kit," said Rook slowly, "did you go somewhere last night?"

Kit's other eye opened. For just a second, they looked very awake.

"Couldn't sleep," they said. "Went for a walk." They rolled over and pulled the blanket up. "Five more minutes."

Rook looked at the soot on Kit's cheek. He looked at the tower. He decided not to say anything.

But he wondered.

Here is what Rook didn't know.

The night before, when the crystal on the Relay Tower had flickered, Kit had known exactly what it meant. Kit had grown up in the shadow of that tower. Kit had fallen asleep every night of their life looking at that blue light through a window. And Kit knew that a crystal that flickered like that had a crack in it somewhere. A bad one. The kind that gets bigger.

So Kit had grabbed the toolbelt and the welder, and woken up Sporix and Gleamgrub, and slipped out of the caboose without a sound. They had run all the way across the scrap heaps in the dark. They had climbed the service ladder on the back of the tower, two hundred and forty rungs, with the wind whistling and the toolbelt clanking. And at the very top, inside the crystal room, they had found it: a crack running right down the middle of the glowing core, thin as a hair and long as an arm, spitting little blue sparks.

It was a strange crack. Kit noticed that. It was too straight. Too neat. Cracks didn't usually look like that. Cracks usually looked like lightning. This one looked like somebody had drawn it with a ruler.

But there wasn't time to think about that.

Kit had worked for two hours. Two hours of very careful, very quiet, very slow work, with goggles down and welder hissing and tongue sticking out of the corner of their mouth. Gleamgrub had eaten the rust off every bolt so they would turn. Sporix had puffed out little clouds of sticky spores to hold the pieces still while the welds cooled. And when the last spark faded, and the crack was sealed, and the core blazed back to life, Kit had sat back on their heels in the blue glow and let out a breath so big it fogged their goggles.

Then they had climbed back down all two hundred and forty rungs, run all the way back across the scrap heaps, and crept into their bunk.

And they hadn't told anyone. Not Rook. Not Sporix, who already knew. And definitely not the person whose tower it was.

The Ferrox Relay Tower was even bigger up close.

It rose up out of the middle of Ferrox City like a giant iron spear, so tall that Rook had to lean all the way back to see the crystal at the top. Its base was made of huge curved plates of star-seed shell, riveted together with bolts the size of Rook's head, all of it shining with that soft pearly glow under the rust. Wide iron steps led up to an enormous round door. And carved into the stone lintel over the door, so old and worn they were almost gone, were the swirling marks. The same as the bridge. The same as the Forge Gate.

"The tower was here before the city," Kit said quietly. "Before anybody. People came to Ferrox and found it standing here all by itself in the middle of nowhere. They built the city around it."

Inside was an arena. A great round room with metal stands climbing up the walls on every side, packed with people. Miners and train drivers and junk market kids and old folks with blankets on their laps. They were stamping their feet on the metal floor so it rang like a drum. BOOM. BOOM. BOOM. Up near the top, Rook spotted the gang of kids from the junk market, with Sprocket and Lady Twinkletooth sitting on their shoulders, waving a hand-painted sign that said GO ROOK! (AND KIT!!!)

Kit went pink and hid behind Rook.

And in the middle of the arena floor, waiting, stood the Keeper.

Hank Briggs was the biggest man Rook had ever seen, and Rook had met Forge Miner Dax only two days ago. Hank was bigger. He was as tall as a door and as wide as two doors. He had a huge red beard that went all the way down his chest, with little brass beads braided into it. He wore a leather apron over a shirt with the sleeves ripped off, and his arms were as thick as tree trunks, covered in old burn scars and faded tattoos of gears. On his head was a welding cap, pushed back, and on his face was the biggest grin Rook had ever seen.

"WELL, NOW!" he boomed. His voice was so loud that the stands shook. "YOU'RE THE KID WHO CAME IN WITH MY KIT?"

Rook swallowed. "Yes, sir."

"HA!" Hank threw back his head and laughed. It sounded exactly like a train horn. HAW-HAW-HAWWWWW. "Sir! Hear that, Kit? He called me sir!" He looked past Rook, and his eyes went soft. "Hiya, kiddo. You came home."

"Hi, Dad," said Kit, from behind Rook.

There was a little pause. It was the kind of pause where two people both have a hundred things to say and neither of them knows which one to say first. Rook felt it, and it made his chest ache.

Then Hank clapped his enormous hands together, and the pause broke.

"RIGHT! Let's see what you've got!"

Hank Briggs had two Alienmon, and both of them were made of iron.

The first one was called a Girderon. It looked like a long iron beam that had grown four short legs and a head like a hammer. It was heavy and slow, and when it charged, it charged in a straight line, like a train, and if you weren't out of the way, you'd be flat.

"Cactling!" Rook called. "You're up!"

Cactling marched out onto the floor, cracked its stubby knuckles, and glared at the Girderon. The Girderon glared back. It scraped one iron foot across the floor. Skreeeee. Sparks jumped. Then it lowered its hammer head and charged.

The floor shook. Rook felt it through his sneakers, THOOM, THOOM, THOOM, faster and faster, a whole iron train coming straight at a cactus that barely came up to Rook's belt.

"Wait for it," said Rook. His mouth had gone dry. "Wait for it. Wait for it... NOW! Sidestep!"

Cactling hopped to the left. The Girderon thundered past, couldn't stop, and slammed head-first into the arena wall with a CLAAAANG that made the whole tower ring like a bell. Dust rained down from the rafters. It staggered back, its hammer head wobbling.

"Needle Spray!"

Cactling flung a whole fistful of needles. They bounced off the Girderon's iron sides with a sound like rain on a tin roof. Ping-ping-ping-ping. Not one of them stuck.

The Girderon shook its head, turned around, and charged again. Cactling dodged. It charged again. Cactling dodged again, but closer this time, so close the wind of it spun Cactling around in a circle. Every needle bounced off. And Cactling was panting now, its little green chest going in and out, in and out. The Girderon wasn't panting at all.

On the fifth charge, Cactling's stubby legs were too slow.

The hammer head caught it full in the middle. WHAM. Cactling flew. It hit the arena wall so hard that the metal dented, and it dropped to the floor in a heap and lay there, not moving, with half its cream-colored spines snapped off and the creamy flower in the middle of its body crushed flat.

The whole crowd went "OHHH."

"Cactling!" Rook's voice cracked right down the middle. He was halfway onto the floor before he knew he was moving. "Cactling, that's enough, come back, you don't have to..."

Cactling's arm twitched.

Then, slowly, it planted one stubby fist on the floor. It pushed. It wobbled. It fell over. It pushed again. And Cactling, the grumpiest, bravest, smallest cactus on the whole Molten Frontier, dragged itself back up onto its feet, and turned around, and glared at the Girderon with one squinted, furious eye.

The Girderon was already charging.

Rook didn't think. He just saw it. Every time the Girderon ran, its hammer head swung up, and for one heartbeat there was a gap. A dark little seam, right where the head joined the beam. The only place on the whole thing that wasn't solid iron.

"Cactling! Don't dodge! Stand your ground! When the head comes up, aim for the neck!"

Cactling planted its feet. The Girderon came on like a train. THOOM, THOOM, THOOM. Rook couldn't breathe. The hammer head swung up...

"NOW!"

Cactling threw every needle it had left, all of them at once, straight into the seam.

SHHHK.

They stuck. The Girderon's head jerked sideways with a screech of metal. Its legs tangled. It skidded past Cactling on its side, sparks shrieking up off the floor, and crashed into the wall again, and this time it didn't get up so fast. It stood there, wheezing steam, its hammer head drooping to one side.

And Cactling, very calmly, sat down.

It didn't fall. It sat. Like it had decided it was done, and it had done enough, and nobody was going to tell it otherwise.

Rook ran out and scooped it up, needles and all. It prickled. He didn't care. "You were amazing," he whispered. "You hear me? Amazing." Cactling glared up at him as if to say, Obviously. But it leaned its crushed little flower against his thumb before it let him call it back into the Linker.

The crowd went wild. Hank Briggs was laughing his train-horn laugh and clapping his huge hands. "HA! Did you SEE that? Nobody's ever stuck a needle in Girderon! Come on back, old girl. Rest that neck."

Then he stopped laughing. And Rook felt the whole arena change.

"Plazmo," said Rook. "Your turn."

Plazmo shot out onto the floor, sparks crackling. And Hank Briggs reached for his last capsule.

"Anvilox," he said quietly. "Let's go, old friend."

The stands went silent.

The thing that stomped out onto the arena floor was the most famous Alienmon on all of Ferrox. Rook knew it from the trading cards. Everybody did. They called it the Iron Wall. It was a hound, but a hound built like a fortress, nearly as tall as Rook and as heavy as two grown miners, made of thick slabs of dark metal and rock. Glowing orange seams ran between the slabs like lava running through cracks in the ground. Across its brow sat a heavy plate shaped exactly like an anvil. Its paws were armored and clawed, and every step it took made the floor jump, and behind it a tail of flame swished slowly back and forth. It had two small, calm, glowing eyes under that anvil plate. It didn't growl. It didn't stomp around. It just walked to the middle of the arena, planted its paws, and stood there like a warm metal wall. And somehow that was scarier than any roar.

"Spark Burst!"

Plazmo flung a fireball. It hit Anvilox right in the chest.

And vanished.

It didn't bounce. It didn't even scorch. The fire just sank into Anvilox's armor like water into dry sand, and all along its body the lava seams brightened, glowing a deeper, hotter orange. Its flame tail flared up tall. It drank it, Rook thought, his stomach dropping. Then a wave of heat rolled off the Anvil Hound and up into the stands, and a man in the third row had to slap at his hat to keep the brim from catching fire.

"Sorry!" Rook called.

"Happens every battle!" the man called back, patting out the brim.

Then Anvilox moved.

It lifted one enormous armored front paw, claws spread, high, higher, and brought it down. BOOOOM. The floor jumped like a trampoline. A ring of force rolled out across the arena, and it hit Plazmo like an ocean wave and threw him backward, tumbling over and over through the air, and smashed him into the far wall.

Plazmo's fire went out.

Not all the way. But almost. For one horrible second, there was nothing on the floor but a little gray wisp of smoke and a tiny red ember, like the very last coal in a campfire.

"PLAZMO!"

The ember flickered. Then it flared, weakly, and Plazmo floated back up, wobbling, half his usual size. He shook himself. A few sad sparks fell off him.

"Spark Burst! Again!"

Plazmo tried. And again. Spark Burst after Spark Burst. Fwoomp. Fwoomp. Fwoomp. Anvilox drank every single one, and every time, its seams burned brighter and its flame tail stood up taller. And every time Plazmo got close enough to throw, Anvilox stamped, BOOM, and the shockwave knocked him spinning, and every time he came back a little smaller and a little dimmer and a little slower.

It was just like the battle with Sola, Rook thought, his stomach going cold. Just like the Bubble Waves. Throwing everything you have at something and watching it all fizzle out. Only worse. Because this time every shot was making Anvilox stronger. And Plazmo was getting hurt.

BOOM. Plazmo hit the floor and bounced and rolled and lay there, flickering.

Rook's hand went to the Linker on his wrist. One button. That was all. One button, and Plazmo would be safe inside, and it would be over, and everybody would say he did really well for a kid from Dustmere.

Plazmo looked up at him.

He was so small now. He was the size of a candle flame. But his one eye was fixed right on Rook, steady as anything, and it wasn't asking to go back. It was asking something else. It was asking, What do we do?

Rook took his hand off the Linker.

He felt the old panic rising up in his chest, the urge to yell Again! Harder! He pushed it down.

Think first.

He made himself look. Not at what wasn't working. At everything. At the arena. At those glowing seams. At Anvilox, standing there so calm, drinking up every spark like a cat lapping milk. And then he heard something in his head. Kit's voice, from the walk along the Scrap Route the day before, when they had been talking about how Kit's welder worked.

Dad's Anvilox loves heat. You could pour a whole furnace on him and he'd just drink it up, like soup. But a welder's different. A welder's one tiny point, hotter than any furnace. More heat in one spot than anything can drink. You don't splash it. You focus it.

Rook's eyes went wide.

The problem wasn't that Plazmo's fire wasn't hot. The problem was that it was spread out. A big round fireball, splashing all over everything, like water from a bucket. To Anvilox, a spread-out fire wasn't an attack. It was food. It was the opposite of a welder. A welder was tiny. A welder was one bright, white-hot point, more heat than anything could drink.

But a welder had to touch the metal. Plazmo would have to get right up against that anvil plate on its brow. Right under those claws.

Rook's heart was slamming so hard he could hear it.

"Plazmo," he said. His voice shook. He let it. "Stop throwing. Don't spread out. Make it small. Smaller than you've ever made it. One tiny point. Hot as you can. Hotter than any furnace. Like a welder." He made his hand into a fist and then pointed one finger. "And then you go right up to it, and you put it right on that anvil plate, and you don't let go. No matter what. Can you do that?"

Plazmo's eye narrowed. His sparks stopped spinning. And then, slowly, his whole flame began to shrink. It shrank from the size of a candle, to the size of a grape, to the size of a pea. And as it got smaller, it got brighter, and brighter, and whiter, until Rook had to squint. Until it wasn't orange anymore at all. It was a tiny, fierce, blazing white star.

In the stands, Kit had gone perfectly still. They were gripping the railing so hard their knuckles had gone pale.

Plazmo flew.

He went straight at Anvilox, low and fast. Anvilox lifted its foot. BOOM. The shockwave came. Plazmo didn't fly over it. He went through it, head down, and Rook watched him get battered sideways and keep going, battered again and keep going, and then he was there, right up against the great anvil plate on Anvilox's brow, and he pressed his tiny white-hot flame against the metal. Right in one spot. And held it there.

TSSSSSSSSSSS.

Anvilox's calm eyes went wide.

It reared back. It stamped. It slammed its whole body sideways into the arena wall, CRASH, trying to crush the tiny burning thing off its brow. Rook screamed Plazmo's name. The wall buckled. The crowd was on its feet, shrieking.

When Anvilox pulled away from the wall, Plazmo was still there.

The plate under him began to glow. Dull red. Then bright red. Then the lava seams all over Anvilox's body began to change, the orange in them racing to yellow, and from yellow to a hard, blazing white, spreading out from the hot spot like cracks across ice. Anvilox was trying to drink the heat. It couldn't drink fast enough. It bucked and stamped and twisted, and the arena floor cracked under its paws, and still Plazmo held on, a white star burning a hole in the night.

"Hold on," Rook whispered. He didn't even know he was saying it. "Hold on, hold on, hold on..."

Steam was screaming out of every white-hot seam. It was too much heat, far too much, more than even the Anvil Hound could drink. Anvilox's big heavy legs began to wobble. It swayed. It swayed the other way. It took one last step toward Rook, slow and heavy, and Rook saw its calm little eyes looking right at him, and he could have sworn it looked almost proud.

Then the Iron Wall fell.

It went over like a tower coming down, KER-RASHHH, and the whole arena jumped, and dust went up in a great gray cloud, and when the cloud cleared, Anvilox was lying on its side on the cracked floor with its eyes closed, its seams cooling back to a soft, sleepy orange, and it did not get up.

There was a moment of complete silence.

Then a tiny spark floated up out of the dust. It drifted toward Rook, slowly, sinking lower and lower, and right before it hit the floor, Rook dove and caught it in both hands.

Plazmo was barely there. He was a flicker. A little warm glow in Rook's cupped palms, so faint that Rook could see his own fingers through it. But his eye opened, just a crack, and looked up at Rook. And Plazmo sneezed.

Pfft. One tiny, happy spark.

Rook laughed. It came out wet. He held Plazmo up against his chest, against his heart, and felt him getting warmer, little by little, like a coal someone was blowing on.

And then the whole tower exploded. People were on their feet, stamping and cheering and banging on the railings. The junk market kids were screaming. Sprocket and Lady Twinkletooth were spinning so fast they were whistling. The man with the singed hat threw it in the air.

"We did it," Rook breathed into Plazmo's flame. "We beat the IRON WALL."

Hank Briggs walked out to the middle of the arena. He knelt down beside Anvilox and laid his big scarred hand on its warm iron side, and Anvilox opened one eye and made a low, tired rumble, like a cat purring. Hank tapped the anvil plate on its brow, very gently, and it rang like a soft bell. Then he stood up and walked over to Rook. He was not laughing now. But he was smiling, a big, slow, warm smile.

"That," he said, "was smart. And that," he nodded at the flicker in Rook's hands, "was the bravest little fire I've ever seen. Nobody's ever done that to old Anvilox before." His eyes flicked up to the stands, to where Kit was standing. "Where'd you learn that trick, son?"

Rook looked up at Kit, too.

"A friend told me," he said.

Hank opened one of his huge hands. Sitting in his palm was a crystal. It was small, about as long as Rook's finger, shaped like a little icicle, and it glowed bright blue from the inside. It was humming. Rook could hear it, very softly, if he held his breath. A single, pure note, like someone running a wet finger around the rim of a glass.

"Your first Signal Shard," said Hank. "A little piece of the heart of my tower. You earned it."

Rook took it with both hands. It was warm. He could feel the hum all the way up his arms.

Then Hank turned around. Kit had come down out of the stands. They were standing at the edge of the arena with their hands stuffed in their pockets and their goggles down over their eyes.

Hank walked over to them. He looked down at his kid for a long moment.

"I went up to check on the core this morning," he said. "It's been flickering for days. I've been worried sick about it. Couldn't figure out how to fix it without shutting the whole tower down." He paused. "Yesterday it was cracked. Today it's perfect. Somebody fixed it." His big voice went quiet. Quieter than Rook would have thought it could go. "Neatest weld I've ever seen. Neater than any I could do." He crouched down, so his face was level with Kit's. "That was you. Wasn't it?"

Kit stared at their boots for a long time.

"...Yeah," they said.

And Hank Briggs pulled his kid into a hug so big and so tight that Kit's goggles fell right off their face and clattered on the floor.

"I'm proud of you, kiddo," Hank said into Kit's hair. His voice had gone all rough and thick. "I'm proud of you. I don't say it enough. I know I don't. I'm always going on about battles and I never say it. But I'm so proud of you I could burst."

Kit didn't say anything. But Kit hugged him back. Hard. Harder than Rook had seen Kit do anything.

Then Hank stood up, with Kit still squashed against his apron, and turned to face the stands. He filled his enormous chest with air.

"HEY! EVERYBODY!" he roared, and the whole tower went quiet. "YOU SEE THIS KID? THIS IS MY KID! KIT BRIGGS! FIXED MY TOWER ALL BY THEMSELF, IN THE MIDDLE OF THE NIGHT! I'M SO PROUD I COULD BURST!"

For one second, nobody made a sound. Then the stands went wild. The miners stamped. The train drivers whistled. The junk market kids screamed "KIT! KIT! KIT!" and waved their sign so hard it ripped in half. Kit buried their bright red face in their dad's apron and groaned. But Rook saw them smiling into it.

Rook looked away to give them a moment, and found that his own eyes were stinging, and decided the arena must be very dusty.

"One more thing," Kit said, when they finally pulled apart and found their goggles. They wiped their nose on their sleeve. "The crack. Dad. It was weird. It was too straight. Like somebody made it."

Hank's face went still. Then it went dark, like a cloud passing over the sun.

"That's what I thought," he said quietly. "Cracks like that don't happen on their own. Somebody's been poking around my tower." He looked out toward the arena doors, toward the orange sky. "And I've got a pretty good idea who."

He didn't say the name. But Rook thought of a crate in the scrap heap, stamped with an orange ring and a diagonal slash.

That was when Zib floated over.

He had been quiet the whole battle, sitting on Rook's cap with his lights dimmed, watching. But now he drifted down slowly toward the Signal Shard in Rook's hands. His huge eye was fixed on it. He floated closer, and closer, until he was hovering right over the little blue crystal.

The Shard's hum got louder.

And Zib's eye began to glow.

It started as a soft white light, deep inside the eye. Then it got brighter. Then a beam of light shot out of it, straight up into the air, like a projector at the movies. And in the air above them, made of light, a picture appeared.

It was a planet.

It was floating in the dark of space, all alone, and it was glowing. Not blue or green, like a healthy world. It was glowing a deep, dark, smoldering red, like the last coals of a campfire when the flames have all gone out. Its sun hung beside it, huge and tired and red. Rook knew that sun. He had seen that sun before. In a dream, on the morning of his birthday.

And from the planet, one by one, little lights were rising.

They were seeds. Tiny glowing seeds, gold and violet and green, lifting off from the surface of the red world and shooting away into the stars. One. Then ten. Then a hundred. Like dandelion fluff blown off a stem. Like sparks rising from a fire. All of them flying away, as fast as they could, into the dark.

The whole arena had gone quiet. Everyone was staring up at the picture.

Then it flickered, and faded, and was gone. Zib's eye went dark. His lights went very, very quiet, a faint, slow, sad blue.

Rook cupped his hands around the little saucer.

"Zib?" he whispered. "Was that... was that your home?"

Zib didn't flash any lights. He didn't spin. He just sat there in Rook's palms, very small and very still.

"...Bip," he said.

It was the smallest bip Rook had ever heard.

Nobody said anything for a long time. Then Hank Briggs cleared his throat. He was staring at the place in the air where the picture had been. He had a very strange look on his face.

"Rook," he said. "That brass badge on your strap. Where'd you get it?"

Rook touched the little cross with the bird on it. "My mom gave it to me. It was my Nana Wren's."

Hank closed his eyes for a second. When he opened them, they were wet.

"Thought so," he said quietly. "You've got her chin." He put one enormous hand on Rook's shoulder. "Come by my hangar in the morning. First thing. There's something in there I've been keeping for a very long time."

"What is it?"

Hank smiled a strange, sad, happy smile.

"Your Nana's," he said.


---

# Chapter 10: Launch Clearance

**Mode: 5 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Rook sat down in the pilot's seat, in the knitted seat cover, …" through the paragraph ending "… doors, his lights flashing every color at once."

**OLD TEXT (remove exactly this):**

> Rook sat down in the pilot's seat, in the knitted seat cover, which was lumpy and red and perfect. Plazmo floated by the window. Cactling strapped itself into a seat with great seriousness and gripped the armrests. Sporix and Gleamgrub tucked themselves into Kit's toolbelt. And Zib settled right on top of the steering wheel, his huge eye fixed on the hangar doors, his lights flashing every color at once.

**NEW TEXT (paste exactly this):**

Rook sat down in the pilot's seat, in the knitted seat cover, which was lumpy and red and perfect. Plazmo floated by the window. Cactling strapped itself into a seat with great seriousness and gripped the armrests. Sporix climbed into Kit's lap, and Gleamgrub settled on the scrap tin Kit had wedged between their boots. And Zib settled right on top of the steering wheel, his huge eye fixed on the hangar doors, his lights flashing every color at once.

## Edit 2 of 5
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "And off to one side floated a planet. A huge, round, purple …" through the paragraph ending "… those rings that swim through space like fish.""

**OLD TEXT (remove exactly this):**

> And off to one side floated a planet. A huge, round, purple planet, with swirls of lavender cloud, and around its middle, a set of rings. Wide, flat, glittering rings, tilted at an angle, like the brim of a hat. Up close, Rook could see that the rings were made of millions and millions of little chunks of ice and crystal, all glinting in the sun.

> "That's Ombra," Kit breathed, pressing their face against the glass. "The ringed giant. Fifth ring. Nobody lives there. You can't, the air's all wrong. But Dad says there are Alienmon in those rings that swim through space like fish."

**NEW TEXT (paste exactly this):**

And off to one side floated a planet. A huge, round, pale-blue planet, frost-white at the top and bottom, its whole surface crazed with long silver cracks like ice on a winter pond. And around its middle, a set of rings. Wide, flat, glittering rings, tilted at an angle, like the brim of a hat. Up close, Rook could see that the rings were made of millions and millions of little chunks of ice and crystal, all glinting in the sun.

"That's Glacia," Kit breathed, pressing their face against the glass. "The ice world. Fifth ring. It's frozen solid, pole to pole. There are a few towns down there, way out on the far side, tucked under big glass domes. Dad says you can't step outside without six pairs of socks on. And he says there are Alienmon in those rings that swim through space like fish."

## Edit 3 of 5
**Type:** REPLACE 10 old paragraph(s) with 7 new paragraph(s)
**Find:** from the paragraph starting "KSSSSHHHH. "...this thing on? Is this thing ON?" KSSSHH. "Strand, you've got …" through the paragraph ending "… SPORE DUTY! THEY'RE THREATENING US WITH SPORE DUTY!""

**OLD TEXT (remove exactly this):**

> KSSSSHHHH. "...this thing on? Is this thing ON?" KSSSHH. "Strand, you've got it on the wrong channel, I'm talking to the snack machine..." KSSSSHHH.

> Kit and Rook looked at each other.

> "No," said Kit. "No way."

> Rook looked in the little round mirror on the side of the bubble. Coming up behind them, fast, rattling and wobbling and trailing a thin stream of smoke from its crumpled wing, was a small white shuttle. Painted on the side was a twisting ladder.

> KSSSHH. "ATTENTION, CREAM-COLORED SPACECRAFT!" Pell's voice blasted out of the trumpet speaker so loud the brass bird spun around on its string. "THIS IS THE HELIX DIRECTIVE! FIELD DIVISION!"

> There was a pause.

> "Second Class," added a smaller, more apologetic voice.

> "STOP SAYING THAT ON THE RADIO, STRAND!"

> "It's on our badges, Pell. It's on our BADGES."

> "HAND OVER THE SAUCER! The Director wants it before Phase Two wraps up, and I am NOT going back to the Station without it AGAIN! Do you know what they made us do last time? SPORE DUTY! THEY'RE THREATENING US WITH SPORE DUTY!"

**NEW TEXT (paste exactly this):**

KSSSSHHHH. "...cream-colored vessel, this is Helix Field Division." KSSSHH. The voice was calm and clear and very close. "Cut your engines and open your docking hatch."

Kit and Rook looked at each other.

Rook knew that voice. He had heard it in the dark, in the Sunset Tunnel, telling him that nobody needed to move fast.

He looked in the little round mirror on the side of the bubble. Coming up behind them, fast and smooth and silent, was a white Helix shuttle. It was long and narrow, like a needle, and it was closing the distance the way a hawk closes on a mouse. On its nose was an orange ring with a diagonal slash through it.

"Is that...?" Kit whispered. Rook had told them about the tunnel. All of it.

"Pell," said Rook.

KSSHH. "Hello again, Rook." As if he had heard. Maybe he had. "I told you it wouldn't be that easy twice. You're in a fifty-year-old medical ship with two speeds. I'm in a pursuit shuttle with clearance to bring the scout in. You already know how this ends. Cut your engines, and nobody gets hurt."

## Edit 4 of 5
**Type:** REPLACE 24 old paragraph(s) with 51 new paragraph(s)
**Find:** from the paragraph starting ""Then we'll have to be smarter."" through the paragraph ending ""Bip," he said, with deep satisfaction."

**OLD TEXT (remove exactly this):**

> "Then we'll have to be smarter."

> Rook looked out at the stars. Think first. What was out here? Ombra's rings, glittering. A comet, far off. And just ahead, tumbling slowly end over end through the dark, a giant asteroid. It was huge, as big as a mountain, gray and lumpy and pocked with craters, and it was spinning. Slowly, heavily, like a top that was just about to fall over.

> And around it, Rook noticed, little rocks and chunks of ice were floating in circles. Round and round. Caught.

> "Kit," he said slowly. "That asteroid. It's pulling stuff in, isn't it? Like a magnet?"

> Kit looked. Their eyes went wide behind their goggles. "It's big enough to have gravity. If you get too close, it'll grab you and swing you around and... Rook. ROOK. What are you doing?"

> Rook turned the wheel.

> The Dandelion swooped straight toward the giant spinning rock.

> "WHAT ARE YOU DOING?" Kit yelled.

> "Thinking first!" Rook yelled back. "Hold on!"

> He zigged left. The Helix shuttle zigged left behind them. He zagged right. It zagged right. The asteroid loomed up ahead, bigger and bigger, filling the whole bubble, gray and cratered and turning, until Rook could see every lump and bump on its surface. He felt the pull of it, a strange, heavy tug, like the ship was going downhill.

> "Now, Kit! Slightly Less Gentle! Full power!"

> Kit slammed a lever. The seashell engines roared. And Rook turned the wheel as hard as he could, so the Dandelion skimmed past the edge of the asteroid, so close that they could have reached out and touched it, and then curved away and out and free, shooting off into the dark like a stone from a slingshot.

> Behind them, the Helix shuttle tried to make the same turn.

> It was a little too close. It was a little too slow. And the asteroid's pull caught it, the way a hand catches a ball.

> The shuttle swung around the asteroid in a big circle. And then another circle. And another. Round and round and round, like a toy on a string, like a moth around a lamp, unable to get away.

> KSSSSHHH. "We're STUCK!" Pell wailed over the radio. "Strand! Do something!"

> "I feel sick," said Strand.

> "Don't you DARE be sick in this shuttle!"

> "I'm not doing it on purpose, Pell!"

> "WE'LL BE BAAAAAACK!" KSSSHHH. "...eventually! When we stop SPINNING!"

> The radio clicked off.

> For a moment there was silence in the Dandelion. Then Kit started laughing. Then Rook started laughing. Then they were both laughing so hard that Rook had to let go of the wheel, and the ship drifted gently in a slow circle, and the kettle in the back started whistling again all by itself.

> Zib came out from behind the peppermints. He flew up to the back window and looked out at the little white shuttle going round and round and round the asteroid.

> "Bip," he said, with deep satisfaction.

**NEW TEXT (paste exactly this):**

"Then give me Slightly Less Gentle!"

Kit slammed a lever. The seashell engines roared, and the Dandelion leaped forward, and for one wonderful second the white shuttle shrank in the mirror.

Then it grew again. Slowly. Easily. As if it had only been waiting to see what they would do.

KSSHH. A different voice this time. Lower. Quieter. "Pell. That ship's old. If we lock on at full power, the hull could crack."

A pause.

"Then they'd better hold still," said Pell. "Lock it."

A beam of pale orange light shot out from the nose of the shuttle and hit the back of the Dandelion.

THOOM.

The whole ship jolted like a cart hitting a wall. Rook flew forward against his straps. Cactling's armrests creaked under its grip. The brass bird on its string swung wildly, and the stars outside the bubble, which had been streaming past, slowed. And stopped. And then, horribly, began to slide the other way.

They were going backward.

"Tractor beam!" Kit shouted. Every dial on the panel had swung over into the red. "It's got us! It's twice as strong as our engines, Rook, we can't pull out of it!"

The engines screamed. The whole ship shook. Somewhere in the back, the kettle started to whistle, high and thin and frightened, and it didn't stop. Rook twisted around in his seat and looked out the back of the bubble.

The shuttle was so close now that he could see a hatch on its belly sliding open. Inside, it was bright and white and clean. And all along one wall, in a neat row, were cages. Small metal cages. Empty. Waiting.

Zib saw them too. He made a sound Rook had never heard him make before. Not a bip. Just a thin, tiny whine.

Something inside Rook went very cold and very still.

Think first.

He made himself turn back around. He made himself look. Not at the cages. At everything. Glacia's rings, glittering, far off. A comet, farther still. And just ahead, tumbling slowly end over end through the dark, a giant asteroid. It was huge, as big as a mountain, gray and lumpy and pocked with craters, and it was spinning. Slowly, heavily, like a top that was just about to fall over.

And around it, Rook noticed, little rocks and chunks of ice were floating in circles. Round and round. Caught.

"Kit," he said, and his voice came out strangely calm. "That asteroid. It's pulling stuff in, isn't it? Like a magnet?"

Kit looked. Their eyes went wide behind their goggles. "It's big enough to have gravity. If you get too close, it'll grab you and swing you around and... Rook. Rook. What are you thinking?"

"The beam's pulling us back. The asteroid would pull us forward. Our engines plus the rock..." He swallowed. "Is that more than the beam?"

Kit stared at him. Then at the dials. Their lips moved, doing sums. "Maybe," they whispered. "Maybe. And the shuttle's locked onto us. Wherever we go, it has to come too. And it's way heavier than we are. If it gets dragged into those rocks..."

"Then it's got bigger problems than us." Rook put both hands on Nana Wren's steering wheel. "Hold on, everybody."

He turned the wheel.

The Dandelion stopped fighting the beam and dove, nose first, straight toward the giant spinning rock.

KSSHH. "What is he doing?" That was Strand.

"Stay on him," said Pell. But for the first time, Rook thought, he didn't sound quite so sure.

The asteroid's pull caught them. Rook felt it, a strange, heavy tug, like the ship was rolling downhill. The stars began to slide forward again. Faster. Faster. The dials crept back out of the red. The asteroid loomed up ahead, bigger and bigger, filling the whole bubble, gray and cratered and turning, until Rook could see every lump and bump on its surface, and the chunks of ice and rock swinging around it like a crowd of tiny moons.

Behind them, the shuttle came too, dragged along on the end of its own beam.

"Now, Kit! Everything we've got!"

Kit slammed every lever on the panel. The seashell engines roared like they had never roared before. And Rook turned the wheel as hard as he could, so the Dandelion skimmed past the edge of the asteroid, so close that they could have reached out and touched it, threading the gap between two tumbling chunks of ice.

The shuttle couldn't thread it. It was too big, too heavy, too fast.

A boulder of ice the size of a house came swinging around the asteroid and passed straight through the orange beam.

SNAP.

The beam broke like a rope cut with scissors. The Dandelion leaped free, curved away and out, and went shooting off into the dark like a stone from a slingshot.

Behind them, the Helix shuttle tried to make the same turn.

It was a little too close. It was a little too slow. The ice boulder clipped its wing in a silent flash of white, and the asteroid's pull caught it, the way a hand catches a ball. The shuttle lurched sideways into the circling rocks. Its engines flared bright, fighting, and it began to swing around the asteroid in a long, slow, helpless curve.

KSSHH. "...port engine's hit." Strand's voice was tight and fast. "Pell, we're in the debris ring. If we keep chasing, we go in. We have to get clear."

A long silence. The static hissed.

"...Break off," said Pell.

Rook let out a breath he hadn't known he was holding.

Then the radio crackled one last time.

"That was clever, Rook." Pell's voice was perfectly calm again. Not angry. Interested. Which was worse. "Clever gets noticed. Somebody a lot higher up than me is going to hear your name today. I'll make sure of it." A pause. "Enjoy Sporeholm."

The radio clicked off.

For a long moment, nobody in the Dandelion said anything at all. The kettle was still whistling. Kit reached back without looking and switched it off, and their hand was shaking so hard it took two tries.

"They had cages," Kit said quietly. "Rook. In the shuttle. They had cages."

"I know."

Zib came out from behind the peppermints. He didn't fly to the back window. He flew to Rook, and pressed himself against Rook's hand on the steering wheel, and stayed there.

Rook looked in the little round mirror. Far behind them, the white shuttle was still crawling around and around the asteroid, slow and crooked, engines sputtering, caught. It was getting smaller. But it wasn't gone.

"Bip," Zib whispered.

Rook kept one hand on the wheel and the other on Zib, and he didn't let go of either one for a long time.

## Edit 5 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Sporix shot up out of the toolbelt and pressed itself against the …" through the paragraph ending "… make before. A long, soft, happy, longing hum."

**OLD TEXT (remove exactly this):**

> Sporix shot up out of the toolbelt and pressed itself against the glass. Its cap was quivering. Its eyes were enormous. And it was making a sound Rook had never heard it make before. A long, soft, happy, longing hum.

**NEW TEXT (paste exactly this):**

Sporix shot up out of Kit's lap and pressed itself against the glass. Its cap was quivering. Its eyes were enormous. And it was making a sound Rook had never heard it make before. A long, soft, happy, longing hum.


---

# Chapter 12: Rival in the Lantern Marsh

**Mode: 14 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 14
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Plazmo floated close beside him, keeping his fire very low and careful …" through the paragraph ending "… Rook could tell that Kit's chest hurt too."

**OLD TEXT (remove exactly this):**

> Plazmo floated close beside him, keeping his fire very low and careful near all that paper. Zib rode on his cap, lights dimmed to a quiet blue. Kit walked a few steps behind, with Sporix in the toolbelt, not saying anything, which was how Rook could tell that Kit's chest hurt too.

**NEW TEXT (paste exactly this):**

Plazmo floated close beside him, keeping his fire very low and careful near all that paper. Zib rode on his cap, lights dimmed to a quiet blue. Kit walked a few steps behind, with Sporix riding on their shoulders, not saying anything, which was how Rook could tell that Kit's chest hurt too.

## Edit 2 of 14
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Sola looked at Kit. At the goggles and the oil and the …" through the paragraph ending "… She looked at Sporix. Her eyebrows went up."

**OLD TEXT (remove exactly this):**

> Sola looked at Kit. At the goggles and the oil and the enormous toolbelt with a mushroom poking out of it. She looked at Sporix. Her eyebrows went up.

**NEW TEXT (paste exactly this):**

Sola looked at Kit. At the goggles and the oil and the enormous toolbelt. Then at the knee-high mushroom riding on Kit's shoulders, peering at her from under its cap. Her eyebrows went up.

## Edit 3 of 14
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Sola hesitated. She looked down at the lantern bobbing on the water. …" through the paragraph ending "… corner was the shape of a twisting ladder."

**OLD TEXT (remove exactly this):**

> Sola hesitated. She looked down at the lantern bobbing on the water. Then she pulled the glowing screen back out of her pocket and held it up, just for a second, so they could see. In the corner was the shape of a twisting ladder.

**NEW TEXT (paste exactly this):**

Sola hesitated. She looked down at the lantern bobbing on the water. Then she pulled the glowing screen back out of her pocket and held it up, just for a second, so they could see. In the corner was a small orange ring with a diagonal slash through it.

## Edit 4 of 14
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "The platform at the end of the boardwalk was small and round, …" and ends "… paper lanterns would go up like dry leaves."

**NEW TEXT (paste exactly this):**

And it was a very good place for a water-type. There was water on every side. Water underneath. Water in the air, even, cool and damp, beading up on the rail. Gloopa wouldn't run out of anything here. Plazmo would be fighting with the whole marsh against him.

## Edit 5 of 14
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Plazmo floated out to face it." through the paragraph ending "Plazmo floated out to face it."

**OLD TEXT (remove exactly this):**

> Plazmo floated out to face it.

**NEW TEXT (paste exactly this):**

Plazmo floated out to face it. His sparks were spinning fast. He remembered, Rook could tell. He remembered the corral, and the mud, and the wet dirt, and being so small he was barely warm. His eye was fixed on Gloopa and it was blazing.

## Edit 6 of 14
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "He just watched." and ends "He just watched."

**NEW TEXT (paste exactly this):**

His heart was going like a drum. His hands wanted to make fists. Every single part of him wanted to shout Spark Burst! and get it over with, the way he always did. He kept his mouth shut. He made himself breathe.

## Edit 7 of 14
**Type:** REPLACE 8 old paragraph(s) with 23 new paragraph(s)
**Find:** from the paragraph starting "Gloopa's middle swelled up. Its bubble heart glowed bright. It opened its …" through the paragraph ending ""Again!""

**OLD TEXT (remove exactly this):**

> Gloopa's middle swelled up. Its bubble heart glowed bright. It opened its mouth, and out rolled the wave. A great curling wall of shining bubbles, tall as a fence, sparkling in the lantern light, rolling across the platform straight at Plazmo.

> "Up," said Rook.

> Plazmo shot straight up into the air. The Bubble Wave rolled right under him and splashed off the edge of the platform into the marsh.

> Sola's eyes narrowed. "Again."

> Another wave. Bigger this time.

> "Left."

> Plazmo zipped to the left. The wave missed him by a hair.

> "Again!"

**NEW TEXT (paste exactly this):**

Gloopa's middle swelled up. Its bubble heart glowed bright. It opened its mouth, and out rolled the wave. A great curling wall of shining bubbles, tall as a fence, sparkling in the lantern light, rolling across the platform straight at Plazmo. The old planks groaned under it. WHOOOSH.

"Up," said Rook.

Plazmo shot straight up into the air. The Bubble Wave rolled right under him and smashed off the edge of the platform into the marsh, KER-SPLOOSH, throwing black water so high it rained back down on all of them.

Sola's eyes narrowed. "Again."

Another wave. Bigger this time. Faster.

"Left."

Plazmo zipped to the left. The wave missed him by a hair. But only by a hair. The edge of it clipped his flame as it went by, and there was a sharp TSSST, and a puff of steam, and Plazmo spun sideways like a top and nearly went into the water.

Rook's stomach dropped right through the planks.

Plazmo caught himself an inch above the surface. He hung there, hissing. A whole side of his flame had gone dark and smoky, like a log somebody had splashed. He shook himself hard, and it crackled back, but thinner.

"Again!" Sola snapped. "Don't let him rest!"

Gloopa didn't. It didn't even close its mouth between waves now. It just poured them out. One, WHOOSH, and Plazmo dodged. Two, WHOOSH, and he dodged again, slower. The third one caught him low, scooped him up like a leaf in a gutter, and slammed him flat onto the planks. WHAM. Water went everywhere. Steam went up in a great white hiss, and for a second Rook couldn't see him at all.

"PLAZMO!"

When the steam blew away, Plazmo was lying in a puddle in the middle of the platform. His flame was flat. Sputtering. Spitting little gray wisps of smoke. He was trying to lift himself up, and every time he did, the water under him hissed and pulled him back down.

It was the Trading Post all over again. Rook could feel it happening. The mud. The fence. The old trader's hand going up. And that awful voice in his head, the one that sounded just like him, yelling Again! Harder! Just throw everything! His mouth was already open to shout it.

Plazmo looked up at him.

Soaked, smoking, half his size. But his one eye found Rook's across the wet planks, and held on. It wasn't scared. It wasn't asking to stop. It was asking what it had asked in Hank's tower. What do we do?

And Rook realized it was waiting. Plazmo was waiting for him. Not for a yell. For an answer.

Rook shut his mouth. He swallowed the yell. It was like swallowing a rock.

Think first.

"I've got you," he said. His voice shook. "Get up, buddy. Just get up. And keep watching her. Not the wave. Her."

Plazmo pushed. The puddle hissed. He pushed again, and dragged himself up out of the water in a cloud of steam, and floated, wobbling, back into the air.

Somebody behind Rook let out a breath. Kit.

"Again!" said Sola.

## Edit 8 of 14
**Type:** REPLACE 2 old paragraph(s) with 4 new paragraph(s)
**Find:** from the paragraph starting ""Plazmo," Rook said, very calm. "Over the top of it. And then, …" through the paragraph ending "… steam. He landed lightly on the far side."

**OLD TEXT (remove exactly this):**

> "Plazmo," Rook said, very calm. "Over the top of it. And then, right as it opens its mouth for the next one, Spark Burst. Small. Right at the bubble."

> Plazmo flew up and over the curl of the third wave, so close the bubbles fizzed against his flame and sent up little puffs of steam. He landed lightly on the far side.

**NEW TEXT (paste exactly this):**

But to get there, Plazmo would have to go over the wave. Not around it. Over it. Right through the spray at the top of the curl, where the bubbles fizzed hottest against his fire. One mistake and he'd be under it. And there might not be enough flame left in him to come back up.

"Plazmo," Rook said, very calm, even though he was not calm at all, even though his heart was slamming so hard he could hear it over the water. "Over the top of it. And then, right as it opens its mouth for the next one, Spark Burst. Small. Right at the bubble."

Plazmo didn't wait to be asked twice.

He flew up and over the curl of the third wave, so close the bubbles fizzed against his flame and sent up little puffs of steam, tsst-tsst-tsst-tsst, and the top of the wave curled over and smacked down on his back, SPLASH, and for one horrible second Rook lost him in the white. Then a ragged little flame came tumbling out the far side. Plazmo landed hard on the planks, skidded, smoked, and stayed up.

## Edit 9 of 14
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "This time it wasn't a fizzle. It was a burst of steam, …" through the paragraph ending "Plazmo did a loop in the air."

**OLD TEXT (remove exactly this):**

> This time it wasn't a fizzle. It was a burst of steam, a big white puff that shot out of Gloopa like a kettle boiling over. Gloopa wobbled backward. It jiggled. It made a startled, hiccupping sound. And for the first time ever, it looked hurt.

> Plazmo did a loop in the air.

**NEW TEXT (paste exactly this):**

This time it wasn't a fizzle. It was a burst of steam, a big white puff that shot out of Gloopa like a kettle boiling over. Gloopa wobbled backward. It jiggled. It slid across the wet planks and bumped against the rail, thunk, and made a startled, hiccupping sound. And for the first time ever, it looked hurt.

Plazmo did a loop in the air. A lopsided, wobbly, smoking loop. But a loop.

## Edit 10 of 14
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "Standing in the middle of the platform was something tall and beautiful. …" through the paragraph ending "… very old-looking, like it had just remembered something."

**OLD TEXT (remove exactly this):**

> Standing in the middle of the platform was something tall and beautiful. It was shaped like a jellyfish standing upright, as tall as Rook, with a smooth, round, glowing blue dome for a head and a body that shimmered and rippled like water in sunlight. Its bubble heart glowed right in the middle of its chest, bigger and brighter than before. And flowing down from it were long, long tentacle arms, dozens of them, rippling and swaying in the air like silk ribbons in a breeze, trailing little sparkles of water behind them.

> It turned its round head and looked down at Sola. Its eyes were gentle and calm and very, very old-looking, like it had just remembered something.

**NEW TEXT (paste exactly this):**

Floating in the middle of the platform was something tall and beautiful. It hung in the air beneath a tall, speckled bell, like a living lantern full of seawater, a whole head taller than Rook, and the bell glowed a soft, deep blue from the inside. Under the rim of the bell, a quiet face peeked out. Its bubble heart glowed right in the middle of it, just below that quiet face, bigger and brighter than before. And flowing down from it were long, long tentacle arms, dozens of them, rippling and swaying in the air like silk ribbons in a breeze, trailing little sparkles of water behind them.

It tipped its tall bell and looked down at Sola from under the rim, humming one low, watery note, like the sea inside a shell. Its eyes were gentle and calm and very, very old-looking, like it had just remembered something.

## Edit 11 of 14
**Type:** REPLACE 4 old paragraph(s) with 13 new paragraph(s)
**Find:** from the paragraph starting ""Tidaloid," she said. "Tidal Whip."" through the paragraph ending "… was down to the size of a candle."

**OLD TEXT (remove exactly this):**

> "Tidaloid," she said. "Tidal Whip."

> Tidaloid raised one long flowing arm. It drew it back, slow and graceful, the water inside it sparkling. And then it swung.

> The arm cracked across the platform like a whip made of ocean, faster than Rook could follow, faster than he could even shout. It caught Plazmo right in the middle and sent him spinning off across the marsh in a cloud of steam. He bounced off the water once, twice, like a skipping stone, and landed on a lily pad, which lit up pink.

> His flame was down to the size of a candle.

**NEW TEXT (paste exactly this):**

Rook's mouth had gone completely dry. Plazmo was hovering in front of him, panting little puffs of smoke, smaller than a candle now, and the thing he was facing was taller than Rook.

Plazmo drifted backward, just a little, until his warm, flickering side bumped against Rook's fingers. And stayed there. Not hiding. Leaning. The way you lean on somebody before you go back out.

Then he floated forward again, all by himself, and faced Tidaloid.

"Okay," he whispered. "Okay. Together. Watch the heart, buddy. It's still the heart."

"Tidaloid," said Sola. "Tidal Whip."

Tidaloid raised one long flowing arm. It drew it back, slow and graceful, the water inside it sparkling, and its speckled bell glowed brighter and brighter as it gathered the attack.

And as it drew back, its bubble heart showed. Right there in the middle of its chest. Glowing. Open.

"Spark Burst! NOW!"

Plazmo threw everything he had left. Every last spark, squeezed into one tight, white-hot point, the way he'd learned against Anvilox. It streaked across the platform like a shooting star, straight at the glowing heart, and Rook's whole body leaned after it, and for one breathless moment he really thought...

Three silky arms swept across Tidaloid's chest. FSSST. The Spark Burst hit a curtain of water and went out in a puff of steam.

And then Tidaloid swung.

The arm cracked across the platform like a whip made of ocean, faster than Rook could follow, faster than he could even shout. KRAAACK. It caught Plazmo right in the middle and sent him spinning off across the marsh in a cloud of steam. He bounced off the water once, twice, like a skipping stone, and landed on a lily pad, which lit up pink.

His flame was down to the size of a candle. Then smaller. A birthday candle. A match. It flickered and leaned over and almost went out.

## Edit 12 of 14
**Type:** REPLACE 2 old paragraph(s) with 4 new paragraph(s)
**Find:** from the paragraph starting "Rook knelt at the edge of the platform and scooped Plazmo off …" through the paragraph ending "… didn't feel like it was all his fault."

**OLD TEXT (remove exactly this):**

> Rook knelt at the edge of the platform and scooped Plazmo off the lily pad. He was small and dim and soggy. But his eye was open. And it was not sad, like it had been after the Trading Post. It was fierce and bright and almost smiling. It seemed to say: Did you see that? Did you see how close we got?

> And Rook realized, holding him, that he did not feel the way he had felt at the Trading Post either. He didn't feel like crying. He didn't feel like it was all his fault.

**NEW TEXT (paste exactly this):**

Rook threw himself down flat at the edge of the platform, stretched out his arm as far as it would go over the black water, and scooped Plazmo off the lily pad. He was small and dim and soggy and hissing. He weighed almost nothing. Rook cupped both hands around him and breathed on him, gently, the way you'd breathe on the last coal of a fire.

The little flame shivered. It caught. It held.

And Plazmo's eye opened. It was not sad, like it had been after the Trading Post. It was fierce and bright and almost smiling. It seemed to say: Did you see that? Did you see how close we got?

And Rook realized, holding him, that he did not feel the way he had felt at the Trading Post either. He didn't feel like crying. Well. A little like crying. But not because he was ashamed. He didn't feel like it was all his fault. They had gone through every one of those waves together, and they had gotten back up every single time, and Plazmo had never once stopped looking at him.

## Edit 13 of 14
**Type:** REPLACE 1 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "He looked up. Sola was standing over him again, with Tidaloid towering …" through the paragraph ending "… Tidaloid towering behind her, its silky arms swaying."

**OLD TEXT (remove exactly this):**

> He looked up. Sola was standing over him again, with Tidaloid towering behind her, its silky arms swaying.

**NEW TEXT (paste exactly this):**

Plazmo sneezed. Pfft. One small, soggy spark, and a puff of steam that smelled like wet campfire. Rook laughed, and his laugh wobbled.

He looked up. Sola was standing over him again, with Tidaloid towering behind her, its silky arms swaying. One of its arms, Rook noticed, was held a little close to its chest, right over its bubble heart, as if it still stung.

## Edit 14 of 14
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It was a printed Helix notice, with the twisting ladder at the …" through the paragraph ending "… one line that made Kit's blood go cold."

**OLD TEXT (remove exactly this):**

> It was a printed Helix notice, with the twisting ladder at the top. Most of it was boring. Times and numbers and code words Kit didn't understand. But in the middle, in bold letters, there was one line that made Kit's blood go cold.

**NEW TEXT (paste exactly this):**

It was a printed Helix notice, with the orange ring and slash at the top. Most of it was boring. Times and numbers and code words Kit didn't understand. But in the middle, in bold letters, there was one line that made Kit's blood go cold.


---

# Chapter 13: Lost in the Mushroom Maze

**Mode: 8 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 8
**Type:** REPLACE 15 old paragraph(s) with 22 new paragraph(s)
**Find:** from the paragraph starting "In a clearing in the middle of the Maze, Helix had set …" through the paragraph ending "… name. People say she can hear through walls.""

**OLD TEXT (remove exactly this):**

> In a clearing in the middle of the Maze, Helix had set up camp. There were white tents with the twisting ladder on them, and floodlights on poles, glaring and harsh. And everywhere, standing at the bases of the mushrooms, were machines. Big white boxy machines on wheels, each one with a long flexible hose sticking out of it like an elephant's trunk. The ends of the hoses were pressed up against the mushroom caps. And they were sucking. Sucking up the spores. Rook could see them going in, little streams of golden light vanishing into the hoses, shhhluuuurp, and the mushroom caps fading to gray behind them.

> Thick black cables ran out of the back of every machine, snaking away across the ground and disappearing into the mist.

> Helix workers in white jumpsuits were walking between the machines with clipboards. And sitting on an upturned crate right in the middle of the clearing, with his helmet off and his chin in his hands, looking absolutely miserable, was Pell.

> "Spore duty," Pell was grumbling. "SPORE duty. I joined Helix to be a HERO, Strand. I joined to go on missions. Fight rivals. Wear a cape. And what do they give me?" He flung out an arm at the nearest machine. "VACUUMING MUSHROOMS."

> "We did lose the saucer twice," said Strand, who was sitting beside him on another crate, holding a clipboard upside down. "And we did crash the shuttle. And we did get stuck going around that asteroid for six hours."

> "That wasn't OUR fault."

> "It was a little bit our fault."

> "Whose side are you on?"

> Strand looked down at the clipboard. He turned it the right way up. "Pell," he said quietly. "What do they even need all these spores for?"

> Pell shrugged. "Who knows. Science stuff."

> "I heard one of the lab people talking," said Strand, even more quietly. "They said the spores are pulsing. All over Sporeholm. In time with something. Something back at the Starfall Crater. They said they're using them to measure it." He swallowed. "They said it's like a heartbeat. Getting faster."

> "So?"

> "So they said it's for Phase Three. They said Phase Three is something to do with a door."

> Pell went very still for a moment. Then he laughed, a little too loudly. "A door! Ha! What kind of evil plan is a DOOR? Come on, Strand. Get back to work. If Admin Vex finds out we're behind schedule..."

> Strand shivered all over. "Don't say her name. People say she can hear through walls."

**NEW TEXT (paste exactly this):**

In a clearing in the middle of the Maze, Helix had set up camp. There were white tents with the orange ring and slash on their sides, and floodlights on poles, glaring and harsh. And everywhere, standing at the bases of the mushrooms, were machines. Big white boxy machines on wheels, each one with a long flexible hose sticking out of it like an elephant's trunk. The ends of the hoses were pressed up against the mushroom caps. And they were sucking. Sucking up the spores. Rook could see them going in, little streams of golden light vanishing into the hoses, shhhluuuurp, and the mushroom caps fading to gray behind them.

Thick black cables ran out of the back of every machine, snaking away across the ground and disappearing into the mist.

Helix workers in white jumpsuits were walking between the machines with clipboards, checking dials, writing things down, as calm and busy as people in a factory. Nobody was shouting. Nobody was hurrying. Somehow that was worse. Two Skitterdrones hung in the air above the tents, their dish wings turning slowly, listening to the Maze.

And at the edge of the floodlights, with his visor pushed up and a glowing screen in one hand, stood Pell.

Rook had never seen his face before. He was younger than Rook had expected, with a sharp, narrow face and short, neat hair. He looked tired. Beside him stood Strand, visor still down, holding a clipboard he wasn't reading.

"Sector nine is down to forty percent," Pell said, scrolling. "We're behind."

"Pell." Strand didn't look up. "Look at the stalks."

"I've seen the stalks."

"The ones we did last night. They're not growing back. Nothing's growing back."

Pell's thumb stopped on the screen. "They told us it's temporary."

"Do you believe that?"

For a moment Pell didn't answer. Then he lowered the screen.

"You know what my father did, Strand? Ran a water pump out in the dunes on Dustara. Thirty-one years. Fixed it every time it broke. Nobody ever knew his name. Nobody ever came out to see him." He looked up at the floodlights, at the orange ring on the nearest tent. "Helix came out. Helix put up the masts and the grid and the school roofs, and now there's music in places that never had anything. When the Director says something matters, it's because he can see further than we can. That's what believing in something means."

Strand said nothing.

"And when Phase Two is done," Pell went on, more quietly, "the people who did it won't be standing in a swamp at midnight. They'll be on the Station. I'm going to be one of them." He glanced sideways. "You could be too. If you'd stop asking questions out loud."

Strand turned the clipboard over in his hands. "I heard one of the lab people talking," he said, even more quietly. "They said the spores are pulsing. All over Sporeholm. In time with something. Something back at the Starfall Crater. They said they're using them to measure it." He swallowed. "They said it's like a heartbeat. Getting faster."

Pell didn't say anything.

"They said it's for Phase Three. They said Phase Three is something to do with a door."

Pell went very still. Then he reached up and pulled his visor down, and Rook couldn't see his face anymore.

"Then it's above our clearance," he said. His voice was perfectly level. "And you don't repeat it. Not on the radio. Not in the mess hall. Not even to me. If Admin Vex finds out you've been listening at lab doors..."

Strand's shoulders hunched. "Don't say her name. People say she can hear through walls."

"People say a lot of things," said Pell. But before he walked back toward the machines, Rook saw him glance over his shoulder, into the dark.

## Edit 2 of 8
**Type:** REPLACE 5 old paragraph(s) with 15 new paragraph(s)
**Find:** from the paragraph starting "Out in the mist, somebody yelled. "WHO TURNED OFF THE POWER?"" through the paragraph ending "… on their shoulder, puffing out happy golden sparkles."

**OLD TEXT (remove exactly this):**

> Out in the mist, somebody yelled. "WHO TURNED OFF THE POWER?"

> "Not me!" yelled Pell.

> "It's never you!"

> "BECAUSE IT'S NEVER ME!"

> Kit sat down on the moss next to the power box and started laughing, a shaky, breathless, can't-quite-believe-it laugh. Sporix bounced up and down on their shoulder, puffing out happy golden sparkles.

**NEW TEXT (paste exactly this):**

Out in the mist, nobody yelled.

That was the first thing Kit noticed, and it made the back of their neck go cold. There was no shouting. No crashing about. Just a pause, and then one voice cutting through the white, calm and clipped and much too close.

"Power's down. That's not a fault. That's a lever." Pell. "Junction box, south side. Drones up. Strand, take the east cables. Nobody leaves the clearing."

A lever, Kit thought, can be pushed back up.

Kit grabbed the big black cable where it plugged into the bottom of the box, braced one boot against the metal, and pulled with everything they had. It came loose with a fat thunk. Kit hauled it hand over hand and flung the end of it as far out into the mist as they could.

Then they heard it.

Click-click. Click-click.

A thin, dry buzzing, like a wasp in a jar. Coming slowly along the cables. Coming toward the box.

Kit pressed back against the cold side of the power box and didn't breathe. A shape floated out of the white: a hard white shell and two round wings shaped like little satellite dishes, swiveling, twitching, listening. The dishes turned one way. Then the other. Then, slowly, toward the box.

Toward the sound of Kit's heart, which was pounding so hard Kit was sure the whole Maze could hear it.

Sporix moved first. It leaned down off Kit's shoulder, and puffed.

Not a little puff. Every white spot on its cap opened at once, and a great soft cloud of glittering spores went rolling out into the mist, joining all the golden spores already swirling out of the dead hoses. All at once the air was full of them, drifting and whispering and shimmering, thousands and thousands of tiny sounds.

The Skitterdrone's dishes jerked. Left. Right. Up. Left again. It was listening to everything at once, and it couldn't find anything at all.

Kit didn't wait. They crept backward into the white, one slow step at a time, one hand trailing along a cable so they wouldn't get lost, until the clicking faded behind them and Pell's voice was only a murmur and their legs finally gave out.

Kit sat down hard on the moss and started laughing, a shaky, breathless, can't-quite-believe-it laugh, with one hand clamped over their mouth to keep it quiet. Sporix bounced up and down on their shoulder, puffing out tiny happy golden sparkles.

## Edit 3 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It was a big slug, as long as Rook's forearm, round and …" through the paragraph ending "… dark eyes, and it seemed to be smiling."

**OLD TEXT (remove exactly this):**

> It was a big slug, as long as Rook's forearm, round and smooth and squishy-looking. And it was glowing. It glowed all over, from the inside, a soft, steady, gentle pale blue, exactly like a nightlight in a little kid's bedroom. Two long, wobbly stalks on top of its head had little glowing balls on the ends, like lamps. It looked up at Rook with two little dark eyes, and it seemed to be smiling.

**NEW TEXT (paste exactly this):**

It was a big slug, as long as Rook's forearm, round and smooth and squishy-looking. And it was glowing. Its soft body glowed all over, from the inside, a bright, steady lime green, like a glow stick at a night fair. Over its back it wore a dark purple mantle, like a little cloak, dotted with spots that glowed green too, and the edges of its body curled out into slimy purple frills. Two long, wobbly eyestalks rose from the top of its head, with a round green eye at the end of each one. It looked up at Rook with them, and it seemed to be smiling.

## Edit 4 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "The slug led him slowly through the mist. It went left, then …" through the paragraph ending "… back to make sure he was still there."

**OLD TEXT (remove exactly this):**

> The slug led him slowly through the mist. It went left, then right, then right again, then squeezed under a root that Rook had to crawl beneath. Everywhere it went, it lit up the way in its soft blue glow, and the mist seemed to part around it, just a little. It never hurried. It never stopped. And every so often, it looked back to make sure he was still there.

**NEW TEXT (paste exactly this):**

The slug led him slowly through the mist. It went left, then right, then right again, then squeezed under a root that Rook had to crawl beneath. Everywhere it went, it lit up the way in its lime-green glow, and the mist seemed to part around it, just a little. It never hurried. It never stopped. And every so often, it looked back to make sure he was still there.

## Edit 5 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "He held up his Linker. The screen lit up and showed him …" through the paragraph ending "… DAMP PLACES. KNOWN TO LEAD LOST TRAVELERS HOME."

**OLD TEXT (remove exactly this):**

> He held up his Linker. The screen lit up and showed him a picture. LUMISLUG. BIO-TYPE. GENTLE. FOUND IN DARK, DAMP PLACES. KNOWN TO LEAD LOST TRAVELERS HOME.

**NEW TEXT (paste exactly this):**

He held up his Linker. The screen lit up and showed him a picture. LUMISLUG. TOXIN-TYPE. GENTLE. ITS BRIGHT GLOW WARNS OTHERS TO KEEP THEIR DISTANCE, BUT IT MEANS NO HARM. FOUND IN MISTY SWAMPS AND DARK, DAMP PLACES. KNOWN TO LEAD LOST TRAVELERS HOME.

## Edit 6 of 8
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "Then it glowed brighter. Brighter than it had glowed all night. Bright …" through the paragraph ending "… the sound of wind chimes. LUMISLUG. PARTNER CONFIRMED."

**OLD TEXT (remove exactly this):**

> Then it glowed brighter. Brighter than it had glowed all night. Bright as a little blue moon.

> Rook grinned and raised his Linker. The cyan beam, the swirl of sparkles, the sound of wind chimes. LUMISLUG. PARTNER CONFIRMED.

**NEW TEXT (paste exactly this):**

Then it glowed brighter. Brighter than it had glowed all night. Bright as a little green moon.

Rook grinned and raised his Linker. The cyan beam, the swirl of sparkles, the sound of wind chimes. LUMISLUG. PARTNER CONFIRMED. And the Lumislug's warning glow softened, all at once, into a gentle shimmer, the way it would always glow from then on whenever Rook was near.

## Edit 7 of 8
**Type:** REPLACE 1 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "It was at the very edge of the Helix camp, where the …" through the paragraph ending "… up in the corner, its glow almost gone."

**OLD TEXT (remove exactly this):**

> It was at the very edge of the Helix camp, where the mist was just starting to thin. In the confusion after the power went out, workers were running everywhere, shouting and bumping into each other. And off to one side, forgotten, sat a little cage. A small metal cage with a Helix label on it. And inside the cage was a tiny captured sporeling. A little round one with a leaf on its head, curled up in the corner, its glow almost gone.

**NEW TEXT (paste exactly this):**

It was at the very edge of the Helix camp, where the mist was just starting to thin. The floodlights were dark. Workers were moving between the dead machines with flashlights, quickly and quietly, checking hoses and following cables, and somewhere out in the white Rook could hear Pell's voice giving orders, never raised, never hurried. Over by the tents, a long hover-cart sat under a gray tarp, and under the edge of the tarp Rook could see the corners of little metal cages, stacked up and strapped down and ready to go.

One cage had been left behind. It sat off to one side, forgotten, with a Helix tag clipped to the front. And inside it was a tiny captured sporeling. A little round one with a leaf on its head, curled up in the corner, its glow almost gone.

## Edit 8 of 8
**Type:** REPLACE 11 old paragraph(s) with 16 new paragraph(s)
**Find:** from the paragraph starting "Strand looked left. He looked right. He looked left again. Nobody was …" through the paragraph ending "… of the canoe like a little blue headlight."

**OLD TEXT (remove exactly this):**

> Strand looked left. He looked right. He looked left again. Nobody was watching. Then he knelt down, very quickly, and opened the cage door.

> The little sporeling blinked up at him.

> "Go on," Strand whispered. "Shoo. Go home. Quick, before Pell sees."

> The sporeling hopped out of the cage and vanished into the glowing mist.

> Strand stood up. He brushed off his knees. He turned around.

> And he saw Rook, peeking out from behind the stalk.

> They stared at each other. Rook didn't move. Strand didn't move. Rook could see his face clearly for the first time, without the foggy visor. He was older than Rook had thought, with round cheeks and worried eyes and a kind, tired face.

> Then Strand put one finger to his lips.

> Shhhh.

> And he hurried away into the mist.

> Kit found Rook at the canoe an hour later, following the cables back. They hugged so hard they both nearly fell into the channel. Then they both started talking at once, and stopped, and laughed, and started again. Kit told Rook about the power box. Rook told Kit about the Lumislug, who was now riding on the front of the canoe like a little blue headlight.

**NEW TEXT (paste exactly this):**

Strand looked toward the tents. He looked toward the dark. Nobody was watching. Then he knelt down, very quickly, and opened the cage door.

The little sporeling blinked up at him.

"Go on," Strand whispered. "Go home. Quickly."

The sporeling hopped out of the cage and vanished into the glowing mist.

The radio on Strand's shoulder crackled. "Strand. Status."

Strand touched it. "East cables clear," he said. "Cages secure." His voice didn't shake at all. Rook wondered how many times he had practiced saying things like that.

Strand stood up. He brushed off his knees. He pushed up his visor and rubbed his eyes. He turned around.

And he saw Rook, peeking out from behind the stalk.

They stared at each other. Rook didn't move. Strand didn't move. Rook could see his face clearly for the first time. He was older than Rook had thought, or maybe he just looked older, with round cheeks and worried eyes and a kind, tired face.

Rook waited for him to shout. One word into that radio, and Pell and the drones would be here in seconds. Strand's hand went to the radio.

And stayed there.

Then he took it away, and put one finger to his lips.

Shhhh.

"You didn't see that," he breathed. "And I didn't see you."

Then he pulled his visor back down and walked away toward the tents. Not hurrying. The way you walk when you don't want anybody to wonder where you've been.

Kit found Rook at the canoe an hour later, following the cables back. They hugged so hard they both nearly fell into the channel. Then they both started talking at once, and stopped, and laughed, and started again. Kit told Rook about the power box. Rook told Kit about the Lumislug, who was now riding on the front of the canoe like a little green headlight.


---

# Chapter 14: Plazmet Ignites

**Mode: 8 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "The first one oozed out of a jar on a high shelf …" through the paragraph ending "… It barely seemed to be moving at all."

**OLD TEXT (remove exactly this):**

> The first one oozed out of a jar on a high shelf and dripped down to the floor. It was a blob of thick purple goo, like jam, with two lazy yellow eyes floating in it. It moved slowly. Very slowly. It barely seemed to be moving at all.

**NEW TEXT (paste exactly this):**

The first one oozed out of a jar on a high shelf and dripped down to the floor. Splorp. It was a blob of thick purple goo, like jam, with two lazy yellow eyes floating in it. It moved slowly. Very slowly. It barely seemed to be moving at all.

## Edit 2 of 8
**Type:** REPLACE 4 old paragraph(s) with 9 new paragraph(s)
**Find:** from the paragraph starting "But where it touched, a little purple mark appeared on Cactling's green …" through the paragraph ending "… breathing fast, and it could not get up."

**OLD TEXT (remove exactly this):**

> But where it touched, a little purple mark appeared on Cactling's green skin. And Cactling winced. It shook its foot. It threw more needles. And slowly, the purple mark began to spread.

> "Poison," Kit breathed. "Rook, it's poison. It doesn't have to hit hard. Every touch makes Cactling weaker."

> Cactling fought bravely. It threw needles until its arms were tired. It stomped and huffed and glared. But the Oozel just kept oozing, slow and patient, touching it once, and then again, and then again. And each touch left a mark. And each mark made Cactling a little slower.

> Finally, Cactling sat down hard in the middle of the circle. Its flower drooped. It was covered in purple spots, and it was breathing fast, and it could not get up.

**NEW TEXT (paste exactly this):**

But where it touched, a little purple mark appeared on Cactling's green skin. And Cactling winced. It hopped back, shaking its foot. It threw more needles. And slowly, the purple mark began to spread.

"Poison," Kit breathed. "Rook, it's poison. It doesn't have to hit hard. Every touch makes Cactling weaker."

Cactling did not care about poison. Cactling put its head down and charged, which was the most Cactling thing it could possibly have done, and punched the Oozel right between its lazy yellow eyes.

Its stubby fist sank in up to the shoulder. SHLORP.

And stuck.

The Oozel blinked. Then the whole blob heaved, like a wave rolling up a beach, and flung Cactling across the circle. WHUMP. Cactling bounced off the glowing moss border, rolled twice, and came up spitting, with a big purple splotch all down one arm.

Rook's stomach dropped. "Cactling, keep your distance! Needles from far away!"

Cactling fought bravely. It threw needles until its arms were shaking. It stomped and huffed and glared. But the Oozel just kept oozing, slow and patient, touching it once, and then again, and then again. Tap. Tap. Tap. And each touch left a mark. And each mark made Cactling a little slower. Its cream-colored spines started to bristle, stiff and ragged. The creamy flower in the middle of its body began to wilt, the petals curling in around its green eye like paper too close to a fire.

Finally, Cactling sat down hard in the middle of the circle. Its flower drooped. It was covered in purple spots, and it was breathing fast, and it could not get up. It planted one fist and pushed. Its arm buckled. It pushed again. It fell over sideways and lay there, still glaring at the Oozel with one squinted eye, as if glaring were the very last weapon it had left.

## Edit 3 of 8
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "He sent out Lumislug next. Lumislug was slow too, and gentle, and …" and ends "… Plip. Lumislug's glow got dimmer with every pop."

**NEW TEXT (paste exactly this):**

Then the Gloomtoad puffed its throat up huge and spat a big one.

KA-SPLAT.

It hit Lumislug side-on and knocked it right over onto its back. Lumislug lay there with its little foot waving in the air, its glow stuttering on and off like a flashlight with a dying battery. It rolled. It rolled again. It got itself the right way up, so slowly that Rook could hardly stand to watch, and it looked over at him, and it glowed, just once, as bright as it could.

## Edit 4 of 8
**Type:** REPLACE 2 old paragraph(s) with 13 new paragraph(s)
**Find:** from the paragraph starting "Plazmo floated out into the circle. He was already tired. He had …" through the paragraph ending "… there, slowly gathering itself up for another round."

**OLD TEXT (remove exactly this):**

> Plazmo floated out into the circle. He was already tired. He had been zipping in to help the others all battle long, bouncing off the walls, getting splashed by sludge. His flame was small and flickering, the size of a plum. There were purple spots on him too.

> Across the circle, the Gloomtoad crouched, its throat puffing in and out, its spots oozing. Behind it, the Oozel was still there, slowly gathering itself up for another round.

**NEW TEXT (paste exactly this):**

Plazmo floated out into the circle. He was already tired. He had been zipping in to help the others all battle long, bouncing off the walls, getting splashed by sludge. His flame was small and flickering, the size of a plum. There were purple spots on him too, dull little smudges in the orange, and every time he moved, he left a faint trail of purple smoke behind him.

"Spark Burst!" Rook shouted, before he could stop himself.

Plazmo flung a fireball. The Oozel slid right in front of the Gloomtoad and took it full in the middle.

FSSSSSHHH.

The fire went into the goo and went out. Just like that. Like a match dropped in a puddle. The Oozel jiggled. A little curl of steam rose off its top. That was all.

And then the Gloomtoad spat.

The sludge hit Plazmo dead center. SPLAT. TSSSSSSSS. His flame hissed and shrank and went dark purple at the edges, and he dropped out of the air like a stone and hit the floor and skidded, trailing smoke, right into the Oozel's reach. A gooey tendril curled around him. Rook heard him crackle, high and thin, a sound like a fire trying to scream.

"PLAZMO!"

Plazmo thrashed. He flared. He tore himself free in a spray of sparks and wobbled up into the air, coughing little purple puffs, smaller than Rook had ever seen him. Smaller than a plum. Smaller than an egg.

Rook's hand was already on the Linker on his wrist. One button. Plazmo would be safe inside, and the poison would stop spreading, and it would be over. Nobody would blame him. Two Toxin-types against a kid who'd never even seen one. Everybody would understand.

Plazmo looked at him.

His flame was guttering. There was purple smoke drifting out of him. But his one big eye was fixed right on Rook, steady as anything, and he gave one small, hard shake, side to side. No. He wasn't asking to go back. He was asking what they were going to do.

Rook took his hand off the Linker.

## Edit 5 of 8
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Rook took a breath. He let it out slowly." through the paragraph ending "… took a breath. He let it out slowly."

**OLD TEXT (remove exactly this):**

> Rook took a breath. He let it out slowly.

**NEW TEXT (paste exactly this):**

Rook took a breath. He let it out slowly. His heart was slamming so hard his whole body shook with it. He let it shake.

## Edit 6 of 8
**Type:** REPLACE 3 old paragraph(s) with 4 new paragraph(s)
**Find:** from the paragraph starting "The Gloomtoad was getting frustrated. Rook could see it. It puffed up …" through the paragraph ending "… Oozel's tendril reached for where he had been."

**OLD TEXT (remove exactly this):**

> The Gloomtoad was getting frustrated. Rook could see it. It puffed up its throat bigger and bigger. It spat faster and faster. Plip-plip-plip-plip. The bubbles were flying everywhere now, popping on the walls, popping on the floor, and none of them were hitting Plazmo. And every time the Gloomtoad spat, it had to puff up its throat first. And every time it puffed up its throat, it got a little more tired.

> And the Oozel was coming too, slowly, slowly, creeping up from behind. Rook watched it. He watched it the whole time. He knew exactly where it was.

> "Up," he said. Plazmo floated up, just as the Oozel's tendril reached for where he had been.

**NEW TEXT (paste exactly this):**

Not every bubble missed. One clipped the edge of his flame, TSST, and he spun sideways, dimming, and Rook's breath stopped in his throat. Plazmo caught himself. He shook off a few sad sparks. He looked at Rook. Rook nodded, just barely, and Plazmo turned back to the toad and kept waiting. It was the hardest thing Rook had ever done. Harder than any battle. Standing there, saying dodge in a calm voice while his best friend got smaller and smaller, and not letting himself scream ATTACK.

The Gloomtoad was getting frustrated. Rook could see it. It puffed up its throat bigger and bigger. It spat faster and faster. Plip-plip-plip-plip. The bubbles were flying everywhere now, popping on the walls, popping on the floor, sizzling holes in the moss, and none of them were hitting Plazmo. And every time the Gloomtoad spat, it had to puff up its throat first. And every time it puffed up its throat, it got a little more tired.

And the Oozel was coming too, slowly, slowly, creeping up from behind. Rook watched it. He watched it the whole time. He knew exactly where it was.

"Up," he said. Plazmo floated up, just as the Oozel's tendril reached for where he had been. It snapped shut on empty air. Shlup.

## Edit 7 of 8
**Type:** REPLACE 4 old paragraph(s) with 5 new paragraph(s)
**Find:** from the paragraph starting "It was not a Spark Burst. It was not anything Rook had …" through the paragraph ending "… like the rings around Ombra, humming with power."

**OLD TEXT (remove exactly this):**

> It was not a Spark Burst. It was not anything Rook had ever seen. It was as if everything Plazmo had been holding in, all battle long, all those dodges, all that waiting, every spark he hadn't thrown, came pouring out of him at once. His tiny, tired, plum-sized flame exploded outward, bigger and bigger and brighter and brighter. Brighter than he had been at the Forge Gate. Brighter than he had been against Anvilox. Brighter than the Spore Pools outside, brighter than the whole glowing tower, brighter than anything.

> Rook threw his arm over his eyes. Kit dove behind a table. Dr. Moor sat perfectly still on her cushion, but her mouth was open.

> Through his fingers, Rook could see Plazmo's shape changing.

> He was stretching. Growing. The round ball of flame was pulling itself out long, longer, like a drop of honey being stretched between two spoons. One end of him became a head, bright and blazing and white-hot. The other end streamed out behind him into a tail, long and flowing and flickering, orange and gold and red, trailing sparks like a comet across the night sky. His two little spinning sparks had grown, too. They had stretched out and joined together into a ring. A glowing, spinning ring of pure blue-white plasma, circling around him like the rings around Ombra, humming with power.

**NEW TEXT (paste exactly this):**

It was not a Spark Burst. It was not anything Rook had ever seen. It was as if everything Plazmo had been holding in, all battle long, all those dodges, all that waiting, every spark he hadn't thrown, came pouring out of him at once. His tiny, tired, battered flame exploded outward, bigger and bigger and brighter and brighter. Brighter than he had been at the Forge Gate. Brighter than he had been against Anvilox. Brighter than the Spore Pools outside, brighter than the whole glowing tower, brighter than anything.

VWOOOOOOOM.

A wave of heat rolled across the room. Jars rattled on every shelf, all the way up the spiral stairs. Papers flew. The moss on the floor flattened out in a ring, like grass under a helicopter. Rook threw his arm over his eyes. Kit dove behind a table. Dr. Moor sat perfectly still on her cushion, but her mouth was open, and the moss on her coat was blowing straight back.

Through his fingers, Rook could see Plazmo's shape changing. And he could see the purple spots. They were burning. Every last dull smudge of poison was glowing white-hot and shriveling away into smoke, like dry leaves in a bonfire.

He was stretching. Growing. The round ball of flame was pulling itself out long, longer, like a drop of honey being stretched between two spoons. One end of him became a head, bright and blazing and white-hot. The other end streamed out behind him into a tail, long and flowing and flickering, orange and gold and red, trailing sparks like a comet across the night sky. His two little spinning sparks had grown, too. They had stretched out and joined together into a ring. A glowing, spinning band of extra-hot plasma, white-gold and blazing, circling his middle like the rings around Glacia, humming with power.

## Edit 8 of 8
**Type:** REPLACE 10 old paragraph(s) with 25 new paragraph(s)
**Find:** from the paragraph starting ""Okay, buddy," he said. "Let's see what you can do."" through the paragraph ending "… his partner's blazing head. And some things don't."

**OLD TEXT (remove exactly this):**

> "Okay, buddy," he said. "Let's see what you can do."

> He didn't even need to name the move. Plazmet seemed to know. He pulled back, coiling his long blazing tail. His plasma ring spun faster and faster, humming higher and higher. And then he shot forward across the circle like a shooting star. Like a comet. A streak of white and gold and orange fire, so fast that he left a glowing line in the air behind him.

> Comet Dash.

> He struck the Gloomtoad right in its puffed-up middle. WHOOOOOMPH! The toad went tumbling backward, end over end, its throat deflating with a long pfffffffffft, like a balloon letting go. It rolled across the floor, bumped gently into the Oozel, and the two of them sat there in a heap, blinking, too dazed to move.

> It was over.

> The tower was very quiet.

> Then Dr. Lysa Moor began to clap. Slowly. Calmly. Three claps. Then she stood up from her cushion, walked across the circle, and knelt down to check on her Gloomtoad and Oozel, who were perfectly fine, just very surprised. She patted them both gently. Then she straightened up and looked at Rook.

> "Forty-one seconds," she said, "when you came in." She tilted her head. "And just now, you waited for... I counted. Four minutes and twelve seconds. With your last Alienmon, poisoned and tired, and every reason in the world to panic." She smiled. It was a real smile this time, small and warm. "That's patience, Rook. That's real patience. Most grown-ups don't have it."

> Plazmet floated down beside Rook, blazing proudly. Rook reached out, very carefully, half afraid he might burn his fingers. But Plazmet's flame was warm, just warm, like a mug of hot cocoa, exactly like Plazmo had always been.

> Some things change, Rook thought, touching his partner's blazing head. And some things don't.

**NEW TEXT (paste exactly this):**

But the battle wasn't over.

The Gloomtoad's eyes snapped open. Its throat was still full, blown up huge, and it let all of it go at once. Not a bubble. A wave. A great rolling wall of purple sludge, roaring across the circle, SPLOOOOSH, as tall as Rook. And behind Plazmet, the Oozel reared up off the floor like a purple curtain, its tendrils spreading wide, ready to catch whatever came through.

Sludge in front. Goo behind. Nowhere to go.

If that wave hit him now, Rook thought, after everything, it would put him out. All the way out.

Think. There wasn't time to think. There was only time to trust.

"Okay, buddy," he said. "Let's see what you can do."

He didn't even need to name the move. Plazmet seemed to know. He pulled back, coiling his long blazing tail. His plasma ring spun faster and faster, humming higher and higher, until the whole tower was buzzing with it. And then he shot forward across the circle like a shooting star. Like a comet. A streak of white and gold and orange fire, so fast that he left a glowing line in the air behind him.

Comet Dash.

He went straight into the sludge wave.

TSSSSSSSSSSSSHHHHHHHH.

Steam exploded across the room, thick and white. Rook couldn't see anything. He couldn't see Plazmet, or the toad, or anything but steam and purple spatters and a glow somewhere in the middle of it all, a glow that was getting dimmer, dimmer, dimmer...

"PLAZMET!" Rook screamed. "GO! GO!"

The glow flared.

Plazmet burst out of the far side of the wave, smoking, streaming steam, his tail ragged, and he did not slow down. He struck the Gloomtoad right in its puffed-up middle. WHOOOOOMPH! The toad went tumbling backward, end over end, its throat deflating with a long pfffffffffft, like a balloon letting go. It rolled across the floor, slammed into the rearing Oozel, SPLUDGE, and the two of them collapsed in a heap, blinking, too dazed to move.

It was over.

The tower was very quiet. The steam drifted up the spiral stairs. Somewhere high above, a jar finished rattling and went still.

Plazmet hung in the air in the middle of the circle. Then his tail drooped. His plasma ring wobbled and slowed. And he sank, slowly, lower and lower, the way Plazmo used to when he was very tired, and Rook was already running. He skidded across the moss on his knees and caught him just before he touched the floor.

Rook reached out, very carefully, half afraid he might burn his fingers. But Plazmet's flame was warm, just warm, like a mug of hot cocoa, exactly like Plazmo had always been. He was panting little puffs of steam. His comet-tail was frayed at the end and sputtering. But his eye opened, and looked up at Rook, and crinkled.

And he sneezed. Pfft. A tiny, happy spark.

Rook laughed, and it came out wet, and he held his partner against his chest, a lot bigger now and a lot harder to hold, and didn't care one bit.

Then Dr. Lysa Moor began to clap. Slowly. Calmly. Three claps. Then she stood up from her cushion, walked across the circle, and knelt down to check on her Gloomtoad and Oozel, who were tired and sticky and very surprised, but fine. She patted them both gently. Then she took a little green bottle from the pocket of her mossy coat, and without a word, she held out her hand for Rook's Linker. One drop of glowing green for Cactling. One drop for Lumislug. One drop, very carefully, on the end of Plazmet's tail, where the last purple spatter still clung. It hissed, and faded, and was gone.

"Spore tonic," she said. "They'll sleep it off by morning." Then she straightened up and looked at Rook.

"Forty-one seconds," she said, "when you came in." She tilted her head. "And just now, you waited for... I counted. Four minutes and twelve seconds. With your last Alienmon, poisoned and tired, and every reason in the world to panic." She smiled. It was a real smile this time, small and warm. "That's patience, Rook. That's real patience. Most grown-ups don't have it."

Plazmet lifted himself out of Rook's arms and floated up beside him, wobbly, but blazing proudly. Rook reached out and touched his partner's blazing head.

Some things change, Rook thought. And some things don't.


---

# Chapter 15: Port Ember

**Mode: 5 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "They flew back across the stars to Dustara. Back past Ombra and …" through the paragraph ending "… the clouds of steam, to the turquoise sea."

**OLD TEXT (remove exactly this):**

> They flew back across the stars to Dustara. Back past Ombra and its glittering rings. Back past the giant spinning asteroid, which was, Kit was relieved to see, no longer towing a small white Helix shuttle around and around. And then down, down, down through the smoky pink sky of the Molten Frontier, past the rivers of lava and the clouds of steam, to the turquoise sea.

**NEW TEXT (paste exactly this):**

They flew back across the stars to Dustara. Back past Glacia and its glittering rings. Back past the giant spinning asteroid. Kit watched it the whole way, and didn't let go of the armrests until it was far behind them and there was nothing white and needle-shaped anywhere in the mirror. And then down, down, down through the smoky pink sky of the Molten Frontier, past the rivers of lava and the clouds of steam, to the turquoise sea.

## Edit 2 of 5
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "He looked out. Out on the turquoise water, kids were racing. They …" through the paragraph ending "… anywhere, as long as you don't pop them.""

**OLD TEXT (remove exactly this):**

> He looked out. Out on the turquoise water, kids were racing. They were riding on top of big round bubbles. Huge, shiny, see-through bubbles, as big as armchairs, bobbing and bouncing across the waves like beach balls. Each bubble had two little flippers on the sides, and a pair of big happy eyes on the front, and a wide, cheerful mouth. And each one had a kid sitting on top, holding onto a loop of rope, shrieking with laughter as they went bouncing over the swells. Boing. Boing. Boing.

> "Bubbub!" Kit said, pressing their face against the glass. "I've only ever seen them in books! They're Hydro-types. They love giving rides. They'll carry you anywhere, as long as you don't pop them."

**NEW TEXT (paste exactly this):**

He looked out. Out on the turquoise water, kids were racing. They were riding on top of big round bubbles. Huge, shimmering, see-through bubbles of air, as big as armchairs, bobbing and bouncing across the waves like beach balls. And inside each bubble, snug in the middle, sat a little round Alienmon no bigger than a cat, with two little flippers on its sides, a pair of big happy eyes, a wide, cheerful mouth, and a pouch in its chest that puffed out more air whenever its bubble started to shrink. And each one had a kid sitting on top, holding onto a loop of rope, shrieking with laughter as they went bouncing over the swells. Boing. Boing. Boing.

"Bubbub!" Kit said, pressing their face against the glass. "I've only ever seen them in books! They're Hydro-types. They blow those bubbles out of a pouch in their chests, and they ride the waves inside them. They travel in big giggly groups, and they love giving rides. They'll carry you anywhere, as long as you don't pop them."

## Edit 3 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "A girl named Mina, who had a gap in her teeth and …" through the paragraph ending "… took off across the water like a rocket."

**OLD TEXT (remove exactly this):**

> A girl named Mina, who had a gap in her teeth and a fishing hook stuck in her hat for luck, lent them two Bubbub of their own. Rook's was called Splodge. Kit's was called Sir Wobbleton the Third. Rook climbed on top of Splodge, which was like trying to sit on a giant water balloon. He slid off the left side. He climbed back on. He slid off the right side. He climbed back on and grabbed the rope and held on as tight as he could, and Splodge gave a happy gurgle and took off across the water like a rocket.

**NEW TEXT (paste exactly this):**

A girl named Mina, who had a gap in her teeth and a fishing hook stuck in her hat for luck, lent them two Bubbub of their own. Rook's was called Splodge. Kit's was called Sir Wobbleton the Third. Rook climbed on top of Splodge, which was like trying to sit on a giant water balloon with a giggling Alienmon inside it. He slid off the left side. He climbed back on. He slid off the right side. He climbed back on and grabbed the rope and held on as tight as he could, and Splodge gave a happy gurgle and took off across the water like a rocket.

## Edit 4 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Enormous glittering rings. Not like Ombra's, which you had to fly to …" through the paragraph ending "… imagine what they would look like at night."

**OLD TEXT (remove exactly this):**

> Enormous glittering rings. Not like Ombra's, which you had to fly to see. These were right overhead, huge and close and bright, sweeping across the blue sky in great silver-white bands, like a bridge made of diamonds. In the daylight they sparkled. Rook could only imagine what they would look like at night.

**NEW TEXT (paste exactly this):**

Enormous glittering rings. Not like Glacia's, which you had to fly to see. These were right overhead, huge and close and bright, sweeping across the blue sky in great silver-white bands, like a bridge made of diamonds. In the daylight they sparkled. Rook could only imagine what they would look like at night.

## Edit 5 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Not sailing ships. Starships. Three of them, long and sleek and white, …" through the paragraph ending "… shape Rook knew by now. A twisting ladder."

**OLD TEXT (remove exactly this):**

> Not sailing ships. Starships. Three of them, long and sleek and white, hanging low over the water, circling slowly. Circling like sharks. On their sides was a shape Rook knew by now. A twisting ladder.

**NEW TEXT (paste exactly this):**

Not sailing ships. Starships. Three of them, long and sleek and white, hanging low over the water, circling slowly. Circling like sharks. On their sides was a shape Rook knew by now. An orange ring with a diagonal slash through it.


---

# Chapter 16: Ghost Ship

**Mode: 10 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "And he thought about Sporix, alone in a capsule in the Observatory, …" through the paragraph ending "… Mossback, alone under the fern in the mist."

**OLD TEXT (remove exactly this):**

> And he thought about Sporix, alone in a capsule in the Observatory, waiting for somebody to look at it. And the little copper Gleamgrub, alone in the scrap heap, guarding the Cogglets. And the baby Mossback, alone under the fern in the mist.

**NEW TEXT (paste exactly this):**

And he thought about Sporix, alone in a capsule in the Observatory, waiting for somebody to look at it. And the little rusty Gleamgrub, alone in the scrap heap, guarding the Cogglets. And the baby Mossback, alone under the fern in the mist.

## Edit 2 of 10
**Type:** REPLACE 3 old paragraph(s) with 3 new paragraph(s)
**Find:** from the paragraph starting "Then Kit took a deep breath, let go of his arm, and …" through the paragraph ending "… seemed a little less frightening in its light."

**OLD TEXT (remove exactly this):**

> Then Kit took a deep breath, let go of his arm, and held out their homemade Linker.

> "Lumislug," Kit said. "You'd better lead."

> Rook let out Lumislug. It slid out onto the deck in a swirl of sparkles, blinked at them sleepily, and then lit up. Its soft blue nightlight glow spread out across the dark deck, steady and calm, and somehow everything seemed a little less frightening in its light.

**NEW TEXT (paste exactly this):**

Then Kit took a deep breath, let go of his arm, and nodded at Rook's Linker.

"Lumislug," Kit said. "You'd better lead."

Rook let out Lumislug. It slid out onto the deck in a swirl of sparkles, blinked at them sleepily, and then lit up. Its soft lime-green nightlight glow spread out across the dark deck, steady and calm, and somehow everything seemed a little less frightening in its light.

## Edit 3 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "The corridor opened up into a big dark room at the very …" through the paragraph ending "… swept across the floor and up the walls."

**OLD TEXT (remove exactly this):**

> The corridor opened up into a big dark room at the very bottom of the ship. The cargo hold. Lumislug slid forward into the middle of it and glowed as bright as it could, and its blue light swept across the floor and up the walls.

**NEW TEXT (paste exactly this):**

The corridor opened up into a big dark room at the very bottom of the ship. The cargo hold. Lumislug slid forward into the middle of it and glowed as bright as it could, and its lime-green light swept across the floor and up the walls.

## Edit 4 of 10
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "It was round and fluffy and white, like a dandelion puff or …" through the paragraph ending "… Its beak trembled. It opened its tiny mouth."

**OLD TEXT (remove exactly this):**

> It was round and fluffy and white, like a dandelion puff or a ball of cotton candy. It had two tiny stubby wings sticking out of its sides, much too small for its body. It had two tiny orange feet. It had a tiny orange beak. And it had two enormous, round, shiny black eyes, wet with tears.

> It looked up at them. Its beak trembled. It opened its tiny mouth.

**NEW TEXT (paste exactly this):**

It was round and plump, with teal and hot-pink feathers all puffed up like a pom-pom. It had two tiny stubby wings sticking out of its sides, much too small for its body, with shiny chrome tips. It had two tiny chrome legs. On one side of its head was a little ear shaped exactly like a speaker. It had a beak shaped exactly like a megaphone. And it had two enormous, round, shiny black eyes, wet with tears.

It looked up at them. Its beak trembled. It pointed its tiny megaphone beak straight at them.

## Edit 5 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Kit's Linker beeped. They held it up, and the cracked screen flickered …" through the paragraph ending "… VERY LOUD. HOWLS WHEN SEPARATED FROM ITS FLOCK."

**OLD TEXT (remove exactly this):**

> Kit's Linker beeped. They held it up, and the cracked screen flickered and showed a picture. CHIRPOD. SONIC-TYPE. VERY SMALL. VERY LOUD. HOWLS WHEN SEPARATED FROM ITS FLOCK.

**NEW TEXT (paste exactly this):**

Kit's Linker beeped. They held it up, and the cracked screen flickered and showed a picture. CHIRPOD. SONIC-TYPE. VERY SMALL. VERY LOUD. COPIES ANY SOUND IT HEARS. HOWLS WHEN SEPARATED FROM ITS FLOCK.

## Edit 6 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "The Chirpod looked at Kit's hands. It looked at Kit's face. And …" through the paragraph ending "… burrowed in. It gave one last tiny hiccup."

**OLD TEXT (remove exactly this):**

> The Chirpod looked at Kit's hands. It looked at Kit's face. And then it hopped forward on its tiny orange feet, one hop, two hops, three, right into Kit's hands. Kit scooped it up and held it against their chest, inside their jacket. The Chirpod burrowed in. It gave one last tiny hiccup.

**NEW TEXT (paste exactly this):**

The Chirpod looked at Kit's hands. It looked at Kit's face. And then it hopped forward on its tiny chrome feet, one hop, two hops, three, right into Kit's hands. Kit scooped it up and held it against their chest, inside their jacket. The Chirpod burrowed in. It gave one last tiny hiccup.

## Edit 7 of 10
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "Rook let out a breath he felt like he'd been holding since …" through the paragraph ending "… scariest cotton ball in the whole Kessler system.""

**OLD TEXT (remove exactly this):**

> Rook let out a breath he felt like he'd been holding since they climbed the ladder. He started to laugh, a shaky, relieved laugh. "A monster," he said. "The ghost ship monster. It's a cotton ball."

> Kit was smiling down at the sleeping Chirpod. "The scariest cotton ball in the whole Kessler system."

**NEW TEXT (paste exactly this):**

Rook let out a breath he felt like he'd been holding since they climbed the ladder. He started to laugh, a shaky, relieved laugh. "A monster," he said. "The ghost ship monster. It's a pom-pom."

Kit was smiling down at the sleeping Chirpod. "The scariest pom-pom in the whole Kessler system."

## Edit 8 of 10
**Type:** REPLACE 2 old paragraph(s) with 2 new paragraph(s)
**Find:** from the paragraph starting "On a desk in the corner, under a single bare bulb, lay …" through the paragraph ending "A twisting ladder."

**OLD TEXT (remove exactly this):**

> On a desk in the corner, under a single bare bulb, lay a big black book. A logbook. On its cover was a shape stamped in silver.

> A twisting ladder.

**NEW TEXT (paste exactly this):**

On a desk in the corner, under a single bare bulb, lay a big black book. A logbook. On its cover was a shape stamped in orange.

A ring, with a diagonal slash through it.

## Edit 9 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "They took it down to the beach at sunrise, when the sky …" through the paragraph ending "… circling over the far end of the island."

**OLD TEXT (remove exactly this):**

> They took it down to the beach at sunrise, when the sky was pink and gold and the rings were fading to silver. Kit held it up in both hands. The Chirpod looked around, blinking, at the sand and the sea and the sky. Then it looked up, high up, at a flock of fluffy white birds circling over the far end of the island.

**NEW TEXT (paste exactly this):**

They took it down to the beach at sunrise, when the sky was pink and gold and the rings were fading to silver. Kit held it up in both hands. The Chirpod looked around, blinking, at the sand and the sea and the sky. Then it looked up, high up, at a flock of round teal-and-pink birds circling over the far end of the island.

## Edit 10 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "They watched until it was just a speck. Until it joined the …" through the paragraph ending "… tell which little white puff it was anymore."

**OLD TEXT (remove exactly this):**

> They watched until it was just a speck. Until it joined the flock. Until they couldn't tell which little white puff it was anymore.

**NEW TEXT (paste exactly this):**

They watched until it was just a speck. Until it joined the flock. Until they couldn't tell which little teal-and-pink puff it was anymore.


---

# Chapter 17: Harbor Under Siege

**Mode: REPLACE THE WHOLE CHAPTER TEXT.** More than half of this chapter changed (2,427 of 4,563 words), so replacing it whole is simpler and safer than 13 separate edits. Select everything in this chapter (keep the chapter title), delete it, and paste the NEW CHAPTER TEXT below. Then assign voices and generate the whole chapter.

## NEW CHAPTER TEXT

They ran.

They ran up the beach and across the sand and onto the stone streets of Port Saltreach, where everybody else was running too, but in the other direction. Fishermen were hauling their boats up out of the water. Mothers were scooping up kids. Shopkeepers were slamming their shutters. A man ran past carrying a goat. The bells clanged and clanged from every tower, so loud that Rook could feel them in his teeth.

CLANG-CLANG-CLANG-CLANG!

Overhead, the Helix ships roared past, so low that their shadows swept over the rooftops and the wind they made sent laundry flying off the lines. Three white ships. And the black one with the yellow stripes, bigger and louder than the others, its engines making a deep, angry BZZZZZZZZZ, like a giant wasp.

They were heading for the rocky point. For the tall white tower with the blue spiral stripe. For Captain Marsh's tower.

"The crystal!" Kit panted, running beside Rook with their toolbelt clanking. "Rook, the scratch on Dr. Moor's crystal, the crack on Dad's, they were TESTING. They were testing how to get them out. That's what they're here for!"

Rook didn't answer. He didn't have any breath left to answer with. He just ran faster.

Plazmet streaked ahead of them, his comet-tail blazing. Zib clung to Rook's cap with his lights flashing a frightened red.

They reached the bottom of the rocky point. The road up to the tower was steep and winding, cut into the cliff. And it was blocked.

Helix grunts held it. A dozen of them, in white jumpsuits and visors, spread across the road in two neat lines, the way people stand when they have practiced standing that way. Nobody was shouting. One of them was talking into a radio, calmly, reading out numbers. Above their heads hovered their Alienmon: buzzing bug-like fliers as big as dogs, each held up by two round wings shaped exactly like satellite dishes, which swiveled and twitched as they flew, listening to everything. Skitterdrones. They worked in pairs, sweeping back and forth above the road, clicking and buzzing to each other like a swarm passing messages.

And past them, halfway up the cliff road, Captain Delia Marsh was fighting her way up toward her tower.

She was alone. She had her long blue coat flying out behind her and her brass spyglass in one hand like a sword. Beside her, rolling up the road like a boulder, was the biggest Alienmon Rook had ever seen. It was old and huge and blue, a giant sea creature like a cross between a whale and a turtle, with flippers as wide as doors and a great heavy shell crusted all over with barnacles. It was shoving Helix grunts out of the way with its enormous head, gently but firmly, like someone moving furniture.

But there were so many grunts. Every time the old blue creature shoved one line back, the other line stepped up and closed the gap, calm and tidy, like a door swinging shut. And the Skitterdrones swarmed over its shell like ants, clicking, dish wings turning, pinning it down. Captain Marsh was barely moving forward at all.

She saw them. She shouted something over the bells. Rook couldn't hear it. But he saw her point. Not at the road. Up. At the tower.

At the side of the tower, a long iron ladder ran up the cliff from the beach. A service ladder. For lighthouse keepers.

"She wants us to go up the back way," Kit breathed.

Rook was already running.

The ladder was slippery with sea spray and so steep that it leaned out over the waves. Rook climbed with his heart in his throat, not looking down, Zib clinging to his cap, Kit climbing right below him. Plazmet flew alongside, lighting the way. The bells clanged. The wind howled. The waves smashed against the rocks below, sending up great sprays of glowing blue foam.

At the top was a small round door. Rook shoved it open.

They tumbled inside, into the heart of the Harbor Tower.

It was a big round room, tall and white, with a spiral staircase winding up the walls toward the top. Blue tiles covered the floor in swirling patterns, like waves. Round windows looked out at the sea on every side. And in the middle of the room, running straight up through the ceiling like the trunk of a tree, was a great column of light.

It was the core. The crystal heart of the tower. It ran all the way from the floor up through the center of the tower to the crystal at the very top. It was made of the same glowing crystal as the Signal Shards, but huge, as thick as a tree trunk, and it was shining a deep, beautiful sea-blue. Rook could hear it humming. It was the same note as the Shards in his satchel. Deep and pure and steady.

And it was being taken apart.

Helix workers were swarming over it. They had built scaffolding around it, white metal scaffolding, and they were standing on every level with tools. Big wrenches. Hissing cutters. Clamps and cables and pulleys. They were unbolting it. Rook could see it happening. They were unscrewing the huge brass bolts that held the core to the floor, one by one, and wrapping it in thick black straps, and hooking the straps to chains that ran up through the hole in the roof.

Up through the hole in the roof, Rook could see the belly of the black-and-yellow ship, hovering right over the tower. Waiting.

The core's hum was wavering. Getting fainter. Flickering, like the crystal on Ferrox had flickered.

Pell and Strand were there too. Rook spotted them at the edge of the room, beside a big crate. Pell had a glowing screen in one hand and was calling bolt numbers up to the scaffolding, crisp and steady, and the workers called back to him one by one as each bolt came free. Strand was at a winch by the wall, feeding chain up through the hole in the roof. Neither of them looked up. They were working the way people work when they have done a thing many times before. But they were both standing very straight. And every few seconds, Rook saw Pell's eyes flick toward the middle of the room, the way you keep checking on a dog that might bite.

Because standing in the middle of it all, in front of the core, was someone new.

She was tall and thin, and she stood with perfect posture, as if there were a string pulling her up from the top of her head. Her hair was cut sharp and short and asymmetrical, longer on one side than the other, and it was dyed a bright, startling teal, like the sea on a sunny day. She wore a sleek black uniform with silver buttons. And over her shoulders hung a cape. A long cape, down to her heels, striped black and yellow, black and yellow, like a wasp.

She had her back to them. She was looking up at the core, watching the workers, with her hands clasped behind her back.

She didn't turn around when they burst in. She didn't jump. She didn't even seem surprised.

"Ah," she said. Her voice was cool and smooth and bored, like someone reading a shopping list. "There you are."

Then she turned.

Her face was pale and sharp. Her mouth was a thin straight line. And her eyes were the palest blue Rook had ever seen, almost silver, almost white. They were as cold as ice. They looked at Rook the way you look at a bug on a windowsill.

"Admin Vex," she said. "And you are Rook. From Dustmere." The pale eyes moved to Kit. "And the engineer who switched off my harvest in the Maze." She said it the way someone reads a line off a page. "Field Agent Pell writes very thorough reports."

Across the room, Pell went still.

Rook remembered the radio crackling in the dark behind the asteroid. Somebody a lot higher up than me is going to hear your name. Pell had kept his promise. And now he was standing in the same room as the person he had made it to, and he didn't look proud at all. He looked like someone waiting to find out whether he was in trouble.

"Admin," Pell said. His voice was steady. "The boy's partner is an evolved Plasma-type. I'd recommend..."

"Twice, Pell." Admin Vex didn't look at him. "Twice you told me you would bring in the scout. And yet here it is. It walked in on its own."

A tiny pause.

"Yes, Admin."

"Keep the bolts moving."

Pell's jaw tightened. Then he turned back to the scaffolding and called out the next number, and his voice didn't shake at all. Over at the winch, Strand kept his eyes on the chain. But his hands, Rook noticed, had stopped moving.

Rook's heart was pounding so hard he could feel it in his ears. But he made himself stand up straight. He made himself look right into those cold, pale eyes.

"Give that core back!" he shouted. "That's not yours! It's Captain Marsh's! It's Thalassa's!"

Admin Vex looked at him for a long moment. Then she sighed. A small, tired, bored sigh, the kind of sigh you make when a fly is buzzing near your ear.

"It isn't anybody's," she said. "It's a crystal. A very old, very interesting crystal. And the Director needs it more than a fishing village does." Her pale eyes flicked up, just for a moment, to Rook's cap. To Zib. Something moved in them. Something hungry. "Hello, little scout."

Zib went rigid. His lights flashed red, red, red.

Rook stepped in front of him. "Don't you dare touch him."

"Touch him?" Vex almost smiled. Almost. "I wasn't going to. Not today." She tilted her head. "The Director says the scout will come to us on its own. When it's time." She turned away, back to the core, as if Rook had stopped being interesting. "Now run along. I'm working."

Rook's hands balled into fists.

"Plazmet!" he shouted. "Comet Dash! At the chains!"

Plazmet blazed. He coiled up, his plasma ring spinning, and shot across the room like a shooting star, straight at the thick black chains that ran from the core up to the ship.

Admin Vex didn't even look around.

She just snapped her fingers.

Something dropped down from the scaffolding. It landed on the tiled floor right in Plazmet's path with a heavy, wet SPLAT. Plazmet swerved, just in time, and went skidding off to one side in a shower of sparks.

And the something swung its tail.

WHAP. It caught Plazmet in midair, a long, heavy, dripping lash, and flung him sideways into the scaffolding. He hit a white metal pole with a CLANNNG that shook the whole frame. A wrench fell three floors and bounced off the tiles. Plazmet dropped to the floor in a heap of sputtering sparks, and where the dripping tail had touched him, his fire hissed and smoked and went a sick, dull orange.

"Plazmet!"

It was a serpent.

A long, thick, coiling serpent, longer than the room was wide, and it was purple. Deep, dark, glistening purple, the color of a bruise. It was covered in shiny scales that dripped. They dripped constantly, little drops of thick purple ooze that fell to the floor and hissed and smoked where they landed, leaving little burned marks on the blue tiles. It had a flat, wide head like a shovel, and two narrow yellow eyes. And all down its back ran a row of black-and-yellow striped spines.

It reared up. It hissed. The hiss sounded like a kettle full of acid.

"Hexcoil," said Admin Vex, still not turning around. "Deal with them."

Plazmet was already getting up. He shook the ooze off his comet-tail in a spatter of smoking drops, flared himself bright again, and flew straight back at the serpent, low and fast. "Plazmet, wait..." Rook started. Too late. The Hexcoil didn't even turn its head. It just flicked its tail again, lazy, like someone swatting a fly. WHAP. Plazmet tumbled across the floor, over and over, and fetched up against the wall under a round window, his plasma ring wobbling, his flame flickering low.

Rook's mouth had gone dry. That was Plazmet. Plazmet had beaten the Iron Wall. Plazmet had evolved in a blaze bright enough to light a mushroom from the inside. And this thing had knocked him across the room twice without even looking at him.

The Hexcoil's yellow eyes swept across the room. They passed over Plazmet, smoking and struggling up by the wall. They passed over Rook. They passed over Zib.

And they stopped on Kit.

Kit had been edging along the wall toward the scaffolding, trying to get to one of the cutters, trying to fix things the way Kit always fixed things. Kit froze.

The Hexcoil smiled. Rook didn't know snakes could smile. This one could.

And it went for Kit.

It didn't go for Plazmet, who was the strongest. It didn't go for Rook, who was the one shouting. It went straight for the smallest, quietest person in the room. It slithered across the tiles so fast that it left a smoking purple trail behind it, a long hissing line of melted, bubbling tile, and it backed Kit into the corner, between the wall and a stack of crates, rearing up over them. Its dripping jaws opened wide. Purple ooze spattered on the floor at Kit's feet. Hissss. Hissss.

Kit pressed back against the wall. There was nowhere to go.

"KIT!" Rook yelled. He started running. Plazmet was already streaking across the room, trailing smoke, his fire still guttering. But they were too far away. Much too far.

And that was when Sporix jumped.

It leaped down off Kit's shoulders. It landed on the tiles right in front of Kit, right between Kit and the Hexcoil. It planted its tiny feet.

It was so small. So, so small. It barely came up to Kit's knee. The Hexcoil was as big as a tree. Its dripping purple head hung over Sporix like a storm cloud, its yellow eyes narrowing, its jaws dripping.

Sporix was shaking. Rook could see it from across the room. Its whole body was trembling. Its cap was quivering. Little puffs of frightened spores were popping out of the white spots on its cap with every shiver.

But it did not move.

The Hexcoil spat.

A gob of purple ooze hit Sporix square on top of its cap. TSSSSSSS. Smoke boiled up. Sporix squealed, a thin, high, terrible little sound, and was knocked flat on its back on the tiles, its feet kicking at the air. When it rolled over, there was a smoking, blackened spot on its red cap, right in the middle of the white spots, as big as a coin.

"Sporix!" Kit dropped to their knees and reached for it. "Sporix, no, come here, come back up here, please..."

Sporix got up.

It wobbled. Its cap was steaming. It was shaking so hard now that its little feet tapped on the tiles. But it stepped out of Kit's hands, and walked back to the exact same spot, and planted its feet again.

It did not run. It did not hide. It did not pull its cap down over its eyes.

It stood there, between its person and the monster, shaking all over, and it did not move one inch.

Then, just once, it looked back over its shoulder. Up at Kit.

Rook saw Kit's face. He knew that face. It was the face he'd made against Anvilox, with his hand on the Linker and one button between his partner and safety. Kit's hand was already half out, reaching to scoop Sporix up and hide it away.

Kit's hand stopped.

"Okay," Kit whispered. Their voice wobbled all over the place. "Okay. I'm right here. I'm right behind you."

The Hexcoil hissed. It drew back its head to strike.

And Sporix began to glow.

It started under its cap. A soft green light, like the inside of a leaf held up to the sun. Then it spread, through its whole little body, brighter and brighter, until it was glowing like the mushrooms of Sporeholm, glowing like a lantern, glowing so bright that the Hexcoil flinched back and hissed and shielded its yellow eyes.

The light grew.

And Sporix grew with it.

Its body stretched up, tall and lanky, taller than Kit, taller than Rook, as tall as a grown-up. Its two stubby little legs stretched down into the floor and became roots, long strong twisting roots that dug into the cracks between the tiles and held on. Its two stubby little arms grew long, and longer, and became vines, thick pale twisting vines, all its soft cream fluff gone hard and woody and wound together like rope, that coiled and curled through the air. And its mushroom cap, its little red cap with the white spots that it used to hide under, spread out. Wider and wider. Until it was as wide as an umbrella, as wide as a shield, red with white spots, its edges drooping and ragged, spreading out over Kit like a roof.

The light faded.

Where little Sporix had been, now stood something tall. Tall and strong and calm, like a young tree. Its body was pale and lanky and twisting, like a mushroom stalk wound out of woody rope. Its roots held fast to the floor. Its vines swayed slowly in the air. And its great spotted cap spread out over Kit's head like a shield, so that Kit was standing completely safe underneath it. There was still a dark, scorched spot right in the middle of it. It hadn't gone away. It had just grown with everything else.

It had the same eyes. The same big, gentle eyes. But they weren't shy anymore. Not one little bit.

Kit's homemade Linker beeped. The cracked screen flickered.

MYCELITH. BIO-TYPE. EVOLVED FORM.

"Mycelith," Kit whispered, looking up at it. "Oh. Oh, look at you."

The Hexcoil hissed again, louder, angrier. It lunged.

WHAM.

Its shovel head slammed into Mycelith's great cap like a battering ram. Mycelith's roots tore loose from the floor with a crackle of breaking tile, and it slid backward, SKRRRRK, a whole long step, until its stalk thumped against the wall right beside Kit. The cap held. Kit, underneath it, didn't get touched. But Mycelith let out a low, groaning creak, like a tree in a storm.

The Hexcoil didn't stop. It whipped its long body around and around Mycelith's stalk, coil after dripping coil, and squeezed. Everywhere its scales touched, the ooze hissed. TSSSS. TSSSS. Smoke curled up off Mycelith's pale stalk. Its vines lashed at the serpent's head, thwack, thwack, and the serpent bit at them, and the vines came back smoking and singed at the tips. Mycelith's cap began to tilt. To sag. Lower. Lower. Its gentle eyes squeezed shut.

"Get off it!" Rook was almost there. "Plazmet, help it!"

Plazmet flung himself at the coils, and the Hexcoil's tail came round one more time and swatted him into a stack of crates, KRUNCH, and he didn't get up straight away. Rook's heart slammed so hard it hurt. Both of them. It was beating both of them at once.

But Kit wasn't looking at the snake.

Kit was looking at the floor.

Rook saw it a second later. The trail. The long, smoking purple trail the Hexcoil had left everywhere it had slithered, across the room, along the wall, around the crates, in loops and zigzags. The ooze hadn't just burned the tiles. It had eaten right through them. All along that trail, the blue tiles were melted into holes, and through the holes Rook could see the old dark stone of the tower underneath, cracked and crumbly and full of gaps.

The Hexcoil had drawn a map. And the map was everywhere it was lying right now.

"Mycelith!" Kit's voice cracked, and Kit didn't stop. "Don't pull at it! Go down! Under the floor! Follow the holes!"

Mycelith's eyes opened.

It didn't fight the coils anymore. It stood still inside them, sagging and smoking, and it pushed its roots straight down, deep into the cracks between the tiles, into the old stone underneath. Rook felt it through his sneakers. A rumble. A shiver, running out across the whole floor, under everything, like something enormous waking up.

The Hexcoil felt it too. Its yellow eyes went wide. It squeezed harder. Mycelith's cap creaked and dipped almost all the way down onto Kit's head...

Then Mycelith lifted one long vine arm, calm and slow, and the floor exploded.

Roots burst up out of the blue tiles, all around the Hexcoil. Up out of every single hole the Hexcoil had burned. Huge roots, thick as Rook's arm, twisting and curling, shooting up out of the cracks in the floor. KRAK-KRAK-KRAK-KRAK. Tiles flew. The Hexcoil thrashed, uncoiled from Mycelith in a panic, and struck at Kit one last time, jaws wide, straight down at the cap, and Mycelith didn't dodge. It braced. It took the hit. WHAM. The whole great cap shuddered...

And the roots caught the Hexcoil in midair.

They wrapped around its long purple body. Once. Twice. Three times. Around and around and around, tight as a knot, until the Hexcoil was tied up like a parcel, its yellow eyes bulging, its dripping jaws snapping at nothing, hissing and thrashing and completely, totally stuck.

The room went silent. Every Helix worker on the scaffolding had stopped to stare.

Rook skidded to a stop. Plazmet came wobbling up out of the crates and stopped beside him, his fire low and smoky. They both stared at the tall, calm, spotted giant standing in the corner. Its stalk was streaked with burn marks. Its vines were singed. It was leaning against the wall, breathing in long, slow, creaking breaths. But its roots were still holding, and Kit was still safe underneath it.

And Admin Vex, finally, turned around.

She looked at the Hexcoil, tied up in roots. She looked at Mycelith. She looked at Kit, standing safe underneath the great spotted cap.

She raised one thin eyebrow.

"Interesting," she said.

That was all. Just one word. But she said it in the same voice you might use about a beetle under a microscope, and it made Rook's skin crawl.

Then she reached up and touched a small silver device on her collar. "Release the core," she said into it. "Lift."

"No!" Rook shouted.

But the last bolt had already come loose. The chains went taut with a great metallic CLANK. And the core, the great glowing crystal heart of the Harbor Tower, rose up off the floor. Slowly at first. Then faster. Up through the scaffolding, up through the hole in the roof, swinging on its black chains, its blue light flickering, flickering, getting fainter.

"Recall," said Vex, and the Hexcoil dissolved into purple sparkles and flowed into a sleek black Linker on her wrist, slipping out of Mycelith's roots like water through fingers. She swept toward a door at the side of the room, her black-and-yellow cape swirling behind her. Helix workers came down the scaffolding after her, quickly but in order, the top level first, as if they had practiced it. Pell stood by the door with his screen tucked under his arm and counted them out, one by one. He didn't look at Rook once.

At the door, Vex paused. She looked back over her shoulder. Not at Rook. At Zib.

"We already have what we came for," she said. "For now."

And she was gone.

Strand was the last one out. At the door, he stopped. He looked back at Rook, just for a second, with his worried, round-cheeked face. He looked like he wanted to say something. Something he wasn't supposed to say.

"Strand." Pell's hand closed on his arm. Not hard. Not a yank. Just enough. He said it low, but Rook heard. "She notices everything. Everything. Don't give her a reason."

Strand's mouth closed.

Pell looked past him, across the wrecked blue floor, at Rook. For a moment they just looked at each other, the boy and the field agent. Rook couldn't read anything in his face at all.

"I told you it wouldn't be easy," Pell said quietly.

Then he turned, and took Strand with him, and the door swung shut behind them.

The roar of the black-and-yellow ship's engines filled the whole sky. Rook ran up the spiral stairs and out onto the balcony at the top of the tower just in time to see it rise. It went up, and up, carrying the great blue crystal beneath it on its chains like an eagle carrying a fish. The three white ships fell in behind it. And together they shot away into the bright sky, past the glittering rings, smaller and smaller, until they were just four dots.

Then they were gone.

Rook stood on the balcony with his hands on the railing. Below him, the bells of Port Saltreach had stopped. The harbor was quiet. People were coming out of their houses again, slowly, looking up at the sky.

And behind him, the tower was dark.

The crystal at the very top, the one that had shone sea-blue over the harbor every night for longer than anyone could remember, was gone. In its place was an empty brass cradle, and a hole, and the sky.

He heard footsteps on the stairs. Kit came out onto the balcony. Mycelith came out behind them, slowly, ducking its great spotted cap under the doorway. It moved stiffly, like someone who had been out in a storm all night. The burn marks on its stalk had faded to gray smudges, and the scorched spot on its cap had stopped smoking, but one singed vine still trailed along the floor behind it.

Kit didn't say anything. They just walked straight up to Mycelith and threw both arms around its long, twisting middle and held on tight. Mycelith's vines curled down around Kit's back, gently, the way you'd tuck a blanket around someone. Its great cap tilted down over both of them, like an umbrella in the rain.

"You protected me," Kit whispered into Mycelith's side. "You were so scared. I saw you shaking. And you did it anyway." Their voice broke. "You always protect me."

Mycelith made a soft, low, rustling sound, like wind through leaves.

Rook looked away to give them a moment. He looked out at the sea instead. And then he reached into his satchel and took out the two Signal Shards. The blue one and the green one.

They were flickering.

Not humming. Not singing their sweet two-part harmony. Flickering. Dimming and brightening, dimming and brightening, unsteadily, like a candle in a draft. Like they had felt something happen. Like something had hurt them.

Somewhere out there in the Kessler system, Rook thought, there were eight towers. Eight crystals, on eight different worlds, all shining together like the eight little lights on Dr. Vashti's map.

And now one of them was dark.


---

# Chapter 18: Captain's Orders

**Mode: REPLACE THE WHOLE CHAPTER TEXT.** More than half of this chapter changed (2,389 of 4,745 words), so replacing it whole is simpler and safer than 7 separate edits. Select everything in this chapter (keep the chapter title), delete it, and paste the NEW CHAPTER TEXT below. Then assign voices and generate the whole chapter.

## NEW CHAPTER TEXT

Captain Delia Marsh came up the spiral stairs of her tower very slowly.

Rook heard her coming. Clomp. Clomp. Clomp. Her heavy black boots on the stone. She was not running anymore. She came out onto the balcony, and she stopped, and she looked up at the empty brass cradle where her crystal used to be.

She looked at it for a long, long time.

She had a cut on her cheek. Her long blue captain's coat was torn at the shoulder and spattered with purple ooze from the Skitterdrones. Her gray hair was full of sea spray. Behind her, down at the foot of the tower, the huge old blue sea creature with the barnacled shell was lying on the rocks, breathing slowly, resting. It lifted its great head and made a low, sad sound up at the dark tower. Wooooooom.

Captain Marsh didn't cry. Rook didn't think Captain Marsh had ever cried in her life. But her hands were gripping the railing so hard that her knuckles had gone white, and her jaw was clenched so tight that a muscle in her cheek was jumping.

"A hundred and twelve years," she said finally. Her voice was very quiet and very rough. "That crystal has lit this harbor every single night for a hundred and twelve years. Through storms. Through floods. Through the night the stars fell. Every fisherman who ever got lost out there in the dark found his way home by that light." She closed her eyes. "And they unbolted it like a lightbulb."

Rook didn't know what to say. He held out the two flickering Shards, as if that might help.

Captain Marsh looked at them. Then she looked at Rook. And then her stormy gray eyes went hard, harder than Rook had ever seen anybody's eyes go.

"No battles," she said.

"What?"

"You heard me. No battles. No Signal Shards." She pushed herself off the railing and stood up straight. "Not until every last Helix grunt is off my docks. They ran in such a hurry they left half their people behind, and those people are still out there in my harbor, scaring my fishermen and breaking things and hiding in my sheds." She looked down at the harbor, at the boats and the stilt houses and the people standing in the streets, looking up at the dark tower. "A Keeper's job isn't to battle, son. Not really. A Keeper's job is to keep. To look after a place and the people in it." Her jaw tightened. "Today I didn't do that very well. So until I do, nobody battles anybody."

She turned and started down the stairs. Then she stopped and looked back over her shoulder.

"You can help," she said, "if you want to."

They wanted to.

It took the whole next day.

They started at dawn on the docks. Captain Marsh was right: the Helix ships had left in such a hurry that a dozen grunts had been left behind. Rook had always pictured Helix as one big thing, white and orange and organized, like a machine. But the people it had left behind weren't a machine. They were just people, scattered all over Port Saltreach with their clicking, buzzing Skitterdrones, and every one of them was different. Some were trying to steal boats to get away. Some were hiding, scared, now that their ships were gone. And some were still angry.

The first group was on the fish market pier, trying to untie a fishing boat that very clearly did not belong to them.

"Excuse me," said Rook. "That's not yours."

The grunts turned around. There were three of them. They saw Rook. They saw Plazmet, blazing behind him with his comet-tail lashing. They saw Kit, and Mycelith, tall and calm under its wide, ragged red cap, looming over Kit's shoulder like a very large and very disapproving umbrella.

Two of them dropped the rope and put their hands up. Their Skitterdrones ducked behind their legs, dish-shaped wings folded tight. But the third one didn't. He was older than the others, with a hard, sunburned face and his visor shoved up on his forehead, and his hand stayed resting on the static-net launcher at his hip. His Skitterdrone rose up off the boards behind him, and its dish-wings swiveled, slowly, until they were pointing at Zib.

"We were just leaving," he said. His voice was flat. "Step aside, kid. You don't want to do this today."

"Not in that boat," said Kit.

The man looked at Kit. He looked at Plazmet, whose fire had gone white-hot at the edges. He looked down at his own boots, and at Mycelith's pale roots, which had spread out quietly across the wet boards all around them while nobody was watching.

"Brann," said one of the others, low. "Leave it. The ships are gone. Nobody's coming back for us."

For a long second, nobody moved. Then the man called Brann took his hand off the launcher, slowly, one finger at a time, and let the rope drop into the water.

Captain Marsh had a big old cargo barge waiting at the end of the harbor, and anyone who wanted to leave Thalassa was welcome to take it, she said, as long as they took it straight back through the harbor gate and never, ever came back. Rook and Kit marched the grunts to it. Then they went back for more.

They found three grunts hiding in the lighthouse on Gull Rock, sitting on the floor in the dark with the door barricaded, who wouldn't come out until Captain Marsh herself stomped up the path and told them through the keyhole that nobody on her island was going to hurt them. They found two more trapped at the end of the sea wall by Mina, who was standing in front of them with a fishing net held out in both hands, and her Bubbub, Splodge, puffed up to twice its size beside her, and a look on her face that said she had been waiting all night for this. And they found one all by himself on a little beach on the far side of the island, sitting on a rock with his helmet off, looking out at the sea. He looked very young, not much older than the big kids at the Dustmere schoolhouse, and very miserable.

"I just wanted a job," he said, when they found him. He didn't get up. He didn't try to run. "There's no work back home. Helix came to our school with a brochure, with pictures of Alienmon on it, all smiling. They said it was research. They said we'd be helping Alienmon." He looked down at his Skitterdrone, which was nestled against his boot. "They gave me him on the first day. I named him Pip. You're not supposed to name them." He swallowed. "I didn't know about the cages. I swear I didn't know. Not until yesterday. Not until they made me carry one."

Rook thought about Strand, opening the cage in the Maze. Strand, leaving a yellow blanket in an empty cage. I'm sorry. I'm really sorry. Helix was full of people who were sorry, Rook thought. And the cages kept filling up anyway.

"There's a barge," Rook said gently. "Captain Marsh says anyone can take it home."

The young grunt looked up at him. Then he nodded, and picked up his Skitterdrone, and walked with them back to the harbor without anyone having to march him at all. On the barge, he sat by himself at the very back, with Pip in his lap. When it went out through the harbor gate, he was the only one who looked back.

Around noon, Kit heard the crying.

It was coming from an old wooden shed at the back of the boatyard, behind a stack of lobster pots. A little whimpering, whining sound. Kit pressed their ear against the door. Then Kit's face went hard and angry, in a way Rook had only seen once before, on the Scrap Route on Ferrox, holding a crate stamped dispose after use.

The door was padlocked. Kit had it open in about four seconds with a hairpin and a tiny screwdriver.

Inside, in the dim, two Alienmon were tied to a post with rough rope.

One was a seahorse as big as a dog, with glittering green scales and a curly tail and long frilly fins like lace. The other was a crab, round and orange and about the size of a dinner plate, with one claw much bigger than the other. They had been tied up tight, so tight they could barely move. The seahorse's fins were drooping. The crab's eyes, on their little stalks, were pressed flat against its shell.

On the wall above them was a Helix label. COLLECTED. AWAITING TRANSFER.

"They were going to take them," Kit said. Their voice was shaking. "They just didn't have time."

Mycelith stepped forward. It reached out with its long, gentle arms of pale, woody fiber, twisted together like rope. And very, very carefully, it began to untie the knots. One by one. Slowly and patiently, the way you would untangle a necklace. Kit knelt down and helped. Rook held the lantern.

When the last rope fell away, the crab scuttled straight into the corner and hid. But the seahorse just stood there, trembling, staring at them with its huge, glittering eyes, as if it couldn't believe it was free.

Then Rook did the only thing he could think of. He took Nana Wren's badge off his satchel strap and held it out, so the seahorse could see the little brass cross, with the little brass bird.

"It's okay," he said. "You're safe now. We look after people. It's a promise."

He didn't know if the seahorse understood. But it stopped trembling. And after a moment, it swam forward through the air, slow and graceful, and pressed its long nose very gently against the badge.

They took both Alienmon down to the harbor and let them go in the turquoise water. The seahorse swam three circles around the dock, its lacy fins rippling, and then dove down into the glittering blue and was gone. The crab took a little longer. It sat on the edge of the dock and looked at the water for a while. Then it waved its big claw at them, once, and dropped in with a plop.

The whole afternoon, they helped the fishermen fix their nets.

The Helix grunts had torn half the nets in the harbor, trying to cut their way through to the boats. Now they lay in great tangled heaps on the docks, full of holes. The fishermen sat on upturned crates with big wooden needles, mending them, and they showed Rook and Kit how. You tied a knot. Then another knot. Then another knot. Over and over and over, hundreds of knots, until the hole was gone.

It was slow. It was boring. Rook's fingers got sore and his back got stiff and he got fishy-smelling twine stuck to everything.

But the fishermen told stories while they worked. Stories about storms and sea serpents and the time Old Barnaby, Captain Marsh's huge blue barnacled Alienmon, had carried an entire sinking ship back to harbor on its back. Stories about the Captain herself, who had come to Port Saltreach as a girl of fourteen with nothing but a rowboat and a stubborn streak a mile wide. And stories about the tower. About how its blue light had brought them home on dark nights, again and again and again, for as long as any of them could remember.

Mycelith turned out to be wonderful at fixing nets. Its long, rope-like fibers could tie knots faster than any fisherman on the dock. By the end of the afternoon, there was a small crowd of fishermen standing around it, watching, with their mouths open.

"I'd trade my boat for one of them," said one of them.

"Not for sale," said Kit, very fast.

Mycelith tied another knot, very pleased with itself.

By sunset, the docks were safe.

The last Helix grunt was on the barge, heading out through the harbor gate. The nets were mended and hanging up to dry. The fishing boats were tied up in neat rows. People were out in the streets again, lighting their lanterns, talking in low voices, looking up at the dark tower with sad faces. But they were safe.

Captain Marsh walked down the pier toward Rook and Kit, who were sitting on the edge of the dock with their feet dangling over the glowing water, too tired to move. Her long blue coat had been mended. The cut on her cheek had a bandage on it. Old Barnaby swam alongside the pier beside her, his barnacled shell rising out of the water like a little island.

She stopped. She looked down at them for a long time. They were covered in fish scales and twine and sunburn and purple Skitterdrone goo.

Then, for the first time since Rook had met her, Captain Delia Marsh smiled.

It was a small smile. It crinkled up the corners of her stormy gray eyes. But it was real.

"Right," she said. "Now we battle."

They battled on the water.

Captain Marsh's arena wasn't in her tower. It was out in the harbor, in a wide circle of open sea marked out by floating buoys with little bells on them. The whole of Port Saltreach lined the docks to watch, holding their lanterns up. The glowing rings arched overhead. The sea glittered and glowed. Rook stood on one floating platform, Captain Marsh on another, with the open water between them.

And into that water swam Old Barnaby.

He was huge. Up close he was even bigger than Rook had thought, as big as a fishing boat, his great shell crusted with barnacles and seaweed, his flippers as wide as doors. His face was old and wrinkled and wise, with drooping whiskers like an old man's mustache. He looked at Rook with one deep, calm, ancient eye. Rook's Linker beeped. BRINEBACK. HYDRO-TYPE. VERY OLD. VERY STRONG.

Rook swallowed.

Water beats fire. Everybody knew that. He thought about sending out Plazmet straight away, because Plazmet was his strongest. Then he stopped.

Think first.

"Cactling," he said. "You first."

The crowd murmured. Cactling stomped out onto the edge of Rook's platform. It looked at the sea. It looked at Old Barnaby. It looked back at Rook as if to say, You want me to do WHAT?

"Plants beat water," said Rook. "You've got the advantage, buddy. Just don't fall in."

Cactling huffed. Then it cracked its stubby knuckles and turned to face the enormous old Brineback.

It was a battle of waves and wind, and it went on and on.

Old Barnaby didn't move fast. He didn't need to. He swept one huge flipper through the water and a wave rose up, taller than a house, green and glowing and curling over at the top, and came crashing down over Rook's platform. KA-SHOOOOM. The platform plunged under. Rook went down on one knee with salt water up to his chest and the whole world roaring. When it bobbed back up, Cactling was still there, clinging to the edge with all four stubby limbs, dripping and furious.

"Needle Spray!"

Cactling threw needles. And they stuck. They stuck in the soft places between the barnacles, thk-thk-thk, and every one made Old Barnaby flinch. Plants beat water. The big Brineback grunted, and shook his great head, and Rook saw him start to slow down.

So Old Barnaby breathed in, and blew.

A howling wind came whipping across the harbor so hard that it nearly blew Rook's cap off. Zib had to hold onto his hair. The platform tipped up on its side like a door swinging open. And Cactling, who had been braced for water, not wind, lost its grip.

It went flying. Out over the edge, tumbling end over end, and into the sea with a tiny, awful plip.

"CACTLING!"

The crowd gasped. Rook threw himself flat on the tilting platform and stared at the dark water where it had gone in, and there was nothing, nothing, just ripples and foam and the glowing green sea. His heart stopped. Cactling couldn't swim. Cactling hated water. Cactling wouldn't even stand near a puddle.

Clang.

One of the buoys swung. Its little bell rang. And there was Cactling, hanging off the side of the buoy by one stubby arm, coughing up seawater, the creamy flower in the middle of its body plastered flat, its one green eye squinting out of the middle of it. It glared across the harbor at Old Barnaby with an expression of pure, outraged fury.

Then it climbed. Up the buoy. Along the rope. Hand over hand, dripping, its stubby legs kicking, while Old Barnaby's next wave rolled underneath it and nearly shook it off again. It flopped back onto the platform in a soggy heap, lay there for one second, and got up.

"You okay?" Rook breathed. "Buddy, are you..."

Cactling shook itself like a wet dog, spraying him all over. Then it turned around and faced the sea again.

Then Old Barnaby dove. He sank down under the glittering water, so deep that the waves closed over him and he disappeared completely. The crowd went quiet. Rook watched the water. He watched it so hard his eyes stung. And then he saw it. A huge dark shape rising up underneath Cactling's platform, fast, faster...

"Cactling! JUMP!"

Cactling jumped. Old Barnaby burst up out of the sea right where it had been standing, in a tremendous explosion of spray, KRA-BOOOOSH, flipping the platform over like a pancake. Cactling landed on top of the old Brineback's barnacled shell. It blinked. Old Barnaby blinked.

Then Old Barnaby rolled. He bucked and twisted, trying to shake it off, and the barnacles scraped and the water churned white, and Cactling hung on with its stubby fists dug deep into the seaweed and its teeth gritted, getting dunked, coming up, getting dunked again.

On the third time up, it let go with one arm. And threw every needle it had left, straight down, from point-blank range.

Old Barnaby let out a long, rumbling groan, like a ship's horn. He sank back down into the water, slowly. When he came up again, he was floating on his back with his flippers out, breathing hard.

But he wasn't done. And neither was Cactling. Cactling was exhausted, soaked, and out of needles. It slid off the shell onto the bobbing wreck of the platform and sat there with its flower drooping, wheezing, half its needles gone, and it tried to stand up for more, and its legs folded. Rook leaned out and scooped it up in both arms, prickles and seawater and all. He called it back, telling it over and over how amazing it was, and Cactling flowed into the Linker looking extremely smug.

"Plazmet," said Rook. "Your turn. Remember the Spore Pools."

Plazmet blazed out over the water. His fire hissed where it touched the spray. Steam rose all around him. Old Barnaby rolled over and looked at him with that calm, ancient eye, and Rook could tell he was thinking: Fire? Against me? On the open sea?

Old Barnaby swept up another wave.

"Up," said Rook. Plazmet shot up, high over the wave, and it crashed harmlessly underneath him.

Old Barnaby blew another wind.

"Ride it," said Rook. Plazmet turned sideways and let the wind carry him, swooping around in a great arc like a seabird, his comet-tail streaming.

Old Barnaby dove again, down into the deep. Plazmet hovered over the water and waited. The crowd held its breath. Captain Marsh's eyes narrowed.

The sea under Plazmet went smooth. Too smooth. Like glass. And Rook realized, one second too late, that Old Barnaby wasn't coming up for air this time.

"Plazmet, MOVE..."

The water exploded straight up. Not Old Barnaby. A spout. A tower of seawater as thick as a tree trunk, shooting out of the sea like a fountain, FWOOOOSSSHHH, and it hit Plazmet from underneath and swallowed him whole.

For one horrible second there was no fire at all. Just a column of water and a huge, screaming cloud of steam, TSSSSSSSSSSHHHHH, rolling out across the harbor so thick that Rook couldn't see the buoys. The crowd went dead quiet.

Then something fell out of the bottom of the steam cloud.

It was Plazmet. Or what was left of him. His comet-tail was gone. His plasma ring had gone out. He was a tiny, sputtering, coal-red ember, smaller than he had been against Anvilox, smaller than he'd ever been, and he was falling. Straight down. Toward the sea.

"PLAZMET!"

Rook's hand jumped toward the Linker, and stopped halfway. Wait.

The ember caught itself, an arm's length above the waves. It hovered there, flickering. Steam drifted up off it in thin gray wisps. And its one eye, very small now, turned and found Rook across the water.

It wasn't asking to come back. Rook knew that look by now. It was asking, What do we do?

Remember the Spore Pools. He'd said it himself, and then he'd forgotten it the second the battle got exciting. Plazmet didn't need to dodge everything. He needed to wait. And Rook needed to watch.

"Plazmet," he said. Quietly. Barely louder than talking. "Get small. Stay high. Rest. Don't do anything until I say."

Plazmet floated up, slowly, wobbling, until he was a tiny red dot high over the water. And he waited. He didn't throw a single spark. He just hung there, and breathed, and very slowly, little by little, his fire crept back from red to orange.

Rook waited. He waited and watched. Because he had seen something, during the battle with Cactling. Every time Old Barnaby came up from a dive, he had to stop at the surface for just a second. Just one second. To breathe. His great wrinkled head came out of the water, and his mouth opened, and he took a huge gulping breath of air. And in that second, he wasn't making waves. He wasn't making wind. He was just breathing.

Old Barnaby knew it too. That was why he'd used the spout. He'd stayed down so long, making it, that he had to be nearly out of air now.

The water bulged. Rook's heart slammed against his ribs.

Old Barnaby's head broke the surface. His mouth opened. He breathed in.

"NOW!"

Plazmet dropped out of the sky like a falling star. Comet Dash. He flared as he fell, every bit of fire he'd saved up roaring back into him at once, his comet-tail whipping out behind him, his plasma ring sputtering back to life. And Old Barnaby saw him coming. The old Brineback snapped his mouth shut and swept up one last wave, fast, a wall of water rising straight into Plazmet's path...

Plazmet went through it.

Straight through. TSSSSHHH. Rook saw his fire shrink to almost nothing in the middle of the wave, and he screamed Plazmet's name, and then a white-hot point came punching out the other side, still falling, still burning, and struck the old Brineback right on the top of his great barnacled head, in a burst of fire and steam that lit up the whole harbor gold. KA-WHOOOOOSH!

When the steam cleared, Old Barnaby was floating peacefully on his back again. His flippers were spread out wide. His eyes were closed. And he was making a slow, contented, rumbling sound that sounded very much like laughter.

Plazmet came drifting back over the water toward Rook. He was sinking lower and lower, his tail just a wisp, and right before he touched the sea, Rook leaned out over the edge of the platform as far as he could and caught him in both cupped hands. He was barely warm. He was the size of a walnut. But his eye opened, and he sneezed, pfft, one tired little spark, right onto Rook's thumb.

The whole harbor went wild.

Captain Marsh walked across the floating platforms to Rook. She shook his hand with that grip like an anchor, careful not to jostle the little ember cupped in his other one. Then she pressed something into his palm.

It was a Signal Shard. Deep sea-blue, like the tower's crystal had been.

But it was flickering. Faint. Weak. Like a candle at the very end of its wick.

"Every Keeper keeps one piece of their tower's heart," Captain Marsh said quietly. "I chipped this one off the day I became Keeper, forty years ago. I've worn it on a chain around my neck every day since." She closed Rook's fingers over it with her own big rough hand. "It's the only piece of my tower they didn't take. You keep it safe, son. You hear me?"

"I will," said Rook. His voice came out thick. "I promise."

He had his third Signal Shard.

That evening, his Linker rang.

Rook was sitting on the pier with Kit, eating fish pie and watching the rings glow, when his wrist buzzed and a little picture popped up on the screen. A round face with flour on its nose.

"Mom!"

"Hi, sweetheart!" Mom's voice crackled out of the tiny speaker, warm and bright and so familiar that Rook's throat went tight. "Oh, look at you! You're sunburned! Are you wearing your hat? You're not wearing your hat. Rook, wear your hat."

"I'm wearing it, Mom, Zib's sitting on it."

"Bip!" said Zib, waving his lights at the screen.

"Oh, hello, Zib, darling! Oh, I miss you both so much." Behind Mom, in the little picture, Rook could see their kitchen. The stove. The table. And standing by the counter, a tall brass shape with one glowing lamp-eye, holding what appeared to be a toaster.

"HELLO, ROOK," said DX-4. "YOUR MOTHER ASKED ME TO REPAIR THE TOASTER. I HAVE INSTEAD IMPROVED IT. IT NOW HAS ELEVEN SETTINGS."

"It used to have three," said Mom. "I just wanted it to have three."

"SETTING ELEVEN," said DX-4, "IS CALLED 'VOLCANO.' I DO NOT RECOMMEND IT."

Rook laughed so hard he nearly fell off the pier. He told Mom everything. Almost everything. He told her about Nurse Coral and the Forge Gate and Hank and the Dandelion, and Mom cried a little when he told her about Nana Wren's ship, and then cried a lot more when he told her about Plazmet. He told her about Kit and Sporix, and Kit waved shyly at the screen, and Mom said Kit was welcome for pancakes any time, forever. He didn't tell her about the cages. Or Admin Vex. He didn't want her to worry.

Then Mom's face changed. It went soft and a little bit sad.

"Guess who came by today?" she said. "Sola Reyes."

Rook sat up.

"She knocked on the door this morning. She'd come all the way back to Dustmere, just for the day. She was asking all sorts of questions about her dad. Where he used to go. Who he used to talk to. What he was like before he disappeared." Mom paused. "She asked a lot about Dr. Vashti, actually. Whether they were friends. Whether they used to go out to the crater together."

"What did you tell her?"

"The truth. That I didn't really know. That Teo Reyes was a kind man who always had his head in the stars." Mom was quiet for a moment. "She seemed so tired, honey. Tired all the way through. Like she hadn't slept in a week. And so..." Mom searched for the word. "So alone."

Rook looked out at the dark sea. He didn't say anything for a long while.

He thought about the paper boat on the Lantern Marsh with Dad written on its side. He thought about Sola crying behind the paper moon. He thought about the glowing screen with the orange ring and slash in the corner. They said they're closer to finding him than anyone's ever been.

"Mom," he said slowly. "Did she say where she was going next?"

Mom frowned. "She did, actually. It was a bit strange. She said she was going to the Deep Sea Ferry dock, in Port Ember. Tomorrow night." Mom looked out of the screen at him, worried now. "She said somebody was meeting her there."


---

# Chapter 19: Sola's Choice

**Mode: 10 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Tidaloid rose up out of the Linker in a swirl of blue …" through the paragraph ending "… as if it knew how upset she was."

**OLD TEXT (remove exactly this):**

> Tidaloid rose up out of the Linker in a swirl of blue light and unfolded itself on the end of the pier. Tall and graceful, its round dome glowing, its long silky tentacle arms rippling in the evening air. It looked at Rook with its calm, ancient eyes. Then it looked at Sola, and something in its face went worried, as if it knew how upset she was.

**NEW TEXT (paste exactly this):**

Tidaloid rose up out of the Linker in a swirl of blue light and unfolded itself on the end of the pier. Tall and graceful, it floated under its tall, speckled bell like a living lantern of seawater, the dome glowing, its long silky tentacles rippling in the evening air. Its quiet face peeked out from beneath the bell and looked at Rook with calm, ancient eyes. Then it looked at Sola, and something in its face went worried, as if it knew how upset she was.

## Edit 2 of 10
**Type:** REPLACE 4 old paragraph(s) with 4 new paragraph(s)
**Find:** from the paragraph starting "Tidaloid raised one long rippling arm and swung it. It cracked across …" through the paragraph ending "… been, sending up a spray of salt water."

**OLD TEXT (remove exactly this):**

> Tidaloid raised one long rippling arm and swung it. It cracked across the air like a whip made of ocean, fast as lightning.

> Rook didn't shout. He didn't panic. He'd been watching Tidaloid's shoulders, the way it drew its arm back before every swing.

> "Under," he said quietly.

> Plazmet dipped. The Tidal Whip sliced through the air where he'd been, sending up a spray of salt water.

**NEW TEXT (paste exactly this):**

Tidaloid raised one long rippling arm and swung it. It cracked across the air like a whip made of ocean, fast as lightning. KSSHHAK!

Rook didn't shout. He didn't panic. He'd been watching Tidaloid's bell, the way it glowed brighter and drew a tentacle back before every swing.

"Under," he said quietly.

Plazmet dipped. The Tidal Whip sliced through the air where he'd been and smashed down on the pier, WHAM, so hard that a board split down the middle and salt water sprayed up over Rook's sneakers.

## Edit 3 of 10
**Type:** REPLACE 1 old paragraph(s) with 20 new paragraph(s)
**Find:** from the paragraph starting "Sola was breathing hard. "Tidaloid! Tidal Whip! Keep going! Don't stop!"" through the paragraph ending "… hard. "Tidaloid! Tidal Whip! Keep going! Don't stop!""

**OLD TEXT (remove exactly this):**

> Sola was breathing hard. "Tidaloid! Tidal Whip! Keep going! Don't stop!"

**NEW TEXT (paste exactly this):**

"Tidaloid!" Sola's voice was sharp. "Don't swing at him. Grab him!"

Rook didn't see the arm coming. Nobody could have. It came low, out of the steam, from the wrong side, and it wrapped around Plazmet's comet-tail like a rope.

TSSSSSSSSS.

Plazmet screeched. Steam boiled off him in a white rush. He blazed, trying to burn his way loose, and the arm just squeezed tighter, hissing and steaming and not letting go. And then Tidaloid swung him. Up, over its glowing dome, around in a great whistling circle, and down.

Into the sea.

KSSSSHHHHHHHHHHHH.

The water where Plazmet went in exploded into steam. A huge white cloud of it, hissing and roaring, billowing up over the end of the pier so thick that Rook couldn't see his own hands. Under it, the dark sea was bubbling. Boiling. And then it went still.

"PLAZMET!"

Rook was on his knees at the edge of the pier, leaning out over the black water, with no idea when he'd moved. There was nothing down there. No glow. No light. Just dark, flat water and a few last bubbles. His heart was slamming so hard it shook his whole body. His hand found the Linker on his wrist and clamped over it. One press. That was all. One press, and he'd be safe inside, wherever he was..

A bubble rose. And another. And then, like a coal pulled out of a bucket, a tiny, hissing, steaming red spark came bobbing up out of the sea.

Plazmet dragged himself into the air. He barely made it. His comet-tail was gone, nothing but a wisp of smoke. His plasma ring flickered, out, on, out. He was smaller than he had been since the night he evolved, small and dim and dripping, and every little drop of sea that fell off him hissed. He wobbled up to the level of the pier, and stopped there, panting, the way a fire pants when you've almost put it out.

And he looked at Rook.

His eye was tiny. But it was steady. And it wasn't saying take me back. Rook knew it like he knew his own name. It was saying, I'm still here. What do we do?

Rook took his hand off the Linker.

He wanted to yell. He wanted to yell Comet Dash and Get her and Again, again, again. It was right there in his throat. He swallowed it.

Think first.

"Stay out of reach," he said, and his voice was shaking, and he let it. "Don't fight. Just watch her. I'll tell you when."

Plazmet's eye narrowed. And he hung there, small and red and dripping, out at the very edge of Tidaloid's reach, and didn't throw a single spark.

Sola was breathing hard. "Tidaloid! Tidal Whip! Keep going! Don't stop!"

Tidaloid swung. Plazmet slid away from it, slow, barely moving, just far enough. KSSHHAK. Swung again. KSSHHAK. The whips were missing him by a hand's width. Then by a finger's. One clipped the very end of his wispy tail and he spun, and steamed, and nearly went down again, and caught himself.

## Edit 4 of 10
**Type:** REPLACE 2 old paragraph(s) with 3 new paragraph(s)
**Find:** from the paragraph starting "Rook could see it. Its graceful arms were swinging slower. Its dome …" through the paragraph ending "… said softly. "Next time it stops to breathe.""

**OLD TEXT (remove exactly this):**

> Rook could see it. Its graceful arms were swinging slower. Its dome was dimming. Every whip was a little weaker than the last. And between each one, it had to stop. Just for a moment. Its arms would drop, and its bubble heart would pulse, and it would draw in a long, shaky breath, catching it.

> "Plazmet," Rook said softly. "Next time it stops to breathe."

**NEW TEXT (paste exactly this):**

Rook could see it. Its graceful arms were swinging slower. Its dome was dimming. Every whip was a little weaker than the last. The arm that had grabbed Plazmet was red and blistered along one side, from the heat, and Tidaloid kept holding it close. And between each swing, it had to stop. Just for a moment. Its arms would drop, and its bubble heart would pulse, and it would draw in a long, shaky breath, catching it.

But Plazmet was tired too. More tired. Rook could see that just as clearly. His fire had crept back up from red to orange, but no further. He had one Comet Dash left in him. Maybe. If it missed, there wouldn't be another.

"Plazmet," Rook said softly. "Next time it stops to breathe. Go straight through the steam. Don't stop for anything."

## Edit 5 of 10
**Type:** REPLACE 1 old paragraph(s) with 6 new paragraph(s)
**Find:** from the paragraph starting "Plazmet struck. Comet Dash. A streak of gold through the white steam, …" through the paragraph ending "… it hit Tidaloid right on its glowing dome."

**OLD TEXT (remove exactly this):**

> Plazmet struck. Comet Dash. A streak of gold through the white steam, fast and clean and bright, and it hit Tidaloid right on its glowing dome.

**NEW TEXT (paste exactly this):**

Plazmet struck. Comet Dash. He flared, everything he had left roaring out of him at once, his comet-tail snapping back out behind him long and gold. A streak of fire through the white steam, fast and clean and bright...

And Sola saw it. "Tidaloid! UP!"

Tidaloid's arm came up, tired and blistered and fast anyway, and swung, one last whip straight into Plazmet's path. KSSHHAK. It hit him. Rook saw it hit him. Saw the fire shrink, saw the steam burst out in a great white flower...

Plazmet didn't stop.

He went right through the water, hissing, and out the other side, and hit Tidaloid right on its glowing dome. KA-WHOOOM.

The flash lit up the whole end of the pier. Both of them went flying. Tidaloid staggered back across the boards, and Plazmet tumbled away the other way, end over end, a little red spark bouncing off the planks, tok, tok, tok, and rolled to a stop right against the toe of Rook's sneaker.

## Edit 6 of 10
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "The steam drifted away across the dark water." and ends "The steam drifted away across the dark water."

**NEW TEXT (paste exactly this):**

Rook knelt and cupped Plazmet in both hands. He was hot and damp and hissing faintly, and so dim that Rook could see the lines of his own palms through him. But he was there. His eye cracked open. And he sneezed, pfft, a single, soggy spark.

## Edit 7 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "A white Helix shuttle came gliding down out of the dark. Not …" through the paragraph ending "… Painted on its side was the twisting ladder."

**OLD TEXT (remove exactly this):**

> A white Helix shuttle came gliding down out of the dark. Not crashing. Not wobbling. Smoothly, perfectly, like it had done this a hundred times. It touched down on the very end of the pier, right beside them, with a soft hiss. Its lights blinked red and white. Painted on its side was the twisting ladder.

**NEW TEXT (paste exactly this):**

A white Helix shuttle came gliding down out of the dark. It came in low over the water, slow and careful, with its landing lights on, and touched down on the very end of the pier, right beside them, as lightly as a gull settling on a post. Its engines sighed and went quiet. Painted on its side, bright under the dock lanterns, was an orange ring with a diagonal slash through it.

## Edit 8 of 10
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "Rook looked through the door. Inside, there was nobody but the pilot, …" and ends "… Then he looked away, fast, at the floor."

**NEW TEXT (paste exactly this):**

Rook waited for the rest of them. For Pell, tall and straight, with his net launcher. For the clicking of Skitterdrones out of the dark. Nobody came. There was only Strand, and the open door, and the soft white light.

Somehow that was worse. They hadn't sent anybody to fight. They hadn't needed to. Sola was walking in on her own.

## Edit 9 of 10
**Type:** REPLACE 2 old paragraph(s) with 3 new paragraph(s)
**Find:** from the paragraph starting "Sola stopped in the doorway of the shuttle. She looked back." through the paragraph ending "… cap spread over them both. Kit stepped forward."

**OLD TEXT (remove exactly this):**

> Sola stopped in the doorway of the shuttle. She looked back.

> She looked at Rook, standing on the end of the pier, holding the paper boat in one hand and the struggling little saucer in the other. She looked at Kit, standing behind him, with Mycelith's great spotted cap spread over them both. Kit stepped forward.

**NEW TEXT (paste exactly this):**

Inside the shuttle, Strand had half risen out of his seat, one hand reaching for a switch on the panel. Then he saw Zib caught safe in Rook's hands, and he sat back down, slowly, and took his hand away.

Sola stopped in the doorway of the shuttle. She looked back.

She looked at Rook, standing on the end of the pier, holding the paper boat in one hand and the struggling little saucer in the other. She looked at Kit, standing behind him, with Mycelith's great ragged red cap spread over them both. Kit stepped forward.

## Edit 10 of 10
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "The door slid shut." and ends "The door slid shut."

**NEW TEXT (paste exactly this):**

Through the little round window beside it, Rook saw Strand lean over and say something to her, and Sola nod without looking at him. Then Strand turned back to the controls. For one second his eyes came up and found Rook's through the glass, and this time he didn't look away. He gave one small shake of his head. It was so small that Rook couldn't tell if it meant don't follow us, or I'm sorry, or I didn't want this either.


---

# Chapter 20: City of Lights

**Mode: 6 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 6
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Dr. Vashti's mouth fell open. She looked up at Mycelith, tall and …" through the paragraph ending "… way you would bow to someone you remembered."

**OLD TEXT (remove exactly this):**

> Dr. Vashti's mouth fell open. She looked up at Mycelith, tall and calm and spotted. Mycelith looked down at her. Then it gave a slow, gentle bow, its great cap tipping forward, the way you would bow to someone you remembered.

**NEW TEXT (paste exactly this):**

Dr. Vashti's mouth fell open. She looked up at Mycelith, tall and calm on its twisting root legs, under its wide, ragged red cap. Mycelith looked down at her. Then it gave a slow, gentle bow, its great cap tipping forward, the way you would bow to someone you remembered.

## Edit 2 of 6
**Type:** REPLACE 5 old paragraph(s) with 5 new paragraph(s)
**Find:** from the paragraph starting "And from far below, from the street, came screaming. Not scared screaming. …" through the paragraph ending "… they had rubbed their feet on a carpet."

**OLD TEXT (remove exactly this):**

> And from far below, from the street, came screaming. Not scared screaming. Confused screaming. The kind of screaming people do when something very silly is happening very fast.

> Rook ran to the window and looked down.

> In the little park at the bottom of the tower, a white Helix shuttle had crashed straight into the purple fountain. It was sitting there nose-down in the water, with steam hissing out of its engine and water splashing everywhere. Its big cargo door had burst wide open.

> And pouring out of it were bugs.

> Dozens of them. Hundreds of them. Little bug-shaped Alienmon, each one about the size of a mouse, with shiny blue shells and six skittery legs and two long antennae that crackled with sparks. They were streaming out of the shuttle in a great buzzing, crackling, sparking cloud, flying in every direction at once. And they crackled. Their whole bodies crackled with static, little blue zaps of electricity jumping off them like they had rubbed their feet on a carpet.

**NEW TEXT (paste exactly this):**

And from far below, from the street, came shouting. Not scared shouting, not yet. Startled, confused shouting, the kind people do when everything around them stops making sense all at once.

Rook ran to the window and looked down.

In the little park at the bottom of the tower, beside the purple fountain, a white Helix transport was sitting on the grass. It hadn't crashed. It had landed neatly, square in the middle of the park, as if it had every right to be there. On its side was an orange ring with a diagonal slash through it. Its big cargo door was wide open, and a ramp ran down onto the grass, and at the bottom of the ramp sat a stack of metal crates. The top one had burst open from the inside. Its lid was bent straight up, blackened and smoking at the edges.

And pouring out of it were bugs.

Dozens of them. Hundreds of them. Little bug-shaped Alienmon, each one about as big as a loaf of bread, stubby and striped yellow and black, with huge cyan eyes, two crackling antennae, and buzzing wings that seemed to break apart into pixels at the edges. They were streaming out of the broken crates in a great buzzing, crackling, sparking cloud, flying in every direction at once. And they crackled. Their whole bodies crackled with static, little blue zaps of electricity jumping off them like they had rubbed their feet on a carpet, and a fizzy electric haze leaking off them wherever they went.

## Edit 3 of 6
**Type:** REPLACE 8 old paragraph(s) with 8 new paragraph(s)
**Find:** from the paragraph starting ""Glitchbugs," Kit breathed, pressing their face against the glass. "Volt-types. That must …" through the paragraph ending "… circle, flailing. "Get it off! GET IT OFF!""

**OLD TEXT (remove exactly this):**

> "Glitchbugs," Kit breathed, pressing their face against the glass. "Volt-types. That must be a whole Helix cargo hold of them."

> And running around in the middle of it all, chasing the Glitchbugs with butterfly nets, shouting at each other, were two figures in white jumpsuits.

> One tall and thin. One short and round.

> "You left the DOOR open!" Pell was yelling, swinging his net wildly and missing everything.

> "YOU were driving!" Strand yelled back. "You drove into a FOUNTAIN!"

> "The fountain came out of NOWHERE!"

> "It's a FOUNTAIN, Pell! They don't MOVE!"

> A Glitchbug landed on Pell's helmet. His visor started flashing rainbow colors and playing a little tune. He spun around in a circle, flailing. "Get it off! GET IT OFF!"

**NEW TEXT (paste exactly this):**

"Glitchbugs," Kit breathed, pressing their face against the glass. "Volt and Swarm types. They scramble any screen they touch." Kit's voice dropped. "Helix had them packed in crates. That many, squashed in together, scared... their static must have built up until the locks blew."

And moving through the middle of it all, calm and unhurried, were four figures in white jumpsuits.

They weren't chasing anything. They were working. Two of them carried squat white static-net launchers, the same kind Pell had carried in the Sunset Tunnel, and every few seconds one of them raised it and fired. Thoomp. A crackling blue net snapped shut around a cluster of Glitchbugs and dropped them, twitching, onto the wet grass. The other two walked behind, picking up the nets and slinging them up the ramp into the transport like bags of laundry.

"They're hurting them," Kit whispered.

Then one of the grunts touched the side of his helmet, as if he were listening to someone. He raised one hand and drew a circle in the air. All four of them stopped at once. They didn't look at the swarm. They didn't look at the people shouting in the street, or the frozen trains, or the shopkeeper trapped behind his flapping door. They just walked back up the ramp, carrying whatever they had already caught. The ramp folded up. The door slid shut. The transport lifted off the grass, smooth and quiet, turned once over the park, and climbed away between the towers.

It left the rest of the Glitchbugs behind. Hundreds of them. Scared and crackling and loose in the middle of the city.

Rook's hands had curled into fists on the windowsill. "They're just leaving them."

Behind them, Dr. Vashti had come to the window too. She watched the transport until it was gone, and her face was very hard. "They took what they needed," she said quietly. "Whatever's left over is somebody else's problem."

## Edit 4 of 6
**Type:** REPLACE 1 old paragraph(s) with 6 new paragraph(s)
**Find:** from the paragraph starting "They tried everything. Plazmet chased them, but they were too quick, and …" through the paragraph ending "… cap stood up on end like Rook's hair."

**OLD TEXT (remove exactly this):**

> They tried everything. Plazmet chased them, but they were too quick, and every time he got close, they zapped him and his flame flickered blue. Cactling threw needles, but it felt bad about it and kept missing on purpose. Mycelith spread its vines out wide like a net and caught dozens of them at once, which worked beautifully, until they all zapped it at the same time and its whole cap stood up on end like Rook's hair.

**NEW TEXT (paste exactly this):**

One Glitchbug was a joke. A hundred Glitchbugs, all scared and all crackling at once, were not.

They tried everything. Plazmet chased them, but they were too quick, and every time he got close, they zapped him and his flame flickered blue. Then a whole cloud of them turned on him at once. ZZZZZRAKK! It was like flying into a thunderstorm. A web of blue lightning wrapped around him, and his flame went from gold to blue to a sputtering gray, and he dropped out of the air and hit the wet pavement with a fssst, rolling, smoking, his plasma ring wobbling crooked.

"Plazmet!" Rook skidded down beside him. His heart was going like a drum. Plazmet shook himself, hard, and a shower of blue sparks flew off him. He sneezed. A tiny puff of fire, very indignant. Then he floated back up, a little lopsided, and glared at the swarm.

"Okay," Rook breathed. "Okay. Careful. They're scared, not mean."

Cactling threw needles, but it felt bad about it and kept missing on purpose. Mycelith spread its long, rope-like fibers out wide like a net and caught dozens of them at once, which worked beautifully, until they all zapped it at the same time. KRZZZT! Mycelith's whole body went rigid. Its fibers jerked. It sank down onto one knee on the pavement, steaming gently in the rain, while Kit yelled its name, and its whole cap stood up on end like Rook's hair.

The swarm was getting bigger. Every light in the park was flashing. Every one of them was a little angrier than the last.

## Edit 5 of 6
**Type:** REPLACE 3 old paragraph(s) with 3 new paragraph(s)
**Find:** from the paragraph starting "Rook let out Lumislug. It slid out onto the wet pavement and …" through the paragraph ending "… like a slug wearing a sparkly blue coat."

**OLD TEXT (remove exactly this):**

> Rook let out Lumislug. It slid out onto the wet pavement and blinked around at the chaos. Then, when Rook asked it to, it turned its glow all the way up. Brighter than it had ever glowed. Bright as a little blue moon.

> Every Glitchbug in the park stopped.

> Their antennae swiveled. Their little shiny eyes went wide. And one by one, then ten by ten, then all at once, they came floating out of the streetlights and the signs and the hot dog stand, and drifted toward Lumislug's glow like moths to a porch light. They landed all over it, all over its back and its eye-stalks, crackling happily, until Lumislug looked like a slug wearing a sparkly blue coat.

**NEW TEXT (paste exactly this):**

Rook let out Lumislug. It slid out onto the wet pavement and blinked around at the chaos. Then, when Rook asked it to, it turned its glow all the way up. Brighter than it had ever glowed. Bright as a little lime-green moon, its dark spots blazing.

Every Glitchbug in the park stopped.

Their antennae swiveled. Their huge cyan eyes went even wider. And one by one, then ten by ten, then all at once, they came floating out of the streetlights and the signs and the hot dog stand, and drifted toward Lumislug's glow like moths to a porch light. They landed all over it, all over its back and its eye-stalks, crackling happily, until Lumislug looked like a slug wearing a sparkly yellow-and-black coat.

## Edit 6 of 6
**Type:** REPLACE 11 old paragraph(s) with 17 new paragraph(s)
**Find:** from the paragraph starting "And as they went, they passed Strand." through the paragraph ending "And he ran."

**OLD TEXT (remove exactly this):**

> And as they went, they passed Strand.

> He was sitting on the edge of the broken fountain with his net across his knees, soaking wet, watching the Glitchbugs drift toward Lumislug's glow. Pell was nowhere to be seen. Rook stopped.

> Strand looked up. He went pale. He looked left and right, as if he wanted to run.

> "Where is she?" Rook said quietly. "Where's Sola?"

> Strand looked at the ground for a long time.

> "She's safe," he said finally. His voice was very small. "She's at the Station. They gave her a room with a big window. She's... she's safe." He swallowed. "For now."

> "What does that mean? 'For now'?"

> "STRAND!" Pell's voice came echoing from somewhere across the park. "Strand, I found the SPARE NET! Where ARE you?"

> Strand jumped up. He looked at Rook, and his worried, round face looked even more worried than usual.

> "I'm sorry," he whispered. "I'm sorry. I can't."

> And he ran.

**NEW TEXT (paste exactly this):**

And as they went, somebody fell into step behind them.

Rook didn't notice at first. Then Zib's lights flicked to a sharp, warning red, and Rook turned around.

A man was standing at the mouth of an alley, a few steps back, out of the bright lights. He wasn't wearing a white jumpsuit. He was wearing a plain gray rain jacket with the hood up, like half the people in Neonis. But Rook knew the round cheeks under that hood. He knew those worried eyes.

"Strand," he said.

Kit stepped in front of Lumislug. Plazmet's flame flared up bright and hot, and the shiny rain hissed where it touched him.

Strand didn't reach for anything. He held his hands a little way out from his sides, open and empty, the way you would with a frightened animal. "I'm not here for him," he said. He didn't look at Zib. He seemed to be trying very hard not to. "I'm not here for anything. I saw your ship come in. I just..." He stopped. He looked past them, at the Glitchbugs riding on Lumislug's back. "I told them the crates were too full," he said, very quietly. "Nobody listens to Second Class."

"Where is she?" Rook said. "Where's Sola?"

Strand looked at the ground for a long time.

"She's safe," he said finally. His voice was very low. "She's at the Station. They gave her a room with a big window. She's... she's safe." He swallowed. "For now."

"What does that mean? 'For now'?"

Strand opened his mouth. And on his wrist, under the gray sleeve, a Linker buzzed.

He glanced down at it. Rook caught a flash of orange on the little screen, the ring and the slash, and a name underneath. PELL.

Strand turned his wrist so the screen faced his arm. It stopped buzzing. Then, at once, it started again, and this time a voice came out of it, small and flat and perfectly calm.

"Strand. North pad. Four minutes." A pause. "Whatever you're doing, finish it."

Strand looked at Rook. His worried, round face looked even more worried than usual. It looked older, too.

"I'm sorry," he whispered. "I'm sorry. I can't."

And he turned and walked back into the alley, fast, with his head down, and the glittering rain closed behind him like a curtain.


---

# Chapter 21: Pirate Radio

**Mode: 1 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 1
**Type:** REPLACE 2 old paragraph(s) with 9 new paragraph(s)
**Find:** from the paragraph starting "Rook and Plazmet guarded. Because Static was right. Helix drones came. Little …" through the paragraph ending "… stood straight and tall all on its own."

**OLD TEXT (remove exactly this):**

> Rook and Plazmet guarded. Because Static was right. Helix drones came. Little white flying machines, round and buzzing, with one red eye and a long zapping arm. They came swooping out of the dark in twos and threes, heading straight for whatever dish Kit was fixing. And every time, Plazmet was waiting. He blazed up out of the shadows in a burst of fire and Comet-Dashed them right out of the sky. ZZZZAP-FWOOOM! The drones went spinning off into the night, sparking and smoking, and crashed harmlessly into the street below.

> Mycelith held things steady. On the twelfth rooftop, an enormous antenna, tall as a tree, cracked at the base and started to fall. Toward the street, toward the floating trains, toward the people below. Mycelith stepped forward, wrapped its long vine arms around the antenna, and held it. Held it upright, steady and calm, its roots gripping the rooftop, while Kit welded the base back together. When Kit was done, Mycelith let go, very slowly, and the antenna stood straight and tall all on its own.

**NEW TEXT (paste exactly this):**

Rook and Plazmet guarded. Because Static was right. Helix drones came. Little white flying machines, round and humming, with one red eye and a long zapping arm, and an orange ring and slash stamped on every shell. They didn't buzz around like bugs. They came out of the dark in twos and threes, in straight, careful lines, always from the side Rook wasn't watching, always heading for whatever dish Kit was fixing. Somebody, somewhere, was steering them. Somebody who could see exactly where the kids were.

On the ninth rooftop, three of them came at once, and while Plazmet blocked two, the third got behind him. KZZZAKK! A red bolt hit him square. His flame went blue and ragged, and he spun down onto the wet rooftop and skidded, hissing, through a puddle. TSSSSSS.

"PLAZMET!" Rook's stomach dropped through his sneakers.

Plazmet looked up at him through the steam. Not asking to go back. Asking, Which one?

Think first. The drones had to stop and hover, just for a heartbeat, to aim. "Stay down," Rook said, his voice shaking. "Wait till they stop. Then go."

The drones drifted in. Slowed. Stopped. "NOW!"

Plazmet blazed up out of the puddle and Comet-Dashed them right out of the sky. ZZZZAP-FWOOOM! KRUNCH! The drones went spinning off into the night, sparking and smoking, and dropped, dark and smoking, onto the gravel of the rooftop.

Plazmet sank onto Rook's shoulder, panting little puffs of steam, and sneezed. Rook cupped his hands around him to keep the rain off until he burned gold again. After that, every time the drones came, Plazmet waited for them to stop and aim. And every time, they went down. But more kept coming. Whoever was steering them had plenty to spare.

Mycelith held things steady. On the twelfth rooftop, an enormous antenna, tall as a tree, cracked at the base and started to fall. Toward the street, toward the floating trains, toward the people below. Mycelith stepped forward, wrapped its long, rope-like arms around the antenna, and held it. Held it upright, steady and calm, its roots gripping the rooftop, while Kit welded the base back together. When Kit was done, Mycelith let go, very slowly, and the antenna stood straight and tall all on its own.


---

# Chapter 22: Static on the Line

**Mode: 10 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 10
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "That was the only way to describe it. It came stomping out …" and ends "… and two small glowing green lights for eyes."

**NEW TEXT (paste exactly this):**

Every step it took made the stage jump. THOOM. THOOM. Rook felt it come up through his feet and into his knees.

## Edit 2 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting ""No kidding," Rook muttered." through the paragraph ending ""No kidding," Rook muttered."

**OLD TEXT (remove exactly this):**

> "No kidding," Rook muttered.

**NEW TEXT (paste exactly this):**

"No kidding," Rook muttered. His mouth had gone dry.

## Edit 3 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It wasn't just a sound. It was a wave. A shockwave. Rook …" through the paragraph ending "… and crashed into the edge of the arena."

**OLD TEXT (remove exactly this):**

> It wasn't just a sound. It was a wave. A shockwave. Rook saw it ripple out through the air, like a ripple on a pond, and it hit Plazmet head-on and knocked him clean across the stage. He went tumbling end over end, his flame flickering, and crashed into the edge of the arena.

**NEW TEXT (paste exactly this):**

It wasn't just a sound. It was a wave. A shockwave. Rook saw it ripple out through the air, like a ripple on a pond, bending the laser beams, bending the rain, and it hit Plazmet head-on and knocked him clean across the stage. He went tumbling end over end, his flame flattening sideways like a candle in a gale, and crashed into the edge of the arena with a CLANG that dented the metal rail.

## Edit 4 of 10
**Type:** REPLACE 1 old paragraph(s) with 4 new paragraph(s)
**Find:** from the paragraph starting "Three shockwaves, one after another. Each one made Rook's ears ring. Each …" through the paragraph ending "… and sent him spinning across the stage again."

**OLD TEXT (remove exactly this):**

> Three shockwaves, one after another. Each one made Rook's ears ring. Each one made his teeth rattle and his eyeballs feel wobbly. Plazmet dodged the first one. The second one clipped his tail. The third one hit him dead-on and sent him spinning across the stage again.

**NEW TEXT (paste exactly this):**

Three shockwaves, one after another. Each one made Rook's ears ring. Each one made his teeth rattle and his eyeballs feel wobbly, and he was standing all the way back at the edge of the stage. Plazmet dodged the first one. The second one clipped his tail and spun him like a top. The third one hit him dead-on.

WHAMMM.

It folded his whole flame in half. It drove him down into the stage so hard that the glowing floor tiles cracked in a star around him, and the lights under them sputtered out. For a second, all Rook could see was smoke.

Then Plazmet floated up out of it. Slowly. His plasma ring was wobbling. His comet-tail had shrunk to a stub.

## Edit 5 of 10
**Type:** REPLACE 4 old paragraph(s) with 14 new paragraph(s)
**Find:** from the paragraph starting "In the third row, a big man with a beard caught Glitchbug …" through the paragraph ending "… its speaker cones pulsing, its dial ticking, waiting."

**OLD TEXT (remove exactly this):**

> In the third row, a big man with a beard caught Glitchbug in both hands, looked down at it in surprise, and then passed it to the lady next to him. She passed it to a kid. The kid passed it to his grandma. The grandma passed it forward. And Glitchbug went traveling back down through the crowd, hand over hand over hand, crackling happily the whole way and zapping everybody who touched it, until finally the man in the front row reached over the barrier and handed it back to Rook.

> "Nice bug!" the man shouted, his hair standing straight up.

> Glitchbug zapped Rook's cap. It seemed to be having the time of its life.

> Plazmet came back to Rook's side, his flame low. Glitchbug crackled on his shoulder. Across the stage, the Boombastadon stood calm and huge, its speaker cones pulsing, its dial ticking, waiting.

**NEW TEXT (paste exactly this):**

In the third row, a big man with a beard caught Glitchbug in both hands, looked down at it in surprise, and then passed it to the lady next to him. She passed it to a kid. The kid passed it to his grandma. The grandma passed it forward. And Glitchbug went traveling back down through the crowd, hand over hand over hand, crackling dizzily the whole way and zapping everybody who touched it, until finally the man in the front row reached over the barrier and handed it back to Rook.

"Nice bug!" the man shouted, his hair standing straight up.

Glitchbug wobbled. Its crooked antenna was bent even more crooked now. But it zapped Rook's cap anyway, a little weaker than usual. It seemed to be having the time of its life.

Plazmet came back to Rook's side, his flame low. Glitchbug crackled on his shoulder. Across the stage, the Boombastadon stood calm and huge, its speaker cones pulsing, its dial ticking, waiting.

Then it stamped one huge foot and let out the biggest boom yet.

BA-DOOOOOOM.

Rook didn't even see it coming. One second Plazmet was beside him. The next, the wave had scooped Plazmet up and thrown him the whole length of the stage, and he hit the rail and dropped and lay there on the cracked tiles. His fire had shrunk to almost nothing. A small orange glow, flickering, flickering, like a match in the wind. The giant screens showed it in close-up, for all fourteen worlds to see.

The crowd went quiet.

"Plazmet!" Rook's voice cracked right down the middle. He ran. He slid onto his knees beside him. Plazmet was so small. Smaller than he'd been since he was Plazmo. His plasma ring had stopped spinning altogether.

Once, Rook's hand would have gone straight to the Linker. Not anymore. He just knelt there on the cracked floor with his hands on either side of that little flame, and he waited for Plazmet to tell him.

Plazmet opened his eye.

He looked right up at Rook. And then, very slowly, he pushed himself up off the floor, wobbling, and turned around, and faced the Boombastadon. His tiny flame stood up straight. And his plasma ring gave one stubborn little spin.

Not yet, that spin said. Not yet.

Rook stood up.

## Edit 6 of 10
**Type:** INSERT new paragraph(s)
**Where:** directly AFTER the paragraph that starts "He thought about the rooftops. About last night. About Kit fixing and …" and ends "… together, they had done it in one night."

**NEW TEXT (paste exactly this):**

And he thought about the Boombastadon itself. How before every big boom, its dial swung right. How its two little green eyes watched everything. How all its speakers had to pulse together, in time, to make a shockwave. Like a band that had to play the same note at once.

## Edit 7 of 10
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Cactling stomped out onto the stage, cracking its stubby knuckles. Lumislug slid …" through the paragraph ending "… his cap, Zib flashed every color at once."

**OLD TEXT (remove exactly this):**

> Cactling stomped out onto the stage, cracking its stubby knuckles. Lumislug slid out beside it, blinking calmly. Glitchbug crackled on his shoulder. Plazmet blazed up beside him. And on his cap, Zib flashed every color at once.

**NEW TEXT (paste exactly this):**

Cactling stomped out onto the stage, cracking its stubby knuckles. Lumislug slid out beside it, blinking calmly. Glitchbug crackled on his shoulder. Plazmet floated up beside him, small and dim and absolutely refusing to sit down. And on his cap, Zib flashed every color at once.

## Edit 8 of 10
**Type:** REPLACE 4 old paragraph(s) with 8 new paragraph(s)
**Find:** from the paragraph starting "Lumislug glowed. It glowed and glowed and glowed. It glowed brighter than …" through the paragraph ending "… there. The dial jammed. The needle couldn't swing."

**OLD TEXT (remove exactly this):**

> Lumislug glowed. It glowed and glowed and glowed. It glowed brighter than it had in the Mushroom Maze, brighter than in the streets of Neonis. It glowed until it was too bright to look at, a blazing blue-white star in the middle of the stage, so bright that the strobes and the lasers looked dim beside it.

> The Boombastadon's two little green eyes squeezed shut. It shook its huge head. It couldn't see.

> "Cactling! The dial!"

> Cactling wound up and threw. A single needle, straight and true, whistling across the stage. It hit the Boombastadon's big round dial right in the middle, right where the needle pivoted, and stuck there. The dial jammed. The needle couldn't swing.

**NEW TEXT (paste exactly this):**

Lumislug glowed. It glowed and glowed and glowed. It glowed brighter than it had in the Mushroom Maze, brighter than in the streets of Neonis. It glowed until it was too bright to look at, a blazing lime-green star in the middle of the stage, so bright that the strobes and the lasers looked dim beside it.

The Boombastadon's two little green eyes squeezed shut. It shook its huge head. It couldn't see.

So it fired at the light.

BOOM. The wave hit Lumislug and shoved it backward across the stage, squeaking along the tiles, leaving a long glowing smear behind it. Its eye-stalks flattened. Its glow shuddered, dimmed... and came right back up. Lumislug dug in and held on and kept glowing, slow and steady and stubborn, right in the Boombastadon's face.

"Hold on, Lumislug!" Rook yelled. "Cactling! The dial!"

The dial was already swinging right. Rook could see it. The next boom was coming.

Cactling wound up and threw. A single needle, straight and true, whistling across the stage. It hit the Boombastadon's big round dial right in the middle, right where the needle pivoted, and stuck there. The dial jammed. The needle couldn't swing.

But the boom had already started. BWOMM. Half a shockwave burst out and caught Cactling square, and it went bowling backward across the stage, needles snapping, and fetched up against Rook's shins in a grumpy, prickly heap. Its flower was squashed flat. It sat up anyway, and glared over at the Boombastadon as if to say, That's all?

## Edit 9 of 10
**Type:** REPLACE 8 old paragraph(s) with 20 new paragraph(s)
**Find:** from the paragraph starting "Glitchbug shot off Rook's shoulder like a rocket. It zipped straight between …" through the paragraph ending "… in the middle of its big black speaker-chest."

**OLD TEXT (remove exactly this):**

> Glitchbug shot off Rook's shoulder like a rocket. It zipped straight between the Boombastadon's stumpy legs, found the thick bundle of glowing wires on its underside, and zapped them. ZZZZZZT!

> The Boombastadon's beat skipped.

> It actually skipped. The music coming out of its speakers stuttered and jumped and hiccupped. Boom-boom-b-b-b-boom. Bm. Boom-ba-ba-boom. It sounded like a record scratching. The Boombastadon shook its head in confusion. It stomped. Its speakers were all pulsing at different times now, all mixed up, all out of rhythm. It couldn't line them up for a shockwave. It couldn't see. It couldn't turn itself up. It stood in the middle of the stage, blinking its squeezed-shut eyes, totally confused.

> And while it was all mixed up, Rook said, very quietly:

> "Plazmet. Now."

> Plazmet coiled back. His plasma ring spun faster and faster, humming higher and higher. And then he streaked across the stage in a blazing line of gold and white fire.

> Comet Dash.

> He hit the Boombastadon right in the middle of its big black speaker-chest.

**NEW TEXT (paste exactly this):**

Glitchbug shot off Rook's shoulder like a rocket. It zipped straight between the Boombastadon's stumpy legs. One huge foot came down, THOOM, right where it had been, and the tile under it shattered. Glitchbug jinked left. Another foot. THOOM. Glitchbug jinked right. And then it was underneath, and it found the thick bundle of glowing wires on the Boombastadon's underside, and zapped them with everything it had. ZZZZZZZZZT!

The Boombastadon's beat skipped.

It actually skipped. The music coming out of its speakers stuttered and jumped and hiccupped. Boom-boom-b-b-b-boom. Bm. Boom-ba-ba-boom. It sounded like a record scratching. The Boombastadon shook its head in confusion. It stomped. Its speakers were all pulsing at different times now, all mixed up, all out of rhythm. It couldn't see. It couldn't turn itself up.

But it wasn't beaten. Not yet.

Its speaker cones shuddered. They pulled in. They pulled in further, every single one, straining, trying to find each other, trying to get back in time. Boom... ba-boom... BOOM... BOOM... Rook's stomach went cold. It was finding the beat again. One more shockwave like the last one, and nobody on this stage would be getting up.

And Plazmet was the only one left who could reach it. Plazmet, who was the size of a teacup.

Rook listened. Really listened, the way Dr. Vashti listened to her green wavy line. Boom... ba-boom... BOOM... And there it was. Every time the beat came around, it stumbled, just once, in the same place. A hiccup. A gap. One tiny heartbeat where every speaker on that giant body was empty, and nothing at all was coming out.

"Plazmet," Rook said, very quietly. His heart was slamming so hard he could hear it over the crowd. "Not on the beat. On the gap. You'll only get one try. Wait for it."

Plazmet coiled back. His plasma ring spun faster and faster, humming higher and higher, the way it hadn't been able to all night. He drew in every last scrap of fire he had. He went from orange to gold to white.

Boom... ba-boom... BOOM...

The Boombastadon's cones pulled all the way in. All of them. Together. The big one was coming.

"Wait for it..."

...BOOM... ba...

"NOW!"

Plazmet streaked across the stage in a blazing line of gold and white fire.

Comet Dash.

He went into the gap like a key into a lock. The boom came a split second behind him. It caught the very end of his tail and tore it to sparks, and his flame went thin as a thread, and for one horrible second Rook couldn't see him at all.

Then he hit the Boombastadon right in the middle of its big black speaker-chest.

KA-WHAMMMM.

Fire burst across every speaker cone at once. The whole stage jumped. The Boombastadon rocked back on its stumpy legs, and its chrome tusks scraped sparks off the floor.

## Edit 10 of 10
**Type:** REPLACE 3 old paragraph(s) with 6 new paragraph(s)
**Find:** from the paragraph starting "Then the crowd went WILD." through the paragraph ending "… looked at Rook with tired, bright, grinning eyes."

**OLD TEXT (remove exactly this):**

> Then the crowd went WILD.

> They screamed. They stamped. They jumped up and down so hard that the whole tower actually did sway, just a little. Glowsticks flew through the air. Fireworks burst overhead in great showers of gold and green. The giant screens showed Rook's face, enormous, with his hair sticking straight up and his mouth hanging open. In the front row, the man with the beard was crying.

> DJ Static walked slowly across the stage. Static knelt down beside the Boombastadon and patted it on its big chrome tusk. Then Static stood up, and pulled off those sparkly sunglasses, and looked at Rook with tired, bright, grinning eyes.

**NEW TEXT (paste exactly this):**

Then a tiny spark drifted down out of the smoke, sinking lower and lower, and Rook dove across the cracked tiles and caught it in both hands.

Plazmet was barely there. A warm flicker in Rook's palms, so faint he could see his own fingers through it. But his eye opened a crack and looked up at Rook. And Plazmet sneezed. Pfft. One tiny, proud spark.

Rook laughed, and it came out wet. Cactling limped over and leaned against his knee. Lumislug slid up on his other side, its glow turned down soft and tired. Glitchbug landed on his shoulder and, very gently for once, didn't zap anybody. And on his cap, Zib flashed gold.

Then the crowd went WILD.

They screamed. They stamped. They jumped up and down so hard that the whole tower actually did sway, just a little. Glowsticks flew through the air. Fireworks burst overhead in great showers of gold and green. The giant screens showed Rook's face, enormous, with his hair sticking straight up and his mouth hanging open and Plazmet cupped against his chest. In the front row, the man with the beard was crying.

DJ Static walked slowly across the stage. Static knelt down beside the Boombastadon and patted it on its big chrome tusk, and the Boombastadon let out a low, tired hum, like a fridge settling down for the night. Then Static stood up, and pulled off those sparkly sunglasses, and looked at Rook with tired, bright, grinning eyes.


---

# Chapter 24: Temple of Voices

**Mode: REPLACE THE WHOLE CHAPTER TEXT.** More than half of this chapter changed (2,688 of 4,657 words), so replacing it whole is simpler and safer than 13 separate edits. Select everything in this chapter (keep the chapter title), delete it, and paste the NEW CHAPTER TEXT below. Then assign voices and generate the whole chapter.

## NEW CHAPTER TEXT

The great dark doorway of the Temple of Voices didn't swing open. It didn't slide. It didn't creak.

It sank.

The huge slab of stone that had blocked it for a thousand years slowly lowered itself down into the floor with a deep, grinding rumble, like a giant clearing its throat. Dust poured off it in clouds. Little stones skittered and bounced down the steps. And when it had sunk all the way down, so that its top was level with the ground, there was a dark, open doorway, and a long stone hallway beyond it, going down into shadow.

"Enter," said Liss's chiming voice, from the crystal in the wall. "And be brave. The temple will test you."

At the bottom of the steps, Tamsin let out a whoop so loud that every archaeologist in the camp jumped. "FORTY YEARS!" she yelled. "FORTY YEARS I've been waiting to see the inside of this thing!" She came charging up the steps two at a time, faster than Rook would have believed an old woman could move, her feather bouncing, her vest flapping, her walking stick clacking on the stone.

She stopped beside them at the top, puffing. She looked into the dark doorway. She looked at Rook.

"Well?" she said. "What are we waiting for?"

The Temple of Voices was a maze.

Not a maze of mushroom stalks, like the one on Sporeholm. A maze of stone. Long, tall, echoing hallways, with walls that went up so high that Rook couldn't see the ceiling. Narrow corridors that twisted and turned. Staircases that went up, and then down, and then up again. Secret doors that slid open in walls that looked completely solid, and then slid shut again behind them.

And it echoed.

Every footstep. Every breath. Every word. It bounced off the stone walls and came back, again and again and again, softer and softer, until it faded away. When Kit sneezed, the sneeze came back nine times. When Plazmet's flame crackled, the crackle came back from every direction at once, like a crowd of tiny fires all whispering.

"It's called the Temple of Voices," Tamsin whispered. Her voice whispered back. Voices... voices... voices. "Now I know why."

Lumislug led the way, glowing its gentle lime green. Plazmet floated beside it, lighting up the walls. And everywhere the light fell, there were carvings. Swirls and loops, and gold lines that caught the light and glowed. Every so often, they passed another small crystal set into the wall, just like the one by the front door. And every time Zib floated past one, it lit up, soft and white, and Liss's voice spoke from it.

"Left," it would say. Or "Down the stairs." Or "Not that way, little ones. That way is only a very long fall."

Rook was very glad of Liss.

They went deeper and deeper into the temple. Down and down and down. The air got cooler. The echoes got softer. And then the hallway opened up, all at once, into a vast round room.

Rook stopped. Everyone stopped.

It was the biggest room he had ever been in. Bigger than the arena at the top of the Voltspire. Bigger than Hank's tower. Its walls were made of pale, smooth stone, curving up and up into a great dome high above. And set into the walls, all the way around, were mirrors. Dozens and dozens of round mirrors, made of polished silver, each one in a carved stone frame, each one tilted at a slightly different angle.

Far, far above, in the very top of the dome, was a single small hole. And through it came one thin, perfect beam of sunlight. It shone straight down, through the dusty air, like a golden string, and landed on the floor in a bright little circle in the very middle of the room.

On the far side of the room was a door. A huge, round, stone door, taller than three houses. In the very center of it was set a large crystal, clear and dark.

And standing in front of the door, side by side, were three standing stones.

At first, Rook thought they were statues.

They were small. No taller than Rook's chest. Each one was a single slab of carved brown stone, standing upright on the floor, its edges worn smooth by a thousand years. They had no arms. No legs. No mouths. No noses. No ears. But around each one, three small pebbles hung perfectly still in the air, each on its own thin ring of pink light, like tiny moons that had forgotten how to move.

And down the middle of each smooth stone face ran one long, jagged crack. All three cracks were dark.

Rook took one step into the room.

The three cracks lit up.

They glowed. A deep, burning violet, like the sky just after sunset. The pebbles around them began to move, sliding along their pink rings, faster and faster, circling and circling. And with a deep, grinding, rumbling sound, like mountains turning over in their sleep, the three standing stones turned on the spot, all together, and faced him.

Rook's Linker beeped. MONOLET. GRAVITY/PSI-TYPE. 140 KILOGRAMS EACH. ANCIENT GUARDIAN.

"Oh," said Kit, in a very small voice.

The Monolets spoke. All three together. Their voices weren't voices. They weren't even sounds. They were rumbles, deep and slow, that didn't come through the air at all. They landed right inside Rook's head, so deep that he felt them behind his eyes. And they echoed in there, again and again and again.

"ONLY... THE WORTHY... MAY PASS."

Pass... pass... pass...

The three Monolets shuffled forward into a perfectly straight row, edge to edge, neat as soldiers. The floor shook. THOOM. Their pebbles whirled faster and faster, humming on their rings of pink light.

Rook swallowed. He looked at the Monolets. He looked at the huge round door behind them, with the dark crystal in its middle. He looked at the mirrors on the walls, and the thin beam of sunlight shining down on the floor.

Think first.

The Monolets were guarding the door. But the door was closed. It didn't matter if he beat them. Even if all three of them fell down, the door would still be closed. So beating them wasn't the point. The point was the door.

And the door had a crystal in it. And the crystal was dark.

And there was a beam of light shining down from the roof. And mirrors all around the walls.

Rook turned to Kit. Kit was already staring at the mirrors. Their goggles were pulled down. Their lips were moving silently, as if they were counting. Rook knew that look. It was the same look Kit had in the Mushroom Maze when they found the cable. The same look Kit had under the console on the Forge Gate.

"Kit," said Rook. "Can you figure out the door?"

"It's a light puzzle," Kit said, without looking at him. Their voice was fast and excited. "See? The beam comes down from the hole in the roof. It hits the floor. But if you put a mirror in the right place, you could bounce it. And then bounce it again. And again. All the way around the room, from mirror to mirror to mirror." Kit pointed at the round door. "Until it hits that crystal. That's the lock. The light is the key."

"Can you do it?"

Kit looked at all the mirrors. Dozens and dozens of them, all at different angles. Their face went a bit pale.

"I... I think so," Kit said. "But it'll take time. And I'll have to get to every mirror. And they're..." Kit's eyes went to the three standing stones. "They're kind of in the way."

"Then I'll handle the Monolets," said Rook. He grinned at Kit. Kit grinned back, a shaky, nervous, excited grin. "You figure out the doors."

"And I," said Tamsin, rolling up her sleeves, "will help the genius."

The Monolets came shuffling forward in their neat straight row. THOOM. THOOM. THOOM.

Every shuffle shook the floor. Little chips of stone jumped and rattled on the tiles. Up in the dome, the mirrors trembled in their frames, and the thin golden beam of sunlight shivered like a plucked string.

Rook sent out everybody. Plazmet blazed out in front, his comet-tail streaming. Cactling stomped out beside him, cracking its knuckles. Lumislug slid forward, glowing. Glitchbug crackled on Rook's shoulder.

"Okay, team," Rook said. "Here's the thing. We are NOT trying to beat them."

Plazmet's eye swiveled toward him in surprise.

"They're guardians," Rook said. "They've been standing here for a thousand years, guarding this door. They're not bad guys. They're just doing their job." He took a deep breath. "So we're not going to hurt them. We're just going to keep them busy. Keep them looking at us. Keep them away from Kit. That's it."

Cactling gave him a long, flat look, as if to say, You want me to do WHAT?

The first Monolet's three pebbles stopped circling. They hung in the air for one heartbeat. Then they flew.

"Dodge!"

Plazmet and Cactling dodged. The pebbles hit the floor where they had been standing with a KRAKOOOM that made the whole room shake. They were only little stones. But they hit like falling boulders. The tiles split in a star of cracks. Dust rained down from the dome. A chunk of stone the size of Rook's head bounced past his boots, and he felt the wind of it. Then the pebbles leapt up off the floor and zipped back onto their pink rings, circling as if nothing had happened.

Those pebbles had missed Cactling by about the width of a needle.

The second Monolet's crack flared violet, and all at once the air around Rook went heavy, so heavy his knees buckled and his satchel dragged at his shoulder like a sack of bricks. The third one sent all three of its pebbles skimming across the floor in a line, low and fast and heavy as a falling wall.

"Jump!"

Cactling jumped. The pebbles whooshed underneath it so close they shaved the tips off two of its needles. Lumislug... did not jump, because it was a slug, but it was very low to the ground, and the pebbles skimmed right over the top of it with a sound like a passing train. Lumislug blinked, and kept glowing.

Rook let out a breath he hadn't known he was holding. His hands were already shaking.

And behind them, Kit ran to the first mirror.

It was the hardest thing Rook had ever done.

Not because the Monolets were strong, though they were. Not because they were big, though they were huge. It was hard because every bit of him wanted to fight back. Every time a stone came screaming in, he wanted to shout Spark Burst! Comet Dash! Needle Spray! He wanted to hit back. Hard.

But he didn't.

"Dodge. Dodge. Plazmet, swing around the left one, make it turn. Good! Cactling, run past the middle one. Make it chase you. Lumislug, glow brighter, make them look at you."

Then the Monolets stopped throwing wildly. All three of their violet cracks flared together, slow and cold, and Rook felt his stomach drop. They weren't just smashing anymore. They were learning.

The middle one shuffled left. The left one shuffled right. And Cactling, running flat out between them, looked up and saw stone closing in on both sides.

"Cactling, OUT of there!"

Too late. The left Monolet's crack blazed, and the air beside Cactling went heavy and hard, like a giant invisible hand coming down flat to swat a fly. It caught Cactling side-on.

WHUMP.

Cactling flew. It skidded across the floor, needles screeching on the stone, and slammed into the base of a pillar with a CRACK that echoed nine times around the dome. It lay there in the dust. The creamy flower in the middle of its body was bent right over.

"Cactling!"

Cactling's arm twitched. It rolled over, slowly, and got one stubby arm under itself, and pushed. It wobbled up onto its feet. It turned around and glared at the Monolet with one squinted, furious eye, and Rook knew exactly what that glare meant. It meant, Let me hit it. Just once. Please.

"No," Rook said. His voice cracked. "No needles. I know. I know. Just keep moving."

The middle Monolet turned toward Plazmet.

Plazmet was fast. He looped up and over its top, and three whirling pebbles punched through the air where he had just been. He dropped low. Rook started to grin...

And the third Monolet, the one nobody was watching, shuffled out of the dust. Its crack blazed. And the air on both sides of Plazmet slammed together.

BOOOOM.

Plazmet was right between them.

The sound was like two mountains meeting. The dust went up in a ring. It was a crushing pull, from every side at once, squeezing inward, harder and harder. And when it finally let go, something tiny and orange dropped out of the empty air and fell, and fell, and hit the floor, and rolled.

Plazmet's fire had gone down to almost nothing. His plasma ring was flickering, on, off, on. He lay on the cracked tiles, a little gray wisp of smoke curling up off him, and he didn't move.

"PLAZMET!"

Rook was running before he knew it. He skidded to his knees beside him. Plazmet's flame was making a tiny, ragged sound. Fff. Fff. Like a candle in a draft.

Above them, the Monolet's pebbles drew back on their rings again.

Something hot and furious roared up in Rook's chest, so fast and so big that it frightened him. They hurt him. All he had to do was say two words. Comet Dash. Every bit of Rook wanted to scream it.

Plazmet looked up at him.

He was so small. He was the size of a match flame. But his one eye found Rook's face and held it, steady as anything. It was asking. Is that really what we do?

Rook closed his mouth on the words.

Think first.

They were guardians. They weren't being cruel. They were doing the one job they'd been given, a thousand years ago, and they were doing it with everything they had. If he hit them now, he would be just another kid with strong fists and no patience. And Kit wasn't done yet.

"Not yet," Rook whispered to Plazmet. "We don't hit them. We just don't let them win either. Okay? Can you get up?"

Plazmet's flame shivered. Then, with a sound like a match striking, fsssht, it flared. He floated up off the floor, wobbling, half his size, and turned to face the Monolet.

The pebbles came down. Rook grabbed Plazmet out of the air and threw himself sideways. KRAKOOOM. The tile where they had been kneeling exploded into gravel.

"Lumislug! Brighter! As bright as you can! Right in their faces! Glitchbug, zip around them. Don't zap them. Just buzz."

Lumislug scrunched up its whole squishy body, and glowed. It glowed so bright the room went green. All three Monolets flinched, their violet cracks flickering in the glare, and their pebbles flew wide.

And Glitchbug buzzed. It zoomed in circles around the third Monolet's smooth stone face, crackling, so close to its glowing crack that the Monolet kept turning around and around, trying to follow it. It spun in a slow circle on the spot. Then another. Then it got so dizzy that it tipped over, very slowly, like a falling tree, and landed flat on its back.

THOOOM. The whole room jumped.

Rook laughed out loud. It came out shaky. He couldn't help it.

And all the while, on the other side of the room, Kit was turning mirrors.

Click.

Kit grabbed the edge of a big silver mirror in its stone frame and turned it, just a little. The beam of sunlight hit it, and bounced off, and shot across the room in a straight golden line, and hit the wall.

"No," Kit muttered. "Left. Little more left."

Click.

The beam bounced off and hit another mirror. That mirror bounced it up, to another mirror high on the wall.

"Yes! Tamsin! That one up there! Can you reach it?"

Tamsin used her walking stick. She hooked it around the edge of the high mirror and pulled. Click. The beam bounced off it and zigzagged across the room again.

"YES!" Kit was running now, from mirror to mirror. Click. Click. The golden line of light zigzagged across the room. From mirror to mirror to mirror. Up and down and side to side. Like a laser. Like a spider's web made of sunshine.

Click. Click. Click.

A Monolet's pebble came hurtling straight at Kit. Mycelith was there in an instant, its wide, ragged red cap spreading out like a shield over Kit's head. WHAMMM. The pebble bounced off the cap. The floor under Mycelith's root-legs cracked in a ring. Mycelith didn't even flinch.

"Thanks," Kit gasped, and kept turning.

Click.

"One more!" Kit yelled. "Rook! I need one more! But it's behind the middle one!"

Rook looked. The last mirror was right behind the biggest Monolet, the one in the middle, set into the wall just above the door. The Monolet was standing directly in front of it, violet crack turned toward Rook.

And Rook's whole team was hurt. Cactling was limping. Lumislug's glow had gone dim and patchy from shining so hard. And Plazmet, floating at his shoulder, was still only half his size.

"Plazmet," Rook said. His voice shook. He let it. "I need you to lead it away. Right up close to its face, close enough that it only looks at you. No fire. No hitting. Just make it follow you." He swallowed. "It's going to fight. You can't hit back. Can you do that?"

Plazmet's flame went still for a moment. Then he bobbed, once, firmly.

He floated forward, right in front of the middle Monolet's face. Close. Very close. Its violet crack flared, fixed on him. And then Plazmet backed away. Slowly. Teasingly. Like a cat with a piece of string. And the Monolet shuffled after him. One step. Two steps. Three. Away from the door.

Then it threw.

WHOOOSH. Plazmet dipped. The pebbles missed him by a whisker, and the wind of it blew his little flame sideways and nearly out. He steadied, and backed away again. Four steps. Five.

"Hold on," Rook whispered. He didn't even know he was saying it. "Hold on, hold on, hold on..."

Kit ran. They ran behind the Monolet and scrambled right up onto its flat stone top, as if it were a step stool, ducking under its whirling pebbles, which made the Monolet go "HRRMMMM?" in confusion, deep inside everybody's heads. It stopped. It started to turn around. If it turned, Kit would go flying, right into the path of those pebbles.

"PLAZMET! NOW! As bright as you've EVER been!"

Plazmet blazed. Not at the Monolet. Just blazed, all the fire he had left, flaring up big and white and gold right in front of that glowing crack, like a sunrise in a dark room. The Monolet froze, dazzled, its pebbles wobbling on their rings.

Kit reached up from its top, grabbed the edge of the last mirror, and turned it.

CLICK.

The beam of sunlight bounced off the last mirror. It shot down in a perfect straight golden line.

And it hit the crystal in the center of the great round door.

The crystal blazed.

It lit up from inside, bright gold, like the sun itself was trapped inside it. The light poured out of it in every direction, all across the door, along the carved lines, until the whole enormous stone door was glowing with golden light, every swirl and loop shining.

And the Monolets stopped.

All three of them, all at once. They froze, mid-shuffle. The one chasing Plazmet stopped with its three pebbles hanging frozen in the air. The one with Kit on top went perfectly still. The one lying dizzy on its back stopped rocking.

In the sudden quiet, a tiny spark drifted down out of the air in front of Rook. Plazmet had spent every bit of fire he had. Rook held out both hands and caught him. He was barely a flicker, warm and light as a feather, but his eye opened a crack and looked up at Rook. And Plazmet sneezed. Pfft. One tiny spark.

Rook laughed. It came out wobbly. He held Plazmet against his chest. Cactling limped over and leaned its whole prickly side against his leg, and Rook didn't even mind the needles.

Then, slowly, with a deep grinding sound, the one on its back floated itself upright, and the three Monolets shuffled into a neat straight row and turned to face Rook and Kit. Their glowing cracks weren't cold anymore. They were warm. Soft gold, like the light from the door.

And all three of them tipped forward, together, in a slow, deep bow. Their pebbles dipped low on their rings.

The one with Kit on top tilted itself very, very carefully, until Kit could slide down off it onto the floor.

"BRAINS," the Monolets rumbled, deep inside Rook's head. They looked at Kit. "AND HEART." They looked at Rook. "TOGETHER."

Together... together... together...

"YOU DID NOT STRIKE US," the middle one said, its deep voice rumbling through the inside of Rook's skull. "YOU COULD HAVE. YOU DID NOT. MANY HAVE COME TO THIS DOOR, LONG AGO, WITH STRONG FISTS AND NO PATIENCE. THEY DID NOT PASS." Its glowing crack turned toward Rook, and then at the little flicker in his hands. "YOU ARE WORTHY."

Rook felt something warm and bright spread through his whole chest, all the way out to the tips of his fingers. And in his cupped hands, Plazmet's flame grew, just a little, as if he felt it too.

Kit ran over and grabbed his arm, laughing and shaking. Tamsin threw her hat in the air.

And the great round door began to move.

It rumbled. It shook. Dust poured down. It began to roll to the side, slowly, slowly, like a giant stone wheel.

And then it stopped.

It had opened just a crack. A thin dark crack, barely wide enough to slip a hand through. And no matter how much it rumbled and shook, it wouldn't open any further.

The golden light on the door flickered.

"What?" said Rook. "Why did it stop?"

Kit was already at the door, pressing their ear against the stone. Their eyes were closed. They were listening.

"There's something missing," Kit said slowly. "The light worked. The lock's open. But it's like... it's like the door is waiting for something else." They frowned. "There are little holes. All along the edges of the door. Hundreds of them. Like a flute. Or an organ. It's supposed to make a sound." Kit pulled back and looked up at the huge door. "It's supposed to sing. That's how it opens all the way. But nothing's singing. The temple's broken."

Tamsin leaned on her walking stick and looked around the vast, silent room. "The Temple of Voices," she said quietly. "And it's lost its voice."

Zib floated over to the crack in the door. He looked into it, his huge eye glowing. He tried humming. The Spore Choir song. Hmm-mm-mmm. It echoed around the room, soft and sweet. But the door didn't move.

"It needs a pure note," said Liss's voice, chiming out of a crystal high in the wall. "One single, perfect, ringing note. Long ago, the temple keepers had one. But it has been a very long time since anyone rang it."

And from behind a pillar at the edge of the room, something peeked out.

It was small. About as tall as Rook's knee. It was shaped like a little bell, round at the top and flared at the bottom, made of polished silver that gleamed in the dim light. Beneath its rim was a tiny smiling face, shy and round-eyed. Long teal ribbons flowed off it like streamers in a breeze. And hanging below it, like a skirt, was a ring of thin glass chime tubes that clinked very softly whenever it moved. It was floating, just slightly off the ground, peeking around the edge of the stone pillar.

It had been hiding there, Rook realized. It had been hiding there the whole time. Watching the battle. Watching Kit turn the mirrors. Too scared to come out.

Rook's Linker beeped, very softly. CHIMELET. SONIC/CRYSTAL-TYPE. ITS NOTE CAN WAKE ANCIENT THINGS.

Rook didn't move. Kit didn't move. Nobody wanted to scare it.

The little bell looked at them. It looked at the great door, open just a crack. It looked at the three Monolets, still bowing. And then it looked at Zib.

Zib looked back at it. His lights went soft and gold. And very, very quietly, he went: "...Bip."

The Chimelet came out from behind the pillar.

It floated slowly across the great round room, past Rook, past Kit, past the Monolets, until it was hanging in the air in the very middle of the room, right in the center of the golden beam of sunlight. The light glinted off its silver sides and sparkled through its glass tubes, so bright that it looked like a little sun.

It took a breath. Rook didn't know bells could take breaths. This one did.

And then it swung itself gently from side to side, once, its teal ribbons fluttering and its glass tubes shivering, and rang.

Dinnnnnnnnnng.

It was the purest sound Rook had ever heard. Pure and clear and perfect, like a single drop of water falling into a still pond. It rang out through the vast round room. It rang up into the dome. It rang down the long dark hallways, and through the maze, and out to the very edges of the temple.

And the whole temple sang back.

Every wall hummed. Every crystal chimed. The hundreds of little holes along the edges of the great door all began to sing at once, like a giant pipe organ, like a choir, like the Spore Choir on Sporeholm and the four Shards humming together and the howl of the Chirpods all at once. The sound swelled and swelled until Rook could feel it in his bones, in his teeth, in his heart. The golden light blazed brighter and brighter. The Monolets' violet cracks shone, and their pebbles whirled on their pink rings. Mycelith's cap trembled. Plazmet's plasma ring spun so fast it whistled. Zib was flashing every color he had, spinning in circles beside the Chimelet, going "BIP! BIP! BIIIIIP!" along with the song.

And the great round door rolled open.

All the way. Slowly. Grandly. With a deep, rumbling, joyful sound, like the whole temple letting out a breath it had been holding for a thousand years.

The song faded. The echoes faded. The Chimelet floated gently back down to the floor, glowing with pride.

And beyond the door, there was a hall.

It was dark. It was so big that Rook couldn't see the end of it, or the ceiling, or the walls. It just stretched away into shadow, vast and silent and waiting. But something in there was glowing. Faintly. Softly. All along the walls, as far as he could see.

Pictures.

"Come," said Liss gently. "Come and see where you came from, little scout."

Zib floated forward, into the doorway. He stopped there. His lights flickered. Then he looked back over his shoulder at Rook, with his huge round eye, and Rook could have sworn he looked scared.

Rook walked forward and stood beside him. He held out his hand. Zib floated down into it.

"Together," Rook said.

And they walked into the dark.


---

# Chapter 25: Murals of Ystra

**Mode: 5 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Tamsin had taken off her hat. She was holding it against her …" through the paragraph ending "… Mycelith had bowed its great spotted cap low."

**OLD TEXT (remove exactly this):**

> Tamsin had taken off her hat. She was holding it against her chest with both hands, the way people do in very old churches. Her eyes were wet. Kit had pushed their goggles all the way up on their head and was turning around and around in a slow circle, mouth open. Plazmet had turned his flame down to the softest glow he could, as if he were afraid of hurting the paintings with too much light. Mycelith had bowed its great spotted cap low.

**NEW TEXT (paste exactly this):**

Tamsin had taken off her hat. She was holding it against her chest with both hands, the way people do in very old churches. Her eyes were wet. Kit had pushed their goggles all the way up on their head and was turning around and around in a slow circle, mouth open. Plazmet had turned his flame down to the softest glow he could, as if he were afraid of hurting the paintings with too much light. Mycelith had bowed its wide, ragged red cap low.

## Edit 2 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting ""She could not run. She was too old, and too big, and …" through the paragraph ending "… "Every Alienmon you know came from those seeds.""

**OLD TEXT (remove exactly this):**

> "She could not run. She was too old, and too big, and her roots went too deep. So she gave everything she had left to the seeds. All her strength. All her light. And she sent them out across the dark, as far as they could go, to find somewhere new. Somewhere safe. Somewhere the shadow could not follow." The light pulsed. "Every Alienmon you know came from those seeds."

**NEW TEXT (paste exactly this):**

"She could not run. She was too old, and too big, and her roots went too deep. So she gave everything she had left to the seeds. All her strength. All her light. And she sent them out across the dark, as far as they could go, to find somewhere new. Somewhere safe. Somewhere the shadow could not follow." The light pulsed. "We called her the Seedmother. Every Alienmon you know came from her seeds."

## Edit 3 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Kit came and stood on Rook's other side. Then Plazmet floated close, …" through the paragraph ending "… on Rook's shoulder, and the other on Kit's."

**OLD TEXT (remove exactly this):**

> Kit came and stood on Rook's other side. Then Plazmet floated close, his comet-tail curling around them, warm. Then Mycelith bent down, slowly, and spread its great spotted cap over all of them like a roof. And then Tamsin came, and put one old, wrinkled, warm hand on Rook's shoulder, and the other on Kit's.

**NEW TEXT (paste exactly this):**

Kit came and stood on Rook's other side. Then Plazmet floated close, his comet-tail curling around them, warm. Then Mycelith bent down, slowly, and spread its wide, ragged red cap over all of them like a roof. And then Tamsin came, and put one old, wrinkled, warm hand on Rook's shoulder, and the other on Kit's.

## Edit 4 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It took hours. They pressed the big sheets of paper flat against …" through the paragraph ending "… with its eight stars and its golden words."

**OLD TEXT (remove exactly this):**

> It took hours. They pressed the big sheets of paper flat against the stone, and rubbed over them with the charcoal, gently, the way you rub a pencil over a coin to see the picture come through. Tamsin showed them how. Mycelith held the big sheets up high with its long vines, so they could reach the tops of the paintings. Plazmet floated close and gave them light. And one by one, the paintings appeared on the paper, in soft gray lines. The crystal forest. The shadow. The tree-mother. The scouts. The door, with its eight stars and its golden words.

**NEW TEXT (paste exactly this):**

It took hours. They pressed the big sheets of paper flat against the stone, and rubbed over them with the charcoal, gently, the way you rub a pencil over a coin to see the picture come through. Tamsin showed them how. Mycelith held the big sheets up high with its long, rope-like fibers, so they could reach the tops of the paintings. Plazmet floated close and gave them light. And one by one, the paintings appeared on the paper, in soft gray lines. The crystal forest. The shadow. The tree-mother. The scouts. The door, with its eight stars and its golden words.

## Edit 5 of 5
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "They ran back through the great hall, past the glowing paintings. Through …" through the paragraph ending "… the archaeologists, who all stood up and stared."

**OLD TEXT (remove exactly this):**

> They ran back through the great hall, past the glowing paintings. Through the round door. Past the three Monolets, who bowed their stone heads as they passed, and the little Chimelet, who rang a soft ding goodbye. Up through the echoing maze, with Liss whispering left, right, up the stairs from every crystal. Out of the dark doorway at the top of the temple, into blinding golden sunlight. Down all the steps, two at a time, three at a time. Across the sand. Past the tents and the archaeologists, who all stood up and stared.

**NEW TEXT (paste exactly this):**

They ran back through the great hall, past the glowing paintings. Through the round door. Past the three Monolets, who tipped forward in a bow as they passed, their pebbles dipping on their rings, and the little Chimelet, who rang a soft ding goodbye. Up through the echoing maze, with Liss whispering left, right, up the stairs from every crystal. Out of the dark doorway at the top of the temple, into blinding golden sunlight. Down all the steps, two at a time, three at a time. Across the sand. Past the tents and the archaeologists, who all stood up and stared.


---

# Chapter 26: The Crater Four

**Mode: 3 paragraph edit(s).** Make them in order, top to bottom. Unchanged paragraphs keep their existing audio.

## Edit 1 of 3
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "Mycelith rose to its full height behind Kit, tall and calm and …" through the paragraph ending "… of them, like a shield. Like a promise."

**OLD TEXT (remove exactly this):**

> Mycelith rose to its full height behind Kit, tall and calm and strong, its great spotted cap spreading out wide over all of them, like a shield. Like a promise.

**NEW TEXT (paste exactly this):**

Mycelith rose to its full height behind Kit, tall and calm and strong, its wide, ragged red cap spreading out over all of them, like a shield. Like a promise.

## Edit 2 of 3
**Type:** REPLACE 1 old paragraph(s) with 1 new paragraph(s)
**Find:** from the paragraph starting "It was enormous. It was shaped like a twisting ladder, two great …" through the paragraph ending "… in a long row, seven empty cradles. Waiting."

**OLD TEXT (remove exactly this):**

> It was enormous. It was shaped like a twisting ladder, two great curving arms of silver spiraling around each other, with lights blinking all along them. Ships came and went from it like bees around a hive. Inside it, in rooms nobody ever saw, one great crystal was glowing. Deep sea-blue, from Thalassa, dim and flickering, wrapped in black chains. And beside it, in a long row, seven empty cradles. Waiting.

**NEW TEXT (paste exactly this):**

It was enormous. It was shaped like a twisting ladder, two great curving arms of silver spiraling around each other, with lights blinking all along them. Ships came and went from it like bees around a hive, and on every one of them, and on the station's great silver flank, glowed an orange ring with a diagonal slash through it. Inside it, in rooms nobody ever saw, one great crystal was glowing. Deep sea-blue, from Thalassa, dim and flickering, wrapped in black chains. And beside it, in a long row, seven empty cradles. Waiting.

## Edit 3 of 3
**Type:** REPLACE 1 old paragraph(s) with 3 new paragraph(s)
**Find:** from the paragraph starting "When he spoke, his voice was very calm. Very quiet. The quietest …" through the paragraph ending "… The quietest voice in the whole Kessler system."

**OLD TEXT (remove exactly this):**

> When he spoke, his voice was very calm. Very quiet. The quietest voice in the whole Kessler system.

**NEW TEXT (paste exactly this):**

Below them, through a wide floor of glass, stretched a hall so long that its far end was lost in shadow. It was full of cages. Row after row after row of them, neat and white and humming. And in every single cage sat an Alienmon. No two the same. A little tag hung from each cage door, with a name and a number on it, like a label in a museum. Over the entrance to the hall, in tall silver letters, were two words. PROJECT UNITY.

Sola didn't say anything. But her hands, pressed flat against the glass, slowly curled into fists.

Then he turned back to the stars. When he spoke, his voice was very calm. Very quiet. The quietest voice in the whole Kessler system.
