import { IComponent, studioPro } from "@mendix/extensions-api";

const menuId = "CodeSpellChecker.OpenTab";
const caption = "Code Spell Checker";

class Main implements IComponent {
    async loaded(): Promise<void> {
        await studioPro.ui.extensionsMenu.add({
            menuId,
            caption,
        });

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
        });
    }
}

export const component: IComponent = new Main();
