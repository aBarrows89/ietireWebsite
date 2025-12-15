import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.ietires.com'
  const lastModified = new Date()

  // For a single-page app with anchor navigation, only list the main page
  // Google doesn't index hash URLs separately - they're considered same page
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
