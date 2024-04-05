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
  const frameRate = 60;
  renderCount +=1;
  // console.log(scrollYEnds);
  // console.log(scrollYStarts);
  React.useEffect(()=>{
    var playbackConst = 500; 
    const videoLength = vid.current?.duration==null?0:vid.current?.duration;
    vid?.current?.setAttribute("autobuffer", "autobuffer");
    window.onscroll = (event)=>{
      if(vid.current==null){
        return;
      }
      var v : HTMLVideoElement = vid.current;
      v.currentTime = Math.max(videoLength*(window.scrollY - scrollYStarts)/(scrollYEnds - scrollYStarts + 1), 0);
      //console.log(v.currentTime);
    };
    // dynamically set the page height according to video length
    // vid.current.addEventListener('loadedmetadata', function() {
    //   //setHeight.style.height = Math.floor(vid.duration) * playbackConst + "px";
    // });
  });
  return (
    <video id="v0" ref={vid} tabIndex={0} preload="preload">
      <source type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;" src="https://www.apple.com/media/us/mac-pro/2013/16C1b6b5-1d91-4fef-891e-ff2fc1c1bb58/videos/macpro_main_desktop.mp4"></source>
    </video>
  )
}


function ScrollArea({scrollPos} : {scrollPos : React.RefObject<number>}) {
  const [frameNum, setFrameNum] = React.useState(0);
  const [width, height] = useDeviceSize();
  const ref = React.useRef<HTMLDivElement>(null);
  const [videoScrollYStart, setVideoScrollYStart] = React.useState(0);
  const [videoScrollYEnd, setVideoScrollYEnd] = React.useState(0);
  React.useEffect(()=>{
    setFrameNum(height- (scrollPos.current?scrollPos.current:0));
    if(ref.current){
      setVideoScrollYStart(ref.current?.getBoundingClientRect().top+window.innerHeight);
      setVideoScrollYEnd(ref.current?.getBoundingClientRect().bottom);
      console.log(videoScrollYStart);
      console.log(videoScrollYEnd);
    }
  });

  let screenTop = ref.current?.getBoundingClientRect().top;
  screenTop = screenTop?screenTop:0;
  const viewportOverlayStyle = {"opacity": Math.min(0.8, (screenTop+height/2-200)/300) } as React.CSSProperties;
  return (
    <div ref={ref} className="scroll-animated-section">
        <div className="headline">
          <h1>Free your desktop. <br/> And your apps will follow. {screenTop}</h1>
        </div>
        <div className="scroll-container">
          <div className="sticky-element">
            <div className="viewport-overlay" style={viewportOverlayStyle}></div>
            <VideoScroll scrollYStarts={videoScrollYStart} scrollYEnds={videoScrollYEnd}/>
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
