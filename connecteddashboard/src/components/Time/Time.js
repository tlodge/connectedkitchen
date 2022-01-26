import "../Dashboard/dashboard.css";
import { useD3 } from "../../hooks/useD3";
import * as d3 from 'd3';

function Time(props) {

    const pathTween =(d1, precision)=>{
       
        return function() {
            var path0 = this;
          const  path1 = path0.cloneNode(), n0 = path0.getTotalLength(), n1 = (path1.setAttribute("d", d1), path1).getTotalLength();
      
          // Uniform sampling of distance based on specified precision.
          var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
          while ((i += dt) < 1) distances.push(i);
          distances.push(1);
      
          // Compute point-interpolators at each distance.
          var points = distances.map(function(t) {
            var p0 = path0.getPointAtLength(t * n0),
                p1 = path1.getPointAtLength(t * n1);
            return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
          });
      
          return function(t) {
            return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
          };
        };
      }

    const renderTime = (root, data=[])=>{
        const FLOWTIME = 30000;
        const FLIPTIME = 1000;

        const g = root.select("g#time");
        const timegroup = g.selectAll("g.timegroup").data(data);
        const timegroupg = timegroup.enter().append("g").attr("class", "timegroup");
        
        const sandtopbig = "M98.378,104.937c2.617,4.314 4.447,8.704 4.447,13.685c-0,15.661 -15.269,28.613 -31.727,28.613c-16.457,-0 -31.154,-12.679 -31.154,-28.341c-0,-4.981 0.997,-9.537 3.614,-13.851c16.459,4.001 36.847,3.895 54.82,-0.106Z";
        const sandtopsmall = "M83.079,142.594c1.143,0.584 1.64,-0.213 1.51,0.462c-0.355,1.837 -6.856,3.833 -13.847,3.878c-7.257,0.047 -10.709,-0.696 -10.451,-2.474c0.098,-0.674 -0.458,-0.679 0.685,-1.264c4.654,3.829 14.789,3.596 22.103,-0.602Z";
        const sandbottombig = "M99.341,204.579c0,0 3.812,-7.251 3.67,-13.616c-0.378,-16.933 -14.687,-28.542 -31.701,-28.542c-17.015,0 -31.591,13.222 -31.591,28.655c0,4.909 3.727,13.765 3.727,13.765l55.895,-0.262Z"
        const sandbottomsmall = "M95.542,204.597c0,0 4.18,0.447 4.18,-0.141c-0,-1.849 -12.955,-4.884 -28.373,-4.884c-15.419,0 -28.1,3.191 -28.1,5.04c0,0.588 3.906,-0.015 3.906,-0.015l48.387,0Z"
        
        
        const sandbottomtop = "M80.282,165.936c0,0 1.232,-0.54 1.186,-1.014c-0.122,-1.262 -4.745,-2.126 -10.241,-2.126c-5.497,-0 -10.205,0.985 -10.205,2.134c-0,0.366 1.203,1.026 1.203,1.026l18.057,-0.02Z"
        const sandtopbottom = "M95.587,104.885c2.373,0.483 4.031,0.974 4.031,1.531c0,1.752 -13.84,3.201 -28.759,3.201c-14.918,-0 -28.24,-1.419 -28.24,-3.171c-0,-0.557 0.904,-1.067 3.277,-1.549c14.919,0.447 33.399,0.436 49.691,-0.012Z";
      

        timegroupg.append("path").attr("id", "sandtop")
                    .attr("class","sandy")
                    .attr("d",sandtopbig)
                    .transition()
                    .on("start", function repeat(){
                        d3.active(this)
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopsmall,4))
                        //.transition().duration(1).on("start",()=>d3.active(this).attr("d", sandtopbottom))
                        .transition().duration(FLIPTIME)

                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopbig,4))
                        .transition().duration(FLIPTIME)

                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopsmall,4))
                        //.transition().duration(1).on("start",()=>d3.active(this).attr("d", sandtopbottom))
                        .transition().duration(FLIPTIME)


                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandtopbig,4))
                         .transition().duration(FLIPTIME).on("end", repeat)
                    })
                    

        
        timegroupg.append("path").attr("id", "sandbottom")
                    .attr("class","sand")
                    .attr("d",sandbottomsmall)
                    .transition()
                    .on("start", function repeat(){
                      
                        d3.active(this)
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandbottombig,4))
                       
                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(180, 71.246, 155.031)`
                            const from = `rotate(0, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        }))
                        
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandbottomtop,4))
                        
                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(0, 71.246, 155.031)`
                            const from = `rotate(180, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        }))//.attr("d",sandbottomsmall)
                        
                        .transition().duration(FLOWTIME).attrTween("d", pathTween(sandbottombig,4))

                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(180, 71.246, 155.031)`
                            const from = `rotate(0, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        }))
                        
                        .transition().duration(FLOWTIME).attrTween("d",   pathTween(sandbottomtop,4))

                        .transition().duration(FLIPTIME).on("start", ()=>g.transition().attrTween("transform", (d)=>{
                            const to =  `rotate(0, 71.246, 155.031)`
                            const from = `rotate(180, 71.246, 155.031)`
                            return d3.interpolate(from, to);
                        })).on("end", repeat)
                        //.attr("d",sandbottomsmall).on("end", repeat)
                      
                    });
        
    }

    const timeref = useD3((root)=>{
        renderTime(root, [1]);
    });

    return (<g ref={timeref}>
            <rect id="timerect" x="9.711" y="102.577" width="129.587" height="103.717" className="timerect"/>
            <path d="M112.434,103.177L30.213,103.177C28.05,108.24 26.932,113.665 26.935,119.16C26.942,134.008 34.993,147.152 47.277,154.711C46.379,155.223 45.694,155.637 45.433,155.828C45.304,155.922 45.179,156.017 45.057,156.112C34.019,163.846 26.942,176.265 26.935,190.204C26.932,195.748 28.204,200.743 30.405,205.844L112.507,205.368C114.703,200.279 115.708,195.776 115.71,190.247C115.717,176.106 108.445,163.52 97.135,155.802C96.894,155.627 96.64,155.456 96.372,155.288C96.187,155.172 95.836,154.968 95.371,154.707C107.663,147.141 115.718,133.977 115.71,119.116C115.708,113.636 114.591,108.226 112.434,103.177Z" className="timeback"/>
            <g id="time">
                
                <path id="timer" d="M59.727,148.238C47.305,143.875 38.457,132.704 38.451,119.622C38.448,114.252 40.234,108.639 43.117,103.987L98.886,104.154C101.774,108.803 104.192,114.22 104.195,119.59C104.201,132.93 95.012,144.292 82.207,148.478C80.587,150.197 79.645,152.252 79.645,154.459C79.645,157.075 80.968,159.477 83.174,161.359C85.61,162.237 90.4,164.913 90.311,164.932C98.715,170.48 104.2,179.607 104.195,189.915C104.192,195.285 102.671,200.559 99.783,205.208L42.847,205.181C39.964,200.529 38.448,195.252 38.451,189.882C38.456,179.63 43.891,170.552 52.221,165.005C52.008,164.964 56.615,162.463 58.591,161.689C61.037,159.761 62.522,157.23 62.522,154.459C62.522,152.148 61.489,150.004 59.727,148.238Z" className="timer"/>
                <path id="timerreflection" d="M42.335,204.165C41.237,202.05 40.504,199.843 40.061,197.572C39.619,195.312 39.468,192.992 39.529,190.641C39.641,185.871 40.979,181.409 43.237,177.5C45.509,173.569 48.72,170.21 52.582,167.692C52.582,167.692 52.784,167.536 52.784,167.536C53.22,167.297 54.724,166.481 56.159,165.757C57.025,165.32 57.864,164.918 58.412,164.709L59.074,164.346C61.039,163.272 62.412,161.825 63.374,160.149C64.336,158.474 64.872,156.558 65.157,154.539C65.383,152.869 64.874,150.744 63.804,148.888C62.786,147.124 61.272,145.623 59.542,144.924C56.814,143.853 54.263,142.447 51.947,140.78C49.57,139.068 47.443,137.079 45.655,134.838C42.063,130.336 39.817,124.858 39.647,118.736C39.571,116.392 39.752,114.047 40.217,111.758C40.685,109.455 41.434,107.215 42.51,105.093C41.276,107.153 40.359,109.355 39.732,111.642C39.1,113.95 38.77,116.336 38.694,118.737C38.521,125.185 40.559,131.093 44.115,136.008C45.911,138.49 48.098,140.712 50.581,142.618C53.003,144.476 55.717,146.015 58.611,147.223C59.862,147.731 60.909,148.864 61.651,150.136C62.437,151.484 62.896,153.007 62.744,154.225C62.54,155.943 62.136,157.581 61.355,159.02C60.618,160.375 59.552,161.555 58.006,162.452L57.61,162.709C57.023,162.955 56.122,163.418 55.197,163.923C53.718,164.729 52.169,165.637 51.786,165.863C51.722,165.899 51.663,165.942 51.609,165.992L51.491,166.091C47.523,168.916 44.26,172.591 42.043,176.844C39.878,180.998 38.701,185.691 38.812,190.641C38.872,193.03 39.146,195.378 39.711,197.65C40.274,199.911 41.122,202.094 42.335,204.165Z" className="timereflection"/>
                <path id="timerreflection1" d="M100.454,203.825C101.668,201.754 102.516,199.571 103.079,197.31C103.644,195.038 103.918,192.691 103.977,190.301C104.089,185.351 102.912,180.658 100.747,176.504C98.529,172.251 95.267,168.576 91.299,165.751C91.299,165.751 91.181,165.652 91.181,165.652C91.127,165.602 91.067,165.559 91.004,165.523C90.621,165.297 89.072,164.389 87.593,163.583C86.667,163.078 85.767,162.616 85.18,162.369L84.783,162.112C83.238,161.215 82.171,160.035 81.435,158.68C80.653,157.241 80.25,155.603 80.045,153.885C79.894,152.667 80.353,151.144 81.139,149.797C81.88,148.524 82.928,147.391 84.179,146.884C87.073,145.676 89.786,144.137 92.209,142.278C94.692,140.372 96.879,138.15 98.675,135.668C102.231,130.753 104.269,124.845 104.096,118.397C104.02,115.996 103.69,113.61 103.058,111.302C102.431,109.015 101.514,106.813 100.28,104.753C101.356,106.875 102.105,109.116 102.573,111.418C103.037,113.708 103.218,116.052 103.142,118.397C102.972,124.518 100.727,129.996 97.135,134.498C95.347,136.739 93.22,138.728 90.842,140.44C88.527,142.108 85.976,143.513 83.247,144.584C81.518,145.283 80.003,146.785 78.986,148.548C77.916,150.404 77.406,152.529 77.632,154.199C77.917,156.219 78.454,158.134 79.415,159.809C80.378,161.485 81.751,162.932 83.716,164.006L84.378,164.369C84.925,164.578 85.765,164.98 86.63,165.417C88.062,166.139 89.561,166.953 90.002,167.194C90.006,167.196 90.208,167.352 90.208,167.352C94.069,169.87 97.281,173.23 99.552,177.16C101.811,181.069 103.149,185.531 103.261,190.301C103.322,192.652 103.17,194.972 102.729,197.232C102.286,199.503 101.553,201.71 100.454,203.825Z" className="timereflection"/>
            </g>
           
        </g>
   
    );
}

export default Time;