type UserInfo = {
  uid: string
  username: string
  email: string
  isLoggedIn: boolean
  isAccountVerified: boolean
}

type ImageInfo = {
  id: string
  title: string
  description: string
  author_username: string
  author_id: string
  likes: number
  views: number
  path: string
  created_at: string
}

type Comment = {
  id: string
  comment: string
  author_username: string
  likes: number
}

export type { UserInfo, ImageInfo, Comment }