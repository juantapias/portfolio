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
