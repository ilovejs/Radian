// Line plots.

radian.directive('lines',
 ['plotTypeLink', function(plotTypeLink)
{
  'use strict';

  function draw(svg, x, xs, y, ys, s) {
    var width   = s.strokeWidth || 1;
    var opacity = s.strokeOpacity || 1.0;
    var sopts = (s.stroke || '#000').split(';');
    var str = (sopts.length == 1 || !s.strokesel) ?
      sopts[0] : sopts[s.strokesel % sopts.length];

    // Switch on type of stroke...
    if (str.indexOf(':') == -1) {
      // Normal single-colour line.
      var line = d3.svg.line()
        .x(function (d) { return xs(d[0]); })
        .y(function (d) { return ys(d[1]); });
      svg.append('path').datum(d3.zip(x, y))
        .attr('class', 'line').attr('d', line)
        .style('fill', 'none')
        .style('stroke-width', width)
        .style('stroke-opacity', opacity)
        .style('stroke', str);
    } else {
      // Fading stroke.
      var strokes = str.split(':');
      var interp = function(dx) { return 1 - Math.exp(-20*dx/(3*x.length)); };
      var ihsl = d3.interpolateHsl(strokes[0], strokes[1]);
      var based = d3.zip(x, y);
      var lined = d3.zip(based, based.slice(1));
      svg.selectAll('path').data(lined).enter().append('path')
        .attr('class', 'line')
        .style('stroke-width', width)
        .style('stroke-opacity', opacity)
        .style('stroke', function(d,i) { return ihsl(interp(i)); })
        .attr('d', d3.svg.line()
              .x(function (d) { return xs(d[0]); })
              .y(function (d) { return ys(d[1]); }));
    }
  };

  return {
    restrict: 'E',
    scope: true,
    link: function(scope, elm, as) {
      plotTypeLink(scope, elm, as, draw);
    }
  };
}]);


// Scatter/bubble plots.

radian.directive('points',
 ['plotTypeLink', function(plotTypeLink)
{
  'use strict';

  function draw(svg, x, xs, y, ys, s) {
    var marker = s.marker || "circle";
    var markerSize = s.markerSize || 1;
    var stroke = s.stroke || '#000';
    var strokeWidth = s.strokeWidth || 1.0;
    var strokeOpacity = s.strokeOpacity || 1.0;
    var fill = s.fill || '#000';
    var fillOpacity = s.fillOpacity || 1.0;
    var orientation = s.orientation || 0.0;

    // Single-colour points.
    var points = d3.svg.symbol()
      .type(marker).size(markerSize);
    svg.selectAll('path').data(d3.zip(x, y))
      .enter().append('path')
      .attr('transform', function(d) {
        return 'translate(' + xs(d[0]) + ',' + ys(d[1]) + ')';
      })
      .attr('d', points)
      .style('fill', fill)
      .style('fillOpacity', fillOpacity)
      .style('stroke-width', strokeWidth)
      .style('stroke-opacity', strokeOpacity)
      .style('stroke', stroke);
  };

  return {
    restrict: 'E',
    scope: true,
    link: function(scope, elm, as) {
      plotTypeLink(scope, elm, as, draw);
    }
  };
}]);
