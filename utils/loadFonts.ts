export const loadCustomFonts = async () => {
  const fontLoadPromises = [
    new FontFace(
      "Caveat",
      "url(https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2Q7ZjYY.woff2)"
    ).load(),
    new FontFace(
      "Work Sans",
      "url(https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.woff2)"
    ).load(),

    // Add other fonts similarly
  ];

  try {
    const loadedFonts = await Promise.all(fontLoadPromises);
    loadedFonts.forEach((font) => {
      document.fonts.add(font);
    });
    await document.fonts.ready;
  } catch (error) {
    console.error("Error loading fonts:", error);
  }
};
