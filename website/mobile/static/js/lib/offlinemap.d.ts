// Type definitions for OfflineMap

interface OfflineMapStatic {
    addMapToCache(lat: number, lon: number, callback: (progress: number, errorMsg: string) => void) : void;
    render(lat: number, lon: number, zoomLevel: number, ctn: HTMLElement) : void;
    addItem(lat: number, lon: number, text: string);
    clearCache(): void;
    clearItems(): void;
}

declare var OfflineMap: OfflineMapStatic;