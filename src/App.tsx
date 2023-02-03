import './App.css'
import { MpSdk } from "../public/mp_bundle/sdk";

declare global {
  interface Window {
    MP_SDK: any;
  }
}

async function handleShowcaseLoad() {
  const showcaseIframe = document.getElementById("showcase_iframe") as HTMLIFrameElement;
  try {
    if (showcaseIframe.contentWindow) {
      let sdk = await showcaseIframe.contentWindow.MP_SDK.connect(
        showcaseIframe
      );
      sdk.App.state.subscribe((state: any) => {
        if (state.phase === sdk.App.Phase.PLAYING) {
          onSdkConnect(sdk);
        }
      });
    }
  } catch (e) {
    console.error(e);
    return;
  }
}

async function onSdkConnect(sdk: MpSdk) {
  console.log('SDK Connected: ', sdk)
  // run your SDK code here

  var [sceneObject] = await sdk.Scene.createObjects(1);
  var logoNode = sceneObject.addNode("logoNode");
  var lightNode = sceneObject.addNode("lightNode");

  var logoInitialInputs = {
    url: "/assets/Matterport_Logo.gltf",
    visible: true,
    localScale: {
      x: 0.1,
      y: 0.1,
      z: 0.1,
    },
  };

  var directionalLightInitialInputs = {
    enabled: true,
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
    intensity: 2,
    target: {
      x: 0,
      y: 0,
      z: 0,
    },
    debug: false,
  };

  var ambientLightInitialInputs = {
    intensity: 1,
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
  }

  logoNode.addComponent(
    "mp.gltfLoader",
    logoInitialInputs
  );

  var lightComponent = lightNode.addComponent(
    "mp.directionalLight",
    directionalLightInitialInputs
  );
  
  lightNode.addComponent(
    "mp.ambientLight",
    ambientLightInitialInputs
  );

  sceneObject.start();
  logoNode.obj3D.position.set(0, 0, 0);
  lightComponent.light.target = logoNode.obj3D;

  const tick = function () {
    requestAnimationFrame(tick);
    logoNode.obj3D.rotation.y += 0.01;
  };
  tick();
}

function App() {
  return (
    <div className="App">
      <iframe id={'showcase_iframe'} width={'800px'} height={'600px'} frameBorder={0} src='./mp_bundle/showcase.html?m=j4RZx7ZGM6T&applicationKey=5n1rihzdbgxus7k1exfne27ac&play=1' onLoad={handleShowcaseLoad}></iframe>
    </div>
  )
}

export default App
