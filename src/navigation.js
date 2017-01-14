/**
 * Move the timeline a given percentage to left or right
 * @param {Number} percentage   For example 0.1 (left) or -0.1 (right)
 */
function move (percentage) {
    var range = timeline.getWindow();
    var interval = range.end - range.start;

    timeline.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end:   range.end.valueOf()   - interval * percentage
    });
}

// attach events to the navigation buttons
$('#zoomIn').onclick    = function () { timeline.zoomIn( 0.2); };
$('#zoomOut').onclick   = function () { timeline.zoomOut( 0.2); };
$('#moveLeft').onclick  = function () { move( 0.2); };
$('#moveRight').onclick = function () { move(-0.2); };