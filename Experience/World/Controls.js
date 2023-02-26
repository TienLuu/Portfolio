import GSAP from "gsap";
import Experience from "../Experience.js";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

export default class Controls {
   constructor() {
      this.experience = new Experience();
      this.scene = this.experience.scene;
      this.sizes = this.experience.sizes;
      this.resources = this.experience.resources;
      this.time = this.experience.time;
      this.camera = this.experience.camera;
      this.room = this.experience.world.room.actualRoom;
      this.room.children.forEach((child) => {
         if (child.type === "RectAreaLight") {
            this.rectLight = child;
         }
      });

      this.circleFirst = this.experience.world.floor.circleFirst;
      this.circleSecond = this.experience.world.floor.circleSecond;
      this.circleThird = this.experience.world.floor.circleThird;
      GSAP.registerPlugin(ScrollTrigger);

      this.setSmoothScroll();
      this.setScrollTrigger();

      // this.setPath();

      // const geometry = new THREE.BoxGeometry(16, 16, 16);
      // const material = new THREE.MeshNormalMaterial();
      // const cube = new THREE.Mesh(geometry, material);
      // this.scene.add(cube);

      // this.dummyVector = new THREE.Vector3(0, 0, 0);

      // this.lerp = {
      //    current: 0,
      //    target: 0,
      //    ease: 0.1,
      // };

      // this.position = new THREE.Vector3(0, 0, 0);
      // this.lookAtPosition = new THREE.Vector3(0, 0, 0);

      // this.directionalVector = new THREE.Vector3(0, 0, 0);
      // this.staticVector = new THREE.Vector3(0, -1, 0);
      // this.crossVector = new THREE.Vector3(0, 0, 0);

      // this.progress = 0;
      // this.setPath();
      // this.onWheel();
   }

   setupASScroll() {
      const asscroll = new ASScroll({
         ease: 0.1,
         disableRaf: true,
      });

      GSAP.ticker.add(asscroll.update);

      ScrollTrigger.defaults({
         scroller: asscroll.containerElement,
      });

      ScrollTrigger.scrollerProxy(asscroll.containerElement, {
         scrollTop(value) {
            if (arguments.length) {
               asscroll.currentPos = value;
               return;
            }
            return asscroll.currentPos;
         },
         getBoundingClientRect() {
            return {
               top: 0,
               left: 0,
               width: window.innerWidth,
               height: window.innerHeight,
            };
         },
         fixedMarkers: true,
      });

      asscroll.on("update", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", asscroll.resize);

      requestAnimationFrame(() => {
         asscroll.enable({
            newScrollElements: document.querySelectorAll(
               ".gsap-marker-start, .gsap-marker-end, [asscroll]"
            ),
         });
      });

      return asscroll;
   }

   setSmoothScroll() {
      this.asscroll = this.setupASScroll();
   }

   setScrollTrigger() {
      ScrollTrigger.matchMedia({
         // Desktop
         "(min-width: 969px)": () => {
            this.room.scale.set(0.11, 0.11, 0.11);
            this.rectLight.width = 0.5;
            this.rectLight.height = 0.7;
            this.room.position.set(0, 0, 0);

            // First section -------------------------------------
            this.firstMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".first-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            });
            this.firstMoveTimeline.fromTo(
               this.room.position,
               { x: 0, y: 0, z: 0 },
               {
                  x: () => {
                     return this.sizes.width * 0.0014;
                  },
               }
            );

            // Second section -------------------------------------
            this.secondMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".second-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            })
               .to(
                  this.room.position,
                  {
                     x: () => {
                        return 1;
                     },
                     z: () => {
                        return this.sizes.height * 0.0032;
                     },
                  },
                  "same"
               )
               .to(
                  this.room.scale,
                  {
                     x: 0.4,
                     y: 0.4,
                     z: 0.4,
                  },
                  "same"
               )
               .to(
                  this.rectLight,
                  {
                     width: 0.5 * 4,
                     height: 0.7 * 4,
                  },
                  "same"
               );

            // Third section -------------------------------------
            this.thirdMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".third-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            }).to(this.camera.orthographicCamera.position, {
               y: 1.5,
               x: -4.1,
            });
         },

         // Mobile
         "(max-width: 968px)": () => {
            // Resets
            this.room.scale.set(0.07, 0.07, 0.07);
            this.rectLight.width = 0.3;
            this.rectLight.height = 0.4;

            // First section -------------------------------------
            this.firstMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".first-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            }).to(this.room.scale, {
               x: 0.1,
               y: 0.1,
               z: 0.1,
            });

            // Second section -------------------------------------
            this.secondMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".second-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            })
               .to(
                  this.room.scale,
                  {
                     x: 0.25,
                     y: 0.25,
                     z: 0.25,
                  },
                  "same"
               )
               .to(
                  this.rectLight,
                  {
                     width: 0.3 * 3.4,
                     height: 0.4 * 3.4,
                  },
                  "same"
               )
               .to(
                  this.room.position,
                  {
                     x: 1.5,
                  },
                  "same"
               );

            // Third section -------------------------------------
            this.thirdMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".third-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            });
         },

