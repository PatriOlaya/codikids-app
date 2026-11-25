"""Check native Scratch archives, graph integrity, variables and embedded assets."""
import hashlib
import json
from pathlib import Path
import unittest
import zipfile

class ScratchProjects(unittest.TestCase):
 def test_projects_are_self_contained_standard_scratch(self):
  files=list((Path(__file__).resolve().parents[1]/'public/scratch').glob('*.sb3'))
  self.assertEqual(len(files),3)
  for file in files:
   with self.subTest(project=file.name),zipfile.ZipFile(file) as z:
    p=json.loads(z.read('project.json'));self.assertEqual(p['extensions'],[])
    stage=p['targets'][0];self.assertTrue(stage['isStage'])
    for t in p['targets']:
     blocks=t['blocks'];self.assertGreater(len(blocks),0,t['name'])
     variables={**stage['variables'],**t['variables']}
     reached=set()
     def walk(id):
      if id in reached:return
      reached.add(id);self.assertIn(id,blocks)
      b=blocks[id]
      if b['next']:
       self.assertEqual(blocks[b['next']]['parent'],id);walk(b['next'])
      for value in b['inputs'].values():
       for child in value[1:]:
        if isinstance(child,str):
         self.assertIn(child,blocks);self.assertEqual(blocks[child]['parent'],id);walk(child)
        elif isinstance(child,list) and child[0]==12:self.assertIn(child[2],variables)
      if 'VARIABLE' in b['fields']:self.assertIn(b['fields']['VARIABLE'][1],variables)
     for id,b in blocks.items():
      if b['topLevel']:
       self.assertIsNone(b['parent']);walk(id)
     self.assertEqual(reached,set(blocks),f'Orphan blocks in {t["name"]}')
     for asset in t['costumes']+t['sounds']:
      raw=z.read(asset['md5ext']);self.assertEqual(hashlib.md5(raw).hexdigest(),asset['assetId'])
     self.assertTrue(t['costumes'])

if __name__=='__main__':unittest.main()
