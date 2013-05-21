// Type definitions for OfflineMap

interface OfflineMapStatic {
    addRectToCache(lat1: number, lon1: number, lat2: number, lon2: number, maxZoomLevel: number, callback: (progress: number, errorMsg: string) => void) : void;
    render(lat: number, lon: number, zoomLevel: number, ctn: HTMLElement) : void;
    clearCache(): void;
}

declare var OfflineMap: OfflineMapStatic;