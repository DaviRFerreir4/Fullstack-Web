export interface SignUpFormErrors {
  name?: string[]
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
}

export interface SignInFormErrors {
  email?: string[]
  password?: string[]
}

export interface CreateRequestFormErrors {
  title?: string[]
  description?: string[]
  serviceId?: string[]
}

export interface AddServiceFormErrors {
  title?: string[]
  value?: string[]
  service?: string[]
  serviceName?: string[]
}
