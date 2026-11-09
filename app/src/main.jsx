import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
console.log('L2 Merge!')

import { destinatii } from './data/destinatii.js'
import { getOrase, getNevizitate, totalZile, formatDestinatie, numarPeTara, sortDupaZile } from './utils/destinatii.js'

console.log('L2 Ex. 1 orașe:', getOrase(destinatii))
console.log('L2 Ex. 1 nevizitate:', getNevizitate(destinatii).length)

const nevizitate = getNevizitate(destinatii)
console.log('L2 Ex. 1 zile de vizitat:', totalZile(nevizitate))
console.log('L2 Ex. 1\n' + destinatii.map(formatDestinatie).join('\n'))
console.log('L2 Ex. 1 pe țară:', numarPeTara(destinatii))
console.log('L2 Ex. 1 cea mai lungă vizită:', sortDupaZile(destinatii)[0].oras)

// Ex. 2
export const marcheazaVizitat = (list, id) => 
  list.map(d => d.id === id ? { ...d, vizitat: !d.vizitat } : d)
export const adaugaDestinatie = (list, d) => [...list, d]
export const stergeDestinatie = (list, id) => list.filter(d => d.id !== id)