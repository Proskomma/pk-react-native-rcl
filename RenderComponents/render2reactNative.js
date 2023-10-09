import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { renderStyles as rs, ConvertCssToReactNativeStyle } from './renderStyles';
import { StyleSheet } from 'react-native';
import { Table, Cell, TableWrapper } from 'react-native-reanimated-table';
let convertedStyleSheet = ConvertCssToReactNativeStyle(rs);
const styles = StyleSheet.create(convertedStyleSheet);

const getStyles = (type, subType) => {
    if (!styles[type]) {
        throw new Error(`Unknown style type '${type}'`);
    }
    if (!styles[type][subType]) {
        console.log(`No styles for ${type}/${subType}`)
        return styles[type].default;
    }
    return { ...styles[type].default, ...styles[type][subType] };
}




function InlineElement(props) {
    const [display, setDisplay] = useState(false);
    const toggleDisplay = () => setDisplay(!display);
    if (display) {
        return <Text
            key={`Inline ${Math.random()} `}
            style={{
                marginLeft: '10%',
                marginRight: '10%',
                marginTop: '5%',
                marginBottom: '5%',
                backgroundColor: "#CCC",
                marginBottom: 16,
                borderWidth: 1,
                borderRadius: 4,
                width: '80%',
                flexDirection: 'row',


            }}
            onPress={toggleDisplay}
        >
            {props.children}

        </Text>
    } else {
        return <Text
            key={`Inline_${Math.random()}`}
            style={{
                verticalAlign: 'top',
                fontSize: 10,
                fontWeight: "bold",
                marginRight: 4,
                marginLeft: 4,
                marginTop: 15,
                padding: 2,
                backgroundColor: "#CCC"
            }}
            onPress={toggleDisplay}
        >
            {props.linkText}
        </Text>
    }
}
const renderers = {
    text: ({ word, idWord, workspace,fontConfig }) => {
        if(fontConfig && fontConfig.fontFamily!='default'){
            return (
                <View style={{}}>
                    <Text style={{ paddingTop: 6, fontFamily:fontConfig.fontFamily,fontSize:fontConfig.fontSize }}>
                        {word}
                    </Text>
                </View>
            )
        }
        return (
            <View style={{}}>
                <Text style={{ paddingTop: 6,fontSize:fontConfig.fontSize  }}>
                    {word}
                </Text>
            </View>
        )
    },
    chapter_label: (number, id) =>
        <View
            onPress={() => { console.log('chapter label?') }}
            key={`chapter_label_${id}`} ><Text
                style={{
                    alignSelf: 'flex-start',
                    ...getStyles('marks', "chapter_label"),

                }}>{number}</Text></View>,
    verses_label: (number, bcv, bcvCallback, id) =>
        bcv && bcv.length === 3 ?
            <TouchableOpacity
                style={{ paddingHorizontal: 5 }}
                onPress={() => {
                    bcvCallback(bcv)
                }}>
                <Text
                    key={`verse_label${id}`}

                    style={{
                        ...getStyles('marks', "verses_label"),
                        color: "#00D",
                        textDecorationLine: 'underline',

                    }}
                >
                    {number}
                </Text>
            </TouchableOpacity> :
            <TouchableOpacity
                onPress={() => { bcvCallback(bcv) }}
                key={`versesLabel_${id}`} style={{ flexDirection: 'row', paddingTop: 10 }} >
                <Text
                    style={{
                        ...getStyles('marks', "verses_label"),
                        marginRight: 10,
                    }}>
                    {number}</Text>
            </TouchableOpacity >
    ,
    paragraph: (subType, content, footnoteNo, id) => {
        let TitleContent = {};
        if (["usfm:mt", "usfm:s"].includes(subType)) {
            const updatedContent = content.map((element, index) => {
                const updatedChildren = React.Children.map(element.props.children, (child, childIndex) => {
                    return React.cloneElement(child, { style: { ...getStyles('paras', subType), display: 'flex', flexDirection: 'row', }, key: `title_subTitle_${index}_${childIndex}` });
                });
                return React.cloneElement(element, { key: element.key || `parent_${index}` }, updatedChildren);
            });
            TitleContent = updatedContent;
        }
        return (

            ["usfm:f", "usfm:x"].includes(subType) ?
                <InlineElement
                    key={`paragraph_${id}`}
                    style={getStyles('paras', subType)}
                    linkText={subType === "usfm:f" ? `${footnoteNo}` : "*"}
                >
                    {content}
                </InlineElement> :
                ["usfm:mt", "usfm:s"].includes(subType) ?
                    <View key={`paraphraphe_${id} `} style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 18 }}>{TitleContent}</View>
                    :
                    <View key={`parapgraphe_${id} `} style={{ ...getStyles('paras', subType), alignItems: 'flex-end', flexWrap: 'wrap', flexDirection: 'row' }}>
                        {content}
                    </View>


        )
    },

    wrapper: (atts, subType, content, id) => {
        if (subType.includes('usfm:it')) {

            return <View key={`wrapper_${id} `} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{
                content.map((element, index) => {
                    const updatedChildren = React.Children.map(element.props.children, (child, childIndex) => {
                        return React.cloneElement(child, { style: { ...getStyles('wrappers', subType) }, key: `italic_text_intro${index}_${childIndex}` });
                    });
                    return React.cloneElement(element, { key: element.key || `parent_${index}` }, updatedChildren);
                })}</View>

        }
        const updatedContent = content.map((element, index) => {
            return React.cloneElement(element, { style: { paddingTop: 0 }, key: `wrapper_content_${index} ` });
        });
        if (["usfm:f", "usfm:ft", "usfm:fr"].includes(subType)) {
            return (<View key={`wrapper_${id}`} style={{ ...getStyles('wrappers', subType), flexDirection: 'row' }}>{updatedContent}</View>)

        }
        return (
            subType === 'cell' ?
                atts.role === 'body' ?
                    <Cell key={`cell_${id}`} textStyle={{ textAlign: atts.alignment }}
                        data={updatedContent} />
                    :
                    <Cell key={`cell_${id}`} textStyle={{ fontWeight: 'bold', textAlign: atts.alignment }} data={updatedContent} />
                :
                <View key={`wrapper_${id}`} style={getStyles('wrappers', subType)}>{updatedContent}</View>)
    },
    wWrapper: (atts, content, id) => Object.keys(atts).length === 0 ?
        content
        :

        <View
            key={`wWrapper_${id}`}
            style={{

                display: "flex",
                flexDirection: 'column',

            }}
        >
            <Text key={`Text_wWrapper_${id}`} >{content}</Text>
            <Text key={`wWrapper_${id}`}
                style={{
                    fontSize: 9,
                    fontWeight: "bold",
                    textAlign: 'center',
                }}
            >
                {`lemma = ${id}`
                    + Object.entries(atts).filter(a => a[0] === 'lemma').map(a => {
                        return (`${a[1]}`)
                    })
                    +
                    `\n`
                    +
                    `content =` + Object.entries(atts).filter(a => a[0] === 'content').map(a => {
                        return (`${a[1]}`)

                    })
                }


            </Text>




        </View>,
    mergeParas: paras => paras,
    table: (content, id) => <View key={`table_${id}`} style={{ flex: 1 }}><Table borderStyle={{ borderWidth: 1 }} style={{ flexDirection: "column" }}>{content}</Table></View>,
    row: (content, id) => <TableWrapper key={`row_${id}`} style={{ flexDirection: "row" }}>{content}</TableWrapper>
}

export { renderers };
