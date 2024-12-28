export async function getAverageColor(imageSrc: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
        if (!imageData) {
          resolve("rgb(76, 29, 149)"); // Default color if we can't process the image
          return;
        }
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
        }
        r = Math.floor(r / (imageData.length / 4));
        g = Math.floor(g / (imageData.length / 4));
        b = Math.floor(b / (imageData.length / 4));
        resolve(`rgb(${r}, ${g}, ${b})`);
      };
    });
  }
  
  