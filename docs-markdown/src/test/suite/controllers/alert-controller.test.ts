import * as chai from "chai";
import * as spies from "chai-spies";
import { resolve } from "path";
import { Uri, window, workspace } from "vscode";
import { insertAlert, insertAlertCommand } from "../../../controllers/alert-controller";
import * as common from "../../../helper/common";

chai.use(spies);

const expect = chai.expect;

suite("Alert Controller", () => {
    test("insertAlertCommand", () => {
        const commands = [
            { command: insertAlert.name, callback: insertAlert },
        ];
        expect(insertAlertCommand()).to.deep.equal(commands);
    });
    test("noActiveEditorMessage", () => {
        const spy = chai.spy.on(common, "noActiveEditorMessage");
        insertAlert();
        expect(spy).to.have.been.called();
    });
    test("isMarkdownFileCheck", async () => {
        const filePath = resolve(__dirname, "../../../../../src/test/data/docs-markdown.md");
        const docUri = Uri.file(filePath);
        const document = await workspace.openTextDocument(docUri);
        await window.showTextDocument(document);

        const spy = chai.spy.on(common, "isMarkdownFileCheck");
        insertAlert();
        await sleep(300);
        expect(spy).to.have.been.called();
    });
    test("insertContentToEditor - Note", async () => {
        const filePath = resolve(__dirname, "../../../../../src/test/data/docs-markdown.md");
        const docUri = Uri.file(filePath);
        const document = await workspace.openTextDocument(docUri);
        await window.showTextDocument(document);

        window.showQuickPick = (items: string[] | Thenable<string[]>) => {
            return Promise.resolve("Note – Information the user should notice even if skimming") as Thenable<any>;
        };
        const spy = chai.spy.on(common, "insertContentToEditor");
        insertAlert();
        await sleep(500);
        expect(spy).to.have.been.called();
    });

});

function sleep(ms: number): Promise<void> {
    return new Promise((r) => {
        setTimeout(r, ms);
    });
}
