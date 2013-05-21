/**
 * parts taken from http://openlayers.org/dev/examples/offline-storage.html
 */

var OfflineMap = (function() {

    var map, cacheWrite, cacheRead1, cacheRead2;
    var cacheHits = 0, seeding = false;

    // detect what the browser supports
    function detect(evt) {
        // detection is only done once, so we remove the listener.
        evt.object.events.unregister("loadend", null, detect);
        var tile = map.baseLayer.grid[0][0];
        try {
            var canvasContext = tile.getCanvasContext();
            if (canvasContext) {
                // will throw an exception if CORS image requests are not supported
                canvasContext.canvas.toDataURL();
            } else {
                // TODO
                console.log("Canvas not supported. Try a different browser.");
            }
        } catch(e) {
            // we remove the OSM layer if CORS image requests are not supported.
            map.setBaseLayer(map.layers[1]);
            evt.object.destroy();
            layerSwitcher.destroy();
        }
    }

    function getLonLat(lon, lat) {
        var lonlat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
        return lonlat;
    }

    // update the number of cache hits and detect missing CORS support
    function updateStatus(evt) {
        if (window.localStorage) {
            console.log(localStorage.length + " entries in cache.");
        } else {
            console.log("Local storage not supported. Try a different browser.");
        }
        if (evt && evt.tile.url.substr(0, 5) === "data:") {
            cacheHits++;
        }
        console.log(cacheHits + " cache hits.");
    }

    var self = {};
    self.addRectToCache = function(lat1, lon1, lat2, lon2, maxZoomLevel, callback) {
        // TODO
        callback(100, null);
    }

    self.render = function(lat, lon, zoomLevel, ctn) {
        console.log(lon + ', ' + lat);
        map = new OpenLayers.Map({
            div: ctn,
            projection: "EPSG:900913",
            layers: [
                new OpenLayers.Layer.OSM("OpenStreetMap (CORS)", null, {
                    eventListeners: {
                        tileloaded: updateStatus,
                        loadend: detect
                    }
                })
            ],
            center: getLonLat(lon, lat),
            zoom: zoomLevel
        });
    }
    return self;
})();
