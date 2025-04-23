import { IComponent, studioPro } from "@mendix/extensions-api";

const menuId = "CodeSpellChecker.OpenTab";
const caption = "Code Spell Checker";

class Main implements IComponent {
    async loaded(): Promise<void> {
        await studioPro.ui.extensionsMenu.add({
            menuId,
            caption,
        });
        // await studioPro.ui.extensionsMenu.add({
        //     menuId: "test",
        //     caption: "Test"
        // });

        studioPro.ui.extensionsMenu.addEventListener("menuItemActivated", args => {
            if (args.menuId === menuId) {
                studioPro.ui.tabs.open(
                    {
                        title: caption,
                    },
                    {
                        componentName: "extension/CodeSpellChecker",
                        uiEntrypoint: "tab",
                    },
                );
            }
            if (args.menuId === "test") {
                test();
            }
        });
    }
}

async function test(): Promise<void> {
    console.log("test");
    const { domainModels } = studioPro.app.model;
    const [domainModel] = await domainModels.loadAll(info => info.moduleName === "MyFirstModule");
    const newEntity = await domainModel.addEntity({
        name: "NewEntity",
        attributes: [{ name: "MyAttribute", type: "AutoNumber" }],
    });
    newEntity.documentation = "New documentation";
    // It saves, but it does not persist!
    await domainModels.save(domainModel);
}
export const component: IComponent = new Main();
