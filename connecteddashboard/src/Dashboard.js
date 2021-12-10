import "./dashboard.css";
import Liquid from "./Liquid";
import Water from "./Water";
import Technique from "./Technique";
import Noise from "./Noise";
import Time from "./Time";
import Temperature from "./Temperature";


function Dashboard(props) {

    return (<svg width="100vw" viewBox="0 0 366 207" className="main">
       <rect x={0} y={0} width="365" height="206" className="backrect"></rect>
        <Liquid data={props.data.squirted}/>
        <Water data={{flow:props.data.flow, previous:props.data.previous, fill:props.data.fill}}/>
        <Technique data={{acceleration:props.data.acceleration, pressure:props.data.pressure}}/>
        <Noise data={props.data.mic}/>
        <Time/>
        <Temperature data={props.data.temperature}/>
        <g>
                <text x="186.584px" y="8.581px" className="sensortext">technique</text>
                <text x="242.905px" y="201.991px" className="sensortext">noise</text>
                <text x="310.329px" y="201.751px" className="sensortext">temperature</text>
                <text x="99.311px" y="8.498px" className="sensortext">washing liquid used</text>
                <text x="14.645px" y="8.07px" className="sensortext">water usage</text>
                <text x="117.449px" y="201.552px" className="sensortext">time</text>
        </g>
    </svg>
   
    );
}

export default Dashboard;