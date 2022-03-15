import React, { useState, useRef } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";

import badge1 from '../src/assets/img/badge1.png';
import badge2 from '../src/assets/img/badge2.png';


export default function App() {
  const sceneSize = { x: 400, y: 400 };
  let [image, setImage] = useState(null);
  let [text, setText] = useState("JLMelenchon");
  let [imageProps, setImageProps] = useState({ x: 0, y: 0, w: 400, h: 400 });
  let [loading, setLoading] = useState(false);
  let [uri, setUri] = useState(null);
  let [showGenerate, setShowGenerate] = useState(true);
  const stageRef = useRef(null);
  let [template, setTemplate] = useState(null);

  function getTwitterPP(username) {
    fetch(`https://justcors.com/tl_79c52e0/https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`, {
      method: 'get',
      headers: new Headers({
          'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAALITaQEAAAAAo1VJiuik%2FqXwlj6inhDKHNwS7Qg%3DIb545XzbaPdAb9ElBXCrv4bHdq9JbxyT2LW2QMyM5RbiEQS2n2',
          'Content-Type': 'application/json',
          'mode': 'no-cors'
      })
    })
    .then(res => res.json())
    .then(async data => {
      const bb = await fetch(data.data.profile_image_url.replace('_normal', "")).then(r => r.blob())
      generateImage( bb, setImage )
    })
  }

  // useEffect(() => {
  //   generateImage(new Blob([mac]));
  // }, [])

  const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    var ratio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  };

  const generateImage = (file, cb) => {
    //setShowGenerate(true);
    const reader = new FileReader();
    reader.onload = function (e) {
      let img = new window.Image();
      img.src = e.target.result;

      img.onload = function () {
        const imgR = calculateAspectRatioFit(img.naturalWidth, img.naturalHeight, 400, 400);

        setImageProps({
          x: 0,
          y: 0,
          w: imgR.width,
          h: imgR.height,
        });
        cb(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e) => {
    setShowGenerate(true);
    setText((s) => (s = e.target.value));
  };

  const handleExport = () => {
    setTimeout(() => {
      setUri(uri);
      downloadURI(uri, "jlm-avatar.png");
    }, 100);
  };

  function downloadURI(uri, name) {
    setTimeout(() => {
      setShowGenerate(s => s = false);
      setLoading(s => s = false);
      //setHideStage(s => s = false);
      const uri = stageRef.current.toDataURL();
      setUri(uri);

      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 10);



  }

  function handleGenerate() {
    setLoading(s => s = true);
    getTwitterPP(text);
  }

  async function selectTemplate(selectedTemplate) {
    const bb = await fetch(selectedTemplate).then(r => r.blob())
    generateImage( bb, setTemplate );
  }

  return (
    <div className="app">
      <header>
        <h1>JLM AVATAR</h1>
      </header>

      <div className="imp">
        <label htmlFor="input-text">
          <span className="input-text-label">Pseudo twitter</span>
          <input
            id="input-text"
            className="input-text"
            type="text"
            placeholder="@username"
            value={text}
            onChange={handleKeyDown}
          />
        </label>
      </div>

      <div className={`generer-c ${showGenerate ? "show" : "hidden"} ${loading ? "isloading" : ""}`}>
        <button onClick={handleGenerate} className="generer">Charger</button>
      </div>

      <h4>Liste templates</h4>
      <ul>
        <li className="list" onClick={() => selectTemplate(badge1)}>
        <img className="fit-picture"
     src={badge1}
     alt="Grapefruit slice atop a pile of other slices" />
        </li>
        <li className="list" onClick={() => selectTemplate(badge2)}>
        <img className="fit-picture"
     src={badge2}
     alt="Grapefruit slice atop a pile of other slices" />
        </li>
      </ul>

      <div className={loading ? "show generer-c" : "hidden generer-c"}>
        <div className="LoaderBalls">
          <div className="LoaderBalls__item"></div>
          <div className="LoaderBalls__item"></div>
          <div className="LoaderBalls__item"></div>
        </div>
      </div>

      <main>
        <div className="stage" style={{ position: "relative" }}>
          <Stage

          width={sceneSize.x} height={sceneSize.y} ref={stageRef}>
            <Layer>
              <KonvaImage
                image={image}
                x={imageProps.x}
                y={imageProps.y}
                width={imageProps.w}
                height={imageProps.h}
              />
            </Layer>

            <Layer>
              <KonvaImage
                image={template}
                x={imageProps.x}
                y={imageProps.y}
                width={imageProps.w}
                height={imageProps.h}
              />
            </Layer>
          </Stage>
        </div>
      </main>



      <footer className={`${!showGenerate ? "show" : "hidden"}`}>
        {/* { uri ? <img src={uri} alt=""/> : "" } */}
        <button className="export"  onClick={handleExport}>Enregistrer</button>

      </footer>
    </div>
  );
}
