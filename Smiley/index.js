import React from 'react';
import ReactDOM from 'react-dom';
import { arc } from 'd3';

console.log(ReactDOM);

 /*cx = width / 2; cy = height/2; r = height/2 -
    strokewidth /2; 
main face */
const width = 960;
const height = 500;
const centerX = width / 2;
const centerY = height / 2;
const strokeWidth = 10;
const radius = centerY - strokeWidth / 2;

//eyes
const eyeOffsetX = 90;
const eyeOffsetY = 100;

//mouth
const mouthWidth = 20;
const mouthRadius = 140;

const mouthArc = arc()
  .innerRadius(mouthRadius)
  .outerRadius(mouthRadius + mouthWidth)
  .startAngle(Math.PI / 2)
  .endAngle(Math.PI * 3 / 2);


/* Function that returns HTML for the image
Circle will now be self closing */
const App = () => (
  <svg width={width} height={height}>
   
    /* ES6 string literal */
    <g transform={`translate(${centerX},${centerY})`}>
      <circle
        
        r={radius}
        fill="yellow"
        stroke="black"
        stroke-width={strokeWidth}
      />
      <circle
        cx={- eyeOffsetX}
        cy={- eyeOffsetY}
        r="50"
      />
      <circle
        cx={+ eyeOffsetX}
        cy={- eyeOffsetY}
        r="50"
      />
      <path d={mouthArc()} />
    </g>
  </svg>
);

const rootElement = document.getElementById('root');

//render our app component into the root element
ReactDOM.render(<App />, rootElement);
