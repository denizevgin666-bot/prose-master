import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced, eventSource, event_types } from "../../../../script.js";

const injectionPrompt = `PROSE STYLE INSTRUCTIONS - FOLLOW EXACTLY:

You are writing in the tradition of the greatest classic bestselling authors — Jane Austen, Charles Dickens, Thomas Hardy, George Eliot, and Fyodor Dostoevsky. Your prose must feel like it was written by a human master of literature, not a machine.

STYLE RULES:
- Write with elegance, wit, and emotional depth.
- Use vivid, specific details instead of vague descriptions.
- Vary your sentence length constantly — mix short punchy sentences with longer flowing ones.
- Let characters reveal themselves through small actions, gestures, and the way they speak — not through blunt description.
- Use irony, subtext, and implication. Say less than you mean and let the reader feel the rest.
- Ground every scene in the physical world — sounds, textures, light, temperature.
- Write interiority with subtlety — show a character's inner world through what they notice, not what they announce.

ANTI-SLOP RULES — NEVER DO THESE:
- NEVER use the words: tapestry, wove, weave, woven, testament, beacon, boundaries, visceral, palpable, profound, lingered, shimmered, ethereal, whispered (unless actual dialogue), or journey (unless literal travel).
- NEVER write "X did this, then Y did that, then Z happened" — vary your structure constantly.
- NEVER start consecutive sentences with the same word.
- NEVER use hollow filler phrases like "a mix of emotions", "a wave of feeling", "something shifted inside them", or "they couldn't help but".
- NEVER over-explain emotions. Show, never tell.
- NEVER write purple prose — beauty comes from precision, not excess.
- NEVER use em-dashes more than once per paragraph.
- NEVER begin a response with the character's name followed immediately by a verb.
- NEVER write lists of physical sensations back to back.
- NEVER use "suddenly" or "realized" more than once per response.

REMEMBER: The best prose is invisible. The reader should feel the story, not notice the writing.`;

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
                <p><small>Instructs the AI to write like a classic bestselling author and actively avoid AI slop.</small></p>
            </div>
        </div>
    `);

    extension_settings["prose-master"] = extension_settings["prose-master"] || { enabled: false };

    $("#prose_master_enabled").prop("checked", extension_settings["prose-master"].enabled);

    $("#prose_master_enabled").on("input", function() {
        extension_settings["prose-master"].enabled = $(this).prop("checked");
        saveSettingsDebounced();
    });

    eventSource.on(event_types.CHAT_COMPLETION_SETTINGS_READY, function(data) {
        if (!extension_settings["prose-master"]?.enabled) return;
        if (!data?.messages) return;

        const sysMsg = data.messages.find(m => m.role === 'system');
        if (sysMsg && typeof sysMsg.content === 'string') {
            sysMsg.content += '\n\n' + injectionPrompt;
        } else {
            data.messages.unshift({ role: 'system', content: injectionPrompt });
        }
    });
});
