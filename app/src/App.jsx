import { useState, useEffect } from 'react'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import { getDestinatii, postDestinatie, patchVizitat } from './api/destinatii.js'

import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import Cautare from "./components/Cautare.jsx"
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [seTrimite, setSeTrimite] = useState(false)
  const [textCautare, setTextCautare] = useState('')
  const [pagina, setPagina] = useState(1);
  const [totalPagini, setTotalPagini] = useState(1);


  useEffect(() => {
    async function incarca() {
      setIncarcare(true); // ca să arate "Se încarcă..." când schimbi pagina
      try {
        const date = await getDestinatii(pagina);
        setDestinatii(date.data); 
        setTotalPagini(date.pages); 
      } catch (err) {
        setEroare(err.message);
      } finally {
        setIncarcare(false);
      }
    }
    incarca();
  }, [pagina]);

  
  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id)
    try {
      const salvata = await patchVizitat(id, !destinatie.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (err) {
      console.error(err)
    }
  }


  async function handleAdd(destinatieNoua) {
    setSeTrimite(true)
    try {
      const salvata = await postDestinatie(destinatieNoua)
      setDestinatii((curent) => [...curent, salvata])
    } catch (err) {
      console.error(err)
    } finally {
      setSeTrimite(false)
    }
  }


  const nevizitate = getNevizitate(destinatii)
  const zileDeVizitat = totalZile(nevizitate)

 
  const text = textCautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text)
  )

  
  if (incarcare) return <p className="stare">Se încarcă destinațiile...</p>
  if (eroare) return <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>

  return (
    <main>
      <h1>City Explorer</h1>
      <Rezumat total={destinatii.length} nevizitate={nevizitate.length} zile={zileDeVizitat} />
      
      <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
      
      <Cautare valoare={textCautare} onChange={setTextCautare} />

      {/* Randarea condiționată a listei sau a mesajelor de listă goală */}
      {destinatii.length === 0 ? (
        <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
      ) : afisate.length === 0 ? (
        <p className="gol">Niciun rezultat pentru „{textCautare}”.</p>
      ) : (
        <ListaDestinatii destinatii={afisate} onToggle={handleToggle} />
      )}

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
        <button onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>Înapoi</button>
        <span>pagina {pagina} din {totalPagini}</span>
        <button onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPagini}>Înainte</button>
      </div>
    </main>
  )
}