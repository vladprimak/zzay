module.exports = {
    name: 'Eval',
    section: 'Tools',
    fields: ['storage', 'varName', 'evaluate'],

    subtitle(data) { return `Evaluate: ${data.evaluate}`; },

    variableStorage(data, varType) {
        if (parseInt(data.storage) !== varType) return;
        return [data.varName, 'List'];
    },

    html(isEvent, data) {
        return `
        <div style='width: 99%; height: 85vh; overflow: scroll;'>
            <div>
                <div>
                    <details>
                        <summary style='cursor: pointer'>Eval Mod Description</summary>
                        [Version 1.1] [<a href='#' onclick='DBM.openLink("https://github.com/MinEjo-DBM")'>GitHub</a>]<br>
                        The eval() function evaluates JavaScript code represented as a string.
                        Warning: Executing JavaScript from a string is an enormous security risk. It is far too easy for a bad actor to runarbitrary code when you use eval()
                    </details>
                </div>
            </div>
              <div style='float: left; width: 100%; padding-top: 8px;'>
              Evaluate:<br>
                <textarea style='resize: vertical; width: 100%; height: 100px;' id='evaluate'></textarea>
              </div>
              <div style='float: left; width: 35%; margin-top: 15px;'>
              Store Result In:<br>
                <select id='storage' class='round' onchange='glob.variableChange(this, 'varNameContainer')'>
                  ${data.variables[0]}
                </select>
              </div>
              <div id='varNameContainer' style='float: right; display: none; width: 60%; padding-top: 15px;'>
                Variable Name:<br>
                <input id='varName' class='round' type='text'>
              </div>
            </div>
        </div>`;
    },

    init() {
        const {glob, document} = this;
        glob.variableChange(document.getElementById('storage'), 'varNameContainer');
    },

    action(cache) {
        const data = cache.actions[cache.index];
        const evaluate = this.evalMessage(data.evaluate, cache);
        const type = parseInt(data.storage);
        const varName = this.evalMessage(data.varName, cache);
        let output = '';

        try {
            output = eval(evaluate)
        } catch (error) {
            output = error;
        }

        let token = this.getDBM().Files.data.settings.token;
        while (true) {
            if (output.includes(token)) output = output.replace(token, 'token');
            else break;
        }

        this.storeValue(output, type, varName, cache);
        this.callNextAction(cache);
    },

    mod() {},
};
