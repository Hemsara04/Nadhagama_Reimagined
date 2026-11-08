import { asset } from './asset'

export const PORTAL_URL = 'https://portal.naadhagama.lk/'

export const FESTIVAL = {
  title: 'Naadha Gama Festival 2027',
  place: 'Nuwara Eliya',
  dates: '4–6 February 2027',
  start: '2027-02-04T16:00:00+05:30',
  poster: asset('/site/naadha-gama-festival-2027.jpg'),
}

export const SCENES = [
  { src: asset('/site/hills.webp'), caption: 'Under the hills', place: 'Nuwara Eliya' },
  { src: asset('/images/numwaraeliya_ridma.jpg'), caption: 'Dusk on the village stage', place: 'Nuwara Eliya' },
  { src: asset('/site/guitarist.webp'), caption: 'Strings in the cold air', place: 'Sri Lanka' },
  { src: asset('/site/arena.webp'), caption: 'The arena lights up', place: 'Sri Lanka' },
  { src: asset('/images/dhanith.jpeg'), caption: 'The Orchestral Edition', place: 'Melbourne', tall: true },
  { src: asset('/site/family.webp'), caption: 'One big family', place: 'Sri Lanka' },
  { src: asset('/images/numwaraeliya_all.jpg'), caption: 'A sky of bulbs', place: 'Nuwara Eliya' },
  { src: asset('/site/lanterns.webp'), caption: 'Lantern night', place: 'Sri Lanka' },
  { src: asset('/site/crowd.webp'), caption: 'Voices as one', place: 'Sri Lanka' },
  { src: asset('/site/garden.webp'), caption: 'Garden sessions', place: 'Sri Lanka' },
]

export const EDITIONS = [
  {
    name: 'Nuwara Eliya',
    tag: 'The Home Edition',
    text: 'Tents, string lights and a campfire in the misty hills of Little England — where the village gathers every February.',
    img: asset('/site/campfire.webp'),
  },
  {
    name: 'Melbourne',
    tag: 'The Orchestral Edition',
    text: 'Live at the Sidney Myer Music Bowl — the sound of Sri Lanka carried across the ocean with a full orchestra.',
    img: asset('/images/Mlb_aus.jpeg'),
  },
  {
    name: 'Colombo',
    tag: 'Naadha Gama 360°',
    text: 'In the round, under the stadium lights — a stage open on every side, with the whole village singing around it.',
    img: asset('/places/colombo-360.jpg'),
  },
  {
    name: 'Great Britain',
    tag: 'Charlton Park Estate, Malmesbury',
    text: 'Fairy lights under a glass marquee, a Jacobean mansion behind the stage — Sri Lankan song in the English countryside.',
    img: asset('/places/great-britain.jpg'),
  },
]

// Artist line-up, in the order of the numbered files in /Artists.
// `focus` is the CSS object-position that keeps the artist in frame.
export const ARTISTS = [
  { name: 'Methun', surname: 'SK', img: asset('/artists/methun.jpg'), focus: '68% 0%' },
  { name: 'Dhanith', surname: 'Sri', img: asset('/artists/dhanith-sri.jpg'), focus: '50% 35%' },
  { name: 'Kanchana', surname: 'Anuradhi', img: asset('/artists/kanchana.jpg'), focus: '50% 30%' },
  { name: 'Dinesh', surname: 'Gamage', img: asset('/artists/dinesh.jpg'), focus: '50% 25%' },
  { name: 'Supun', surname: 'Perera', img: asset('/artists/supun.jpg'), focus: '50% 30%' },
]
