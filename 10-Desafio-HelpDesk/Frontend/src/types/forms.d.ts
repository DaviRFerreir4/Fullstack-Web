interface SignUpFormErrors {
  name?: string[]
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
}

interface SignInFormErrors {
  email?: string[]
  password?: string[]
}

interface CreateRequestFormErrors {
  title?: string[]
  description?: string[]
  serviceId?: string[]
}

interface AddServiceFormErrors {
  title?: string[]
  value?: string[]
  service?: string[]
  serviceName?: string[]
}
