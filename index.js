import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

jQuery(async () => {
    $("#extensions_settings2").append(`
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>Prose Master</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div>
                    <input id="prose_master_enabled" type="checkbox" />
                    <label for="prose_master_enabled">Enable Prose Master</label>
                </div>
                <p><small>When enabled, instructs the AI to write like a classic bestselling author.</small></p>
            </div>
        </div>
    `);

    extension_settings["prose-master"] = extension_settings["prose-master"] || { enabled: false };

    $("#prose_master_enabled").prop("checked", extension_settings["prose-master"].enabled);

    $("#prose_master_enabled").on("input", function() {
        extension_settings["prose-master"].enabled = $(this).prop("checked");
        saveSettingsDebounced();
    });
});
