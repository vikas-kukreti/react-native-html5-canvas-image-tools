import Canvas, { Image } from "react-native-canvas";

async function getImage(uri, canvas) {
  const req = await fetch(uri);
  const blob = await req.blob();
  return new Promise((res, rej) => {
    var reader = new FileReader();
    reader.onload = function () {
      const image = new Image(canvas);
      image.addEventListener("load", () => {
        res(image);
      });
      image.src = reader.result;
    };
    reader.readAsDataURL(blob);
  });
}

function ImageCropper(props) {
  const handleCanvas = (canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    props.utilsRef.current = {
      rotate: async function (uri, angle) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const image = await getImage(uri, canvas);
        if (Math.abs(angle) === 90 || Math.abs(angle) === 270) {
          canvas.width = image.height;
          canvas.height = image.width;
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        ctx.restore();
        const base64 = JSON.parse(await canvas.toDataURL("image/jpeg"));
        return base64;
      },
      crop: async function (uri, x, y, w, h) {
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const image = await getImage(uri, canvas);
        ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
        const base64 = JSON.parse(await canvas.toDataURL("image/jpeg"));
        return base64;
      },
    };
  };

  return (
    <Canvas
      ref={handleCanvas}
      style={{ width: 0, height: 0, position: "absolute" }}
    />
  );
}

export default ImageCropper;
