;(function() {
    "use strict"
    const text = `Разнообразный и богатый опыт рамки и место обучения кадров позволяет оценить значение позиций, занимаемых участниками в отношении поставленных задач. Таким образом сложившаяся структура организации влечет за собой процесс внедрения и модернизации форм развития. Товарищи! новая модель организационной деятельности влечет за собой процесс внедрения и модернизации новых предложений. Не следует, однако забывать, что сложившаяся структура организации играет важную роль в формировании новых предложений. С другой стороны рамки и место обучения кадров требуют от нас анализа системы обучения кадров, соответствует насущным потребностям. Задача организации, в особенности же дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании существенных финансовых и административных условий.
    Не следует, однако забывать, что постоянное информационно-пропагандистское обеспечение нашей деятельности влечет за собой процесс внедрения и модернизации направлений прогрессивного развития. Равным образом консультация с широким активом позволяет оценить значение модели развития. С другой стороны сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании позиций, занимаемых участниками в отношении поставленных задач. Не следует, однако забывать, что рамки и место обучения кадров требуют определения и уточнения систем массового участия.
    Не следует, однако забывать, что реализация намеченных плановых заданий требуют определения и уточнения систем массового участия. Не следует, однако забывать, что постоянный количественный рост и сфера нашей активности в значительной степени обуславливает создание соответствующий условий активизации. Повседневная практика показывает, что реализация намеченных плановых заданий играет важную роль в формировании форм развития.`

    const inputElement = document.querySelector('#input')
    const textExampleElement = document.querySelector('#textExample')

    const lines = getLines(text)
    
    let letterId = 1
    let startMoment = null
    let started = false

    let letterCounter = 0
    let letterCounterError = 0

    init()

    function getKeys (event) {
        const isServiceKey = ["ShiftRight", "ShiftLeft", "Backslash"].includes(event.code)
        let element = document.querySelector(`[data-key="${event.key.toLowerCase()}"]`)

        if (isServiceKey) {
            element = document.querySelector(`[data-key="${event.code}"]`)
        } else if (event.key === ',') {
            element = document.querySelector(`[data-comma="${event.key}"]`)
        }

        return element
    }

    function setFocus(event) {
        if (inputElement !== document.activeElement) {
            inputElement.focus()
            inputElement.dispatchEvent(new KeyboardEvent(event.type, event))
        }
    }

    inputElement.addEventListener('focusout', () => {
        document.addEventListener('keydown', setFocus)
    })

    function init () {
        update()

        inputElement.focus()

        inputElement.addEventListener('keydown', event => {
            const currentLineNumber =  getCurrentLineNumber()
            const element = getKeys(event)
            const currentLetter = getCurrentLetter()

            document.removeEventListener('keydown', setFocus)

            if (event.key !== 'shift') {
                letterCounter++
            }

            if (!started) {
                started = true
                startMoment = Date.now()
            }

            const isKey = event.key === currentLetter.original
            const isEnter = event.key === 'Enter' && currentLetter.original === '\n'

            if (event.key.startsWith('F') && event.key.length > 1) {
                return
            }

            if (element) {
                element.classList.add('hint')
            } 
    
            if (isKey || isEnter) {
                letterId++
                update()
            } else {
                event.preventDefault()

                if (event.key !== 'shift') {
                    letterCounterError++

                    for (const line of lines) {
                        for (const letter of line) {
                            if (letter.original === currentLetter.original) {
                                letter.success = false
                            }
                        }
                    }

                    update()
                }
            }

            if (currentLineNumber !== getCurrentLineNumber()) {
                inputElement.value = ''
                event.preventDefault()

                
                const time = Date.now() - startMoment
                document.querySelector('#wordsSpeed').textContent = Math.round(60000 * letterCounter / time)
                document.querySelector('#errorProcent').textContent = Math.floor(10000 * letterCounterError / letterCounter) / 100 + '%'
                started = false
                letterCounter = 0
                letterCounterError = 0
            }
        })

        inputElement.addEventListener('keyup', event => {
            const element = getKeys(event)

            if (element) {
                element.classList.remove('hint')
            } 
        })
    }

    // Принимает длинную строку, возвращает массив строк со служебной информацией
    function getLines (text) {
        const lines = []

        let line = []
        let idCounter = 0

        for (const originalLetter of text) {
            idCounter++

            let letter = originalLetter

            if (letter === ' ') {
                letter = '°'
            }

            if (letter === '\n') {
                letter = '¶\n'
            }

            line.push({
                id: idCounter,
                label: letter,
                original: originalLetter,
                success: true
            })

            if (line.length >= 70 || letter === '¶\n') {
                lines.push(line)
                line = []
            }
        }

        if (line.length > 0) {
            lines.push(line)
        }

        return lines
    }

    // Принимает строку с объектами содержащими служебную информацию и возвращает HTML-структуру
    function lineToHtml (line) {
        const divElement = document.createElement('div')
        divElement.classList.add('line')

        for (const letter of line) {
            const spanElement = document.createElement('span')
            spanElement.textContent = letter.label

            divElement.append(spanElement)

            if (letterId > letter.id) {
                spanElement.classList.add('done')
            } else if (!letter.success) {
                spanElement.classList.add('hint')
            }
        }

        return divElement
    }

    // Возвращает актуальный номер строки
    function getCurrentLineNumber () {
        for (let i = 0, length = lines.length; i < length; i++) {
            for (const letter of lines[i]) {
                if (letter.id === letterId) {
                    return i
                }
            }
        }
    }

    // Функция обновления 3-х отображаемых актуальных строк textExample
    function update () {
        const currentLineNumber = getCurrentLineNumber()
        textExampleElement.innerHTML = ''

        for (let i = 0, length = lines.length; i < length; i++) {
            const html = lineToHtml(lines[i])
            textExampleElement.append(html)

            if (i < currentLineNumber || i > currentLineNumber + 2) {
                html.classList.add('hidden')
            }
        }
    }

    // Возвращает объект символа ожидаемый программой
    function getCurrentLetter () {
        for (const line of lines) {
            for (const letter of line) {
                if (letterId === letter.id) {
                    return letter
                }
            }
        }
    }

})();