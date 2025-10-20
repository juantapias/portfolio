export type IFetchData = {
  data?: ILinkTree
  loading?: boolean
  error?: string | unknown
}

type ILinkTree = {
  social: Social[]
}

type Social = {
  name: string
  url: string
  icon: string
}

export type ITech = {
  icon: string
  location: string
}

export type Services = {
  label: string
  description: string
  features: string[]
}
