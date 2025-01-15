import React, { useState, useEffect } from 'react'
import './App.css'
import { getGlossaryEntries } from './contentful'

// Debug: Log environment variables
console.log('Environment variables:', {
  spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  hasAccessToken: !!import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
})

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
  const [entries, setEntries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const items = await getGlossaryEntries()
        setEntries(items)
        setLoading(false)
      } catch (err) {
        setError('Failed to load glossary entries')
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  // Get unique first letters for the alphabet navigation
  const letters = [...new Set(entries.map(item => item.fields.term[0].toUpperCase()))]
  
  // Filter entries based on search and selected letter
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.fields.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.fields.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLetter = selectedLetter ? entry.fields.term[0].toUpperCase() === selectedLetter : true
    return matchesSearch && matchesLetter
  })

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading glossary entries...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error">{error}</div>
  }

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
            key={entry.sys.id}
            term={entry.fields.term}
            definition={entry.fields.definition}
            reference={entry.fields.reference}
          />
        ))}
        {filteredEntries.length === 0 && (
          <div className="no-results">
            No entries found for your search
          </div>
        )}
      </main>
    </div>
  )
}

export default App
