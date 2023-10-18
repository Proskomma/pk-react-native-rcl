var sofria2WebActions = require("./Sofria2ProskommaRenderFunctions/Sofria2WebActions")
var renderers = require("./Sofria2ProskommaRenderFunctions/render2reactNative")
var renderStyles = require("./Sofria2ProskommaRenderFunctions/renderStyles")

export { ReadingScreen } from './ReadingComponents/ReadingScreen';
export {SideViewVerseByVerse} from "./ReadingComponents/SideViewVerseByVerse"


module.exports = {
    renderers,
    sofria2WebActions,
    renderStyles
}
