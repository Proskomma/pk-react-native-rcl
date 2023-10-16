import { useEffect } from 'react';
import renderDoc from '../customFunction/renderDocument';

function useRenderDocument(documentResult, pk, setData, livre, bible, keyOfSurligne) {
    let output;
    useEffect(() => {
        output = renderDoc(documentResult, pk, livre, bible, keyOfSurligne)
        console.log(output)
        if (output.paras) {
            setData(output.paras.slice(0, 20))
        }
    }, [documentResult])
    return output
}

export { useRenderDocument }