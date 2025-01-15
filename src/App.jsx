import React, { useState } from 'react'
import './App.css'

// Mock data for testing
const glossaryData = [
  {
    id: '1',
    term: 'AAM',
    definition: 'See ADVANCED AIR MOBILITY.'
  },
  {
    id: '2',
    term: 'AAR',
    definition: 'See AIRPORT ARRIVAL RATE.'
  },
  {
    id: '3',
    term: 'ABBREVIATED IFR FLIGHT PLANS',
    definition: 'An authorization by ATC requiring pilots to submit only that information needed for the purpose of ATC. It includes only a small portion of the usual IFR flight plan information.',
    reference: 'See VFR-ON-TOP. Refer to AIM.'
  },
  {
    id: '4',
    term: 'ABEAM',
    definition: 'An aircraft is "abeam" a fix, point, or object when that fix, point, or object is approximately 90 degrees to the right or left of the aircraft track. Abeam indicates a general position rather than a precise point.'
  }
]

// Single glossary entry component
function GlossaryEntry({ term, definition, reference }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="glossary-entry">
      <button 
        className="term-button" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="term">{term}</span>
        <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>
      
      <div className={`definition-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div className="definition">{definition}</div>
        {reference && <div className="reference">{reference}</div>}
      </div>
    </div>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState(null)

  // Get unique first letters for the alphabet navigation
  const letters = [...new Set(glossaryData.map(item => item.term[0].toUpperCase()))]
  
  // Filter entries based on search and selected letter
  const filteredEntries = glossaryData.filter(entry => {
    const matchesSearch = entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLetter = selectedLetter ? entry.term[0].toUpperCase() === selectedLetter : true
    return matchesSearch && matchesLetter
  })

  return (
    <div className="app">
      <header>
        <h1>Pilot/Controller Glossary</h1>
        <p>A comprehensive guide to aviation terminology</p>
      </header>

      <nav className="alphabet-nav">
        <div className="alphabet-list">
          {[...Array(26)].map((_, i) => {
            const letter = String.fromCharCode(65 + i)
            const isAvailable = letters.includes(letter)
            return (
              <button
                key={letter}
                className={`alphabet-item ${selectedLetter === letter ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                disabled={!isAvailable}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search the glossary..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <main>
        {filteredEntries.map(entry => (
          <GlossaryEntry
            key={entry.id}
            term={entry.term}
            definition={entry.definition}
            reference={entry.reference}
          />
        ))}
      </main>
    </div>
  )
}

export default App
