class App {
    #getStructureButton = document.querySelector('.app__get-structure-button');
    #getCopyResultButton = document.querySelector('.app__get-copy-result-button');
    #basicInput = document.querySelector('.app__basic-input');
    #oldInputText = '';
    #charView = document.querySelector('.app__char-view');
    #charList = document.querySelector('.app__char-list');
    #charListItems = document.getElementsByClassName('app__char-list-item');
    #selectedCharView = document.getElementsByClassName('app__char-view-selected');


    constructor() {
        this.main();
    }

    main() {
        this.#addListeners();
    }

    #addListeners() {
        this.#getStructureButton.addEventListener('click', () => {
            this.#oldInputText = this.#basicInput.value
            this.#generateCharView();
            this.#generateListView()
        });

        this.#getCopyResultButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this.#basicInput.value).then();
        });
    }

    #generateCharView() {
        this.#charView.innerHTML = this.#basicInput.value;
    }

    #generateListView() {
        const text = this.#basicInput.value.split('');
        let template = ``;

        text.forEach((char, index) => {
            const info = this.#getUnicodeInfo(char);
            template += `
                <div class="app__char-list-item" data-index='${index}'>
                    <img class="app__char-list-item-copy" src="img/copy.png" alt="copy" data-char='${char}'>
                    <img class="app__char-list-item-edit" src="img/edit.png" alt="edit" data-index='${index}'>
                    <div class="app__char-list-item-char">${char}</div>
                    <div class="app__char-list-item-code">${info.code}</div>
                    <div class="app__char-list-item-name">${info.name}</div>
                </div>
            `;
        });

        this.#charList.innerHTML = template;

        const listItems = Array.from(this.#charListItems);
        listItems.forEach((element) => {
            element.addEventListener('click', () => {
                this.#selectChar(parseInt(element.dataset.index, 10));
                listItems.forEach(el => el.classList.remove("app__char-list-item--selected"));
                element.classList.add("app__char-list-item--selected");

                const selectedViewCharElement = this.#selectedCharView[0] ?? null;
                if (selectedViewCharElement) {
                    selectedViewCharElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });

            const copyElement = element.getElementsByClassName('app__char-list-item-copy')[0];
            const copyElementChar = copyElement.dataset.char;

            copyElement.addEventListener('click', (event) => {
                event.stopPropagation();
                navigator.clipboard.writeText(copyElementChar).then();
            });

            const editElement = element.getElementsByClassName('app__char-list-item-edit')[0]
            const charIndex = parseInt(element.dataset.index, 10);

            editElement.addEventListener('click', (event) => {
                event.stopPropagation();

                const userSymbol = prompt("Type symbol");

                if (userSymbol && userSymbol.length === 1) {
                    const text = this.#basicInput.value;

                    const newText = this.#updateCharInText(text, charIndex, userSymbol);
                    this.#basicInput.value = newText;
                    this.#oldInputText = newText;

                    this.#getStructureButton.click();
                    console.log(`.app__char-list-item--selected[data-index="${charIndex}"]`)

                    setTimeout(() => {
                        document.querySelector(`.app__char-list-item[data-index="${charIndex}"]`).click()
                    });
                } else {
                    alert('You either entered nothing or more than one character');
                }
            });
        });
    }

    #selectChar(index) {
        const text = this.#oldInputText;
        const before = text.slice(0, index);
        const letterToWrap = text[index];
        const after = text.slice(index + 1);

        this.#charView.innerHTML = before
            + `<span class="app__char-view-selected">${letterToWrap}</span>`
            + after;
    }

    #getUnicodeInfo(char) {
        return Unicore.getUnicodeInfo(char);
    }

    #updateCharInText(text, index, newChar) {
        return text.slice(0, index) + newChar + text.slice(index + 1);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
});
