let text = document.createElement('div');
text.innerText = 'Прошу проверить данную работу в последнюю очередь, т.к в данный момент она очевидно не доделана(Спасибо за понимание)'
document.querySelector('body').append(text);
function generateKeyboard(wrapper,lang = '')
{
    let board = document.createElement('div');
    board.className = 'keyboard';
    lang = lang == '' ? window.navigator.language : lang;
    let rows = lang == 'ru-RU' ? generateKeyboardRowsRu() : generateKeyboardRowsEng(); 
    for(let row of rows)
    {
        let keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard__row';
        for(let key of row)
        {
            let keyboardKey = document.createElement('div');
            keyboardKey.className = `key ${key}`
            keyboardKey.className += key.length != 1 || key == '◄'
                                                     || key == '▲'
                                                     || key == '▼'
                                                     || key == '►' ? ' controlKey' : '';
            if(key === '')
            {
                keyboardKey.className += ' space';
            }
            keyboardKey.className += ' '+ lang;
            keyboardKey.innerText = key;
            keyboardKey.addEventListener('click',EnterKey);
            keyboardRow.append(keyboardKey);
        }
        board.append(keyboardRow);
    }
    wrapper.append(board);
    document.addEventListener('keydown',KeyControls);
    document.addEventListener('keyup',(event) => {document.querySelector(`.${event.key}`).style.background = '#3a424a';});
    document.addEventListener('keydown',changeLocale);
}

function changeLocale(event)
{

}

function EnterKey(event)
{
    if(event.target.classList[2] != 'controlKey')
        document.querySelector('textarea').value += event.target.innerText;
}

function KeyControls(event)
{
    console.log(document.querySelector(`.key .${event.key}`));
    console.log(String(`.${event.key}`));
    if(document.querySelector(`.${event.key}`).classList[2] != 'controlKey')
        document.querySelector('textarea').value += event.key;
    document.querySelector(`.${event.key}`).style.background = '#4ad46a';
}


function generateKeyboardRowsEng()
{
    let row1 = ['\`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'];
    let row2 = ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\','Del'];
    let row3 = ['CapsLock','a','s','d','f','g','h','j','k','l',';','\'','Enter'];
    let row4 = ['Shift','z','x','c','v','b','n','m',',','.','/','▲','Shift'];
    let row5 = ['Ctrl','Win','Alt','','Alt','◄','▼','►','Ctrl'];

    return [row1,row2,row3,row4,row5];
}

function generateKeyboardRowsRu()
{
    let row1 = ['\`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'];
    let row2 = ['Tab','й','ц','у','к','е','н','г','ш','щ','з','х','ъ','\\','Del'];
    let row3 = ['CapsLock','ф','ы','в','а','п','р','о','л','д','ж','э','Enter'];
    let row4 = ['Shift','я','ч','с','м','и','т','ь','б','ю','.','▲','Shift'];
    let row5 = ['Ctrl','Win','Alt','','Alt','◄','▼','►','Ctrl'];

    return [row1,row2,row3,row4,row5];
}

function appInit()
{
    let wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    document.querySelector('body').append(wrapper);
    generateKeyboard(wrapper);
    let textArea = document.createElement('textarea');
    textArea.style.width = document.querySelector('.keyboard').offsetWidth + 'px';
    document.querySelector('.keyboard').before(textArea);
}

appInit();



