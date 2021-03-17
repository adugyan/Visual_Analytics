(function (React, ReactDOM, d3) {
  'use strict';

  React = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;
  ReactDOM = ReactDOM && Object.prototype.hasOwnProperty.call(ReactDOM, 'default') ? ReactDOM['default'] : ReactDOM;

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

  const mouthArc = d3.arc()
    .innerRadius(mouthRadius)
    .outerRadius(mouthRadius + mouthWidth)
    .startAngle(Math.PI / 2)
    .endAngle(Math.PI * 3 / 2);


  /* Function that returns HTML for the image
  Circle will now be self closing */
  const App = () => (
    React.createElement( 'svg', { width: width, height: height }, "/* ES6 string literal */ ", React.createElement( 'g', { transform: `translate(${centerX},${centerY})` },
        React.createElement( 'circle', {
          
          r: radius, fill: "yellow", stroke: "black", 'stroke-width': strokeWidth }),
        React.createElement( 'circle', {
          cx: - eyeOffsetX, cy: - eyeOffsetY, r: "50" }),
        React.createElement( 'circle', {
          cx: + eyeOffsetX, cy: - eyeOffsetY, r: "50" }),
        React.createElement( 'path', { d: mouthArc() })
      )
    )
  );

  const rootElement = document.getElementById('root');

  //render our app component into the root element
  ReactDOM.render(React.createElement( App, null ), rootElement);

}(React, ReactDOM, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IGFyYyB9IGZyb20gJ2QzJztcblxuY29uc29sZS5sb2coUmVhY3RET00pO1xuXG4gLypjeCA9IHdpZHRoIC8gMjsgY3kgPSBoZWlnaHQvMjsgciA9IGhlaWdodC8yIC1cbiAgICBzdHJva2V3aWR0aCAvMjsgXG5tYWluIGZhY2UgKi9cbmNvbnN0IHdpZHRoID0gOTYwO1xuY29uc3QgaGVpZ2h0ID0gNTAwO1xuY29uc3QgY2VudGVyWCA9IHdpZHRoIC8gMjtcbmNvbnN0IGNlbnRlclkgPSBoZWlnaHQgLyAyO1xuY29uc3Qgc3Ryb2tlV2lkdGggPSAxMDtcbmNvbnN0IHJhZGl1cyA9IGNlbnRlclkgLSBzdHJva2VXaWR0aCAvIDI7XG5cbi8vZXllc1xuY29uc3QgZXllT2Zmc2V0WCA9IDkwO1xuY29uc3QgZXllT2Zmc2V0WSA9IDEwMDtcblxuLy9tb3V0aFxuY29uc3QgbW91dGhXaWR0aCA9IDIwO1xuY29uc3QgbW91dGhSYWRpdXMgPSAxNDA7XG5cbmNvbnN0IG1vdXRoQXJjID0gYXJjKClcbiAgLmlubmVyUmFkaXVzKG1vdXRoUmFkaXVzKVxuICAub3V0ZXJSYWRpdXMobW91dGhSYWRpdXMgKyBtb3V0aFdpZHRoKVxuICAuc3RhcnRBbmdsZShNYXRoLlBJIC8gMilcbiAgLmVuZEFuZ2xlKE1hdGguUEkgKiAzIC8gMik7XG5cblxuLyogRnVuY3Rpb24gdGhhdCByZXR1cm5zIEhUTUwgZm9yIHRoZSBpbWFnZVxuQ2lyY2xlIHdpbGwgbm93IGJlIHNlbGYgY2xvc2luZyAqL1xuY29uc3QgQXBwID0gKCkgPT4gKFxuICA8c3ZnIHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgXG4gICAgLyogRVM2IHN0cmluZyBsaXRlcmFsICovXG4gICAgPGcgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7Y2VudGVyWH0sJHtjZW50ZXJZfSlgfT5cbiAgICAgIDxjaXJjbGVcbiAgICAgICAgXG4gICAgICAgIHI9e3JhZGl1c31cbiAgICAgICAgZmlsbD1cInllbGxvd1wiXG4gICAgICAgIHN0cm9rZT1cImJsYWNrXCJcbiAgICAgICAgc3Ryb2tlLXdpZHRoPXtzdHJva2VXaWR0aH1cbiAgICAgIC8+XG4gICAgICA8Y2lyY2xlXG4gICAgICAgIGN4PXstIGV5ZU9mZnNldFh9XG4gICAgICAgIGN5PXstIGV5ZU9mZnNldFl9XG4gICAgICAgIHI9XCI1MFwiXG4gICAgICAvPlxuICAgICAgPGNpcmNsZVxuICAgICAgICBjeD17KyBleWVPZmZzZXRYfVxuICAgICAgICBjeT17LSBleWVPZmZzZXRZfVxuICAgICAgICByPVwiNTBcIlxuICAgICAgLz5cbiAgICAgIDxwYXRoIGQ9e21vdXRoQXJjKCl9IC8+XG4gICAgPC9nPlxuICA8L3N2Zz5cbik7XG5cbmNvbnN0IHJvb3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcblxuLy9yZW5kZXIgb3VyIGFwcCBjb21wb25lbnQgaW50byB0aGUgcm9vdCBlbGVtZW50XG5SZWFjdERPTS5yZW5kZXIoPEFwcCAvPiwgcm9vdEVsZW1lbnQpO1xuIl0sIm5hbWVzIjpbImFyYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBSUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QjtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztFQUNsQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUM7RUFDbkIsTUFBTSxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztFQUMxQixNQUFNLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0VBQzNCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztFQUN2QixNQUFNLE1BQU0sR0FBRyxPQUFPLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUN6QztFQUNBO0VBQ0EsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0VBQ3RCLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQztBQUN2QjtFQUNBO0VBQ0EsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0VBQ3RCLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQztBQUN4QjtFQUNBLE1BQU0sUUFBUSxHQUFHQSxNQUFHLEVBQUU7RUFDdEIsR0FBRyxXQUFXLENBQUMsV0FBVyxDQUFDO0VBQzNCLEdBQUcsV0FBVyxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7RUFDeEMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDMUIsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDN0I7QUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLEdBQUcsR0FBRztFQUNaLEVBQUUsOEJBQUssT0FBTyxLQUFNLEVBQUMsUUFBUSxVQUFRLDZCQUdqQyw0QkFBRyxXQUFXLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDbkQsTUFBTTtFQUNOO0VBQ0EsUUFBUSxHQUFHLE1BQU8sRUFDVixNQUFLLFFBQVEsRUFDYixRQUFPLE9BQU8sRUFDZCxnQkFBYyxhQUFZO0VBRWxDLE1BQU07RUFDTixRQUFRLElBQUksRUFBRSxVQUFXLEVBQ2pCLElBQUksRUFBRSxVQUFXLEVBQ2pCLEdBQUUsTUFBSTtFQUVkLE1BQU07RUFDTixRQUFRLElBQUksRUFBRSxVQUFXLEVBQ2pCLElBQUksRUFBRSxVQUFXLEVBQ2pCLEdBQUUsTUFBSTtFQUVkLE1BQU0sK0JBQU0sR0FBRyxRQUFRLElBQUcsQ0FBRztFQUM3QixLQUFRO0VBQ1IsR0FBUTtFQUNSLENBQUMsQ0FBQztBQUNGO0VBQ0EsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRDtFQUNBO0VBQ0EsUUFBUSxDQUFDLE1BQU0sQ0FBQyxxQkFBQyxTQUFHLEVBQUcsRUFBRSxXQUFXLENBQUM7Ozs7In0=