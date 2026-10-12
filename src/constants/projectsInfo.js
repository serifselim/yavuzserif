import {
  hydraplant0,
  hydraplant1,
  hydraplant2,
  hydraplant3,
  beyaznokta0,
  beyaznokta1,
  beyaznokta2,
} from '../assets/images'

export default [
  {
    id: 0,
    titleKey: 'projects.items.hydraplant.title',
    categoryKey: 'projects.items.hydraplant.category',
    descKey: 'projects.items.hydraplant.desc',
    githubHref: 'https://github.com/serifselim/hydraplant',
    technologies: ['React Native', 'Expo', 'NestJS', 'PostgreSQL', 'Prisma'],
    images: [hydraplant0, hydraplant1, hydraplant2, hydraplant3],
  },
  {
    id: 1,
    titleKey: 'projects.items.beyaznokta.title',
    categoryKey: 'projects.items.beyaznokta.category',
    descKey: 'projects.items.beyaznokta.desc',
    githubHref: 'https://github.com/serifselim/beyaz-nokta',
    liveHref: 'https://www.beyaznoktamanager.com/',
    technologies: ['React Native', 'Expo', 'NestJS', 'PostgreSQL', 'Prisma'],
    images: [beyaznokta0, beyaznokta1, beyaznokta2],
  },
]