         all: () => {
            this.sections = document.querySelectorAll(".section");
            this.sections.forEach((section) => {
               this.progressWrapper =
                  section.querySelector(".progress-wrapper");
               this.progressBar = section.querySelector(".progress-bar");

               if (section.classList.contains("right")) {
                  GSAP.to(section, {
                     borderTopLeftRadius: 10,
                     scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 0.6,
                     },
                  });
                  GSAP.to(section, {
                     borderBottomLeftRadius: 700,
                     scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 0.6,
                     },
                  });
               } else {
                  GSAP.to(section, {
                     borderTopRightRadius: 10,
                     scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 0.6,
                     },
                  });
                  GSAP.to(section, {
                     borderBottomRightRadius: 700,
                     scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top top",
                        scrub: 0.6,
                     },
                  });
               }

               GSAP.from(this.progressBar, {
                  scaleY: 0,
                  scrollTrigger: {
                     trigger: section,
                     start: "top top",
                     end: "bottom bottom",
                     scrub: 0.4,
                     pin: this.progressWrapper,
                     pinSpacing: false,
                  },
               });
            });

            // All Animations
            // First section -------------------------------------
            this.firstMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".first-move",
                  start: "top top",
                  end: "bottom bottm",

                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            }).to(this.circleFirst.scale, {
               x: 3,
               y: 3,
               z: 3,
            });

            // Second section -------------------------------------
            this.secondMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".second-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            })
               .to(
                  this.circleSecond.scale,
                  {
                     x: 3,
                     y: 3,
                     z: 3,
                  },
                  "same"
               )
               .to(
                  this.room.position,
                  {
                     x: -0.3,
                     y: 0,
                  },
                  "same"
               );

            // Third section -------------------------------------
            this.thirdMoveTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".third-move",
                  start: "top top",
                  end: "bottom bottm",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
               },
            })
               .to(
                  this.circleThird.scale,
                  {
                     x: 3,
                     y: 3,
                     z: 3,
                  },
                  "same"
               )
               .to(
                  this.room.position,
                  {
                     x: 1,
                  },
                  "same"
               );

            // Mini Platform Animations
            this.secondPartTimeline = new GSAP.timeline({
               scrollTrigger: {
                  trigger: ".third-move",
                  start: "center center",
               },
            });

            this.room.children.forEach((child) => {
               if (child.name === "Mini_Floor") {
                  this.first = GSAP.to(child.position, {
                     x: -5.44055,
                     z: 13.6135,
                     duration: 0.6,
                  });
               }

               if (child.name === "Mailbox") {
                  this.second = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     duration: 0.6,
                  });
               }

               if (child.name === "Lamp") {
                  this.third = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     ease: "back.out(2)",
                     duration: 0.6,
                  });
               }
               if (child.name === "FloorFirst") {
                  this.fourth = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     ease: "back.out(2)",
                     duration: 0.6,
                  });
               }
               if (child.name === "FloorSecond") {
                  this.fifth = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     duration: 0.6,
                  });
               }
               if (child.name === "FloorThird") {
                  this.sixth = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     ease: "back.out(2)",
                     duration: 0.6,
                  });
               }
               if (child.name === "Dirt") {
                  this.seventh = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     ease: "back.out(2)",
                     duration: 0.6,
                  });
               }
               if (child.name === "Flower1") {
                  this.eighth = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     ease: "back.out(2)",
                     duration: 0.6,
                  });
               }
               if (child.name === "Flower2") {
                  this.ninth = GSAP.to(child.scale, {
                     x: 1,
                     y: 1,
                     z: 1,
                     ease: "back.out(2)",
                     duration: 0.6,
                  });
               }
            });

            this.secondPartTimeline.add(this.first);
            this.secondPartTimeline.add(this.second);
            this.secondPartTimeline.add(this.third);
            this.secondPartTimeline.add(this.fourth, "-=0.2");
            this.secondPartTimeline.add(this.fifth, "-=0.2");
            this.secondPartTimeline.add(this.sixth, "-=0.2");
            this.secondPartTimeline.add(this.seventh, "-=0.2");
            this.secondPartTimeline.add(this.eighth);
            this.secondPartTimeline.add(this.ninth, "-=0.1");
         },
      });
   }

   // setPath() {
   //    this.timeline = new GSAP.timeline();
   //    this.timeline.to(this.room.position, {
   //       x: () => {
   //          return this.sizes.width * 0.0012;
   //       },
   //       scrollTrigger: {
   //          trigger: ".firstMove",
   //          markers: true,
   //          start: "top top",
   //          end: "bottom bottom",
   //          scrub: true,
   //          invalidateOnRefresh: true,
   //       },
   //    });
   // }

   // setPath() {
   //    //Create a closed wavey loop
   //    this.curve = new THREE.CatmullRomCurve3(
   //       [
   //          new THREE.Vector3(-5, 0, 0),
   //          new THREE.Vector3(0, 0, -5),
   //          new THREE.Vector3(5, 0, 0),
   //          new THREE.Vector3(0, 0, 5),
   //       ],
   //       true
   //    );

   //    const points = this.curve.getPoints(50);
   //    const geometry = new THREE.BufferGeometry().setFromPoints(points);

   //    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

   //    // Create the final object to add to the scene
   //    const curveObject = new THREE.Line(geometry, material);
   //    this.scene.add(curveObject);
   // }

   // onWheel() {
   //    window.addEventListener("wheel", (e) => {
   //       if (e.deltaY > 0) {
   //          this.lerp.target += 0.01;
   //          this.back = false;
   //       } else {
   //          this.lerp.target -= 0.01;
   //          this.back = true;
   //       }
   //    });
   // }

   resize() {}

   update() {
      // this.lerp.current = GSAP.utils.interpolate(
      //    this.lerp.current,
      //    this.lerp.target,
      //    this.lerp.ease
      // );
      // if (this.back) {
      //    this.lerp.target -= 0.001;
      // } else {
      //    this.lerp.target += 0.001;
      // }
      // this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current);
      // this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target);
      // this.curve.getPointAt(this.lerp.current, this.position);
      // this.camera.orthographicCamera.position.copy(this.position);
      // this.curve.getPointAt(this.lerp.current % 1, this.position);
      // this.camera.orthographicCamera.position.copy(this.position);
      // this.directionalVector.subVectors(
      //    this.curve.getPointAt((this.lerp.current % 1) + 0.000001),
      //    this.position
      // );
      // this.directionalVector.normalize();
      // this.crossVector.crossVectors(this.directionalVector, this.staticVector);
      // this.crossVector.multiplyScalar(100000);
      // this.camera.orthographicCamera.lookAt(0, 0, 0);
   }
}
