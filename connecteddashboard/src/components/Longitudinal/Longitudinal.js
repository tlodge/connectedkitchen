import React, {memo} from "react";
import './style.css'
import OverallTimeChart from "./OverallTimeChart";
import WaterChart from "./WaterChart";
import LiquidChart from "./LiquidChart";
import ActivityCleaningTimeChart from "./ActivityCleaningTimeChart";
import ActivitySurfacesChart from "./ActivitySurfacesChart";
import ActivityTapChart from "./ActivityTapChart";
import ActivityDryingChart from "./ActivityDryingChart";


const timelabelfn = (value)=>{
    const seconds = parseInt(Math.floor(value / 1000));
    const minutes = parseInt(Math.floor(seconds / 60));
    const remainder = seconds - 60*minutes;
    if (minutes > 0){
        return `${minutes}m ${remainder}s`
    }
    return `${remainder}s`
}

function Longitudinal({data,other}){
   
    const renderFooter = ()=>{
        return  <g> 
                    <g transform="matrix(1,0,0,1,-637.504,-1184.09)">
                        <text x="950.577px" y="1824.33px" className="jumbotext">your cleaning</text>
                        <text x="1075.1px" y="1824.33px" className="jumbotextbold">ﬁnal metrics</text>
                    </g>
                    <path d="M834.699,603.001c-3.864,-3.165 -10.824,-5.28 -18.761,-5.28c-7.991,0 -14.991,2.143 -18.839,5.344c-3.864,-3.165 -10.825,-5.279 -18.762,-5.279c-7.99,-0 -14.991,2.142 -18.839,5.343c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-7.99,-0 -14.991,2.142 -18.839,5.343c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-7.991,0 -14.991,2.143 -18.839,5.344c-3.864,-3.166 -10.825,-5.28 -18.762,-5.28c-7.99,0 -14.99,2.143 -18.839,5.344c-3.864,-3.165 -10.824,-5.28 -18.761,-5.28c-7.99,0 -14.991,2.143 -18.839,5.344c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-7.991,-0 -14.991,2.142 -18.839,5.343c-3.864,-3.165 -10.825,-5.279 -18.762,-5.279c-7.99,-0 -14.99,2.143 -18.839,5.344c-3.864,-3.166 -10.824,-5.28 -18.761,-5.28c-7.99,0 -14.991,2.143 -18.839,5.344c-3.864,-3.166 -10.824,-5.28 -18.761,-5.28c-7.991,0 -14.991,2.143 -18.839,5.344c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-7.991,-0 -14.991,2.142 -18.84,5.343c-3.863,-3.165 -10.824,-5.279 -18.761,-5.279c-7.99,-0 -14.991,2.142 -18.839,5.343c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-7.99,-0 -14.991,2.143 -18.839,5.344c-3.864,-3.166 -10.824,-5.28 -18.761,-5.28c-7.991,0 -14.991,2.143 -18.839,5.344c-3.864,-3.165 -10.825,-5.28 -18.762,-5.28c-7.99,0 -14.99,2.143 -18.839,5.344c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-7.99,-0 -14.991,2.142 -18.839,5.343c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-7.991,-0 -14.991,2.142 -18.839,5.343c-3.864,-3.165 -10.825,-5.279 -18.762,-5.279c-7.99,0 -14.99,2.143 -18.839,5.344c-3.864,-3.166 -10.824,-5.28 -18.761,-5.28c-7.99,0 -14.991,2.143 -18.839,5.344c-3.864,-3.165 -10.824,-5.28 -18.761,-5.28c-7.991,0 -14.991,2.143 -18.839,5.344c-3.864,-3.165 -10.824,-5.279 -18.761,-5.279c-8.248,-0 -15.441,2.283 -19.201,5.656c-3.656,-3.547 -11.038,-5.973 -19.54,-5.973c-12.132,0 -21.982,4.94 -21.982,11.025c-0,1.935 1.015,3.836 2.945,5.512l38.074,-0c0.056,-0.048 0.11,-0.097 0.164,-0.145c0.16,0.155 0.327,0.309 0.502,0.461l38.075,0l0.073,-0.064l37.527,-0l0.073,-0.064l37.527,-0l0.074,-0.065l37.527,0l0.073,-0.064l37.527,0l0.073,-0.064l37.527,0l0.074,-0.064l37.527,-0l0.073,-0.064l37.527,-0l0.073,-0.065l37.527,0l0.074,-0.064l37.527,0l0.073,-0.064l37.527,-0l0.073,-0.064l37.527,-0l0.073,-0.064l37.528,-0l0.073,-0.065l37.527,0l0.073,-0.064l37.527,0l0.073,-0.064l37.527,-0l0.074,-0.064l37.527,-0l0.073,-0.065l37.527,0l0.073,-0.064l37.527,0l0.074,-0.064l37.527,0l0.073,-0.064l37.527,-0l0.073,-0.064l37.527,-0c1.93,-1.676 2.945,-3.577 2.945,-5.513c0,-6.084 -9.85,-11.024 -21.982,-11.024c-7.991,0 -14.991,2.143 -18.839,5.344Z" className="bottomborder" />
                </g>
    }

    //time metrics
    const timedata = ()=>{
        const {time={}} = data;
        const {from=0, to=0} = time;

       
        return {
            value: to-from,
            max: Object.keys(other).reduce((acc, key)=>{
                return Math.max(acc, (other[key].time.to - other[key].time.from));
            },to-from),
            average: Object.keys(other).reduce((acc, key)=>{
                return acc + (other[key].time.to - other[key].time.from);
            },0) / Object.keys(other).length,
            labelfn : timelabelfn,
        }
    }

    const waterdata = ()=>{
        const {water=[]} = data;
        const fill = (water[water.length-1]||{}).fill || 0
        return {
            value: fill,
            max:   Object.keys(other).reduce((acc, key)=>{
                const _fill = ((other[key].water[other[key].water.length-1]) || {}).fill || 0;
                return Math.max(acc, _fill);
            }, fill),
            average: Object.keys(other).reduce((acc, key)=>{
                const _fill = ((other[key].water[other[key].water.length-1]) || {}).fill || 0;
                return acc + _fill
            }, 0) / Object.keys(other).length,
            labelfn: (value)=>`${(value/1000).toFixed(1)} litres`
        }
    }

    const liquiddata = ()=>{

        const {weight=[]} = data;
        const squirted = weight.length > 0 ? weight[weight.length-1].squirted : 0;
        return{
            weight:{
                value: squirted,
                max:   Object.keys(other).reduce((acc, key)=>{
                    const _weight = (other[key].weight || [])
                    return _weight.length > 0 ? Math.max(acc,_weight[_weight.length-1].squirted) : acc;
                }, squirted),
                average: Object.keys(other).reduce((acc, key)=>{
                    const _weight = (other[key].weight || [])
                    return acc + (_weight.length > 0 ? _weight[_weight.length-1].squirted : 0);
                }, 0) / Object.keys(other).length,
                labelfn: (value)=>`${(value).toFixed(1)} g`
            },
            used:{
                value: weight.length,
                max: Object.keys(other).reduce((acc, key)=>{
                            return Math.max(acc, (other[key].weight ||[]).length)
                },weight.length),
                average: Object.keys(other).reduce((acc, key)=>{
                    return acc + (other[key].weight ||[]).length
                },0) / Object.keys(other).length,
                labelfn: (value)=>`${value.toFixed(0)} times`
            }
        }
    }

    const taptimedata = ()=>{
        const {water=[]} = data;

        const calctime = (arr)=>{
            return arr.reduce((acc, item)=>{
                if (item.flow<=0){
                    return {total: acc.total + (item.ts - acc.firstts), firstts:0}
                }
                if (acc.firstts <= 0){
                    return {...acc, firstts:item.ts}
                }
                return acc;
            },{total:0, firstts:0}).total;
        }
        return {
            value: calctime(water),
            max:   Object.keys(other).reduce((acc, key)=>{
                return Math.max(acc, calctime(other[key].water))
            }, calctime(water)),
            average: Object.keys(other).reduce((acc, key)=>{
                return acc + calctime(other[key].water)
            }, 0) / Object.keys(other).length,
            labelfn : timelabelfn
        }
    }

    const activitydata = (type)=>{
        const {activities={}}= data;
        
        const calctotal = (arr=[])=>{
            return arr.reduce((acc,item)=>{
                if (item.from && item.to){
                    return acc + (item.to-item.from)
                }    
                return acc;
            },0);
        }
        
        return{
            value: calctotal(activities[type]),
            max: Object.keys(other).reduce((acc, key)=>{
                return Math.max(acc + calctotal((other[key].activities || {})[type]))
            },calctotal(activities[type])),
            average:  Object.keys(other).reduce((acc, key)=>{
                return acc + calctotal((other[key].activities || {})[type])
            },0) / Object.keys(other).length,
            labelfn: timelabelfn,
        }
    }

    return <svg width="100%" height="100%" viewBox="0 0 879 665" className="svg">    
        <g>
            <rect id="activity-back" x="441.242" y="4.283" width="432.521" height="599.072" className="lngbackrect"/>
            <rect id="water-back"  x="4.522" y="4.283" width="432.521" height="160.885" className="lngbackrect"/>
            <rect id="time-back"  x="4.52" y="442.785" width="432.521" height="160.885" className="lngbackrect"/>
            <rect id="washing-up-back"  x="4.522" y="168.473" width="432.521" height="270.698" className="lngbackrect"/>

            <WaterChart {...waterdata()}/>
            <LiquidChart {...liquiddata()} />
            <OverallTimeChart {...timedata()} />

            <text x="481.954px" y="34.663px" className="title">activity</text>

            <ActivityCleaningTimeChart {...activitydata("items")}/>
            <ActivitySurfacesChart {...activitydata("surfaces")}/>
            <ActivityTapChart {...taptimedata()}/>
            <ActivityDryingChart {...activitydata("drying")}/>
        
            {renderFooter()}    
        </g>
    </svg>
    
}

function areEqual(prevProps, nextProps) {
    if (!prevProps || !nextProps)
        return false;
     const {data:d1} = prevProps || {};
     const {data:d2} = nextProps || {};

     if (!d1 || !d2){
         return false;
     }
     return true;
}

export default memo(Longitudinal, areEqual);