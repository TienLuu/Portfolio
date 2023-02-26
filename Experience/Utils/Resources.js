import * as THREE from "three";
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import Experience from "../Experience.js";

export default class Resources extends EventEmitter {
   constructor(assets) {
      super();
      this.experience = new Experience();
      this.renderer = this.experience.renderer;

      this.assets = assets;

      this.item = {};
      this.queue = this.assets.length;
      this.loaded = 0;

      this.setLoaders();
      this.startLoading();
   }

   setLoaders() {
      this.loaders = {};
      this.loaders.gltfLoader = new GLTFLoader();
      this.loaders.dracoLoader = new DRACOLoader();
      this.loaders.dracoLoader.setDecoderPath("/draco/");
      this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
   }

   startLoading() {
      for (const asset of this.assets) {
         if (asset.type === "glbModel") {
            this.loaders.gltfLoader.load(asset.path, (file) => {
               this.singleAssetLoaded(asset, file);
            });
         } else if (asset.type === "videoTexture") {
            this.video = {};
            this.videoTexutre = {};
            this.video[asset.name] = document.createElement("video");
            this.video[asset.name].src = asset.path;
            this.video[asset.name].muted = true;
            this.video[asset.name].playsInline = true;
            this.video[asset.name].autoPlay = true;
            this.video[asset.name].loop = true;
            // this.video[asset.name].play();
            this.videoTexutre[asset.name] = new THREE.VideoTexture(
               this.video[asset.name]
            );
            this.videoTexutre[asset.name].flipY = true;
            this.videoTexutre[asset.name].minFilter = THREE.NearestFilter;
            this.videoTexutre[asset.name].magFilter = THREE.NearestFilter;
            this.videoTexutre[asset.name].generateMipmaps = false;
            this.videoTexutre[asset.name].encoding = THREE.sRGBEncoding;
            this.singleAssetLoaded(asset, this.videoTexutre[asset.name]);
         }
      }
   }

   singleAssetLoaded(asset, file) {
      this.item[asset.name] = file;
      this.loaded++;

      if (this.loaded === this.queue) {
         this.emit("ready");
      }
   }
}
