import { createClient } from 'contentful'

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
})

export const getGlossaryEntries = async () => {
  try {
    console.log('Fetching entries from Contentful...')
    
    // First, let's get the content types to see what's available
    const contentTypes = await client.getContentTypes()
    console.log('Available content types:', contentTypes.items.map(type => ({
      id: type.sys.id,
      name: type.name
    })))

    const response = await client.getEntries({
      content_type: 'pilotControllerGlossary',
      order: 'fields.term',
      limit: 1000,
    })
    console.log('Contentful response:', response)
    return response.items
  } catch (error) {
    console.error('Error fetching glossary entries:', error)
    return []
  }
}
