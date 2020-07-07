function parse(sbtStr, type) {
    switch (type) {
        case 'ass': return parseAss(sbtStr);
        case 'srt': break;
        default: break;
    }
    return [];
}

function parseAss(sbtStr) {
    try {
        let lines = []; // 最终结果
        const dialogues = sbtStr.match(/Dialogue.+\r\n/g);
        if (dialogues.length <= 0) throw Error('匹配出错！');
        dialogues.map(dialogue => {
            // filter desc lines
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

function slot2Secs(str) {
    if (!str) return '';
    str = str.split(':');
    const time = parseInt(str[0]) * 60 * 60 + parseInt(str[1]) * 60 + parseFloat(str[2]);
    return time;
}