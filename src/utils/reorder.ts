/**
 * Utility functions for array reordering and manipulation
 * Designed to work seamlessly with @dnd-kit drag and drop
 */

/**
 * Reorder an array by moving an item from one index to another
 * Returns a new array (immutable)
 * 
 * @param array - The array to reorder
 * @param fromIndex - The current index of the item
 * @param toIndex - The target index for the item
 * @returns A new reordered array
 */
export function reorderArray<T>(
  array: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  const result = [...array]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

/**
 * Move an item between two different arrays
 * Returns both arrays as new instances (immutable)
 * 
 * @param sourceArray - The array to take the item from
 * @param destArray - The array to add the item to
 * @param sourceIndex - Index in the source array
 * @param destIndex - Index in the destination array
 * @returns Object with new source and destination arrays
 */
export function moveItemBetweenArrays<T>(
  sourceArray: T[],
  destArray: T[],
  sourceIndex: number,
  destIndex: number
): { source: T[]; destination: T[] } {
  const newSource = [...sourceArray]
  const newDest = [...destArray]
  
  const [removed] = newSource.splice(sourceIndex, 1)
  newDest.splice(destIndex, 0, removed)
  
  return {
    source: newSource,
    destination: newDest,
  }
}

/**
 * Insert an item at a specific index in an array
 * Returns a new array (immutable)
 * 
 * @param array - The array to insert into
 * @param item - The item to insert
 * @param index - The index to insert at
 * @returns A new array with the item inserted
 */
export function insertAtIndex<T>(array: T[], item: T, index: number): T[] {
  const result = [...array]
  result.splice(index, 0, item)
  return result
}

/**
 * Remove an item at a specific index from an array
 * Returns a new array (immutable)
 * 
 * @param array - The array to remove from
 * @param index - The index to remove
 * @returns A new array with the item removed
 */
export function removeAtIndex<T>(array: T[], index: number): T[] {
  const result = [...array]
  result.splice(index, 1)
  return result
}

/**
 * Remove an item by value from an array
 * Returns a new array (immutable)
 * 
 * @param array - The array to remove from
 * @param item - The item to remove
 * @returns A new array with the item removed
 */
export function removeItem<T>(array: T[], item: T): T[] {
  return array.filter((i) => i !== item)
}

/**
 * Calculate the new index after a drag and drop operation
 * Handles edge cases for @dnd-kit
 * 
 * @param activeIndex - Current index of dragged item
 * @param overIndex - Index of the item being dragged over
 * @returns The new index for the item
 */
export function calculateNewIndex(
  activeIndex: number,
  overIndex: number
): number {
  if (overIndex === undefined || overIndex === null) {
    return activeIndex
  }
  return overIndex
}

/**
 * Check if reordering is needed
 * 
 * @param fromIndex - Starting index
 * @param toIndex - Target index
 * @returns True if indices are different
 */
export function shouldReorder(fromIndex: number, toIndex: number): boolean {
  return fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0
}
