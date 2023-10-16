import { SofriaRenderFromProskomma } from 'proskomma-json-tools';
import { sofria2WebActions } from '../Sofria2ProskommaRenderFunctions/Sofria2WebActions';
export default function renderDoc(documentResult, pk, option) {
    let output = {};
    let workspace = {  tr: 0 };
    let context = {};
    let config = option
    if (documentResult) {
        const renderer = new SofriaRenderFromProskomma({
            proskomma: pk,
            actions: sofria2WebActions,
        });
        try {
            renderer.renderDocument1({
                docId: documentResult.data.document.id,
                config,
                output,
                workspace,
                context,
            });

        } catch (err) {
            throw err;
        }
    }

    return output;
}


