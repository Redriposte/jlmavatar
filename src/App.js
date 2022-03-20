import React, { useState, useRef } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import toast, { Toaster } from 'react-hot-toast';
import Preview from './components/Preview';

import badge1 from '../src/assets/img/badge1.png';
import badge2 from '../src/assets/img/badge2.png';
import badge3 from '../src/assets/img/badge3.png';
import badge4 from '../src/assets/img/badge4.png';
import empty from '../src/assets/img/empty.png';

export default function App() {
  const sceneSize = { x: 400, y: 400 };
  let [image, setImage] = useState(null);
  let [text, setText] = useState("");
  let [imageProps, setImageProps] = useState({ x: 0, y: 0, w: 400, h: 400 });
  let [loading, setLoading] = useState(false);
  let [uri, setUri] = useState(null);
  const selectedUsername = useRef("");
  let [showGenerate, setShowGenerate] = useState(false);
  const stageRef = useRef(null);
  let [template, setTemplate] = useState(null);

  function getTwitterPP(username) {
    if(username === '') {
      toast('Tchouff, tu as oublié ton pseudo');
      return;
    };
    setLoading(true);
    fetch(`https://justcors.com/l_e7vo5b3wv0i/https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`, {
      method: 'get',
      headers: new Headers({
          'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAALITaQEAAAAAo1VJiuik%2FqXwlj6inhDKHNwS7Qg%3DIb545XzbaPdAb9ElBXCrv4bHdq9JbxyT2LW2QMyM5RbiEQS2n2',
          'Content-Type': 'application/json',
          'mode': 'no-cors'
      })
    })
    .then(res => res.json())
    .then(async data => {
      selectedUsername.current = username;
      const bb = await fetch(data.data.profile_image_url.replace('_normal', "")).then(r => r.blob())
      setLoading(false);
      generateImage( bb, setImage );
      setShowGenerate(true);
    })
    .catch(e => {
      toast.error('Compte introuvable ou erroné');
      setLoading(false);
    })
  }

  const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    var ratio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
  };

  const generateImage = (file, cb) => {
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
    setShowGenerate(false);
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
    if(text === '') {
      return toast('Tchouff, tu as oublié ton pseudo');
    }
    if(selectedUsername.current !== text) {
      getTwitterPP(text);
    }
  }

  async function selectTemplate(selectedTemplate) {
    const bb = await fetch(selectedTemplate).then(r => r.blob())
    generateImage( bb, setTemplate );
    handleGenerate();
  }

  return (
    <main className="container app">
      <div className="row align-items-center">
        <div className="col-md-6 text-md-start text-center py-6 col-left">
          <h1 className="mb-4 fs-9 fw-bold"><span className="violet">Génère</span> <span className="red">ta photo twitter</span></h1>
          <Preview />
          <p className="mb-4 lh-2 lead text-secondary">
            Mélenchonise ta photo twitter
            et montre que tu vas voter pour le
            programme <span className="violet">L</span>'<span className="violet">A</span>venir <span className="violet">E</span>n <span className="violet">C</span>ommun.</p>
          <div className="text-center text-md-start">
          <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">@</span>
              <input
              id="input-text"
              className="input-text form-control"
              type="text"
              placeholder="JLMelenchon"
              value={text}
              onChange={handleKeyDown}
             />
            </div>
            <div className="badges mb-3">
              <ul>
                <li onClick={() => selectTemplate(badge1)} >
                  <img src={badge1} alt='img' className="fit-picture" />
                </li>
                <li onClick={() => selectTemplate(badge2)} >
                  <img src={badge2} alt='img' className="fit-picture" />
                </li>
                <li onClick={() => selectTemplate(badge3)} >
                  <img src={badge3} alt='img' className="fit-picture" />
                </li>
                <li onClick={() => selectTemplate(badge4)} >
                  <img src={badge4} alt='img' className="fit-picture" />
                </li>
              </ul>
            </div>
            {
              loading && (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )
            }
            <div className="text-right">
              <button className={`btn me-3 btn-lg export ${showGenerate ? "show" : "hidden"}`} onClick={handleExport}>Enregistrer</button>
            </div>
          </div>
        </div>
        <div className="col-md-6 text-center m-auto col-right">
          <main>
          {template === null ? (<img  src={empty} alt="consigne" />) :

            (<div className="stage" style={{ position: "relative" }}>
              <Stage width={sceneSize.x} height={sceneSize.y} ref={stageRef} style={{borderRadius: '50%', overflow: 'hidden', width: '400px', margin: 'auto'}}>
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
            </div>)
            }
          </main>
        </div>
      </div>

      <Toaster/>
    </main>
  )
}
