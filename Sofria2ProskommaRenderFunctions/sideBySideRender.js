const actions = {
    startDocument: [
        {
            description: "Storage pour c, v and output",
            test: () => true,
            action: ({ workspace, output }) => {
                workspace.c = null;
                workspace.v = null;
                output.chapters = {};
            }
        }
    ],
    startChapter: [
        {
            description: "Set up new chapter",
            test: () => true,
            action: ({ context, workspace, output }) => {
                const element = context.sequences[0].element;
                workspace.c = element.atts.number;
                workspace.v = null;
                output.chapters[workspace.c] = {};
            }
        }
    ],
    startVerses: [
        {
            description: "Set up new verse",
            test: () => true,
            action: ({ context, workspace, output }) => {
                const element = context.sequences[0].element;
                workspace.v = element.atts.number;
                output.chapters[workspace.c][workspace.v] = [];
            }
        }
    ],
    text: [
        {
            description: "Push text to verse",
            test: ({ workspace }) => workspace.c && workspace.v,
            action: ({ context, workspace, output }) => {
                const element = context.sequences[0].element;
                output.chapters[workspace.c][workspace.v].push(element.text);
            }
        }
    ]
};

export default actions