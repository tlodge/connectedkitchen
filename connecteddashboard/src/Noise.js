import "./dashboard.css";
import { useD3 } from "./hooks/useD3";
import {memo} from 'react';

function Noise(props) {

    const renderNoise = (root, data=[])=>{

        const g = root.select("g.noisecontainer");

        const noise = g.selectAll("g.noisegroup").data(data, (d,i)=>i)
        const noiseg = noise.enter().append("g").attr("class", "noisegroup").attr("opacity",0).attr("transform", d=>`translate(${d[0]},${d[1]})`)

        noiseg.transition().duration(1000).attr("opacity",1)
        noiseg.append("path").attr("id", "bullhorn").attr("d", "M195.156,133.437C192.065,134.672 188.222,136.437 186.878,137.057C186.728,137.126 186.955,137.504 186.906,137.617C186.856,137.729 186.647,137.844 186.58,137.731C186.436,137.487 186.135,136.905 185.823,136.275L185.823,136.276L185.798,136.224L185.799,136.223C185.513,135.58 185.259,134.975 185.162,134.707C185.117,134.583 185.334,134.484 185.45,134.513C185.566,134.542 185.712,134.96 185.858,134.881C187.734,133.854 194.627,130.066 196.705,128.355C197.7,127.535 197.95,125.278 198.325,124.612C198.443,124.403 198.833,124.129 198.959,124.356C199.348,125.06 200.197,126.802 201.048,128.609L201.047,128.61C201.884,130.401 202.67,132.142 202.961,132.887C203.055,133.13 202.607,133.278 202.375,133.245C201.637,133.14 199.77,131.949 198.533,132.253C198.072,132.366 197.467,132.563 196.771,132.816C197.27,133.276 197.696,133.849 198.011,134.52C199.202,137.059 198.346,140.038 196.101,141.168C193.857,142.298 191.067,141.155 189.876,138.616C189.51,137.835 189.424,137.307 189.426,136.51L190.736,135.843C190.631,136.545 190.727,137.299 191.057,138.002C191.875,139.745 193.818,140.516 195.394,139.722C196.971,138.928 197.586,136.869 196.769,135.126C196.408,134.356 195.827,133.776 195.156,133.437Z").attr("class", "bullhorn");

        noise.transition().duration(1000).attr("opacity",1).attr("transform", d=>`translate(${d[0]},${d[1]})`)
        noise.exit().transition().duration(1000).attr("opacity",0).remove();
    }

    const noiseref = useD3((root)=>{
        const mic = props.data;
        renderNoise(root,Array.from({length: Math.min(200,mic/20)},() => ([-30 + Math.floor(Math.random() * 100), 70 - Math.floor(Math.random()*90)])));
    });

    return (<g ref={noiseref} id="noise">
            <rect id="noiserect" x="138.978" y="102.577" width="130.892" height="103.7" className="noiserect"/>
            <g class="noisecontainer"></g>
            <path id="bigbull" className="bigbull" d="M139.102,165.062C144.458,161.777 149,158.814 151.966,156.549C158.005,151.939 160.313,140.273 162.731,136.703C163.489,135.584 165.836,134.022 166.471,135.132C168.441,138.578 172.648,147.151 176.844,156.054L176.841,156.056C180.962,164.885 184.807,173.478 186.192,177.175C186.643,178.378 184.007,179.326 182.689,179.252C178.486,179.016 168.206,173.688 160.975,175.759C158.282,176.53 154.723,177.792 150.627,179.376C153.315,181.524 155.546,184.285 157.097,187.591C159.81,193.374 159.972,199.821 158.043,205.746L149.459,205.746C151.634,201.124 151.896,195.843 149.721,191.207C147.941,187.414 144.827,184.683 141.096,183.222C140.437,183.496 139.773,183.775 139.102,184.058L139.102,165.062Z"></path>
            <path id="bigbullinner" className="bigbullinner" d="M183.987,177C183.825,177.063 183.654,177.116 183.486,177.157C183.237,177.217 182.994,177.251 182.802,177.239C182.082,177.192 181.17,176.965 180.116,176.66C178.242,176.117 175.955,175.315 173.522,174.627C171.002,173.931 168.341,173.356 165.786,173.228C163.905,173.134 162.081,173.282 160.406,173.77C159.159,174.137 157.73,174.606 156.152,175.166C154.269,175.835 152.172,176.634 149.914,177.531C149.585,177.661 149.301,177.871 149.09,178.139C148.879,178.407 148.733,178.728 148.682,179.077C148.632,179.425 148.673,179.773 148.799,180.089C148.925,180.404 149.129,180.688 149.405,180.905C150.665,181.89 151.82,183.019 152.841,184.288C153.836,185.523 154.707,186.886 155.427,188.374C156.654,190.907 157.352,193.652 157.565,196.425C157.771,199.117 157.525,201.834 156.854,204.411L156.585,204.415C155.276,204.44 152.399,204.495 151.15,204.519C151.842,202.37 152.191,200.082 152.137,197.809C152.078,195.335 151.544,192.881 150.458,190.654C149.47,188.631 148.108,186.997 146.487,185.68C144.858,184.358 142.97,183.357 140.945,182.602C142.933,183.418 144.777,184.474 146.352,185.84C147.898,187.179 149.183,188.818 150.088,190.827C151.076,193.019 151.522,195.414 151.507,197.815C151.492,200.205 151.015,202.601 150.156,204.807C150.107,204.938 150.125,205.084 150.205,205.199C150.285,205.313 150.416,205.381 150.556,205.38C150.556,205.38 154.891,205.428 156.589,205.445C156.878,205.448 157.091,205.449 157.193,205.45C157.602,205.454 157.737,205.138 157.737,205.138C157.746,205.117 157.754,205.096 157.76,205.074C158.617,202.282 158.993,199.305 158.842,196.343C158.693,193.393 158.016,190.462 156.78,187.74C156.045,186.125 155.145,184.64 154.108,183.291C153.036,181.898 151.816,180.653 150.479,179.561C150.446,179.535 150.425,179.498 150.41,179.46C150.396,179.423 150.396,179.382 150.402,179.341C150.409,179.301 150.429,179.267 150.454,179.236C150.478,179.207 150.512,179.187 150.549,179.173C152.801,178.326 154.892,177.575 156.767,176.943C158.317,176.42 159.718,175.978 160.941,175.638C162.419,175.221 164.027,175.123 165.683,175.212C168.098,175.343 170.613,175.881 172.996,176.537C175.433,177.192 177.725,177.969 179.604,178.481C180.818,178.812 181.872,179.034 182.699,179.073C183.046,179.089 183.485,179.038 183.932,178.92C184.304,178.823 184.683,178.684 185.017,178.516L185.66,178.077C185.96,177.834 186.071,177.425 185.933,177.064C185.325,175.53 182.026,168.303 178.252,160.306C172.77,148.689 166.318,135.44 166.261,135.467C166.316,135.444 171.546,147.746 176.395,159.125C177.937,162.743 179.446,166.261 180.728,169.266C182.228,172.784 183.42,175.588 183.987,177Z"></path>
            
       </g>
     
   
    );
}


function areEqual(prevProps, nextProps) {
    return Math.floor(prevProps.data/20) == Math.floor(nextProps.data/20);
}

export default memo(Noise, areEqual);