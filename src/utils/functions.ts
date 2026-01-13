// make me a function that take a number of 6 digits and generate a beautiful color based on that code
// make the colors light based on the code
export const generateColor1 = (code: string) => {
  const r = parseInt(code.substring(0, 2), 16)
  const g = parseInt(code.substring(2, 4), 16)
  const b = parseInt(code.substring(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Generates a soft, light color from a 6-digit number.
 * @param code - A 6-digit number (e.g., 123456)
 * @returns A CSS HSL color string (e.g., "hsl(210, 55%, 85%)")
 */
export function generateColor(code: number): string {
  // Ensure it's a 6-digit number
  const safeCode = Math.abs(code % 1000000)

  // Use all digits to generate unique H, S, L
  const str = safeCode.toString().padStart(6, '0')
  const hue = parseInt(str.slice(0, 3), 10) % 360 // 0-359
  const sat = 35 + (parseInt(str.slice(3, 5), 10) % 21) // 35-55%
  const light = 88 + (parseInt(str.slice(5, 6), 10) % 7) // 88-94%

  return `hsl(${hue}, ${sat}%, ${light}%)`
}

export function isRTKQueryError(err: unknown): err is { status: number } {
  return typeof err === 'object' && err !== null && 'status' in err
}
