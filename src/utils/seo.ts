// SEO utility functions

// Set page title and meta description
export const setPageMeta = (title: string, description?: string): void => {
  // Update document title
  document.title = title ? `${title} | Brandie` : 'Brandie - Build every brand overnight'
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && description) {
    metaDescription.setAttribute('content', description)
  }
}

// Generate structured data for a brand
export const generateBrandStructuredData = (brand: any): string => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    description: brand.description || `${brand.name} - Created with Brandie`,
    logo: brand.logo?.url || null,
    url: window.location.href,
    sameAs: brand.socialLinks || []
  }
  
  return JSON.stringify(structuredData)
}

// Add structured data to the page
export const addStructuredData = (jsonLD: string): void => {
  // Remove any existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }
  
  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = jsonLD
  document.head.appendChild(script)
}

// Generate canonical URL
export const getCanonicalUrl = (path: string = ''): string => {
  const baseUrl = window.location.origin
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  return `${baseUrl}${cleanPath}`
}

// Add canonical link to the page
export const setCanonicalLink = (path?: string): void => {
  const url = getCanonicalUrl(path)
  
  // Remove any existing canonical link
  const existingLink = document.querySelector('link[rel="canonical"]')
  if (existingLink) {
    existingLink.remove()
  }
  
  // Add new canonical link
  const link = document.createElement('link')
  link.rel = 'canonical'
  link.href = url
  document.head.appendChild(link)
}

// Set Open Graph meta tags
export const setOpenGraphTags = (data: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}): void => {
  const { title, description, image, url, type = 'website' } = data
  
  // Helper function to set or create meta tag
  const setMetaTag = (property: string, content?: string) => {
    if (!content) return
    
    let meta = document.querySelector(`meta[property="${property}"]`)
    
    if (meta) {
      meta.setAttribute('content', content)
    } else {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      meta.setAttribute('content', content)
      document.head.appendChild(meta)
    }
  }
  
  setMetaTag('og:title', title)
  setMetaTag('og:description', description)
  setMetaTag('og:image', image)
  setMetaTag('og:url', url || window.location.href)
  setMetaTag('og:type', type)
}