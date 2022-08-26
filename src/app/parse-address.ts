
export function parseAddress(query: string): void {
  const shortPattern = /^([\w\s]+)\s(\d+)$/;
  const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w]+)$/;
  let match: string[] | null = query.match(shortPattern);

  if (match) {
    const [, street, streetNumber] = match;
    return;
  } else {
    match = query.match(longPattern);
    if (match) {
      const [, street, streetNumber, zip, city] = match;
      return;
    }
  }

  throw new Error('Could not parse address. Invalid format.');
}
