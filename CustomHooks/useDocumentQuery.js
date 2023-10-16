import { useState, useEffect } from 'react';


function useDocumentQuery(livre, bible, pk) {
  let documentQuery = `
      {
        document(docSetId: "${bible}" withBook: "${livre}"){
          id
          cvIndexes {
            chapter
            verses {
              verse {
                verseRange
              }
            }
          }
      }}
      `
  const documentResult = pk.gqlQuerySync(documentQuery)
  return documentResult
}


export { useDocumentQuery }