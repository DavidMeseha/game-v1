export default function isNearXZ(
  coords1: [number, number, number],
  coords2: [number, number, number],
  threshold: number = 4
) {
  return (
    Math.abs(coords1[0] - coords2[0]) < threshold &&
    Math.abs(coords1[2] - coords2[2]) < threshold &&
    Math.abs(coords1[1] - coords2[1]) < threshold
  );
}
