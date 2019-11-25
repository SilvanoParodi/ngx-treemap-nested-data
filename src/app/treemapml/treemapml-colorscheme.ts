var colorsScheme = [
  "air",
  "solar",
  "nightLights",
  "fire",
  "natural",
  "aqua",
  "picnic",
  "horizon",
  "forest",
  "ocean",
  "flame"
];

export function getColorScheme(index: number): string {
  return colorsScheme.length > index ? colorsScheme[index] : colorsScheme[0];
}
