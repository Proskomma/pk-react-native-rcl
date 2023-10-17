import React, {  useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView,Dimensions } from 'react-native';
import { renderDocForSideBySide } from '../RenderFunctions/renderDocumentsSideBySide';
import { useDocumentQuery } from '../CustomHooks/useDocumentQuery';
import { Table, Cell, TableWrapper,} from 'react-native-reanimated-table';


function transformStringToArray(str) {
  const [start, end] = str.split('-').map(Number);
  if (!end) {
    return [parseInt(start)]
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
 function SideViewVerseByVerse({ navigationFunction, toChange, bibles, book, pk }) {
  const [widthdim, setWidth] = useState(Dimensions.get('window').width)
  const [height, setHeight] = useState(Dimensions.get('window').height - 40)
  const [outputs, setOutputs] = useState([])
  const [data, setData] = useState([])
  const [fontConfig,setFontConfig] = useState({})
  useEffect(() => {
    if(fontFamily!= 'default'){
      setFontConfig({fontSize:fontSize,fontFamily:fontFamily})
    }
    else{
      setFontConfig({fontSize:fontSize})
    }
  },[fontFamily,fontSize])



  navigation.setOptions({
    headerTitle: () => (<></>)
  })



  useEffect(() => {
    setOutputs([]);
    const fetchData = async () => {
      for (const bible of bibles) {
        const doc = await useDocumentQuery(book, bible, pk);
        const d = [];
        doc?.data?.document?.cvIndexes?.map(elem => elem.verses.filter(vers => vers?.verse[0]?.verseRange).map(vers => d.push(
          [elem.chapter, transformStringToArray(vers.verse[0].verseRange)])));
        d.push([null, null])

        setData((prevState) => {
          const newArr = [...prevState];
          newArr.push(d);
          return newArr;
        });
        const out = renderDocForSideBySide(doc, pk, book, bible, 1)
        setOutputs((prevState) => {
          const newArr = [...prevState];
          newArr.push(out);
          return newArr;
        });
      }

    };

    fetchData();
  }, [toChange]);

  const title = []
  bibles.forEach(element => {
    title.push(
      <Cell textStyle={{ fontWeight: 'bold' }} style={{ paddingHorizontal: 10,width: widthdim * (0.85 / bibles.length),   }} data={pk.gqlQuerySync(`{docSet(id: "${element}") {
        tags
      }
    }`).data?.docSet?.tags[0].split(':')[1]}></Cell>
    )
  })
  const trucTest = []
  const chapTable = []
  if (data[bibles.length - 1] && outputs[bibles.length - 1]) {


    for (let p = 0; p < data[0].length - 1; p++) {
      let isUnique = true
      let lengthMultiverse = 0
      let indexMultiverse = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i][p][1].length != 1) {
          isUnique = false
          lengthMultiverse = data[i][p][1].length
          indexMultiverse = i
        }

      }

      if (isUnique) {
        const rowContent = []
        rowContent.push(
        <TouchableOpacity 
        style={{width: widthdim * (0.15 / bibles.length)}}
        onPress={() => {
          if(navigationFunction)
          {navigationFunction()}
        }}>
          <Cell textStyle={fontConfig} style={{ backgroundColor: 'whitesmoke' }} data={`${data[0][p][0]}:${data[0][p][1]}`} />
        </TouchableOpacity>)
        for (let i = 0; i < data.length; i++) {
          rowContent.push(<Cell
          textStyle={fontConfig}
            style={{ paddingHorizontal: 10, width: widthdim * (0.85 / bibles.length) }}
            data={outputs[i].chapters[data[i][p][0]][data[i][p][1]].join('')}
          />)
        }
        trucTest.push(<Table>
          <TableWrapper style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
            {rowContent}
          </TableWrapper>
        </Table>)
      }
      else {
        const columnContent = []
        const chap = []
        for (let n = 0; n < lengthMultiverse; n++) {
          chap.push(<Cell
            style={{paddingHorizontal: 10, flex: 1, width: widthdim * (0.15 / bibles.length) }}
            data={`${data[0][p][0]}:${data[0][p][1]}`}
          />)
        }
        columnContent.push(<TableWrapper style={{ flexDirection: 'column', flex: 1 }}>{chap}</TableWrapper>)

        for (let i = 0; i < data.length; i++) {
          if (i === indexMultiverse) {

            columnContent.push(<TableWrapper style={{ flex: 1, borderBottomWidth: 1, flexDirection: 'column' }}>
              <Cell style={{ paddingHorizontal: 10, width: widthdim * (0.85 / bibles.length) }}
                data={outputs[i].chapters[data[i][p][0]][`${data[i][p][1][0]}-${data[i][p][1][lengthMultiverse - 1]}`].join('')} />
            </TableWrapper>
            )
          }
          else {
            cellsContent = []
            for (let n = 0; n < lengthMultiverse; n++) {

              cellsContent.push(<Cell
                style={{ paddingHorizontal: 10, flex: 1, borderBottomWidth: 1, width: widthdim * (0.85 / bibles.length) }}
                data={outputs[i].chapters[data[i][p + n][0]][data[i][p + n][1]].join('')}
              />)

            }
            columnContent.push(<TableWrapper style={{ flexDirection: 'column', flex: 1 }}>{cellsContent}</TableWrapper>
            )
          }
        }
        trucTest.push(<Table style={{
          flexDirection: 'row', flex: 1
        }} >{columnContent}</Table>)
        p += lengthMultiverse - 1
      }
    }
  }
  const renderItem = ({ item: elem }) => {
    if (elem[0] === null) {
      return (<View style={{ height: height / 3 }}><></></View>)
    }
    return (<Table>

      <TableWrapper style={{ flexDirection: 'row', margin: 5, borderBottomWidth: 1 }}>
        <TableWrapper style={{ flexDirection: 'column', width: widthdim * 0.1 }}>
          <TouchableOpacity onPress={() => {
            if(navigationFunction){
                navigationFunction()
            }
          }}>
            <Cell style={{ backgroundColor: 'whitesmoke' }} data={`${elem[0]}:${elem[1]}`} />
          </TouchableOpacity>
        </TableWrapper>
        <TableWrapper style={{ flexDirection: 'row', marginHorizontal: 10 }}>
          {outputs.map((out, id) => (
            <TableWrapper style={{ width: widthdim * (0.90 / bibles.length) }} key={id}>
              <Cell
                style={{ paddingHorizontal: 10 }}
                data={out?.chapters ? out?.chapters[elem[0]][elem[1]].join('') : ''}
              />
            </TableWrapper>
          ))}
        </TableWrapper>
      </TableWrapper>
    </Table>
    )
  };
  return (
    data.length > 0 ?
      <View style={{ flex: 1, height: height }}>
        <Table style={{ width: widthdim}}>
          <TableWrapper style={{ flexDirection: 'row', borderBottomWidth: 1 , width: widthdim}}>
            <Cell textStyle={{ fontWeight: 'bold' }} style={{ width: widthdim * 0.15}} data={book} />
            {title}
          </TableWrapper>
        </Table>
        <ScrollView style={{ flex: 1, height: height }}>
          {trucTest}
        </ScrollView >
      </View>
      :
      <></>);
}

    
module.exports = { SideViewVerseByVerse };
