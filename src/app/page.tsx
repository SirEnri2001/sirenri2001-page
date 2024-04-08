'use client'
import Image from "next/image";
import * as React from 'react';
const ThemeContext = React.createContext(null);
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const useDeviceSize = () => {

  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  React.useEffect(() => {
    // component is mounted and window is available
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    // unsubscribe from the event on component unmount
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return [width, height]

}

var renderCount = 0;


function VideoScroll({scrollYStarts, scrollYEnds, trimStartSeconds, trimEndSseconds} : {scrollYStarts: number, scrollYEnds: number, trimStartSeconds?: number, trimEndSseconds?:number}) {
  const vid = React.createRef<HTMLVideoElement>();
  React.useEffect(()=>{
    const videoLength = vid.current?.duration==null?0:vid.current?.duration;
    vid?.current?.setAttribute("autobuffer", "autobuffer");
    window.onscroll = (event)=>{
      if(vid.current==null){
        return;
      }
      var v : HTMLVideoElement = vid.current;
      const startsSecond = trimStartSeconds?trimStartSeconds:0;
      const endsSecond = trimEndSseconds?trimEndSseconds:videoLength;

      v.currentTime = Math.max(((endsSecond - startsSecond)*(window.scrollY - scrollYStarts)/(scrollYEnds - scrollYStarts)+startsSecond), 0);
    };
  });
  return (
    <video id="v0" ref={vid} tabIndex={0} preload="preload">
      <source type="video/mp4" src="output.mp4"></source>
    </video>
  )
}


function ScrollArea({scrollPos} : {scrollPos : React.RefObject<number>}) {
  const [frameNum, setFrameNum] = React.useState(0);
  const [width, height] = useDeviceSize();
  const ref = React.useRef<HTMLDivElement>(null);
  const [videoScrollYStart, setVideoScrollYStart] = React.useState(0);
  const [videoScrollYEnd, setVideoScrollYEnd] = React.useState(0);
  const headingVerticalTransform = {transform: `translate(0px, 0px)`};
  React.useEffect(()=>{
    setFrameNum(height- (scrollPos.current?scrollPos.current:0));
    if(ref.current){
      setVideoScrollYStart(ref.current?.getBoundingClientRect().top - document.body.getBoundingClientRect().top - height);
      setVideoScrollYEnd(ref.current?.getBoundingClientRect().bottom - document.body.getBoundingClientRect().top);
    }
    window.onscroll = (event)=>{
      
    }
  });

  let screenTop = ref.current?.getBoundingClientRect().top;
  screenTop = screenTop?screenTop:0;
  const viewportOverlayStyle = {"opacity": Math.min(0.8, (screenTop+height/2-200)/300) } as React.CSSProperties;
  return (
    <div ref={ref} className="scroll-animated-section">
        <div className="headline" style={headingVerticalTransform}>
          <h1>Free your desktop. <br/> And your apps will follow. {screenTop}</h1>
        </div>
        <div className="scroll-container">
          <div className="sticky-element">
            <div className="viewport-overlay" style={viewportOverlayStyle}></div>
            <VideoScroll scrollYStarts={videoScrollYStart} scrollYEnds={videoScrollYEnd} trimEndSseconds={20} trimStartSeconds={0}/>
          </div>
        </div>
    </div>
      
  );
}

export default function Home() {
  let areaHeight = 5000;
  const scrollPos = React.useRef(0);
  React.useEffect(function mount() {
    function onScroll() {
      scrollPos.current = window.scrollY;
    }

    window.addEventListener("scroll", onScroll);

    return function unMount() {
      window.removeEventListener("scroll", onScroll);
    };
  });
  return (
    <>
      <h1>Welcome to my app</h1>
      <div style={{height: "150vh"}}></div>
      <ScrollArea scrollPos={scrollPos}/>
      <div style={{height: "150vh"}}></div>
    </>
  );
}
