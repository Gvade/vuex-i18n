export default {
    name: 'translate',
    functional: true,
    props: {
        tag: String,
        path: {
            type: String,
            required : true
        },
        params: Object
    },
    render(h, { data, props, slots, parent }) {
        //Here slots should be treated as the translation params
        const { $t } = parent;
        const slotsObject = slots();

        const translated = $t(props.path, props.params);
        const splitter = '$';
        //Surrounding translation params with splitter sign in order to easily use the split method, which will remove splitters
        //Assuming, that "{" and "}" are the identifiers. Didn't manage to access vuex-i18n config after initialization
        const translatedWithSplitters = translated.replace(/{/g, splitter + '{').replace(/}/g, '}' + splitter);
        //Splitting the translations into array of texts and slots (params)
        const splitted = translatedWithSplitters.split(splitter);

        const tag = props.tag || 'span';

        return h(tag, data, splitted.map(textOrVNode => {
            //Slot as a param
            if (textOrVNode.startsWith('{')) {
                return slotsObject[textOrVNode.replace(/{|}/g, '')]
            }
            //Simple text
            else return textOrVNode;
        }));
    }
};
