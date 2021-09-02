import React, { useState, useRef, useEffect } from "react";
import { Image as KonvaImage, Layer, Stage, Text as KonvaText } from "react-konva";
import Dropzone from "react-dropzone";
import useImage from "use-image";

import arrowSVG from "../src/assets/img/arrow.svg";
import cadre from "../src/assets/img/cadre.png";
import mac from "../src/assets/img/mac.jpg";


export default function App() {
  const sceneSize = { x: 828 / 2, y: 1259 / 2 };
  let [cadreimg] = useImage(cadre);
  let [macimg] = useImage(mac);

  let [image, setImage] = useState(null);
  let [text, setText] = useState("des cons");
  let [text2, setText2] = useState("vivement la fin de la saison");

  let [color] = useState("#e2001a");
  let [imageProps, setImageProps] = useState({ x: 0, y: 0, w: 828 / 2, h: 1259 / 2 });
  let [imageScale] = useState(1);

  let [hideStage] = useState(true);
  let [loading, setLoading] = useState(false);
  let [uri, setUri] = useState(null);
  let [showGenerate, setShowGenerate] = useState(true);
  let [strokeColor] = useState("#000000");
  let [imageText, setImageText] = useState("Choisir une image");
  const stageRef = useRef(null);

  useEffect(() => {
    generateImage(new Blob([mac]));
  }, [])

  const fileDrop = (acceptedFiles) => {
    generateImage(acceptedFiles[0]);
  };

  const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    var ratio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  };

  const generateImage = (file) => {
    setImageText(file.name);
    setShowGenerate(true);
    const reader = new FileReader();
    reader.onload = function (e) {
      let img = new window.Image();
      img.src = e.target.result;

      img.onload = function () {
        const imgR = calculateAspectRatioFit(img.naturalWidth, img.naturalHeight, 500, 500);

        setImageProps({
          x: sceneSize.x / 2 - imgR.width / 2,
          y: sceneSize.y / 2 - imgR.height / 2,
          w: imgR.width,
          h: imgR.height,
        });
        setImage(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e) => {
    setShowGenerate(true);
    setText((s) => (s = e.target.value));
  };

  const handleKeyDown2 = (e) => {
    setShowGenerate(true);
    setText2((s) => (s = e.target.value));
  };


  const handleExport = () => {

    setTimeout(() => {
      setUri(uri);
      downloadURI(uri, "macron-netflix.png");
    }, 100);
  };

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }

  function handleGenerate() {
    setLoading(s => s = true);
    setTimeout(() => {
      setShowGenerate(s => s = false);
      setLoading(s => s = false);
      //setHideStage(s => s = false);
      const uri = stageRef.current.toDataURL();
      setUri(uri);
    }, 1200 + (Math.random() * 1000));
  }

  return (
    <div className="app">
      <header>
        <h1>MACRON NETFLIX</h1>
      </header>

      <div className="imp">
        <label htmlFor="input-text">
          <span className="input-text-label">Titre du film</span>
          <input
            id="input-text"
            className="input-text"
            type="text"
            placeholder="Macron, président des riches"
            value={text}
            onChange={handleKeyDown}
          />
        </label>
      </div>

      <div className="imp">
        <label htmlFor="input-text">
          <span className="input-text-label">Sous-titre du film</span>
          <input
            id="input-text2"
            className="input-text"
            type="text"
            placeholder="Macr"
            value={text2}
            onChange={handleKeyDown2}
          />
        </label>
      </div>

      {/* <div className="imp">
        <span className="input-text-label">Charger votre image</span>
        <Dropzone onDrop={fileDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>{imageText}</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div> */}

      <div className={`generer-c ${showGenerate ? "show" : "hidden"} ${loading ? "isloading" : ""}`}>
        <button onClick={handleGenerate} className="generer">Générer</button>
      </div>

      <div className={loading ? "show generer-c" : "hidden generer-c"}>
        <div className="LoaderBalls">
          <div className="LoaderBalls__item"></div>
          <div className="LoaderBalls__item"></div>
          <div className="LoaderBalls__item"></div>
        </div>
      </div>

      <main className={hideStage ? "hidden" : "show"}>
        <div className="stage" style={{ position: "relative" }}>
          <Stage

          width={sceneSize.x} height={sceneSize.y} ref={stageRef}>
            <Layer>
              <KonvaImage
                // draggable
                image={macimg}
                scaleX={imageScale}
                scaleY={imageScale}
                x={imageProps.x}
                y={imageProps.y}
                width={imageProps.w}
                height={imageProps.h}
              />
              <KonvaText
                x={-20}
                y={165}
                text={text.toUpperCase()}
                align="center"
                fontSize={45}
                fontFamily="arial black"

                fill={color}
                width={450}
                // draggable
              />
              <KonvaText
                x={80}
                y={420}
                text={text2.toUpperCase()}
                align="center"
                fontSize={25}
                fontFamily="arial"
                fill={"#fff"}
                width={250}
                // draggable
              />
            </Layer>

            {/* <Layer>
              <KonvaImage x={0} y={0} image={cadreimg} />
            </Layer> */}
          </Stage>

          {/* <Stage
          className="canvas responsive-canvas"
          width={sceneSize.x} height={sceneSize.y} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            <Layer>
              <KonvaImage x={0} y={0} image={cadreimg} />
            </Layer>
          </Stage> */}
        </div>
      </main>

      <footer className={`${!showGenerate ? "show" : "hidden"}`}>
        { uri ? <img src={uri} alt=""/> : "" }
        <button className="export"  onClick={handleExport}>Enregistrer</button>

      </footer>
    </div>
  );
}
