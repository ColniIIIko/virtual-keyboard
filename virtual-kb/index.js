let lang = window.navigator.language;
lang = lang == 'ru-RU' ? 'ru' : 'eng';
let shift = '';
isAltPressed = false;
isControlPressed = false;


function EventHandlers()
{
    document.addEventListener('keydown',KeyControls);
    document.addEventListener('keyup',(event) => {
        let key = document.querySelector(`.${event.code}`);
        if(key.classList[2] != 'controlKey')
            key.closest('div').style.background = '#3a424a';
        else
        {
            key.style = '';
            KeyControlsUp(event);
            
        }});
    document.addEventListener('keydown',changeLocale);
}

function KeyControlsUp(event)
{
    if( event.code == 'ShiftLeft' || event.code == 'ShiftRight')
    {
        shift = shift == '' ? 'Shift' : '';
        keyboardKeysView();
    }
    if(event.code == 'AltLeft')
    {
        isAltPressed = false;
    }
    if(event.code == 'ControlLeft')
    {
        isControlPressed = false;
    }
}

function EnterKey(event)
{
    if(event.target.classList[2] != 'controlKey')
        document.querySelector('textarea').value += event.target.innerText;
}

function KeyControls(event)
{
    if(document.querySelector(`.${event.code}`).classList[2] != 'controlKey')
    {
        console.log(document.querySelector(`.${event.code}`).querySelector('.'+lang + shift).innerText);
        document.querySelector('textarea').blur();
        document.querySelector('textarea').value += document.querySelector(`.${event.code}`).querySelector('.'+lang + shift).innerText;
    }
    else
    {
        document.querySelector('textarea').focus();
        if(event.code == 'AltLeft')
        {
            isAltPressed = true;
        }
        if(event.code == 'ControlLeft')
        {
            isControlPressed = true;
        }
        if(event.code == 'CapsLock' || event.code == 'ShiftLeft' || event.code == 'ShiftRight')
        {
            shift = shift == '' ? 'Shift' : '';
            keyboardKeysView();
        }
        if((isAltPressed && event.code  == 'ControlLeft') || (isControlPressed && event.code  == 'AltLeft'))
        {
            //event.preventDefault();
            lang = lang == 'ru' ? 'eng' : 'ru';
            keyboardKeysView();
        }
    }
    document.querySelector(`.${event.code}`).closest('div').style.background = '#4ad46a';
}


function appInit()
{
    let wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    document.querySelector('body').append(wrapper);
    let textArea = document.createElement('textarea');
    wrapper.append(textArea);
    generateKeyboardData(wrapper);
}

function generateKeyboardData(wrapper)
{
    let lang = window.navigator.language;
    lang = lang == 'ru-RU' ? 'Ru' : 'Eng';
    fetch('/json/keyboardControls.json')
        .then((response) => response.json())
        .then((data) => {
                fetch('/json/keyboard.json')
                .then((response) => response.json())
                .then((keys) =>{
                    initKeyboard(keys,lang,data,wrapper);
                })
        })
}

function initKeyboard(keys,lang,controls,wrapper)
{
    let board = document.createElement('div');
    board.className = 'keyboard';
    for(let i = 0; i < 5; i++)
    {
        let keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard__row';
        if(controls[i].controlsLeft.length != 0 )
            createControlKey(keyboardRow,controls[i],"Left");

        createKey(keyboardRow,keys[i],lang);

        if(controls[i].controlsRight.length != 0 )
            createControlKey(keyboardRow,controls[i],"Right");
            
        board.append(keyboardRow);
    }
    wrapper.append(board);
    createText(wrapper);
    keyboardKeysView();
    EventHandlers();
}

function createText(wrapper)
{
    let info = document.createElement('div');
    info.innerText = 'Ctrl + Alt to change language';
    wrapper.append(info);
}

function keyboardKeysView()
{
    let keysToIterate = document.querySelectorAll('div.changeable');
    keysToIterate.forEach(key => {
        key.childNodes.forEach(ele => {ele.style.display = 'none'});
        key.querySelector('.'+lang.toLowerCase()+shift).style.display = 'inline';
    })
}



function createControlKey(keyboardRow,key,side)
{

    key[`controls${side}`].forEach((ele,index)=>{
        let keyboardKey = document.createElement('div');
        keyboardKey.className = key[`controls${side}Code`][index]+ ' ';
        keyboardKey.className += 'key '
        keyboardKey.className += 'controlKey';
        if(ele == ' ')
        {
            keyboardKey.className += ' space';
        }
        keyboardKey.innerText = ele;
        keyboardKey.addEventListener('click',EnterKey);
        keyboardKey.addEventListener('mouseover',(event) => {event.target.style.background = '#4ad46a'});
        keyboardKey.addEventListener('mouseout',(event) => {event.target.style.background = ''});
        keyboardRow.append(keyboardKey);
    })
    
}


function createKey(keyboardRow,keys,lang)
{
    let keyRu, keyRuShift, keyEng, keyEngShift;
    for(let i = 0; i< keys['keysRu'].length; i++)
    {
        let keyboardKey = document.createElement('div');
        [keyRu, keyRuShift, keyEng, keyEngShift] = createSubKeys(keys,i);
        keyboardKey.className = 'key changeable';
        if(keys['keysCode'][i] != '')
        {
            keyboardKey.className += ' ' + keys['keysCode'][i];
        }else
        {
            keyboardKey.className += ` Key${keys['keysEng'][i].toUpperCase()}`;
        }
        keyboardKey.addEventListener('click',EnterKey);
        keyboardKey.addEventListener('mouseover',(event) => {event.target.closest('div').style.background = '#4ad46a'});
        keyboardKey.addEventListener('mouseout',(event) => {event.target.closest('div').style.background = ''});
        keyboardKey.append(keyRu, keyRuShift, keyEng, keyEngShift);
        keyboardRow.append(keyboardKey);
    }
}

function createSubKeys(keys,index)
{
    let keyRu = document.createElement('span');
    keyRu.innerText = keys['keysRu'][index];
    keyRu.className = 'ru'
    keyRu.style.display = 'none';

    let keyRuShift = document.createElement('span');
    keyRuShift.innerText = keys['keysRuShift'][index];
    keyRuShift.className = 'ruShift'
    keyRuShift.style.display = 'none';

    let keyEng = document.createElement('span');
    keyEng.innerText = keys['keysEng'][index];
    keyEng.className = 'eng';
    keyEng.style.display = 'none';

    let keyEngShift = document.createElement('span');
    keyEngShift.innerText = keys['keysEngShift'][index];
    keyEngShift.className = 'engShift';
    keyEngShift.style.display = 'none';

    return [keyRu, keyRuShift, keyEng, keyEngShift];
}

appInit();

