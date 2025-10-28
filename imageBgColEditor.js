class ImageBgColEdtior {
  getMostRedColor(imageData) {
    const data = imageData.data;
    let maxRedness = -Infinity;
    let color = { r: 0, g: 0, b: 0, a: 255 };

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];
      const redness = r - (g + b) / 2;
      if (redness > maxRedness) {
        maxRedness = redness;
        color = { r, g, b, a };
      }
    }
    return color;
  }

  changeAllRed(img, tolerance) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    // e.g., build a map of colours
    const colourMap = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];
      const key = `${r},${g},${b},${a}`;
      colourMap[key] = (colourMap[key] || 0) + 1;
    }
    // decide which colour(s) to replace (e.g. find a key, or pick > threshold)
    const targetColour = this.getMostRedColor(imageData); // example
    const replacement = { r: 43, g: 50, b: 67 };

    // now replace
    for (let i = 0; i < data.length; i += 4) {
      if (
        Math.abs(data[i] - targetColour.r) < tolerance &&
        Math.abs(data[i + 1] - targetColour.g) < tolerance &&
        Math.abs(data[i + 2] - targetColour.b) < tolerance
      ) {
        data[i] = replacement.r;
        data[i + 1] = replacement.g;
        data[i + 2] = replacement.b;
        // leave alpha (data[i+3]) unchanged
      }
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }
}
