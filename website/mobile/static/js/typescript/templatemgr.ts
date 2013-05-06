/// <reference path="../lib/handlebars.d.ts" />

module TemplateManager {
    var templates: { [index: string]: string; } =  {};

    /**
     * adds a template to the template manager
     * @param id the identifier of the template
     * @param template the template string
     */
    export function addTemplate(id: string, template: string) {
        templates[id] = template;
    }

    /**
     * retrieves a template from the template manager
     * @param id the id of the template
     * @return the template string
     */
    export function getTemplate(id: string) {
        return templates[id];
    }
}