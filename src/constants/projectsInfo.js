import {
  linkedin0,
  linkedin1,
  linkedin2,
  linkedin3,
  weather0,
  weather1,
  weather2,
  keyboard0,
} from '../assets/images'

export default [
  {
    id: 0,
    titleKey: 'projects.items.linkedin.title',
    categoryKey: 'projects.items.linkedin.category',
    descKey: 'projects.items.linkedin.desc',
    githubHref: 'https://github.com/serifselim/linkedin-clone',
    liveHref: 'https://linkedin-clone-lemon.vercel.app/',
    technologies: ['ReactJS', 'Styled-Components', 'Redux', 'Context API'],
    images: [linkedin0, linkedin1, linkedin2, linkedin3],
  },
  {
    id: 1,
    titleKey: 'projects.items.weather.title',
    categoryKey: 'projects.items.weather.category',
    descKey: 'projects.items.weather.desc',
    githubHref: 'https://github.com/serifselim/weather-of-turkey',
    liveHref: 'https://weather-of-turkey.vercel.app/',
    technologies: ['ReactJS', 'Styled-Components', 'Redux', 'Context API'],
    images: [weather0, weather1, weather2],
  },
  {
    id: 2,
    titleKey: 'projects.items.keyboard.title',
    categoryKey: 'projects.items.keyboard.category',
    descKey: 'projects.items.keyboard.desc',
    githubHref: 'https://github.com/serifselim/keyboard-practice',
    liveHref: 'https://keyboard-practice-kappa.vercel.app/',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    images: [keyboard0],
  },
]
