function* listGenerator(list, count = 1) {
    count = count > list.length ? list.length : count;
    let start = 0;
    let end = count;

    while (true) {
        if (end > list.length) {
            yield list.slice(start, list.length);
            break;
        }
        else {
            yield list.slice(start, end);
        }

        start = end;
        end += count;
    }
}

export default listGenerator;