import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  cloneElement,
  Children,
} from 'react'
import { motion } from 'framer-motion'
import { CursorContext } from './CursorContext'
import useEventListener from '../hooks/useEventListener'
import useIsNear from '../hooks/useIsNear'

/**
 *
 * Todo:
 * Needs to do something:
 * - onClick
 * - onProximity
 * - onMouseOver
 * - onMouseOut
 *
 */

const CurrentCursor = ({ nextCursor, nextRef }: any) => {
  const [currentCursorId, setCurrentCursorId] = useState(nextCursor)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [test, isNearHandle] = useIsNear(nextRef)
  console.log(test)

  const { cursors } = useContext<any>(CursorContext)

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) => {
      setMousePosition({ x, y })
    },
    [setMousePosition]
  )

  useEventListener('mousemove', (e: Event) => {
    onMouseMove(e)
    isNearHandle(e)
  })

  useEffect(() => {
    setCurrentCursorId(nextCursor)
  }, [nextCursor])

  const extractedCursor = cursors.find(
    (cursor: any) => cursor.id === currentCursorId
  )

  if (!extractedCursor.component) {
    throw new Error(`We didn't find cursor with id ${nextCursor}`)
  }

  const Cursor = ({ currentElement, hello }: any) => {
    return Children.map(extractedCursor.component(), (child) => {
      return cloneElement(child, { currentElement, hello })
    })
  }

  return (
    <motion.div
      animate={{ x: mousePosition.x, y: mousePosition.y, position: 'absolute' }}
    >
      <Cursor currentElement={nextRef} />
    </motion.div>
  )
}

export default CurrentCursor
