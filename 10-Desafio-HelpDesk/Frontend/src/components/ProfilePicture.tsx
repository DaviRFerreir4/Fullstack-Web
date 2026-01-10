type Props = React.ComponentProps<'div'> & {
  profilePicture?: string
  username?: string
  size?: keyof typeof sizes
}

const sizes = {
  sm: 'min-w-5 w-5 h-5 text-[0.5rem]',
  md: 'w-8 h-8',
  lg: 'w-10 lg:w-8 h-10 lg:h-8',
  xl: 'w-12 h-12 text-lg',
}

export function ProfilePicture({
  profilePicture,
  username,
  size = 'sm',
  ...rest
}: Props) {
  const names = username?.split(' ')
  const initials = names
    ?.map((name) => {
      return name.substring(0, 1)
    })
    .slice(0, 2)

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
