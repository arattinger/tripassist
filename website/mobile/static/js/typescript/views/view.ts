module TripAssist {
    export interface View {

        /**
        * returns the title of the view
        */
        title(): string;

        /**
        * returns a unique identifier for the view
        */
        name(): string;

        /** 
        * renders the view
        * @param ctn the parent container (content will be cleared)
        * @param data the data to be rendered (if any, e.g. id of the item to be displayed)
        * @param callback a callback function for when the view is fully loaded
        */
        render(ctn: HTMLElement, data: any, callback: () => any);
    }
}