import {FlatList} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useDocumentQuery } from '../CustomHooks/useDocumentQuery';
import renderDoc from '../RenderFunctions/renderDocuments';

function ReadingScreen({option, livre, bible, pk}) {
  const [data, setData] = useState([]);
  const [output, setOutput] = useState(null);
  const [documentResult, setDocResults] = useState(null)

  const renderItem = useCallback(({ item }) => item, []);
  const keyExtractor = useCallback(
    (item, index) => `para-${index}-${item}-${livre}-${bible}`,
    [livre, bible]
  );

  const loadMoreItems = () => {
    if (output?.paras) {
      const newData = output.paras.slice(data.length, data.length + 1);
      setData(prevData => [...prevData, ...newData]);
    }
  };
  useEffect(() => {
    setDocResults(useDocumentQuery(livre, bible, pk))
  }, [livre, bible])
  useEffect(() => {
    if (documentResult?.data?.document?.id) {
      setOutput(renderDoc(documentResult, pk, option));
    }
  }, [documentResult?.data?.document?.id, option.showWordAtts, option.showTitles, option.showHeadings, option.showIntroductions, option.showFootnotes, option.showXrefs, option.showParaStyles, option.showCharacterMarkup, option.showChapterLabels, option.showVersesLabels, option.selectedBcvNotes, option.displayPartOfText, option.renderers]);

  useEffect(() => {
    if (output?.paras) {
      setData(output.paras.slice(0, data.length || 100));
    }
  }, [output]);

  return (
    <FlatList
      style={{ paddingRight: 16, height: '100%', width: '100%' }}
      removeClippedSubviews={true}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={0.5}
    />
  );
}

module.exports = { ReadingScreen };
