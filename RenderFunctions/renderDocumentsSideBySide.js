import { SofriaRenderFromProskomma } from 'proskomma-json-tools';
import actions from '../Sofria2ProskommaRenderFunctions/sideBySideRender';

export function renderDocForSideBySide(documentResult, pk, livre, bible, textNumber) {
    let output = {};
    let workspace = { textRef: `${bible}_${livre}_$${textNumber}`, textNumber: textNumber };
    let context = {};
    let config = {
        showWordAtts: false,
        showTitles: true,
        showHeadings: true,
        showIntroductions: true,
        showFootnotes: true,
        showXrefs: true,
        showParaStyles: true,
        showCharacterMarkup: true,
        showVersesLabels: true,
        excludeScopeTypes: ["milestone", "attribute", "spanWithAtts"],
        showChapterLabels: true,
    }
    if (documentResult) {
        const renderer = new SofriaRenderFromProskomma({
            proskomma: pk,
            actions: actions,
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
            console.log("Renderer", err);
            throw err;
        }
    }

    return output;
}