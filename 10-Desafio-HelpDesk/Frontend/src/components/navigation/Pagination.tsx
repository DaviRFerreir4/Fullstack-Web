// @ts-expect-error TS2307
import LeftIcon from '../../assets/icons/left.svg?react'
// @ts-expect-error TS2307
import LeftDoubleIcon from '../../assets/icons/chevrons-left.svg?react'
// @ts-expect-error TS2307
import RightIcon from '../../assets/icons/right.svg?react'
// @ts-expect-error TS2307
import RightDoubleIcon from '../../assets/icons/chevrons-right.svg?react'

import { Button } from '../form/Button'
import { useMemo } from 'react'

type Props = {
  current: number
  total: number
  onNext: () => void
  onPrevious: () => void
  setPage: (page: number) => void
}

export function Pagination({
  current,
  total,
  onNext,
  onPrevious,
  setPage,
}: Props) {
  const { pages, maxVisible } = useMemo(() => {
    const maxVisible = 5
    let start = Math.max(1, current - Math.floor(maxVisible / 2))
    let end = Math.min(total, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return {
      maxVisible,
      pages,
    }
  }, [current, total])

  return (
    <div className="flex flex-1 justify-center items-center gap-2.5">
      {pages.map((page, i) => (
        <>
          {i === 0 && (
            <>
              {pages.length < total && (
                <Button
                  disabled={current === 1}
                  Icon={LeftDoubleIcon}
                  size="custom"
                  className="text-xs px-2 py-1.5"
                  variant="secondary"
                  onClick={() => setPage(1)}
                />
              )}
              <Button
                variant="secondary"
                onClick={onPrevious}
                disabled={current === 1}
                Icon={LeftIcon}
                size="sm"
              />
            </>
          )}
          {i === 0 && current >= maxVisible - 1 && maxVisible < total && (
            <Button
              disabled
              text="..."
              size="custom"
              className="text-xs px-2 py-1.5"
              variant="secondary"
              onClick={() => setPage(page)}
            />
          )}
          <Button
            disabled={current === page}
            text={String(page)}
            size="custom"
            className="text-xs px-2 py-1.5"
            variant={current === page ? 'primary' : 'secondary'}
            onClick={() => setPage(page)}
          />

          {i === pages.length - 1 && page !== total && (
            <Button
              disabled
              text="..."
              size="custom"
              className="text-xs px-2 py-1.5"
              variant="secondary"
              onClick={() => setPage(page)}
            />
          )}
          {i === pages.length - 1 && (
            <>
              <Button
                variant="secondary"
                onClick={onNext}
                disabled={current === total}
                Icon={RightIcon}
                size="sm"
              />
              {pages.length < total && (
                <Button
                  disabled={current === total}
                  Icon={RightDoubleIcon}
                  size="custom"
                  className="text-xs px-2 py-1.5"
                  variant="secondary"
                  onClick={() => setPage(total)}
                />
              )}
            </>
          )}
        </>
      ))}
    </div>
  )
}
