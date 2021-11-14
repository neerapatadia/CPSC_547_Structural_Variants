// calculates dimensions with respect to the width and max width
// of the main container
export const getDimensions = (proportion) => {
  const containerWidth = 0.9;
  const maxWidth = 1400;
  const calcWidth = window.innerWidth * containerWidth * proportion;
  const maxWidthAllowed = maxWidth * containerWidth * proportion;

  // calculated width is larger than the max width allowed
  if (calcWidth > maxWidthAllowed) {
    return maxWidthAllowed;
  }

  return calcWidth;
};
