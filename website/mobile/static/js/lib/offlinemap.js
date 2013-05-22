/**
 * parts taken from http://openlayers.org/dev/examples/offline-storage.html
 */

var OfflineMap = (function() {

    var map, cacheWrite, cacheRead1, cacheRead2;
    var cacheHits = 0, seeding = false;
    var seedCallback = false;
    // try cache before loading from remote resource
    cacheRead1 = new OpenLayers.Control.CacheRead({});
    cacheWrite = new OpenLayers.Control.CacheWrite({
        imageFormat: "image/jpeg",
        eventListeners: {
            cachefull: function() {
                if (seeding) {
                    if (seedCallback) {
                        seedCallback(0, 'Cache is full!');
                        seedCallback = false;
                    }
                    stopSeeding();
                }
            }
        }
    });

    var markers;
    var markerSize = new OpenLayers.Size(21,25);
    var markerOffset = new OpenLayers.Pixel(-(markerSize.w/2), -markerSize.h);
    // TODO: change to cached version (different marker for each type? (hotel, campsite, museum,...))
    var markerIcon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', markerSize, markerOffset);

    var items = [];

    // start seeding the cache
    function startSeeding() {
        var layer = map.baseLayer,
            zoom = map.getZoom();
        seeding = {
            zoom: zoom,
            extent: map.getExtent(),
            center: map.getCenter(),
            cacheWriteActive: cacheWrite.active,
            buffer: layer.buffer,
            layer: layer
        };
        // make sure the next setCenter triggers a load
        map.zoomTo(zoom === layer.numZoomLevels-1 ? zoom - 1 : zoom + 1);
        // turn on cache writing
        cacheWrite.activate();
        // turn off cache reading
        cacheRead1.deactivate();
        
        layer.events.register("loadend", null, seed);
        
        // start seeding
        map.setCenter(seeding.center, zoom);
    }
    
    // seed a zoom level based on the extent at the time startSeeding was called
    function seed() {
        var layer = seeding.layer;
        var tileWidth = layer.tileSize.w;
        var nextZoom = map.getZoom() + 1;
        var extentWidth = seeding.extent.getWidth() / map.getResolutionForZoom(nextZoom);
        // adjust the layer's buffer size so we don't have to pan
        layer.buffer = Math.ceil((extentWidth / tileWidth - map.getSize().w / tileWidth) / 2);
        //if (nextZoom === layer.numZoomLevels-1) {
            stopSeeding();
        //}
    }
    
    // stop seeding (when done or when cache is full)
    function stopSeeding() {
        // we're done - restore previous settings
        seeding.layer.events.unregister("loadend", null, seed);
        seeding.layer.buffer = seeding.buffer;
        map.setCenter(seeding.center, seeding.zoom);
        seeding = false;
        cacheRead1.activate();
        console.log('stopped seeding');
        $('.map-hidden').remove();
        if(seedCallback) {
            seedCallback(100, null);
        }
    }

    function createMap(ctn, lon, lat, zoom) {

        markers = new OpenLayers.Layer.Markers( "Markers" );
        var popups = [];
        // add items
        for (var i = 0; i<items.length; i++) {
            var lonlat = getLonLat(items[i].longitude, items[i].latitude);
            var marker = new OpenLayers.Marker(lonlat, markerIcon.clone());
            
            var popup = new OpenLayers.Popup(null, lonlat, null,
                items[i].text, true);
            popup.autoSize = true;
            
            marker.popup = popup;
            popups.push(popup);
            popup.hide();
            marker.events.register('click', marker, function() {
                this.popup.toggle();
            });
            markers.addMarker(marker);
        }

        map = new OpenLayers.Map({
            div: ctn,
            projection: "EPSG:900913",
            layers: [
                markers, 
                new OpenLayers.Layer.OSM("OpenStreetMap (CORS)", null, {
                    eventListeners: {
                        tileloaded: updateStatus,
                        loadend: detect
                    }
                })
            ],
            center: getLonLat(lon, lat),
            zoom: zoom
        });

        // add popups
        for (var i = 0; i<popups.length; i++)
            map.addPopup(popups[i]);

        map.addControls([cacheRead1, cacheWrite]);
    }

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
                alert("Canvas not supported. Try a different browser.");
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
    self.addMapToCache = function(lat, lon, callback) {
        var hiddenCtn = document.createElement('div');
        hiddenCtn.className = 'map-hidden';
        document.getElementById('content-ctn').appendChild(hiddenCtn);
        console.log('createMap(' + hiddenCtn + ', ' + lon + ', ' + lat + ')');
        createMap(hiddenCtn, lon, lat, 17);
        seedCallback = callback;
        startSeeding();
    };

    self.render = function(lat, lon, zoomLevel, ctn) {
        console.log(lon + ', ' + lat);
        createMap(ctn, lon, lat, zoomLevel);
    };

    self.clearCache = function() {
        OpenLayers.Control.CacheWrite.clearCache();
    };

    self.addItem = function(lat, lon, text) {
        items.push({
            longitude: lon,
            latitude: lat,
            text: text
        });
    };

    self.clearItems = function() {
        items = [];
    };

    return self;
})();
