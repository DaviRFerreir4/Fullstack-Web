type Props = React.ComponentProps<'div'> & {
  profilePicture?: string
  username?: string
  size?: keyof typeof sizes
}

const sizes = {
  md: 'min-w-5 w-5 h-5 text-[0.5rem]',
  lg: 'w-10 lg:w-8 h-10 lg:h-8',
}

export function ProfilePicture({
  profilePicture,
  username,
  size = 'md',
  ...rest
}: Props) {
  const names = username?.split(' ')
  const initials = names?.map((name) => {
    return name.substring(0, 1)
  })

  return (
    <div
      className={`flex rounded-full overflow-hidden ${sizes[size]}`}
      {...rest}
    >
      {profilePicture ? (
        <img />
      ) : (
        <span className="w-full h-full flex justify-center items-center bg-blue-dark text-gray-600">
          {initials?.map((initial) => initial.toUpperCase())}
        </span>
      )}
    </div>
  )
}
