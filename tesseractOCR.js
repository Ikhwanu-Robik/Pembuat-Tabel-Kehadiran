class TesseractOCRWrapper {
  removeTrailingPipes(arr) {
    return arr.map((str) => str.replace(/\|+$/, "").trim());
  }

  /*async recognizeImage(files) {
    const worker = await Tesseract.createWorker("ind");
    let allResult = [];

    for (const file of files) {
      console.log("starting to recognize file");
      const ret = await worker.recognize(file);
      const result = ret.data.text;

      const resultArr = result.split(/\r?\n/);
      allResult = allResult.concat(resultArr);
    }

    const finalResult = this.removeTrailingPipes(allResult);
    await worker.terminate();

    return finalResult;
  }*/
  
  async recognizeImage(files) {
  const worker = await Tesseract.createWorker("ind");

  const promises = files.map(async (file) => {
    console.log("starting to recognize file");
    const ret = await worker.recognize(file);
    const resultArr = ret.data.text.split(/\r?\n/);
    return resultArr;
  });

  const results = await Promise.all(promises);
  const allResult = results.flat(); // flatten array of arrays

  const finalResult = this.removeTrailingPipes(allResult);

  await worker.terminate();
  
  return finalResult;
}
}
