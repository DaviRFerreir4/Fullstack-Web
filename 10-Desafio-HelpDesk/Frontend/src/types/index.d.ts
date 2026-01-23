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

interface createRequestFormErrors {
  title?: string[]
  description?: string[]
  serviceId?: string[]
}
