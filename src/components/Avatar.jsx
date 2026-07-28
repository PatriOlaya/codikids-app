import { createAvatar } from '@dicebear/core'
import * as adventurer from '@dicebear/adventurer'
import * as bottts from '@dicebear/bottts'
import { useMemo } from 'react'

export default function Avatar({ config = {}, size = 80 }) {
  const svg = useMemo(() => {
    const tipo = config.tipo || 'humano'

    if (tipo === 'robot') {
      return createAvatar(bottts, {
        size: 200,
        seed:             config.seed           || 'CodiKids',
        backgroundColor:  config.bgRobot        ? [config.bgRobot]  : ['534ab7'],
        baseColor:        config.baseColor       ? [config.baseColor]: ['6eecdb'],
        eyes:             config.robotEyes       ? [config.robotEyes]: ['eva'],
        face:             config.robotFace       ? [config.robotFace]: ['round01'],
        mouth:            config.robotMouth      ? [config.robotMouth]:['smile01'],
        top:              config.robotTop        ? [config.robotTop]  :['antennaCrooked'],
        topProbability:   100,
        sides:            config.robotSides      ? [config.robotSides]:['antenna01'],
        sidesProbability: 100,
        texture:          config.robotTexture    ? [config.robotTexture] : [],
        textureProbability: config.robotTexture  ? 100 : 0,
        mouthProbability: 100,
      }).toString()
    }

    return createAvatar(adventurer, {
      size: 200,
      seed:             config.seed          || 'CodiKids',
      backgroundColor:  config.backgroundColor? [config.backgroundColor]: ['b39ddb'],
      skinColor:        config.skinColor     ? [config.skinColor]       : ['f5cfa0'],
      hair:             config.hair          ? [config.hair]            : ['short01'],
      hairColor:        config.hairColor     ? [config.hairColor]       : ['2c1810'],
      hairProbability:  100,
      eyes:             config.eyes          ? [config.eyes]            : ['variant01'],
      eyebrows:         config.eyebrows      ? [config.eyebrows]        : ['variant01'],
      mouth:            config.mouth         ? [config.mouth]           : ['variant01'],
      glasses:          config.glasses       ? [config.glasses]         : [],
      glassesProbability:  config.glasses    ? 100 : 0,
      features:         config.features      ? [config.features]        : [],
      featuresProbability: config.features   ? 100 : 0,
    }).toString()
  }, [JSON.stringify(config)])

  return (
    <div
      style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: `#${config.tipo === 'robot' ? (config.bgRobot || '534ab7') : (config.backgroundColor || 'b39ddb')}` }}
      dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', `<svg style="width:${size}px;height:${size}px;display:block;" `) }}
    />
  )
}
