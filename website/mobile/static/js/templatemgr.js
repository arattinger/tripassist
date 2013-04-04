var TemplateManager;
(function (TemplateManager) {
    var templates = {
    };
    function addTemplate(id, template) {
        templates[id] = template;
    }
    TemplateManager.addTemplate = addTemplate;
    function getTemplate(id) {
        return templates[id];
    }
    TemplateManager.getTemplate = getTemplate;
})(TemplateManager || (TemplateManager = {}));
