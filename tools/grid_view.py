"""Draw a labelled coordinate grid over (a crop of) a 1536x1024 map, for placing walk polygons and hotspots.
Usage: python tools/grid_view.py <image> <out.png> [x0 y0 x1 y1]   (fine 32px grid, labels every 64px)"""
import sys
from PIL import Image, ImageDraw
src,out=sys.argv[1],sys.argv[2]; x0,y0,x1,y1=map(int,sys.argv[3:7]) if len(sys.argv)>6 else (0,0,1536,1024)
im=Image.open(src).convert('RGB').resize((1536,1024)).crop((x0,y0,x1,y1)); d=ImageDraw.Draw(im)
for x in range((x0//32)*32,x1,32):
  if x<x0: continue
  d.line([(x-x0,0),(x-x0,y1-y0)],fill=(0,255,255) if x%128==0 else (70,70,70))
for y in range((y0//32)*32,y1,32):
  if y<y0: continue
  d.line([(0,y-y0),(x1-x0,y-y0)],fill=(0,255,255) if y%128==0 else (70,70,70))
for x in range(((x0+63)//64)*64,x1,64):
  for y in range(((y0+63)//64)*64,y1,64): d.text((x-x0+2,y-y0+1),f'{x},{y}',fill=(255,255,0))
im.save(out)
