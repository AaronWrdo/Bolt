function parse(sbtStr, type) {
    switch (type) {
        case 'ass': return parseAss(sbtStr);
        case 'srt': return parseSrt(sbtStr);
        default: break;
    }
    return [];
}

function parseAss(subtitle) {
    try {
        let lines = []; // result

        // split into dialogues
        const dialogues = subtitle.match(/Dialogue.+\r\n/g);
        if (dialogues.length <= 0) throw Error('匹配出错！');

        // do with every dialogue
        dialogues.map(dialogue => {
            // filter desc dialogue
            if ( /0\,0\,0\,/g.test(dialogue) ) return; // remove lines with '0, 0, 0,'
            if ( /\,{2}\{/g.test(dialogue) ) return; // remove lines with '{\xxx'

            // parse times
            slots = dialogue.match(/\d\:\d{2}\:\d{2}\.\d+/g);
            if (slots.length !== 2) throw Error('匹配出错！');

            // parse texts
            text = dialogue
                .replace(/Dialogue.*,,/g, '')
                .replace(/\r\n/g, '')
                .split(/(\\N|\{.*\})/g);
            const texts = text.filter(item => item && !(/(\\N|\{.*\})/g.test(item)));

            lines = [
                ...lines,
                {
                    'from': slot2Secs(slots[0]),
                    'to': slot2Secs(slots[1]),
                    'text1': texts[0] || '',
                    'text2': texts[1] || '',
                }
            ];
        });
        return lines;
    } catch (e) {
        console.log(e);
    }
}


function parseSrt(subtitle) {
    // console.log(subtitle);
}

function slot2Secs(str) {
    if (!str) return '';
    str = str.split(':');
    const time = parseInt(str[0]) * 60 * 60 + parseInt(str[1]) * 60 + parseFloat(str[2]);
    return time;
}