"""Compose the title screen: the logo (art/ui/logo.png) over the title art (art/ui/title_base.jpg) -> art/ui/title.jpg.
Also refreshes the share image art/ui/og.jpg (1200x630) with the logo.

Usage: python tools/compose_title.py   (re-run after swapping either image)
"""
import os
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ui = lambda n: os.path.join(ROOT, 'art', 'ui', n)
logo = Image.open(ui('logo.png')).convert('RGBA')


def stamp(bg, width, top):
    """Paste the logo centred at `width` px wide with a soft dark halo so it reads over busy art."""
    lg = logo.resize((width, round(logo.height * width / logo.width)), Image.LANCZOS)
    halo = Image.new('RGBA', lg.size, (10, 6, 24, 0))
    halo.putalpha(lg.getchannel('A').point(lambda a: min(255, a * 2)).filter(ImageFilter.GaussianBlur(width // 40)).point(lambda a: a * 0.7))
    x = (bg.width - width) // 2
    bg.alpha_composite(halo, (x, top))
    bg.alpha_composite(lg, (x, top))


t = Image.open(ui('title_base.jpg')).convert('RGBA')
stamp(t, 470, -8)
t.convert('RGB').save(ui('title.jpg'), quality=90)

base = Image.open(ui('title_base.jpg')).convert('RGB').resize((1200, 1080), Image.LANCZOS).crop((0, 350, 1200, 980))
og = Image.blend(base, Image.new('RGB', base.size, (14, 8, 30)), 0.45).convert('RGBA')
stamp(og, 880, 20)
og.convert('RGB').save(ui('og.jpg'), quality=88)
print('title.jpg and og.jpg composed')
