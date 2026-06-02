import defaultWorksRaw from './works.json'

export type WorkCategory = 'movie' | 'apps' | 'model' | 'marketing' | 'experiment'
export type MediaType    = 'image' | 'video' | 'embed' | 'placeholder'

export interface Work {
  id:           string
  title:        string
  category:     WorkCategory
  year:         string
  tag:          string
  role:         string
  tools:        string[]
  description:  string
  process?:     string
  mediaType:    MediaType
  mediaUrl?:    string
  thumbnailUrl?: string
  visible:      boolean
  featured:     boolean
  order:        number
  status?:      string
  storeUrl?:    string
}

export const defaultWorks = defaultWorksRaw as Work[]
